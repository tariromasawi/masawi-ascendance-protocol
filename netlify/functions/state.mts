import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { defaultState, json, verifyToken } from "./_protocol.mts";

export default async (req: Request) => {
  const token = req.headers.get("x-bloodline-token") || "";
  const auth = await verifyToken(token);
  if (!auth) return json({ error: "LOCK_REJECTED", action: "DISSOLVE_INTERFERENCE" }, 401);

  const store = getStore({ name: "ascendance", consistency: "strong" });
  const saved = (await store.get("runtime", { type: "json" })) as Record<string, unknown> | null;
  const base = defaultState();
  const runtime = {
    ...base,
    aura: saved?.aura || base.aura,
    lastHeartbeat: saved?.lastHeartbeat || base.lastHeartbeat,
    eventLog: Array.isArray(saved?.eventLog) ? saved.eventLog.slice(-40) : [],
    viewer: auth.subject,
  };
  return json(runtime);
};

export const config: Config = { path: "/api/state" };
