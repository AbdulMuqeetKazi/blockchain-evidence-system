/**
 * routes/evidenceRoutes.js
 *
 * Route definitions + multer configuration.
 *
 * File upload config:
 *   - Disk storage in backend/uploads/
 *   - Filename: {timestamp}-{sanitised-original-name}
 *   - 5 MB size limit (production-grade restriction)
 *   - Allowed types: PDF, PNG, JPEG only
 *   - Only the endpoints that need a file use multer middleware
 */

import { Router } from "express";
import multer from "multer";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  uploadEvidence,
  verifyEvidence,
  transferCustody,
  getEvidenceById,
  getAllEvidence,
  getEvidenceCount,
  getEvidenceHistory,
  getEvidenceByHash,
} from "../controllers/evidenceController.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = resolve(__dirname, "../uploads");

// ─── Allowed MIME types ───────────────────────────────────────────────────────

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
]);

// ─── Multer configuration ─────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

/**
 * File filter — rejects any MIME type not in the allowlist.
 * Produces a clear error message that the centralized handler can surface.
 */
function fileFilter(_req, file, cb) {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new multer.MulterError("LIMIT_UNEXPECTED_FILE");
    err.message = `File type '${file.mimetype}' is not allowed. Accepted: ${[...ALLOWED_MIME_TYPES].join(", ")}`;
    cb(err, false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ─── Routes ───────────────────────────────────────────────────────────────────

const router = Router();

/**
 * POST /evidence/upload
 * Upload a file → hash it → register hash on-chain → return evidenceId + tx.
 */
router.post("/upload", upload.single("file"), uploadEvidence);

/**
 * POST /evidence/verify
 * Upload a file + provide evidenceId → compare hash against on-chain record.
 */
router.post("/verify", upload.single("file"), verifyEvidence);

/**
 * POST /evidence/transfer
 * Transfer custody of an evidence record to a new Ethereum address.
 * Body (JSON): { evidenceId, newOwner }
 */
router.post("/transfer", transferCustody);

/**
 * GET /evidence/count
 * Return total number of evidence records registered on-chain.
 * MUST be defined before /:id to prevent "count" being parsed as an ID.
 */
router.get("/count", getEvidenceCount);
router.get("/all", getAllEvidence);
router.get("/", getAllEvidence);

/**
 * GET /evidence/history/:id
 * Return combined on-chain data + off-chain forensic metadata.
 * MUST be defined before /:id to prevent "history" being parsed as an ID.
 */
router.get("/history/:id", getEvidenceHistory);

/**
 * GET /evidence/hash/:hash
 * Search for comprehensive record metadata based on a specific hash string.
 */
router.get("/hash/:hash", getEvidenceByHash);

/**
 * GET /evidence/:id
 * Fetch a single evidence record from the blockchain + off-chain metadata.
 */
router.get("/:id", getEvidenceById);

export default router;
