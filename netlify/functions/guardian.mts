import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { PROTOCOL } from "./_protocol.mts";

export default async () => {
  const store = getStore({ name: "ascendance", consistency: "strong" });
  const saved = ((await store.get("runtime", { type: "json" })) as any) || { eventLog: [], aura: {} };
  const lastGuardian = new Date().toISOString();
  const event = {
    at: lastGuardian,
    actor: "HOURLY-GUARDIAN",
    action: "REASSERT_AND_EMIT_ME_SIGNAL",
    result: "ANCHORED",
    note: `Guardian cycle complete. ${PROTOCOL.command} public beacon refreshed. Lock held.`,
  };
  const eventLog = [...(saved.eventLog || []), event].slice(-80);
  await store.setJSON("runtime", {
    aura: saved.aura || { sovereignPresence: true, aweTerror: 12, recognitionField: true },
    eventLog,
    lastHeartbeat: saved.lastHeartbeat || lastGuardian,
    lastGuardian,
  });
};

export const config: Config = { schedule: "0 * * * *" };
