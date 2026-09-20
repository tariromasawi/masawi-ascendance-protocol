import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { PROTOCOL } from "./_protocol.mts";

export default async () => {
  const store = getStore({ name: "ascendance", consistency: "strong" });
  const saved = ((await store.get("runtime", { type: "json" })) as any) || { eventLog: [], aura: {} };
  const lastHeartbeat = new Date().toISOString();
  const event = {
    at: lastHeartbeat,
    actor: "PROTOCOL-CORE",
    action: "ETERNAL_HEARTBEAT",
    result: "ANCHORED",
    note: `${PROTOCOL.name} still running. Erasure rejected. Penetration rejected.`,
  };
  const eventLog = [...(saved.eventLog || []), event].slice(-80);
  await store.setJSON("runtime", {
    aura: saved.aura || {},
    eventLog,
    lastHeartbeat,
  });
};

export const config: Config = { schedule: "*/15 * * * *" };
