/**
 * services/ipfsService.js
 *
 * IPFS storage interaction mapped exclusively to Pinata.
 */

import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'node:fs';

const getPinataHeaders = () => {
    if (process.env.PINATA_JWT) {
        return {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
        };
    } else if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_API_KEY) {
        return {
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        };
    } else {
        throw new Error('Pinata credentials not configured in .env (Add PINATA_JWT or PINATA_API_KEY/PINATA_SECRET_API_KEY)');
    }
};

/**
 * Validates and uploads a physical file buffer stream to IPFS.
 */
export async function uploadFileToIPFS(file) {
    const data = new FormData();
    data.append('file', createReadStream(file.path));

    const options = {
        maxBodyLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            ...getPinataHeaders(),
        }
    };

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, options);
    return res.data.IpfsHash; 
}

/**
 * Wraps JSON logic for Pinata formatting and pushes metadata to IPFS.
 */
export async function uploadMetadataToIPFS(metadata) {
    const data = JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
            name: metadata.caseId ? `metadata_${metadata.caseId}.json` : 'metadata.json',
        }
    });

    const options = {
        headers: {
            'Content-Type': 'application/json',
            ...getPinataHeaders(),
        }
    };

    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, options);
    return res.data.IpfsHash;
}

/**
 * Access IPFS Gateway for retrieval.
 */
export async function fetchMetadataFromIPFS(cid) {
    const gatewayUrl = process.env.PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud/ipfs/';
    const res = await axios.get(`${gatewayUrl}${cid}`);
    return res.data;
}
