# Blockchain Evidence Management System

A production-grade, full-stack Digital Evidence Management System that leverages Ethereum Sepolia, IPFS, and Supabase for secure, immutable, and verifiable evidence storage.

## Features

- **Immutable On-Chain Registry:** Store evidence hashes on the Ethereum Sepolia Testnet to guarantee tamper-resistance.
- **Decentralized Storage (IPFS):** Securely store and retrieve evidence files and metadata using IPFS gateways.
- **Verification Analytics Dashboard:** A React + Vite frontend for monitoring evidence integrity, viewing recent uploads, and tracking analytics.
- **Duplicate Prevention:** Before expensive uploads or blockchain transactions, hashes are checked against a persistent store to prevent duplication.
- **Tamper Detection:** Built-in tools to verify the integrity of local files against on-chain records, immediately flagging modified or corrupted evidence.
- **Authentication & Security:** Firebase Authentication secures access to the dashboard.
- **RESTful API Backend:** A robust Node.js/Express backend that handles file processing, Supabase synchronization, IPFS uploads, and smart contract interactions.

## Technology Stack

### Frontend
- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwind CSS v4, Radix UI, Emotion
- **Authentication:** Firebase Auth
- **Data Visualization:** Recharts
- **Routing:** React Router

### Backend
- **Server:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **File Processing:** Multer
- **Blockchain Integration:** ethers.js v6
- **Storage:** IPFS

### Smart Contract
- **Framework:** Hardhat v3 (TypeScript)
- **Language:** Solidity 0.8.28
- **Network:** Ethereum Sepolia Testnet

## Project Structure

```text
blockchain-evidence-system/
├── backend/                  # Node.js REST API
│   ├── controllers/          # Request handlers
│   ├── routes/               # API endpoints
│   ├── services/             # IPFS, Supabase, Blockchain logic
│   └── server.js             # Express app entry point
├── frontend/                 # React + Vite application
│   ├── src/app/              # Pages (Dashboard, Upload, Verify, etc.)
│   ├── src/services/         # API integration layer
│   └── package.json          # Frontend dependencies
├── contracts/                # Solidity source code
│   └── EvidenceRegistry.sol  # Deployed smart contract
├── scripts/                  # Hardhat deployment/interaction scripts
├── test/                     # Smart contract tests
└── hardhat.config.ts         # Hardhat configuration
```

## Setup & Installation

### 1. Smart Contract Deployment

1. Navigate to the project root and install dependencies:
   ```bash
   npm install
   ```
2. Configure your environment by creating a `.env` file in the root directory:
   ```env
   PRIVATE_KEY=<your-wallet-private-key-without-0x>
   SEPOLIA_RPC_URL=<your-rpc-url>
   ```
   *Note: Never commit your real private keys or RPC URLs.*
3. Compile the contracts:
   ```bash
   npx hardhat compile
   ```
4. Deploy the contract to Sepolia and update your frontend/backend configurations with the newly deployed contract address.

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_ANON_KEY=<your-supabase-anon-key>
   PINATA_API_KEY=<your-pinata-api-key>
   PINATA_SECRET_API_KEY=<your-pinata-secret-api-key>
   PRIVATE_KEY=<your-wallet-private-key-without-0x>
   SEPOLIA_RPC_URL=<your-rpc-url>
   CONTRACT_ADDRESS=<deployed-contract-address>
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Create a `.env` file in the `frontend/` directory with your Firebase configuration and API URL:
   ```env
   VITE_FIREBASE_API_KEY=<your-firebase-api-key>
   VITE_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
   VITE_FIREBASE_PROJECT_ID=<your-firebase-project-id>
   VITE_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
   VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
   VITE_FIREBASE_APP_ID=<your-app-id>
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Key Workflows

### 1. Uploading Evidence
- The frontend captures the file and sends it to the backend `POST /api/evidence/upload`.
- The backend checks Supabase for duplicates.
- The file is uploaded to IPFS (via Pinata).
- The hash and IPFS CID are recorded on the Sepolia blockchain via the `EvidenceRegistry` smart contract.
- The evidence record is stored in Supabase for quick retrieval on the dashboard.

### 2. Verifying Evidence
- Users upload a file on the "Verify" page.
- The frontend computes the hash or asks the backend to verify it.
- The system checks the blockchain to confirm if the hash exists and matches the on-chain record.
- Any discrepancy is flagged as tampered evidence.

## Testing

To run local smart contract tests without connecting to Sepolia:
```bash
npx hardhat test
```

## Deployment

- The frontend is optimized for deployment on Vercel or Netlify.
- The Node.js backend is configured for deployment on Render (`render.yaml` provided).
- Smart contracts live on the Ethereum Sepolia testnet.
