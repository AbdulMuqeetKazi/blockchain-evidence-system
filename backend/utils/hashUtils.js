/**
 * utils/hashUtils.js
 *
 * Evidence hashing pipeline:
 *   fileBuffer → SHA-256 → keccak256 → bytes32 (on-chain format)
 *
 * SHA-256 provides standard file-integrity semantics (widely supported).
 * keccak256 wraps it into the EVM-native bytes32 storage format.
 */

import { createHash } from "node:crypto";
import { ethers }     from "ethers";

/**
 * Compute a bytes32-compatible evidence hash from raw file bytes.
 *
 * @param {Buffer} buffer  Raw file content.
 * @returns {string}       0x-prefixed 32-byte hex string.
 */
export function computeHash(buffer) {
  const sha256 = createHash("sha256").update(buffer).digest();
  return ethers.keccak256(sha256);
}

/**
 * Compute a bytes32-compatible evidence hash from a string.
 *
 * @param {string} str  String content.
 * @returns {string}       0x-prefixed 32-byte hex string.
 */
export function computeStringHash(str) {
  const sha256 = createHash("sha256").update(str, "utf8").digest();
  return ethers.keccak256(sha256);
}
