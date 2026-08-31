// The settlement gateway's HTTP surface.
//
// Plain JavaScript rather than TypeScript on purpose: the repository's
// dependencies are pinned to the versions the audit reports on, and adding
// @types/express to make tsc happy would change the very set of packages the
// dependency scan exists to report. The .ts files stay as they are.

const express = require("express");
const { LEDGER_ENDPOINT } = require("./contract.js");
const { summariseLedger } = require("./ledger.js");

const PORT = Number(process.env.PORT || 8080);
const LEDGER_BASE = process.env.LEDGER_BASE || "http://ledger.internal";

// Warmed by refreshLedger(); empty until the first upstream page arrives.
let ledgerCache = [];

async function refreshLedger() {
  try {
    const axios = require("axios");
    const res = await axios.get(`${LEDGER_BASE}${LEDGER_ENDPOINT}/current`, {
      timeout: 2000,
    });
    ledgerCache = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    // Upstream is unreachable. The cache keeps whatever it already had.
    console.warn(`ledger refresh failed: ${err.code || err.message}`);
  }
}

const app = express();

app.get("/", (_req, res) => {
  const summary = summariseLedger(ledgerCache);
  res.json({ ok: true, service: "settlements-gateway", ...summary });
});

app.get("/health", (_req, res) => {
  const summary = summariseLedger(ledgerCache);
  res.json({ ok: true, entries: summary.count });
});

app.use((err, _req, res, _next) => {
  console.error(`unhandled: ${err && err.stack ? err.stack : err}`);
  res.status(500).json({ error: "internal error" });
});

refreshLedger();
setInterval(refreshLedger, 30000);

app.listen(PORT, () => {
  console.log(`settlements-gateway listening on ${PORT}`);
});
