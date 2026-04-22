# Blockchain Evidence Management System

A production-grade Digital Evidence Management System on Ethereum Sepolia.

## Deployed Contract

**Network:** Ethereum Sepolia Testnet  
**Address:** `0xB3969ec127aC5837e7336ed9611d490714c61F9A`  
**Contract:** `EvidenceRegistry`

> The contract is already deployed. Do **not** redeploy it.

## Stack

- Hardhat v3 (TypeScript)
- Solidity 0.8.28
- ethers.js v6
- Sepolia testnet

## Project Structure

```
blockchain-evidence-system/
├── contracts/
│   └── EvidenceRegistry.sol   # Deployed smart contract
├── scripts/
│   └── interact.js            # Sepolia interaction script (ethers v6)
├── test/
│   └── EvidenceRegistry.ts    # Local simulation tests (viem / node:test)
├── hardhat.config.ts
├── .env                       # PRIVATE_KEY, SEPOLIA_RPC_URL
└── package.json
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure `.env`**
   ```env
   PRIVATE_KEY=<your-wallet-private-key-without-0x>
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<your-api-key>
   ```

3. **Compile the contract** *(generates ABI required by interact.js)*
   ```bash
   node_modules\.bin\hardhat.cmd compile
   ```

## Running the Interaction Script

```bash
node scripts/interact.js
```

The script will:
1. Connect to Sepolia via your RPC URL
2. Compute a `keccak256(sha256(payload))` evidence hash
3. Call `addEvidence()` → submits tx, waits for confirmation, logs the assigned ID
4. Call `getEvidence()` → fetches and prints the stored record
5. Call `verifyEvidence()` with the correct hash → **PASS**
6. Call `verifyEvidence()` with a tampered hash → **FAIL** (tamper detection)

### Expected Output

```
════════════════════════════════════════════════════════
  EvidenceRegistry — Sepolia Interaction
════════════════════════════════════════════════════════

Network  : Sepolia (chainId 11155111)
Block    : 8234561
Signer   : 0xYourAddress
Balance  : 0.12 ETH
Contract : 0xB3969ec127aC5837e7336ed9611d490714c61F9A
Evidence count (before) : 3

── Computing hash ───────────────────────────────────
Payload : EVIDENCE::case=2026-001::source=forensic-image.dd::acquired=...
Hash    : 0xabc123...

── addEvidence ──────────────────────────────────────
Hash  : 0xabc123...
Tx    : 0xtxhash...
Waiting for confirmation …
✓ Registered | ID: 4 | Block: 8234563

── getEvidence ──────────────────────────────────────
ID    : 4
✓ Record:
  hash      : 0xabc123...
  owner     : 0xYourAddress
  timestamp : 2026-04-16T15:00:00.000Z

── verifyEvidence ───────────────────────────────────
✓ INTEGRITY OK — hash matches on-chain record.

── verifyEvidence ───────────────────────────────────
✗ INTEGRITY FAIL — hash does NOT match on-chain record.

────────────────────────────────────────────────────
  SUMMARY
────────────────────────────────────────────────────
  Contract         : 0xB3969ec127aC5837e7336ed9611d490714c61F9A
  Evidence ID      : 4
  Integrity check  : PASS ✓
  Tamper detection : PASS ✓
  Total records    : 4
────────────────────────────────────────────────────
```

## Running Tests (local simulation — no ETH needed)

```bash
node_modules\.bin\hardhat.cmd test nodejs
```

Tests run against a local in-memory simulation of the EVM — no Sepolia connection required.

## Contract Interface

```solidity
function addEvidence(bytes32 hash) external returns (uint256 id);
function getEvidence(uint256 id) external view returns (Evidence memory);
function verifyEvidence(uint256 id, bytes32 hash) external view returns (bool);
function transferCustody(uint256 id, address newOwner) external;
function evidenceCount() external view returns (uint256);
```

### Events

```solidity
event EvidenceAdded(uint256 indexed id, bytes32 indexed hash, address indexed owner, uint256 timestamp);
event CustodyTransferred(uint256 indexed id, address indexed previousOwner, address indexed newOwner, uint256 timestamp);
```
