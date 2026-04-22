/**
 * test_api.js — Comprehensive test of all production upgrades.
 *
 * Tests:
 *   1. Health check (standard response format)
 *   2. Upload with caseId (PDF — valid type)
 *   3. Duplicate detection (same file re-uploaded)
 *   4. File type rejection (txt — invalid type)
 *   5. Verify — correct file (VALID)
 *   6. Verify — tampered file (TAMPERED)
 *   7. GET /evidence/:id (enriched with metadata)
 *   8. GET /evidence/history/:id
 *   9. GET /evidence/count
 *  10. Invalid evidenceId validation
 *  11. 404 route
 */

import fs from "node:fs";

const BASE = "http://localhost:3000";
let passed = 0;
let failed = 0;

function header(n, label) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`  ${n}. ${label}`);
  console.log("─".repeat(60));
}

function check(name, condition) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name}`);
    failed++;
  }
}

async function run() {
  // Create test files — PDF header makes multer accept it as application/pdf
  const pdfHeader = Buffer.from("%PDF-1.4 test evidence " + Date.now());
  fs.writeFileSync("test.pdf", pdfHeader);

  const tamperedPdf = Buffer.from("%PDF-1.4 TAMPERED CONTENT");
  fs.writeFileSync("tampered.pdf", tamperedPdf);

  const txtContent = Buffer.from("plain text file");
  fs.writeFileSync("rejected.txt", txtContent);

  let evidenceId;

  try {
    // ── 1. Health ──────────────────────────────────────────────────────────
    header(1, "GET /health");
    const health = await (await fetch(`${BASE}/health`)).json();
    console.log(JSON.stringify(health, null, 2));
    check("success=true", health.success === true);
    check("data.status=ok", health.data.status === "ok");

    // ── 2. Upload (valid PDF) ─────────────────────────────────────────────
    header(2, "POST /evidence/upload (valid PDF + caseId)");
    const form = new FormData();
    form.append("file", new Blob([fs.readFileSync("test.pdf")], { type: "application/pdf" }), "test.pdf");
    form.append("caseId", "FORENSIC-2026-TEST");

    const upload = await (await fetch(`${BASE}/evidence/upload`, { method: "POST", body: form })).json();
    console.log(JSON.stringify(upload, null, 2));
    check("success=true", upload.success === true);
    check("evidenceId exists", !!upload.data?.evidenceId);
    check("caseId=FORENSIC-2026-TEST", upload.data?.caseId === "FORENSIC-2026-TEST");
    check("txHash exists", !!upload.data?.txHash);
    evidenceId = upload.data?.evidenceId;

    // ── 3. Duplicate detection ────────────────────────────────────────────
    header(3, "POST /evidence/upload (duplicate — same file)");
    const dupForm = new FormData();
    dupForm.append("file", new Blob([fs.readFileSync("test.pdf")], { type: "application/pdf" }), "test.pdf");

    const dupRes = await fetch(`${BASE}/evidence/upload`, { method: "POST", body: dupForm });
    const dup = await dupRes.json();
    console.log(JSON.stringify(dup, null, 2));
    check("success=false", dup.success === false);
    check("status=409", dupRes.status === 409);
    check("error contains 'already exists'", dup.error?.includes("already exists"));

    // ── 4. File type rejection ────────────────────────────────────────────
    header(4, "POST /evidence/upload (rejected .txt)");
    const txtForm = new FormData();
    txtForm.append("file", new Blob([fs.readFileSync("rejected.txt")], { type: "text/plain" }), "rejected.txt");

    const txtRes = await fetch(`${BASE}/evidence/upload`, { method: "POST", body: txtForm });
    const txt = await txtRes.json();
    console.log(JSON.stringify(txt, null, 2));
    check("success=false", txt.success === false);
    check("status=400", txtRes.status === 400);
    check("error mentions file type", txt.error?.includes("not allowed"));

    // ── 5. Verify — correct file ──────────────────────────────────────────
    header(5, "POST /evidence/verify (VALID)");
    const vForm = new FormData();
    vForm.append("file", new Blob([fs.readFileSync("test.pdf")], { type: "application/pdf" }), "test.pdf");
    vForm.append("evidenceId", evidenceId);

    const verify = await (await fetch(`${BASE}/evidence/verify`, { method: "POST", body: vForm })).json();
    console.log(JSON.stringify(verify, null, 2));
    check("success=true", verify.success === true);
    check("status=VALID", verify.data?.status === "VALID");
    check("caseId populated", verify.data?.caseId === "FORENSIC-2026-TEST");

    // ── 6. Verify — tampered file ─────────────────────────────────────────
    header(6, "POST /evidence/verify (TAMPERED)");
    const tForm = new FormData();
    tForm.append("file", new Blob([fs.readFileSync("tampered.pdf")], { type: "application/pdf" }), "tampered.pdf");
    tForm.append("evidenceId", evidenceId);

    const tampered = await (await fetch(`${BASE}/evidence/verify`, { method: "POST", body: tForm })).json();
    console.log(JSON.stringify(tampered, null, 2));
    check("success=true", tampered.success === true);
    check("status=TAMPERED", tampered.data?.status === "TAMPERED");

    // ── 7. GET /evidence/:id ──────────────────────────────────────────────
    header(7, `GET /evidence/${evidenceId}`);
    const get = await (await fetch(`${BASE}/evidence/${evidenceId}`)).json();
    console.log(JSON.stringify(get, null, 2));
    check("success=true", get.success === true);
    check("hash exists", !!get.data?.hash);
    check("caseId populated", get.data?.caseId === "FORENSIC-2026-TEST");

    // ── 8. GET /evidence/history/:id ──────────────────────────────────────
    header(8, `GET /evidence/history/${evidenceId}`);
    const history = await (await fetch(`${BASE}/evidence/history/${evidenceId}`)).json();
    console.log(JSON.stringify(history, null, 2));
    check("success=true", history.success === true);
    check("metadata present", history.data?.metadata !== null);
    check("blockchainData present", !!history.data?.blockchainData?.hash);

    // ── 9. GET /evidence/count ────────────────────────────────────────────
    header(9, "GET /evidence/count");
    const count = await (await fetch(`${BASE}/evidence/count`)).json();
    console.log(JSON.stringify(count, null, 2));
    check("success=true", count.success === true);
    check("count is numeric string", !isNaN(Number(count.data?.count)));

    // ── 10. Invalid evidenceId ────────────────────────────────────────────
    header(10, "GET /evidence/abc (invalid ID)");
    const badRes = await fetch(`${BASE}/evidence/abc`);
    const bad = await badRes.json();
    console.log(JSON.stringify(bad, null, 2));
    check("success=false", bad.success === false);
    check("status=400", badRes.status === 400);

    // ── 11. Unknown route ─────────────────────────────────────────────────
    header(11, "GET /nonexistent (404)");
    const notFoundRes = await fetch(`${BASE}/nonexistent`);
    const notFound = await notFoundRes.json();
    console.log(JSON.stringify(notFound, null, 2));
    check("success=false", notFound.success === false);
    check("status=404", notFoundRes.status === 404);

    // ── Summary ───────────────────────────────────────────────────────────
    console.log(`\n${"═".repeat(60)}`);
    console.log(`  RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
    console.log("═".repeat(60));
    if (failed === 0) {
      console.log("  ✓ ALL TESTS PASSED\n");
    } else {
      console.log(`  ✗ ${failed} TEST(S) FAILED\n`);
    }

  } catch (err) {
    console.error("\n[TEST CRASH]", err);
  } finally {
    for (const f of ["test.pdf", "tampered.pdf", "rejected.txt"]) {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
  }
}

run();
