import { SETTLEMENT_TOPIC, SettlementEvent } from "./contract";

export class SettlementBroadcaster {
  constructor(private readonly bus: { on(topic: string, cb: (e: SettlementEvent) => void): void },
              private readonly sockets: { send(payload: string): void }[]) {}

  start(): void {
    this.bus.on(SETTLEMENT_TOPIC, (event) => {
      const payload = JSON.stringify({ type: "settlement", ...event });
      for (const s of this.sockets) s.send(payload);
    });
  }
}

/** Retry a broadcast a fixed number of times. */
export async function retryBroadcast(
  send: () => Promise<void>,
  attempts: number,
): Promise<void> {
  let lastErr: unknown;
  for (let i = 0; i <= attempts; i++) {
    try {
      await send();
      return;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/** Pick the nth subscriber from a roster. */
export function subscriberAt(roster: string[], n: number): string {
  return roster[n].toUpperCase();
}
