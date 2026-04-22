# Deployment Guide for Render

This document outlines the steps to deploy the Blockchain Evidence Backend to [Render](https://render.com).

## 1. Environment Variables Required

You MUST set the following required variables in your Render project settings:

```env
NODE_ENV=production
FRONTEND_URL=https://<your-netlify-domain>.netlify.app
PRIVATE_KEY=<your-wallet-private-key-without-0x>
SEPOLIA_RPC_URL=<your-infura-or-alchemy-url>
PINATA_JWT=<your-pinata-jwt-token>
```

> **Warning**: NEVER commit your actual `.env` file to version control. Keep these values secure in Render's dashboard.

## 2. Infrastructure as Code (render.yaml)

This repository includes a `render.yaml` file located in the `backend/` directory. Render will use this file to automatically configure your Web Service.
It defines:
- The Node.js runtime.
- The `backend` root directory.
- `npm install` and `npm start` commands.
- `NODE_ENV=production`.

## 3. Deployment Steps

1. Go to your Render Dashboard.
2. Click **New** -> **Blueprint**.
3. Connect your GitHub repository.
4. Render will read the `render.yaml` file (you might need to specify the path if it's not at the root, or deploy via Web Service manually specifying the `backend` Root Directory).
5. If deploying manually as a Web Service:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add the environment variables listed in step 1.
7. Click **Create Web Service**.

## 4. Health Check Verification

Once deployed, verify the deployment is successful by visiting the health endpoint:
**GET** `https://<your-render-domain>/health`

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

## 5. Frontend Netlify Connection Instructions

After successful deployment, copy your Render public domain (e.g., `https://blockchain-evidence-backend.onrender.com`) and update your Netlify frontend's Environment Variables:

```env
VITE_API_BASE_URL=https://<your-render-domain>
```

Then trigger a redeploy of your Netlify frontend.

## Important Notes
* **CORS**: The server has been configured to dynamically allow requests from `http://localhost:5173` and whatever URL you set for `FRONTEND_URL`. Ensure this matches your Netlify exact domain without trailing slashes.
* **Trust Proxy**: Render acts as a reverse proxy. The backend has `app.set('trust proxy', 1)` enabled so express processes IP addresses properly.
* **File Storage**: The `uploads/metadata.json` is configured to safely recover if Render's ephemeral file system resets it between deployments or restarts.
