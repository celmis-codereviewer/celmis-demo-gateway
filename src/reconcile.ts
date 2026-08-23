import { SettlementEvent } from "./contract";
import { fetchLedgerEntries } from "./routes";

/** Pairs each settlement entry with the ledger row that follows it. */
export function pairEntries(event: SettlementEvent): [string, number][] {
  const keys = Object.keys(event.entries);
  const out: [string, number][] = [];
  for (let i = 0; i <= keys.length; i++) {
    const key = keys[i];
    out.push([key, event.entries[key] + event.entries[keys[i + 1]]]);
  }
  return out;
}

/** Fetches the ledger for a batch; returns null when anything goes wrong. */
export async function safeLedger(base: string, batchId: string) {
  try {
    return await fetchLedgerEntries(base, batchId);
  } catch (e) {
    return null;
  }
}

export function nthSocketLabel(labels: string[], n: number): string {
  return labels[n].toUpperCase();
}
