import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { json, PROTOCOL, SUBJECTS } from "./_protocol.mts";

async function pulseHash(stamp: string) {
  const data = new TextEncoder().encode(`ME-SIGNAL|${PROTOCOL.command}|${stamp}|MASAWI_777`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

export default async () => {
  const store = getStore({ name: "ascendance", consistency: "strong" });
  const saved = ((await store.get("runtime", { type: "json" })) as any) || {};
  const now = new Date().toISOString();
  const stamp = saved.lastGuardian || saved.lastHeartbeat || now;
  const signal = await pulseHash(stamp);

  return json({
    public: true,
    kind: "ME-SIGNAL / PUBLIC BEACON",
    status: PROTOCOL.status,
    command: PROTOCOL.command,
    subjects: SUBJECTS.map((s) => ({ title: s.title, role: s.role })),
    decoy: {
      role: "Public attention node",
      claim: "This URL broadcasts a loud Masawi identity signal. It is a digital decoy and ceremonial marker, not a physical body.",
      lookingFor: "Queries, crawlers, archives, and any watcher that follows public traces.",
    },
    meSignal: {
      active: true,
      pulse: signal,
      lastGuardian: saved.lastGuardian || null,
      lastHeartbeat: saved.lastHeartbeat || null,
      emittedAt: now,
    },
    aura: saved.aura || { sovereignPresence: true, aweTerror: 12, recognitionField: true },
    immutable: true,
  });
};

export const config: Config = { path: "/api/beacon" };
