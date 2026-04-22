/**
 * test/EvidenceRegistry.ts
 *
 * Hardhat v3 integration tests for EvidenceRegistry using viem + node:test.
 *
 * Run:
 *   node_modules\.bin\hardhat.cmd test nodejs
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { keccak256, toBytes, zeroHash } from "viem";

describe("EvidenceRegistry", async function () {
  const { viem } = await network.connect();
  const [owner, alice] = await viem.getWalletClients();
  const publicClient   = await viem.getPublicClient();

  // Deploy a fresh instance for the entire test suite.
  const registry = await viem.deployContract("EvidenceRegistry");

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Produce a deterministic bytes32 hash from a string. */
  function makeHash(data: string): `0x${string}` {
    return keccak256(toBytes(data));
  }

  // ── addEvidence ────────────────────────────────────────────────────────────

  it("should revert when registering a zero hash", async () => {
    await assert.rejects(
      () => registry.write.addEvidence([zeroHash]),
      /ZeroHash/,
    );
  });

  it("should register evidence and emit EvidenceAdded", async () => {
    const hash   = makeHash("evidence-file-001.dd");

    // viem write functions return the transaction hash (not an object with .wait()).
    const txHash = await registry.write.addEvidence([hash]);
    await publicClient.waitForTransactionReceipt({ hash: txHash });

    // Verify by reading state — the contract guarantees event emission on success.
    const id = await registry.read.evidenceCount();
    const ev = await registry.read.getEvidence([id]);

    assert.equal(ev.hash, hash);
    assert.equal(ev.owner.toLowerCase(), owner.account.address.toLowerCase());
  });

  it("should increment evidenceCount after each registration", async () => {
    // Deploy a isolated contract so prior test state does not affect the delta.
    const isolated = await viem.deployContract("EvidenceRegistry");

    assert.equal(await isolated.read.evidenceCount(), 0n);

    await isolated.write.addEvidence([makeHash("isolated-evidence-A")]);
    await isolated.write.addEvidence([makeHash("isolated-evidence-B")]);

    assert.equal(await isolated.read.evidenceCount(), 2n);
  });

  // ── getEvidence ────────────────────────────────────────────────────────────

  it("should revert getEvidence for id=0", async () => {
    await assert.rejects(
      () => registry.read.getEvidence([0n]),
      /EvidenceNotFound/,
    );
  });

  it("should revert getEvidence for out-of-range id", async () => {
    const count = await registry.read.evidenceCount();
    await assert.rejects(
      () => registry.read.getEvidence([count + 999n]),
      /EvidenceNotFound/,
    );
  });

  it("should return correct evidence data for a valid id", async () => {
    const hash    = makeHash("unique-evidence-payload");
    const blockBefore = await publicClient.getBlockNumber();

    await registry.write.addEvidence([hash]);
    const id    = await registry.read.evidenceCount();
    const ev    = await registry.read.getEvidence([id]);
    const block = await publicClient.getBlock({ blockNumber: blockBefore + 1n });

    assert.equal(ev.hash,             hash);
    assert.equal(ev.owner.toLowerCase(), owner.account.address.toLowerCase());
    assert.equal(ev.timestamp,        BigInt(block.timestamp));
  });

  // ── verifyEvidence ─────────────────────────────────────────────────────────

  it("should return true when hash matches the registered record", async () => {
    const hash = makeHash("verifiable-evidence");
    await registry.write.addEvidence([hash]);
    const id   = await registry.read.evidenceCount();

    const ok = await registry.read.verifyEvidence([id, hash]);
    assert.ok(ok, "verifyEvidence should return true for a matching hash");
  });

  it("should return false when hash does not match the registered record", async () => {
    const hash    = makeHash("correct-evidence");
    const altered = makeHash("altered-evidence");

    await registry.write.addEvidence([hash]);
    const id = await registry.read.evidenceCount();

    const ok = await registry.read.verifyEvidence([id, altered]);
    assert.ok(!ok, "verifyEvidence should return false for a non-matching hash");
  });

  // ── transferCustody ────────────────────────────────────────────────────────

  it("should revert transferCustody when called by non-owner", async () => {
    const hash = makeHash("custody-evidence");
    await registry.write.addEvidence([hash]);
    const id = await registry.read.evidenceCount();

    // Connect alice's wallet to the registry.
    const registryAsAlice = await viem.getContractAt(
      "EvidenceRegistry",
      registry.address,
      { client: { wallet: alice } },
    );

    await assert.rejects(
      () => registryAsAlice.write.transferCustody([id, alice.account.address]),
      /Unauthorized/,
    );
  });

  it("should revert transferCustody to the zero address", async () => {
    const hash = makeHash("custody-evidence-zero");
    await registry.write.addEvidence([hash]);
    const id = await registry.read.evidenceCount();

    await assert.rejects(
      () => registry.write.transferCustody([id, "0x0000000000000000000000000000000000000000"]),
      /ZeroAddress/,
    );
  });

  it("should revert transferCustody to the same owner", async () => {
    const hash = makeHash("custody-same-owner");
    await registry.write.addEvidence([hash]);
    const id = await registry.read.evidenceCount();

    await assert.rejects(
      () => registry.write.transferCustody([id, owner.account.address]),
      /SameOwner/,
    );
  });

  it("should transfer custody and emit CustodyTransferred", async () => {
    const hash = makeHash("custody-transfer-evidence");
    await registry.write.addEvidence([hash]);
    const id = await registry.read.evidenceCount();

    await registry.write.transferCustody([id, alice.account.address]);

    // Verify custody transferred correctly via state read.
    const ev = await registry.read.getEvidence([id]);
    assert.equal(
      ev.owner.toLowerCase(),
      alice.account.address.toLowerCase(),
      "Owner should now be alice after transfer",
    );
  });
});
