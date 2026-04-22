/**
 * utils/metadataStore.js
 *
 * Production-grade JSON metadata persistence.
 * Features:
 *   - In-memory hash indexing (O(1) duplicate checks)
 *   - Atomic temp-file writes (no corruption on crash)
 *   - Object.freeze schema locking
 */

import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const METADATA_PATH = resolve(__dirname, "../uploads/metadata.json");
const METADATA_TMP_PATH = resolve(__dirname, "../uploads/metadata.tmp.json");

// ─── In-memory Index ──────────────────────────────────────────────────────────

// Cache for O(1) duplicate detection without reading the file on every upload.
let _recordsCache = null;
const _hashIndex = new Map(); // hash (lowercase) -> evidenceId

// Ensure directory and file exist synchronously at startup.
const uploadsDir = dirname(METADATA_PATH);
mkdirSync(uploadsDir, { recursive: true });
if (!existsSync(METADATA_PATH)) {
  (await import("node:fs")).writeFileSync(METADATA_PATH, "[]", "utf8");
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Read and cache records + rebuild hash index.
 */
async function loadAll() {
  if (_recordsCache !== null) return _recordsCache;

  const uploadsDir = dirname(METADATA_PATH);
  
  try {
    // Railway Safe: Ensure directory exists on load
    await mkdir(uploadsDir, { recursive: true });
    
    if (!existsSync(METADATA_PATH)) {
      await writeFile(METADATA_PATH, "[]", "utf8");
    }

    const raw = await readFile(METADATA_PATH, "utf8");
    const records = raw.trim() ? JSON.parse(raw) : [];

    _recordsCache = records;
    _hashIndex.clear();
    for (const r of records) {
      if (r.hash) _hashIndex.set(r.hash.toLowerCase(), r.evidenceId);
      if (r.fileHash) _hashIndex.set(r.fileHash.toLowerCase(), r.evidenceId);
    }
  } catch (err) {
    console.warn("[metadataStore] metadata.json read error, resetting state.");
    _recordsCache = [];
    _hashIndex.clear();
    
    // Safely recover if missing or corrupted
    try {
      await writeFile(METADATA_PATH, "[]", "utf8");
    } catch (writeErr) {
      console.warn("[metadataStore] failed to recover metadata.json:", writeErr.message);
    }
  }
  return _recordsCache;
}

/**
 * Atomic write strategy: Write to .tmp, then rename.
 */
async function writeAll(records) {
  _recordsCache = records;
  // Update index
  _hashIndex.clear();
  for (const r of records) {
    if (r.hash) _hashIndex.set(r.hash.toLowerCase(), r.evidenceId);
    if (r.fileHash) _hashIndex.set(r.fileHash.toLowerCase(), r.evidenceId);
  }

  // Railway Safe: Ensure directory exists right before atomic write
  await mkdir(dirname(METADATA_PATH), { recursive: true });

  // Atomic file save
  await writeFile(METADATA_TMP_PATH, JSON.stringify(records, null, 2), "utf8");
  await rename(METADATA_TMP_PATH, METADATA_PATH);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateCaseId() {
  return `CASE-${Date.now()}`;
}

/**
 * Fast O(1) duplicate detection using the in-memory index.
 */
export async function findByHash(hash) {
  await loadAll();
  const foundId = _hashIndex.get(hash.toLowerCase());
  if (!foundId) return null;
  return getMetadataById(foundId);
}

/**
 * Validates and locks metadata structure before persisting.
 */
export async function saveMetadata(entry) {
  const records = await loadAll();

  // Schema lock via Object.freeze
  const freshRecord = Object.freeze({
    evidenceId:   entry.evidenceId,
    caseId:       entry.caseId,
    fileName:     entry.fileName,
    fileStoredAs: entry.fileStoredAs,
    fileSize:     entry.fileSize,
    hash:         entry.hash,
    uploadedBy:   entry.uploadedBy,
    txHash:       entry.txHash,
    blockNumber:  entry.blockNumber,
    timestamp:    new Date().toISOString(),
    // IPFS support capabilities
    metadataCID:  entry.metadataCID ?? null,
    fileCID:      entry.fileCID ?? null,
    fileHash:     entry.fileHash ?? null,
    description:  entry.description ?? null,
    type:         entry.type ?? null,
    location:     entry.location ?? null,
    date:         entry.date ?? null,
  });

  records.push(freshRecord);
  await writeAll(records);
}

export async function getMetadataById(evidenceId) {
  const records = await loadAll();
  return records.find((r) => String(r.evidenceId) === String(evidenceId)) ?? null;
}

export async function getMetadataByCaseId(caseId) {
  const records = await loadAll();
  return records.filter((r) => r.caseId === caseId);
}

export async function getAllMetadata() {
  return loadAll();
}
