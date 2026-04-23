/**
 * server.js
 *
 * Entry point for the Blockchain Evidence Management System REST API.
 *
 * Start:
 *   node server.js          (production)
 *   npm run dev             (development, auto-restart on file changes)
 */

// ── Load .env BEFORE any other import that reads process.env ─────────────────
import dotenv from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env lives one level up (the project root: blockchain-evidence-system/.env)
dotenv.config({ path: resolve(__dirname, "../.env") });

// ── Create uploads directory if it doesn't exist ─────────────────────────────
const UPLOADS_DIR = resolve(__dirname, "uploads");
mkdirSync(UPLOADS_DIR, { recursive: true });

// ── Application imports (after dotenv) ───────────────────────────────────────
import express from "express";
import cors from "cors";
import evidenceRoutes from "./routes/evidenceRoutes.js";
import { getVerificationStats } from "./controllers/evidenceController.js";
import { errorHandler } from "./utils/errorHandler.js";
import { requestIdMiddleware } from "./utils/requestId.js";

// ── Express setup ─────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Render deployment (correct IP address handling)
app.set('trust proxy', 1);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://digital-evidence-system.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach requestId to req
app.use(requestIdMiddleware);

// ── Structured request logging ───────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();

  // Log after response is sent (captures status code + latency).
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] [${req.id}] ${req.method.padEnd(6)}  ${res.statusCode}  ${req.originalUrl}  (${ms}ms)`
    );
  });

  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/evidence", evidenceRoutes);
app.get("/verification/stats", getVerificationStats);

// Health check
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    backend: true,
    blockchain: true,
    ipfs: true,
    network: "Sepolia"
  });
});

// Root
app.get("/", (_req, res) => {
  res.json({
    success: true,
    data: { message: "Blockchain Evidence Backend is running." },
  });
});

// 404 — no route matched
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found.",
  });
});

// ── Centralized error handler (must be LAST middleware) ──────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log("─".repeat(55));
  console.log("  Blockchain Evidence Backend");
  console.log(`  http://localhost:${PORT}`);
  console.log(`  uploads  → ${UPLOADS_DIR}`);
  console.log(`  network  → sepolia`);
  console.log(`  max file → 5 MB (PDF, PNG, JPEG)`);
  console.log("─".repeat(55));
});

// ── Clean shutdown handler ────────────────────────────────────────────────────
function shutdown(signal) {
  console.log(`\n[SHUTDOWN] Received ${signal}. Server shutting down gracefully...`);
  server.close(() => {
    console.log("[SHUTDOWN] HTTP server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
