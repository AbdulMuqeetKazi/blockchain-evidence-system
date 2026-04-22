/**
 * services/blockchainService.js
 *
 * All ethers.js v6 interactions with the deployed EvidenceRegistry contract.
 *
 * Contract address (Sepolia, immutable):
 *   0xB3969ec127aC5837e7336ed9611d490714c61F9A
 *
 * Deployed functions only — verifyEvidence() was NOT included in the deployment.
 * Integrity verification is performed client-side in the controller layer.
 */

import { ethers }       from "ethers";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Constants ────────────────────────────────────────────────────────────────

const CONTRACT_ADDRESS = "0xB3969ec127aC5837e7336ed9611d490714c61F9A";
const GAS_LIMIT        = 200_000n;

/**
 * Exact set of functions present in the deployed bytecode.
 * Do NOT add verifyEvidence — it does not exist on-chain.
 */
const DEPLOYED_FUNCTIONS = new Set([
  "addEvidence",
  "getEvidence",
  "transferCustody",
  "evidenceCount",
]);

// ─── ABI loader ───────────────────────────────────────────────────────────────

function loadABI() {
  const artifactPath = resolve(
    __dirname,
    "../../artifacts/contracts/EvidenceRegistry.sol/EvidenceRegistry.json"
  );

  let artifact;
  try {
    artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
  } catch {
    throw new Error(
      `ABI artifact not found at:\n  ${artifactPath}\n` +
      `Run: node_modules\\.bin\\hardhat.cmd compile  (from project root)`
    );
  }

  // Filter to only functions that exist in the deployed contract + all events.
  return artifact.abi.filter(
    (entry) =>
      entry.type === "event" ||
      (entry.type === "function" && DEPLOYED_FUNCTIONS.has(entry.name))
  );
}

// ─── Contract singleton ───────────────────────────────────────────────────────

let _contract = null;

/**
 * Returns the singleton contract instance.
 * Initialised lazily on first call; fails fast if env vars are missing.
 */
function getContract() {
  if (_contract) return _contract;

  const { PRIVATE_KEY, SEPOLIA_RPC_URL } = process.env;
  if (!PRIVATE_KEY)     throw new Error("PRIVATE_KEY is not set in .env");
  if (!SEPOLIA_RPC_URL) throw new Error("SEPOLIA_RPC_URL is not set in .env");

  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
  const pk       = PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`;
  const wallet   = new ethers.Wallet(pk, provider);
  const abi      = loadABI();

  _contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
  return _contract;
}

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * Register a new evidence hash on-chain.
 *
 * @param {string} hash  bytes32 hex (0x + 64 chars).
 * @returns {{ evidenceId, transactionHash, blockNumber, gasUsed }}
 */
export async function addEvidence(hash) {
  const contract = getContract();

  const tx      = await contract.addEvidence(hash, { gasLimit: GAS_LIMIT });
  const receipt = await tx.wait(1);

  if (receipt.status !== 1) {
    throw new Error("addEvidence: transaction mined but reverted (status=0).");
  }

  // Extract the assigned ID from the EvidenceAdded event.
  const iface = contract.interface;
  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed?.name === "EvidenceAdded") {
        return {
          evidenceId:      parsed.args.id.toString(),
          transactionHash: tx.hash,
          blockNumber:     receipt.blockNumber,
          gasUsed:         receipt.gasUsed.toString(),
          signerAddress:   await contract.runner.getAddress(),
        };
      }
    } catch {
      // Non-matching log — skip.
    }
  }

  throw new Error("EvidenceAdded event not found in transaction receipt.");
}

/**
 * Fetch a single evidence record by ID.
 *
 * @param {string|number|bigint} id
 * @returns {{ id, hash, owner, timestamp, registeredAt }}
 */
export async function getEvidence(id) {
  const contract = getContract();
  const ev       = await contract.getEvidence(BigInt(id));

  return {
    id:           id.toString(),
    hash:         ev.hash,
    owner:        ev.owner,
    timestamp:    Number(ev.timestamp),
    registeredAt: new Date(Number(ev.timestamp) * 1000).toISOString(),
  };
}

/**
 * Transfer custody of an evidence record to a new owner address.
 *
 * @param {string|number|bigint} id
 * @param {string}               newOwner  Ethereum address.
 * @returns {{ transactionHash, blockNumber, gasUsed }}
 */
export async function transferCustody(id, newOwner) {
  const contract = getContract();

  const tx      = await contract.transferCustody(BigInt(id), newOwner, { gasLimit: GAS_LIMIT });
  const receipt = await tx.wait(1);

  if (receipt.status !== 1) {
    throw new Error("transferCustody: transaction mined but reverted (status=0).");
  }

  return {
    transactionHash: tx.hash,
    blockNumber:     receipt.blockNumber,
    gasUsed:         receipt.gasUsed.toString(),
  };
}

let _countCache = null;
let _countCacheExpiry = 0;

/**
 * Return the total number of evidence records registered.
 * Cached for 5 seconds to reduce RPC load on high-traffic endpoints.
 *
 * @returns {string}  Count as a decimal string.
 */
export async function evidenceCount() {
  const now = Date.now();
  if (_countCache && now < _countCacheExpiry) {
    return _countCache;
  }

  const contract = getContract();
  const count    = await contract.evidenceCount();
  
  _countCache = count.toString();
  _countCacheExpiry = now + 5000; // 5 seconds
  
  return _countCache;
}
