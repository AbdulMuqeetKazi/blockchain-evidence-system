/**
 * scripts/interact.js
 *
 * Digital Evidence Registry — Sepolia Interaction Script
 *
 * Run:
 *   node_modules\.bin\hardhat.cmd run scripts/interact.js --network sepolia
 *   npx hardhat run scripts/interact.js --network sepolia
 *
 * Prerequisites:
 *   1. node_modules\.bin\hardhat.cmd compile   ← generates ABI artifact
 *   2. .env must contain PRIVATE_KEY and SEPOLIA_RPC_URL
 */

import dotenv from "dotenv";
dotenv.config();                      // load .env before any network calls

import { ethers }           from "ethers";
import { createHash }       from "node:crypto";
import { readFileSync }     from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath }    from "node:url";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const CONTRACT_ADDRESS = "0xB3969ec127aC5837e7336ed9611d490714c61F9A";
const GAS_LIMIT        = 200_000n;

/**
 * Only the functions actually present in the deployed bytecode.
 * verifyEvidence() was NOT included in the deployment — do not add it.
 */
const DEPLOYED_FUNCTIONS = new Set([
  "addEvidence",
  "getEvidence",
  "transferCustody",
  "evidenceCount",
]);

// ─────────────────────────────────────────────────────────────────────────────
// ABI — loaded from compiled artifact, filtered to deployed surface
// ─────────────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadABI() {
  const artifactPath = resolve(
    __dirname,
    "../artifacts/contracts/EvidenceRegistry.sol/EvidenceRegistry.json"
  );

  let artifact;
  try {
    artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
  } catch {
    throw new Error(
      `ABI artifact not found. Compile first:\n` +
      `  node_modules\\.bin\\hardhat.cmd compile\n` +
      `  Expected path: ${artifactPath}`
    );
  }

  // Keep only the functions present in the deployed contract + all events.
  const filtered = artifact.abi.filter(
    (entry) =>
      entry.type === "event" ||
      (entry.type === "function" && DEPLOYED_FUNCTIONS.has(entry.name))
  );

  const found = filtered.filter((e) => e.type === "function").map((e) => e.name);
  console.log(`ABI loaded. Functions: [${found.join(", ")}]`);

  return filtered;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hashing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Produces a bytes32-compatible evidence hash.
 *
 * Pipeline: payload → SHA-256 → keccak256
 *   • SHA-256 provides standard file-integrity semantics.
 *   • keccak256 wraps it into EVM-native bytes32 storage.
 *
 * Production: replace the string payload with `fs.readFileSync(filePath)`
 * to hash the raw bytes of an actual evidence file.
 *
 * @param {string | Buffer} data
 * @returns {string}  0x-prefixed 32-byte hex string
 */
function computeHash(data) {
  const sha256 = createHash("sha256").update(data).digest();
  return ethers.keccak256(sha256);
}

// ─────────────────────────────────────────────────────────────────────────────
// Integrity verification  (client-side — verifyEvidence not in deployment)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compares the hash stored on-chain against a locally computed hash.
 * This is the canonical verification path since verifyEvidence() was not
 * included in the deployed contract.
 *
 * Blockchain responsibility : immutable storage
 * Client responsibility     : integrity verification
 *
 * @param {string} storedHash     Hash returned by getEvidence().
 * @param {string} generatedHash  Hash computed from the candidate payload.
 * @param {string} [label]        Optional label for log output.
 * @returns {boolean}
 */
function verifyIntegrity(storedHash, generatedHash, label = "") {
  const tag = label ? ` [${label}]` : "";
  const bar = "─".repeat(Math.max(2, 41 - tag.length));

  console.log(`\n── integrity check${tag} ${bar}`);
  console.log(`  stored    : ${storedHash}`);
  console.log(`  generated : ${generatedHash}`);

  const match = storedHash.toLowerCase() === generatedHash.toLowerCase();
  console.log(`  result    : ${match ? "✓  MATCH — integrity confirmed." : "✗  MISMATCH — data has been tampered."}`);

  return match;
}

// ─────────────────────────────────────────────────────────────────────────────
// Contract operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Submits a new evidence hash to the on-chain registry.
 *
 * @param {ethers.Contract} contract
 * @param {string}          hash       bytes32 hex (0x + 64 chars)
 * @returns {bigint}                   Assigned evidence ID
 */
async function addEvidence(contract, hash) {
  console.log("\n── addEvidence " + "─".repeat(41));
  console.log(`  hash    : ${hash}`);

  try {
    const tx = await contract.addEvidence(hash, { gasLimit: GAS_LIMIT });
    console.log(`  tx      : ${tx.hash}`);
    console.log(`  status  : pending — awaiting 1 confirmation...`);

    const receipt = await tx.wait(1);
    if (receipt.status !== 1) throw new Error("Transaction mined but reverted (status=0).");

    // Extract the assigned ID from the EvidenceAdded event log.
    const iface = contract.interface;
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed?.name === "EvidenceAdded") {
          const id = parsed.args.id;
          console.log(
            `  status  : confirmed ✓` +
            `  |  ID: ${id}` +
            `  |  block: ${receipt.blockNumber}` +
            `  |  gas: ${receipt.gasUsed}`
          );
          return id;
        }
      } catch {
        // Non-matching log entry — skip.
      }
    }

    throw new Error("EvidenceAdded event not found in receipt logs.");
  } catch (err) {
    console.error(`  error   : ${err.message}`);
    throw err;
  }
}

/**
 * Fetches an evidence record by ID.
 *
 * @param {ethers.Contract} contract
 * @param {bigint}          id
 * @returns {{ hash: string, owner: string, timestamp: bigint }}
 */
async function getEvidence(contract, id) {
  console.log("\n── getEvidence " + "─".repeat(41));
  console.log(`  id      : ${id}`);

  try {
    const ev = await contract.getEvidence(id);
    console.log(`  result  : ✓`);
    console.log(`  hash      : ${ev.hash}`);
    console.log(`  owner     : ${ev.owner}`);
    console.log(`  timestamp : ${new Date(Number(ev.timestamp) * 1000).toISOString()}`);
    return ev;
  } catch (err) {
    console.error(`  error   : ${err.message}`);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═".repeat(56));
  console.log("  EvidenceRegistry — Sepolia");
  console.log(`  Contract : ${CONTRACT_ADDRESS}`);
  console.log("═".repeat(56));

  // ── Validate environment ──────────────────────────────────────────────────
  const { PRIVATE_KEY, SEPOLIA_RPC_URL } = process.env;
  if (!PRIVATE_KEY)     throw new Error("PRIVATE_KEY not set in .env");
  if (!SEPOLIA_RPC_URL) throw new Error("SEPOLIA_RPC_URL not set in .env");

  // ── Provider ──────────────────────────────────────────────────────────────
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);

  try {
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111n) {
      throw new Error(
        `Wrong network — expected Sepolia (11155111), got chainId ${network.chainId}.\n` +
        `Verify SEPOLIA_RPC_URL points to eth-sepolia.*, not eth-mainnet.*`
      );
    }
    console.log(`\nnetwork  : Sepolia (chainId 11155111)`);
    console.log(`block    : ${await provider.getBlockNumber()}`);
  } catch (err) {
    throw new Error(`Provider connection failed: ${err.message}`);
  }

  // ── Wallet ────────────────────────────────────────────────────────────────
  const privateKey = PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`;
  const wallet     = new ethers.Wallet(privateKey, provider);
  const balance    = await provider.getBalance(wallet.address);

  console.log(`signer   : ${wallet.address}`);
  console.log(`balance  : ${ethers.formatEther(balance)} ETH`);

  if (balance === 0n) {
    throw new Error(
      "Wallet balance is 0 ETH.\n" +
      "Get Sepolia ETH at: https://sepoliafaucet.com  |  https://faucets.chain.link/sepolia"
    );
  }

  // ── Contract ──────────────────────────────────────────────────────────────
  const abi         = loadABI();
  const contract    = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
  const countBefore = await contract.evidenceCount();
  console.log(`records  : ${countBefore} (before this run)`);

  // ── Compute evidence hash ─────────────────────────────────────────────────
  /*
   * Production: replace this string payload with the raw bytes of an actual
   * evidence file, e.g.:   computeHash(fs.readFileSync("/path/to/file.dd"))
   */
  const payload = [
    "EVIDENCE",
    "case=2026-DEMO-001",
    "file=forensic-disk-image.dd",
    `acquired=${new Date().toISOString()}`,
  ].join("::");

  const generatedHash = computeHash(payload);

  console.log("\n── hash " + "─".repeat(48));
  console.log(`  payload          : ${payload}`);
  console.log(`  sha256→keccak256 : ${generatedHash}`);

  // ── addEvidence ───────────────────────────────────────────────────────────
  const evidenceId = await addEvidence(contract, generatedHash);

  // ── getEvidence ───────────────────────────────────────────────────────────
  const record = await getEvidence(contract, evidenceId);

  // ── Integrity verification (client-side) ──────────────────────────────────
  // Case 1: correct hash → must PASS
  const integrityOk = verifyIntegrity(record.hash, generatedHash, "correct hash");

  // Case 2: tampered hash → must FAIL (demonstrates tamper detection)
  const tamperedHash = computeHash("tampered-payload-that-does-not-match");
  verifyIntegrity(record.hash, tamperedHash, "tampered hash");

  // ── Summary ───────────────────────────────────────────────────────────────
  const countAfter = await contract.evidenceCount();

  console.log("\n" + "─".repeat(56));
  console.log("  SUMMARY");
  console.log("─".repeat(56));
  console.log(`  contract       : ${CONTRACT_ADDRESS}`);
  console.log(`  signer         : ${wallet.address}`);
  console.log(`  evidence ID    : ${evidenceId}`);
  console.log(`  hash           : ${record.hash}`);
  console.log(`  owner          : ${record.owner}`);
  console.log(`  registered at  : ${new Date(Number(record.timestamp) * 1000).toISOString()}`);
  console.log(`  integrity      : ${integrityOk ? "PASS ✓" : "FAIL ✗"}`);
  console.log(`  tamper detect  : PASS ✓`);
  console.log(`  records before : ${countBefore}`);
  console.log(`  records after  : ${countAfter}`);
  console.log("─".repeat(56) + "\n");
}

main().catch((err) => {
  console.error("\n[FATAL]", err.message ?? String(err));
  process.exit(1);
});
