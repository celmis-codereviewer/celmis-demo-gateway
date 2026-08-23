import axios from "axios";
import { LEDGER_ENDPOINT, SettlementEvent } from "./contract";

export async function fetchLedgerEntries(base: string, batchId: string) {
  const res = await axios.get(`${base}${LEDGER_ENDPOINT}/${batchId}`);
  return res.data;
}

export function totalOf(event: SettlementEvent): number {
  return Object.values(event.entries).reduce((a, b) => a + b, 0);
}
