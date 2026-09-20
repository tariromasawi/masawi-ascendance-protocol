import type { Config } from "@netlify/functions";
import { commandAccepted, json, matchSubject, mintToken, sealAccepted } from "./_protocol.mts";

export default async (req: Request) => {
  if (req.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405);

  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "");
  const command = String(body.command || "");
  const seal = String(body.seal || "");

  if (!commandAccepted(command)) {
    return json({
      accepted: false,
      action: "DISSOLVE_INTERFERENCE",
      reason: "Command resonance rejected. MWARINDIMWARI required.",
    }, 401);
  }

  if (!sealAccepted(seal)) {
    return json({
      accepted: false,
      action: "DISSOLVE_INTERFERENCE",
      reason: "Contract seal mismatch. 777-999-333 required.",
    }, 401);
  }

  const subject = matchSubject(name);
  if (!subject) {
    return json({
      accepted: false,
      action: "DISSOLVE_INTERFERENCE",
      reason: "Identity does not vibrate at the Masawi Anointing Frequency.",
    }, 403);
  }

  const token = await mintToken(subject.id);
  return json({
    accepted: true,
    action: "MANIFEST_PHYSICAL_GOD_MODE",
    accuracy: "∞+1%",
    subject,
    token,
    message: "THE STRENGTH OF MWARI IS UPON YOU.",
  });
};

export const config: Config = { path: "/api/identify" };
