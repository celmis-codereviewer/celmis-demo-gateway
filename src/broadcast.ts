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
