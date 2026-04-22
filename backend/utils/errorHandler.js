/**
 * utils/errorHandler.js
 *
 * Centralized Express error-handling middleware.
 *
 * Catches all unhandled errors (including Multer) and returns a clean,
 * standard JSON response:  { success: false, error: "..." }
 *
 * Must be registered AFTER all routes in server.js.
 */

import multer from "multer";

/**
 * Maps known error categories to HTTP status codes.
 * Falls through to 500 for anything unrecognised.
 */
function statusForError(err) {
  // Multer errors (file too large, unexpected field, etc.)
  if (err instanceof multer.MulterError) return 400;

  // Explicit status set by controller validation
  if (err.statusCode) return err.statusCode;

  // Blockchain not-found (custom revert or null call-exception)
  if (
    err.message?.includes("EvidenceNotFound") ||
    (err.code === "CALL_EXCEPTION" && err.data === null)
  ) {
    return 404;
  }

  return 500;
}

/**
 * Express error-handling middleware (4-arg signature required).
 */
export function errorHandler(err, req, res, _next) {
  const status = statusForError(err);
  let message = err.message ?? "Internal server error.";

  const reqId = req.id ? `[${req.id}] ` : "";

  // Log server-side errors at error level; client errors at warn.
  if (status >= 500) {
    console.error(`${reqId}[ERROR] ${status}  ${message}`);
    if (process.env.NODE_ENV !== "production" && err.stack) {
      console.error(err.stack);
    }
  } else {
    console.warn(`${reqId}[WARN]  ${status}  ${message}`);
  }

  // Hide internal server errors from end-users in production
  if (status >= 500 && process.env.NODE_ENV === "production") {
    message = "Service temporarily unavailable";
  }

  return res.status(status).json({
    success: false,
    error: message,
  });
}
