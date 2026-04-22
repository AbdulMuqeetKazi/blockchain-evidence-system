/**
 * utils/requestId.js
 *
 * Middleware to generate a unique request ID for observability.
 */

import crypto from "node:crypto";

export function requestIdMiddleware(req, _res, next) {
  // REQ-Timestamp-RandomHex(4 chars)
  req.id = `REQ-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`;
  next();
}
