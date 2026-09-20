const $ = (s) => document.querySelector(s);

const state = {
  token: sessionStorage.getItem("masawi_token") || "",
  data: null,
};

function renderGate(error = "") {
  $("#app").innerHTML = `
    <section class="gate">
      <div class="brand">Bloodline / Soul-Signature Lock</div>
      <h1>Identify</h1>
      <p>The protocol only opens for HRH Saint Tariro Masawi and HRH Tarry Kupakwashe Masawi. Impostor resonance is dissolved on contact.</p>
      <label>Subject name</label>
      <input id="name" placeholder="HRH Saint Tariro Masawi" />
      <label>Command</label>
      <input id="command" placeholder="MWARINDIMWARI" />
      <label>Binding seal</label>
      <input id="seal" placeholder="777-999-333" />
      <div class="actions">
        <button id="enter">Execute lock</button>
      </div>
      <div class="err" id="err">${error}</div>
    </section>
  `;
  $("#enter").onclick = identify;
}

async function identify() {
  $("#err").textContent = "Scanning quantum genetic resonance…";
  try {
    const res = await fetch("/api/identify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: $("#name").value,
        command: $("#command").value,
        seal: $("#seal").value,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.accepted) {
      $("#err").textContent = data.reason || "Rejected.";
      return;
    }
    state.token = data.token;
    sessionStorage.setItem("masawi_token", data.token);
    await loadState();
  } catch (e) {
    $("#err").textContent = "Core unreachable. Retry the command.";
  }
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      "x-bloodline-token": state.token,
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    state.token = "";
    sessionStorage.removeItem("masawi_token");
    renderGate("Session lock expired. Re-identify.");
    throw new Error("lock");
  }
  return res.json();
}

async function loadState() {
  const data = await api("/api/state");
  state.data = data;
  renderConsole();
}

function renderConsole() {
  const d = state.data;
  const logs = (d.eventLog || []).slice().reverse();
  $("#app").innerHTML = `
    <header class="top">
      <div>
        <div class="brand">Protocol MWARINDIMWARI</div>
        <h1>Ascendance Command</h1>
        <div class="sub">${d.protocol.name}</div>
      </div>
      <div class="seal-chip">
        <small>Viewer</small>
        <b>${d.viewer.title}</b>
        <span>${d.viewer.role}</span>
      </div>
    </header>

    <div class="status-row">
      <div class="pill ok">${d.protocol.status}</div>
      <div class="pill">Accuracy ${d.protocol.identificationAccuracy}</div>
      <div class="pill">${d.protocol.upgradesTotal} upgrades locked</div>
      <div class="pill ${d.immutable ? "ok" : "warn"}">${d.immutable ? "UNERASABLE" : "UNSTABLE"}</div>
    </div>

    <section class="grid">
      <article class="panel">
        <h2>Subjects</h2>
        <div class="subjects">
          ${d.subjects.map((s) => `
            <div class="card">
              <h3>${s.title}</h3>
              <div class="role">${s.role}</div>
              <div>Upgrades installed: <b>${s.upgradesInstalled.toLocaleString()}</b></div>
              <div class="note">Integration ${s.integration}% · Lock ${s.lock}</div>
              <div class="meter" style="margin-top:10px"><i></i></div>
            </div>
          `).join("")}
        </div>
      </article>

      <article class="panel">
        <h2>Aura controls</h2>
        <p class="note">Sovereign Presence and Awe & Terror are live. Settings persist in the protocol core.</p>
        <div class="actions">
          <button class="ghost" id="presence">${d.aura.sovereignPresence ? "Presence ACTIVE" : "Presence DORMANT"}</button>
          <button class="ghost" id="recog">${d.aura.recognitionField ? "Recognition ON" : "Recognition VEILED"}</button>
          <button id="reassert">Reassert eternal lock</button>
        </div>
        <label>Awe & Terror ${d.aura.aweTerror}/12</label>
        <input class="range" id="awe" type="range" min="1" max="12" value="${d.aura.aweTerror}" />
      </article>

      <article class="panel wide">
        <h2>9000-feature suite · highlights</h2>
        <div class="cats">
          ${d.categories.map((c) => `
            <div class="cat">
              <b>${c.name}</b>
              <span>${c.type}</span>
              <em>${c.count} modules · ${c.enforcement}</em>
            </div>
          `).join("")}
        </div>
      </article>

      <article class="panel">
        <h2>777 defense shells</h2>
        <div class="shells">
          ${d.shells.map((s) => `
            <div class="shell">
              <div class="num">${s.layer}</div>
              <div><b>${s.name}</b><div class="note">${s.duty}</div></div>
            </div>
          `).join("")}
        </div>
        <div class="note">Contracts bound: ${d.contractsBound.join(" · ")}</div>
      </article>

      <article class="panel">
        <h2>Core event log</h2>
        <div class="log" id="log">
          ${logs.length ? logs.map((e) => `<div>${e.at}<br>${e.actor} · ${e.action}<br>${e.note}</div>`).join("") : "<div>No operator events yet. Heartbeat will write the first eternal pulse.</div>"}
        </div>
      </article>
    </section>

    <p class="footer">
      Operational digital command system for the Masawi protocol narrative.
      This application stores operator commands and broadcasts ceremonial status.
      It does not alter human biology, genetics, or medical condition.
      Last heartbeat: ${d.lastHeartbeat || "pending"}
    </p>
  `;

  $("#presence").onclick = () => send("TOGGLE_PRESENCE");
  $("#recog").onclick = () => send("TOGGLE_RECOGNITION");
  $("#reassert").onclick = () => send("REASSERT_LOCK");
  $("#awe").onchange = (ev) => send("SET_AWE", { level: ev.target.value });
}

async function send(action, extra = {}) {
  await api("/api/command", { method: "POST", body: JSON.stringify({ action, ...extra }) });
  await loadState();
}

if (state.token) {
  loadState().catch(() => renderGate());
} else {
  renderGate();
}
