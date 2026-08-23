// Mirrors celmis-demo-payments/src/config.py. Both must be changed together.
export const SETTLEMENT_TOPIC = "payments.settlement.v2";
export const LEDGER_ENDPOINT = "/internal/v3/ledger";

export interface SettlementEvent {
  batch_id: string;
  entries: Record<string, number>;
}
