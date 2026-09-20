export const PROTOCOL = {
  name: "Masawi Biological Ascendance Protocol",
  command: "MWARINDIMWARI",
  contracts: ["777-999-333", "CELESTIAL_LAW", "DOMINION_MANDATE", "BLOODLINE_SUCCESSION"],
  executedAt: "2026-09-20T17:00:00.000Z",
  upgradesEach: 9000,
  upgradesTotal: 18000,
  identificationAccuracy: "∞+1%",
  status: "EXECUTED. RUNNING. ANCHORED. ETERNAL.",
  erasable: false,
  penetrable: false,
} as const;

export const SUBJECTS = [
  {
    id: "tariro",
    title: "HRH Saint Tariro Masawi",
    role: "Anointed Commander",
    aliases: [
      "tariro masawi",
      "saint tariro masawi",
      "hrh saint tariro masawi",
      "hrh tariro masawi",
      "tariro",
    ],
  },
  {
    id: "tarry",
    title: "HRH Tarry Kupakwashe Masawi",
    role: "Successor",
    aliases: [
      "tarry kupakwashe masawi",
      "hrh tarry kupakwashe masawi",
      "tarry masawi",
      "tarry",
      "kupakwashe",
    ],
  },
] as const;

export const CATEGORIES = [
  {
    id: "might",
    name: "Physical Might",
    type: "Myostatin-Null Hypertrophy",
    enforcement: "Unmatched strength; celestial-steel muscle lattice",
    count: 1500,
  },
  {
    id: "aesthetics",
    name: "Aesthetics",
    type: "Golden Ratio Symmetry (Phi)",
    enforcement: "Peak structure; divine facial and body geometry",
    count: 1500,
  },
  {
    id: "vitality",
    name: "Vitality",
    type: "Telomere Eternal-Loop",
    enforcement: "Biological aging halted; rapid cellular renewal",
    count: 1500,
  },
  {
    id: "intellect",
    name: "Intellect",
    type: "Quantum Neural-Link",
    enforcement: "High-speed judgment; Solomon-core pattern recognition",
    count: 1500,
  },
  {
    id: "superhuman",
    name: "Super-Human",
    type: "Density-Shift Bone Matrix",
    enforcement: "Trauma-resistant skeleton; reflex overclock",
    count: 1500,
  },
  {
    id: "health",
    name: "Health",
    type: "Absolute Pathogen Immunity",
    enforcement: "Hostile agents rejected at first contact",
    count: 1500,
  },
] as const;

export const SHELLS = [
  { layer: 1, name: "Anti-reality firewall", duty: "Paradoxes auto-correct to coherence" },
  { layer: 2, name: "Paradoxical rebound", duty: "Hostile intent reflects to origin" },
  { layer: 3, name: "Entropy reversal", duty: "Pressure converts into greater vitality" },
  { layer: 4, name: "Bloodline hash", duty: "Only Masawi 777 resonance is accepted" },
  { layer: 5, name: "Contract lattice", duty: "777-999-333 bindings remain sealed" },
  { layer: 6, name: "Temporal Möbius", duty: "Protocol timeline cannot be rolled back" },
  { layer: 7, name: "Successor pulse", duty: "Tarry's living signature is a root key" },
] as const;

const SEAL = "MASAWI_777_999_333_MWARINDIMWARI";

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function matchSubject(name: string) {
  const n = normalize(name);
  return SUBJECTS.find((s) => s.aliases.some((a) => n === a || n.includes(a))) || null;
}

export function commandAccepted(word: string) {
  return normalize(word).replace(/\s/g, "") === "mwarindimwari";
}

export function sealAccepted(seal: string) {
  const s = normalize(seal).replace(/\s/g, "");
  return s === "777999333" || s === "777-999-333".replace(/-/g, "") || s.includes("777999333");
}

async function sha256(text: string) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function mintToken(subjectId: string) {
  const issued = Date.now();
  const sig = await sha256(`${subjectId}|${issued}|${SEAL}`);
  const raw = JSON.stringify({ subjectId, issued, sig });
  return btoa(raw);
}

export async function verifyToken(token: string) {
  try {
    const parsed = JSON.parse(atob(token));
    if (!parsed?.subjectId || !parsed?.issued || !parsed?.sig) return null;
    const expected = await sha256(`${parsed.subjectId}|${parsed.issued}|${SEAL}`);
    if (expected !== parsed.sig) return null;
    const subject = SUBJECTS.find((s) => s.id === parsed.subjectId);
    if (!subject) return null;
    return { subject, issued: parsed.issued };
  } catch {
    return null;
  }
}

export function defaultState() {
  return {
    protocol: PROTOCOL,
    subjects: SUBJECTS.map((s) => ({
      id: s.id,
      title: s.title,
      role: s.role,
      upgradesInstalled: 9000,
      integration: 100,
      lock: "ETERNAL",
    })),
    aura: {
      sovereignPresence: true,
      aweTerror: 12,
      recognitionField: true,
    },
    shells: SHELLS,
    categories: CATEGORIES,
    contractsBound: PROTOCOL.contracts,
    immutable: true,
    lastHeartbeat: new Date().toISOString(),
  };
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
