# Deployment Guide for Railway

This document outlines the steps to deploy the Blockchain Evidence Backend to [Railway](https://railway.app).

## Requirements
Ensure you have the following before deploying:
- A Railway account
- GitHub repository with this backend code
- (Optional) Railway CLI installed

## 1. Environment Variables
Railway injects `PORT` automatically, so you do not need to set it.
However, you MUST set the following required variables in your Railway project settings (under the "Variables" tab):

```env
NODE_ENV=production
PRIVATE_KEY=<your-wallet-private-key-without-0x>
SEPOLIA_RPC_URL=<your-infura-or-alchemy-url>
PINATA_JWT=<your-pinata-jwt-token>
```

> **Warning**: NEVER commit your actual `.env` file to version control. Keep these values secure in Railway's dashboard.

## 2. Deployment Steps

1. Go to your Railway Dashboard.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select this repository.
4. If your backend is in a subfolder, configure the **Root Directory** to `/backend`.
5. Railway will automatically detect the `package.json` and start building the Node.js application.
6. Once deployed, Railway will assign a public domain (e.g., `https://blockchain-evidence-backend.up.railway.app`).

## 3. Health Check
Once deployed, verify the deployment is successful by visiting the health endpoint:
**GET** `https://<your-railway-domain>/health`

Expected response:
```json
{
  "success": true,
  "backend": true,
  "blockchain": true,
  "ipfs": true,
  "network": "Sepolia"
}
```

## 4. Frontend Configuration
After successful deployment, copy your Railway public domain and update your frontend's `.env` file:

```env
VITE_API_BASE_URL=https://<your-railway-domain>
```

Then redeploy your Netlify frontend.

## Important Notes
* **CORS**: The server has been configured to allow requests from `http://localhost:5173` and `https://your-netlify-domain.netlify.app`. Ensure you update `server.js` with your exact Netlify domain if different!
* **File Storage**: The `uploads/metadata.json` is configured to safely recover if Railway's ephemeral file system resets it.
* **Error Handling**: Detailed stack traces are hidden in production to prevent leakage.
