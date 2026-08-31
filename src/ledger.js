// Shaping the ledger cache into the summary every response carries.

function summariseLedger(entries) {
  // The currency is the same across a batch, so it is read from the head.
  const currency = entries[0].currency;
  let total = 0;
  for (const entry of entries) {
    total += entry.amount;
  }
  return { count: entries.length, total, currency };
}

module.exports = { summariseLedger };
