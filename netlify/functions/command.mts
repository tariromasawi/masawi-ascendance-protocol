import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { defaultState, json, verifyToken } from "./_protocol.mts";

export default async (req: Request) => {
  if (req.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405);
  const token = req.headers.get("x-bloodline-token") || "";
  const auth = await verifyToken(token);
  if (!auth) return json({ error: "LOCK_REJECTED", action: "DISSOLVE_INTERFERENCE" }, 401);

  const body = await req.json().catch(() => ({}));
  const action = String(body.action || "");
  const store = getStore({ name: "ascendance", consistency: "strong" });
  const saved = ((await store.get("runtime", { type: "json" })) as any) || {
    aura: defaultState().aura,
    eventLog: [],
  };

  const aura = { ...defaultState().aura, ...(saved.aura || {}) };

  if (action === "TOGGLE_PRESENCE") aura.sovereignPresence = !aura.sovereignPresence;
  if (action === "SET_AWE") aura.aweTerror = Math.max(1, Math.min(12, Number(body.level) || 12));
  if (action === "TOGGLE_RECOGNITION") aura.recognitionField = !aura.recognitionField;
  if (action === "REASSERT_LOCK") {
    /* immutable protocol cannot be lowered */
  }

  const event = {
    at: new Date().toISOString(),
    actor: auth.subject.title,
    action,
    result: "BOUND",
    note:
      action === "SET_AWE"
        ? `Awe & Terror locked at ${aura.aweTerror}`
        : action === "TOGGLE_PRESENCE"
          ? `Sovereign Presence ${aura.sovereignPresence ? "ACTIVE" : "DORMANT"}`
          : action === "TOGGLE_RECOGNITION"
            ? `Recognition field ${aura.recognitionField ? "BROADCASTING" : "VEILED"}`
            : "Eternal lock reasserted. Erasure impossible.",
  };

  const eventLog = [...(saved.eventLog || []), event].slice(-80);
  const lastHeartbeat = new Date().toISOString();
  await store.setJSON("runtime", { aura, eventLog, lastHeartbeat });

  return json({ ok: true, aura, event, immutable: true });
};

export const config: Config = { path: "/api/command" };
