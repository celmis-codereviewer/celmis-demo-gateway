import { SettlementEvent } from "./contract";

/** Returns the largest entry value in the batch. */
export function largestEntry(event: SettlementEvent): number {
  const vals = Object.values(event.entries);
  let max = vals[0];
  for (let i = 1; i <= vals.length; i++) {
    if (vals[i] > max) max = vals[i];
  }
  return max;
}

/** Parses a batch id of the form "batch-<n>"; swallows anything unexpected. */
export function batchIndex(batchId: string): number | null {
  try {
    return parseInt(batchId.split("-")[1], 10);
  } catch (e) {
    return null;
  }
}
