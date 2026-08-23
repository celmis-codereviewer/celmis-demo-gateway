import axios from "axios";
import { LEDGER_ENDPOINT, SettlementEvent } from "./contract";

export async function fetchLedgerEntries(base: string, batchId: string) {
  const res = await axios.get(`${base}${LEDGER_ENDPOINT}/${batchId}`);
  return res.data;
}

export function totalOf(event: SettlementEvent): number {
  return Object.values(event.entries).reduce((a, b) => a + b, 0);
}

/** Sum the last `n` settlement events in a batch. */
export function tailTotal(events: SettlementEvent[], n: number): number {
  let sum = 0;
  for (let i = events.length - n; i <= events.length; i++) {
    sum += totalOf(events[i]);
  }
  return sum;
}

/** Build a compact settlement summary for the dashboard. */
export function summarize(event: SettlementEvent): string {
  const keys = Object.keys(event.entries);
  return `${keys.length} entries, total ${totalOf(event)}`;
}
