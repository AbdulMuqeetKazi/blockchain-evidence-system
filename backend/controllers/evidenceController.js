/**
 * controllers/evidenceController.js
 *
 * HTTP request handlers — one per endpoint.
 *
 * Responsibilities:
 *   - Validate inputs
 *   - Duplicate hash detection (before paying gas)
 *   - Call service/util layer
 *   - Persist off-chain metadata
 *   - Return standardised responses: { success, data } or { success, error }
 *
 * All blockchain not-found errors are caught and forwarded to the centralized
 * error handler via next(err) rather than constructing responses inline.
 */

import { readFile } from "node:fs/promises";
import { ethers } from "ethers";
import { computeHash, computeStringHash } from "../utils/hashUtils.js";
import * as blockchain from "../services/blockchainService.js";
import {
  uploadFileToIPFS,
  uploadMetadataToIPFS,
  fetchMetadataFromIPFS
} from "../services/ipfsService.js";
import {
  generateCaseId,
  saveMetadata,
  getMetadataById,
  findByHash,
  getAllMetadata,
} from "../utils/metadataStore.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Validates an evidence ID from a param or body field.
 * Returns the parsed integer, or null if validation failed (response already sent).
 */
function parseEvidenceId(raw, res) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({
      success: false,
      error: "'evidenceId' must be a positive integer.",
    });
    return null;
  }
  return id;
}

/**
 * Returns true if the error indicates an on-chain record was not found.
 */
function isNotFoundError(err) {
  return (
    err.message?.includes("EvidenceNotFound") ||
    (err.code === "CALL_EXCEPTION" && err.data === null)
  );
}

function normalizeEvidenceRecord(record, metadata) {
  return {
    id: String(record.id),
    caseName: metadata?.caseName ?? metadata?.caseId ?? null,
    description: metadata?.description ?? null,
    evidenceType: metadata?.evidenceType ?? metadata?.type ?? null,
    location: metadata?.location ?? null,
    suspectName: metadata?.suspectName ?? null,
    dateCollected: metadata?.dateCollected ?? metadata?.date ?? null,
    fileName: metadata?.fileName ?? null,
    hash: record.hash,
    owner: record.owner,
    uploadedBy: metadata?.uploadedBy ?? null,
    timestamp: record.timestamp,
    ipfsCid: metadata?.ipfsCid ?? metadata?.fileCID ?? null,
    metadataCid: metadata?.metadataCID ?? null,
    transactionHash: metadata?.transactionHash ?? metadata?.txHash ?? null,
    blockNumber: metadata?.blockNumber ?? null,
    registeredAt: record.registeredAt ?? metadata?.registeredAt ?? null,
    blockchainHash: metadata?.blockchainHash ?? record.hash,
    fileHash: metadata?.fileHash ?? null,
  };
}

// ─── POST /evidence/upload ────────────────────────────────────────────────────

/**
 * Upload a file, hash it, check for duplicates, register on-chain, persist metadata.
 *
 * Multipart form fields:
 *   file    (required)  — the evidence file (PDF, PNG, or JPEG, ≤ 5 MB)
 *   caseId  (optional)  — forensic case identifier; auto-generated if omitted
 */
export async function uploadEvidence(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded. Send a PDF, PNG, or JPEG under the field name 'file'.",
      });
    }

    // Hash the file bytes ALWAYS first to correctly detect existing duplicates natively
    const fileBuffer = await readFile(req.file.path);
    const rawFileHash = computeHash(fileBuffer).toLowerCase();

    // ── Duplicate check BEFORE expensive IPFS ─────────────────────────────
    const existing = await findByHash(rawFileHash);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: "Evidence already exists.",
        existing: {
          evidenceId: existing.evidenceId,
          caseId: existing.caseId,
          fileName: existing.fileName,
          uploadedAt: existing.timestamp,
        },
      });
    }

    const useIPFS = req.body.useIPFS === "true";
    const caseId = req.body.caseId?.trim() || generateCaseId();
    const caseName = req.body.caseName?.trim() || caseId;
    const evidenceType = req.body.evidenceType?.trim() || req.body.type?.trim() || req.file.mimetype;
    const suspectName = req.body.suspectName?.trim() || req.body.suspect?.trim() || null;
    const dateCollected = req.body.dateCollected?.trim() || req.body.date?.trim() || null;

    let hashToStore;
    let fileCID = null;
    let metadataCID = null;
    
    // Replace "system_user" with the actual configured wallet address 
    // to map to the metadata flawlessly before blockchain call.
    const signerAddress = process.env.PRIVATE_KEY 
      ? new ethers.Wallet(process.env.PRIVATE_KEY.startsWith("0x") ? process.env.PRIVATE_KEY : `0x${process.env.PRIVATE_KEY}`).address 
      : "unknown";

    if (useIPFS) {
      try {
        fileCID = await uploadFileToIPFS(req.file);
        
        const ipfsMetadata = {
          caseName,
          caseId,
          fileName: req.file.originalname,
          description: req.body.description || "Blockchain evidence",
          evidenceType,
          location: req.body.location || "Unknown",
          suspectName,
          dateCollected: dateCollected || new Date().toISOString(),
          uploadedBy: signerAddress, 
          fileCID,
        };

        metadataCID = await uploadMetadataToIPFS(ipfsMetadata);
        hashToStore = computeStringHash(metadataCID).toLowerCase();
      } catch (ipfsErr) {
        return res.status(502).json({
          success: false,
          error: `IPFS upload failed: ${ipfsErr.message}`,
        });
      }
    } else {
      hashToStore = rawFileHash;
    }

    console.log(`[upload] case=${caseId}  file="${req.file.originalname}"  hash=${hashToStore}  useIPFS=${useIPFS}`);

    // Register on-chain.
    const result = await blockchain.addEvidence(hashToStore);

    // Persist off-chain metadata.
    await saveMetadata({
      evidenceId: result.evidenceId,
      caseId,
      caseName,
      fileName: req.file.originalname,
      fileStoredAs: req.file.filename,
      fileSize: req.file.size,
      hash: hashToStore,
      blockchainHash: hashToStore,
      fileHash: rawFileHash, // ensures we can detect duplicates across flows
      uploadedBy: signerAddress,
      txHash: result.transactionHash,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      metadataCID,
      fileCID,
      ipfsCid: fileCID,
      description: req.body.description || null,
      evidenceType,
      location: req.body.location || null,
      suspectName,
      dateCollected,
      registeredAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      data: {
        evidenceId: result.evidenceId,
        caseId,
        fileName: req.file.originalname,
        uploadedBy: signerAddress,
        timestamp: new Date().toISOString(),
        txHash: result.transactionHash,
        hash: hashToStore,
        fileHash: rawFileHash,
        blockchainHash: hashToStore,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed,
        registeredAt: new Date().toISOString(),
        file: {
          storedAs: req.file.filename,
          sizeBytes: req.file.size,
          mimeType: req.file.mimetype,
        },
        ipfs: useIPFS ? { 
          fileCID, 
          metadataCID,
          fileURL: `https://gateway.pinata.cloud/ipfs/${fileCID}`,
          metadataURL: `https://gateway.pinata.cloud/ipfs/${metadataCID}`
        } : undefined,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── POST /evidence/verify ────────────────────────────────────────────────────

/**
 * Verify that an uploaded file matches the hash stored on-chain.
 *
 * Multipart form fields:
 *   file        (required)  — the file to verify
 *   evidenceId  (required)  — the on-chain evidence ID to compare against
 */
export async function verifyEvidence(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded. Send a PDF, PNG, or JPEG under the field name 'file'.",
      });
    }

    const { evidenceId } = req.body;
    if (!evidenceId) {
      return res.status(400).json({
        success: false,
        error: "'evidenceId' is required as a form field.",
      });
    }

    const id = parseEvidenceId(evidenceId, res);
    if (id === null) return;

    // Fetch the on-chain record and metadata.
    const metadata = await getMetadataById(id);
    const record = await blockchain.getEvidence(id);

    let isMatch = false;
    let computedHash;
    const uploadedFileHash = computeHash(await readFile(req.file.path)).toLowerCase();

    if (metadata?.metadataCID) {
      // IPFS verification flow
      try {
        await fetchMetadataFromIPFS(metadata.metadataCID);
        computedHash = computeStringHash(metadata.metadataCID).toLowerCase();
        isMatch = record.hash.toLowerCase() === computedHash;
      } catch (ipfsErr) {
        return res.status(502).json({
          success: false,
          error: `IPFS retrieval failed during verification: ${ipfsErr.message}`,
        });
      }
    } else {
      // Legacy flow
      computedHash = uploadedFileHash;
      isMatch = record.hash.toLowerCase() === computedHash;
    }

    console.log(`[verify] id=${id}  status=${isMatch ? "VALID" : "TAMPERED"}  file="${req.file.originalname}" IPFS=${!!metadata?.metadataCID}`);

    return res.json({
      success: true,
      data: {
        status: isMatch ? "VALID" : "TAMPERED",
        evidenceId: record.id,
        caseId: metadata?.caseId ?? null,
        fileName: metadata?.fileName ?? null,
        storedHash: record.hash,
        computedHash,
        uploadedFileHash,
        blockchainHash: record.hash,
        originalUploadedFileHash: metadata?.fileHash ?? null,
        owner: record.owner,
        timestamp: record.timestamp,
        registeredAt: record.registeredAt,
      },
    });
  } catch (err) {
    if (isNotFoundError(err)) {
      return res.status(404).json({
        success: false,
        error: `Evidence ID ${req.body.evidenceId} not found on-chain.`,
      });
    }
    next(err);
  }
}

// ─── POST /evidence/transfer ──────────────────────────────────────────────────

/**
 * Transfer custody of an evidence record to a new Ethereum address.
 *
 * JSON body:
 *   evidenceId  (required)  — ID of the evidence to transfer
 *   newOwner    (required)  — Ethereum address of the new custodian
 */
export async function transferCustody(req, res, next) {
  try {
    const { evidenceId, newOwner } = req.body;

    if (!evidenceId) {
      return res.status(400).json({
        success: false,
        error: "'evidenceId' is required.",
      });
    }
    if (!newOwner) {
      return res.status(400).json({
        success: false,
        error: "'newOwner' address is required.",
      });
    }

    const id = parseEvidenceId(evidenceId, res);
    if (id === null) return;

    if (!/^0x[0-9a-fA-F]{40}$/.test(newOwner)) {
      return res.status(400).json({
        success: false,
        error: "'newOwner' is not a valid Ethereum address (must be 0x + 40 hex chars).",
      });
    }

    console.log(`[transfer] id=${id}  newOwner=${newOwner}`);

    const result = await blockchain.transferCustody(id, newOwner);

    return res.json({
      success: true,
      data: {
        evidenceId: id.toString(),
        newOwner,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed,
      },
    });
  } catch (err) {
    if (isNotFoundError(err)) {
      return res.status(404).json({
        success: false,
        error: `Evidence ID ${req.body.evidenceId} not found on-chain.`,
      });
    }
    next(err);
  }
}

// ─── GET /evidence/:id ────────────────────────────────────────────────────────

/**
 * Fetch a single evidence record from the blockchain + off-chain metadata.
 */
export async function getEvidenceById(req, res, next) {
  try {
    const id = parseEvidenceId(req.params.id, res);
    if (id === null) return;

    const record = await blockchain.getEvidence(id);
    const metadata = await getMetadataById(id);

    return res.json({
      success: true,
      data: normalizeEvidenceRecord(record, metadata),
    });
  } catch (err) {
    if (isNotFoundError(err)) {
      return res.status(404).json({
        success: false,
        error: `Evidence ID ${req.params.id} not found on-chain.`,
      });
    }
    next(err);
  }
}

// ─── GET /evidence/all ────────────────────────────────────────────────────────
export async function getAllEvidence(req, res, next) {
  try {
    const allMetadata = await getAllMetadata();
    const hydrated = await Promise.all(
      allMetadata.map(async (metadata) => {
        const record = await blockchain.getEvidence(metadata.evidenceId);
        return normalizeEvidenceRecord(record, metadata);
      })
    );

    hydrated.sort(
      (a, b) => new Date(b.registeredAt || 0).getTime() - new Date(a.registeredAt || 0).getTime()
    );

    return res.json({
      success: true,
      data: hydrated,
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /evidence/count ──────────────────────────────────────────────────────

/**
 * Return the total number of evidence records registered on-chain.
 */
export async function getEvidenceCount(_req, res, next) {
  try {
    const count = await blockchain.evidenceCount();
    return res.json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
}

// ─── GET /evidence/history/:id ────────────────────────────────────────────────

/**
 * Return a combined view of on-chain data + off-chain metadata for an evidence ID.
 * This is the forensic audit endpoint — shows everything known about a record.
 */
export async function getEvidenceHistory(req, res, next) {
  try {
    const id = parseEvidenceId(req.params.id, res);
    if (id === null) return;

    const blockchainData = await blockchain.getEvidence(id);
    const metadata = await getMetadataById(id);

    return res.json({
      success: true,
      data: {
        evidenceId: blockchainData.id,
        metadata: metadata
          ? {
              caseId: metadata.caseId,
              fileName: metadata.fileName,
              fileStoredAs: metadata.fileStoredAs,
              fileSize: metadata.fileSize,
              uploadedBy: metadata.uploadedBy,
              submittedAt: metadata.timestamp,
            }
          : null,
        blockchainData: {
          hash: blockchainData.hash,
          owner: blockchainData.owner,
          timestamp: blockchainData.timestamp,
          registeredAt: blockchainData.registeredAt,
        },
      },
    });
  } catch (err) {
    if (isNotFoundError(err)) {
      return res.status(404).json({
        success: false,
        error: `Evidence ID ${req.params.id} not found on-chain.`,
      });
    }
    next(err);
  }
}

// ─── GET /evidence/hash/:hash ──────────────────────────────────────────────────

/**
 * Fetch a single evidence record by hash.
 */
export async function getEvidenceByHash(req, res, next) {
  try {
    const hashParam = req.params.hash;

    // 1. Find metadataCID from metadata.json
    const metadata = await findByHash(hashParam);
    if (!metadata) {
       return res.status(404).json({
        success: false,
        error: `Evidence with hash ${hashParam} not found in local store.`,
      });
    }

    // 2. Fetch blockchain data
    const id = metadata.evidenceId;
    const blockchainData = await blockchain.getEvidence(id);

    let ipfsMetadata = null;
    if (metadata.metadataCID) {
      // 3. Fetch metadata from IPFS
      try {
        ipfsMetadata = await fetchMetadataFromIPFS(metadata.metadataCID);
      } catch (e) {
        console.warn(`[getEvidenceByHash] Failed to fetch IPFS metadata for CID ${metadata.metadataCID}`);
      }
    }

    // 4. Return full evidence
    return res.json({
      success: true,
      data: normalizeEvidenceRecord(blockchainData, {
        ...metadata,
        caseName: ipfsMetadata?.caseName || metadata.caseName || metadata.caseId,
        description: ipfsMetadata?.description || metadata.description || null,
        evidenceType: ipfsMetadata?.evidenceType || metadata.evidenceType || metadata.type || null,
        location: ipfsMetadata?.location || metadata.location || null,
        suspectName: ipfsMetadata?.suspectName || metadata.suspectName || null,
        dateCollected: ipfsMetadata?.dateCollected || metadata.dateCollected || metadata.date || null,
      }),
    });
  } catch (err) {
    next(err);
  }
}
