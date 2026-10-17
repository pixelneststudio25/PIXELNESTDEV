/* PixelNestDev | Questionnaire wizard */
(() => {
  /* ---------- Config: fill these in ---------- */
  const CFG = {
    key: "YOUR_WEB3FORMS_ACCESS_KEY", // free key from web3forms.com, sent to your inbox
    wa: "234XXXXXXXXXX",              // WhatsApp number, digits only, with country code
    cal: ""                           // optional Cal.com link, e.g. https://cal.com/yourname/intro
  };

  const NS = "Not sure yet, advise me";
  const TY = { w: "New website", r: "Redesign of an existing site", s: "Online store", a: "AI-powered product or feature", p: "Platform or portal", u: "Not sure yet" };
  const PRE = { website: TY.w, redesign: TY.r, store: TY.s, ai: TY.a, platform: TY.p };
  const B_N = ["₦50,000 – ₦150,000", "₦150,000 – ₦400,000", "₦400,000 – ₦1,000,000", "₦1,000,000 – ₦3,000,000", "₦3,000,000+", NS];
  const B_D = ["$50 – $150", "$150 – $500", "$500 – $1,500", "$1,500 – $5,000", "$5,000+", NS];
  const is = (t) => (a) => a.type === TY[t];

  /* t: s=single, c=checks, x=text. w: when to show. lab: label in the brief. */
  const S = [
    { id: "country", t: "s", q: "Where are you based?", lab: "Based in", sub: "This sets the currency for budgets.", o: ["Nigeria", "Africa (outside Nigeria)", "Europe", "North America", "Elsewhere"] },
    { id: "type", t: "s", q: "What do you need?", lab: "Project", w: (a) => !a.pre, o: [[TY.w, TY.w, "bx-globe"], [TY.r, TY.r, "bx-refresh"], [TY.s, TY.s, "bx-store"], [TY.a, TY.a, "bx-bot"], [TY.p, TY.p, "bx-layer"], [TY.u, TY.u, "bx-help-circle"]] },
    { id: "goal", t: "c", max: 2, req: 1, q: "What's the main goal?", lab: "Goal", sub: "Pick up to 2.", o: ["Get more customers or leads", "Sell online", "Automate a process and save time", "Modernize our look", "Launch a new business", "Something else"] },

    { id: "wkind", t: "s", w: is("w"), q: "What kind of website?", lab: "Website type", o: ["Business or brand site", "Portfolio", "Landing page", "Blog or magazine", "Something else"] },
    { id: "wpages", t: "s", w: is("w"), q: "Roughly how many pages?", lab: "Pages", sub: "A guess is fine.", o: ["1 to 3", "4 to 8", "9 or more", NS] },

    { id: "rplat", t: "s", w: is("r"), q: "What is your site built on now?", lab: "Current platform", o: ["WordPress", "Wix or Squarespace", "Shopify", "Custom code", NS] },
    { id: "rissue", t: "c", w: is("r"), q: "What's wrong with it?", lab: "Problems", sub: "Pick all that apply.", o: ["Looks outdated", "Slow", "Not mobile friendly", "Hard to update", "Not converting visitors"] },
    { id: "rurl", t: "x", w: is("r"), q: "What's your current website address?", lab: "Current site", ph: "https://", opt: 1 },

    { id: "sprod", t: "s", w: is("s"), q: "How many products will you sell?", lab: "Products", o: ["Under 20", "20 to 100", "100 or more", NS] },
    { id: "ssell", t: "s", w: is("s"), q: "What do you sell?", lab: "Selling", o: ["Physical products", "Digital products", "Both"] },
    { id: "spay", t: "c", w: is("s"), q: "How should customers pay?", lab: "Payments", sub: "Pick all that apply.", o: ["Paystack or Flutterwave", "Stripe", "PayPal", "Bank transfer", NS] },

    { id: "ado", t: "c", w: is("a"), req: 1, q: "What should the AI do?", lab: "AI should", sub: "Pick all that apply.", o: ["Chat with customers", "Generate content", "Automate workflows", "Analyze data", "Something else"] },
    { id: "awhere", t: "s", w: is("a"), q: "Where will it live?", lab: "AI lives in", o: ["Our existing website", "A new app", "An internal tool", NS] },
    { id: "ause", t: "s", w: is("a"), q: "How much will it be used?", lab: "Expected usage", o: ["Light, a few users", "Moderate", "Heavy, many users daily", NS] },

    { id: "pkind", t: "s", w: is("p"), q: "What kind of platform?", lab: "Platform type", o: ["Booking system", "Magazine or content platform", "Client portal", "Admin dashboard", "Something else"] },
    { id: "pusers", t: "s", w: is("p"), q: "Who will log in?", lab: "Users", o: ["Only our team", "Our team and customers", "Several user roles", NS] },

    { id: "feat", t: "c", q: "Which features do you want?", lab: "Features", sub: "Pick all that apply, or skip if unsure. We'll help you decide.", o: ["Contact forms", "Admin panel", "User accounts", "Payments", "Booking", "Blog", "Multiple languages", "Third-party integrations"] },
    { id: "have", t: "c", q: "What do you already have?", lab: "Already have", sub: "Pick all that apply.", o: ["Logo and branding", "Website copy", "Images", "A domain", "Hosting", "Designs or mockups", "Nothing yet"] },
    { id: "inspo", t: "x", q: "Is there a site you like?", lab: "Inspiration", sub: "Paste a link. It helps us see your taste. Skip if you like.", ph: "https://", opt: 1 },
    { id: "time", t: "s", q: "When do you want to launch?", lab: "Timeline", o: ["Within 2 weeks", "2 to 4 weeks", "1 to 2 months", "Flexible"] },
    { id: "dead", t: "s", q: "Is there a fixed deadline?", lab: "Fixed deadline", sub: "For example an event or campaign.", o: ["Yes", "No"] },
    { id: "budget", t: "s", q: "What's your budget range?", lab: "Budget", sub: "A rough range helps us recommend the right approach.", o: (a) => (a.country === "Nigeria" ? B_N : B_D) },
    { id: "role", t: "s", q: "Who makes the decision?", lab: "Decision", o: ["I decide", "I decide with others", "I'm gathering info for someone"] },
    { id: "start", t: "s", q: "When can you start?", lab: "Start", o: ["Right away", "Within a month", "Just exploring"] },
    { id: "supp", t: "s", q: "Do you want support after launch?", lab: "Support", o: ["Monthly maintenance", "Occasional updates", "No", NS] },
    { id: "contact", t: "contact", q: "How can we reach you?", lab: "Contact", sub: "We reply within 2 hours." },
    { id: "about", t: "about", q: "A little about you", lab: "About", sub: "Optional, but it helps us prepare." },
    { id: "final", t: "final", q: "Anything else we should know?", lab: "Notes" }
  ];

  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ov = (o) => (Array.isArray(o) ? o[1] : o);
  const track = (n, p) => { try { window.plausible && window.plausible(n, { props: p }); } catch (e) {} };

  let A = {}, i = 0, sending = false;
  try { const s = JSON.parse(localStorage.getItem("pnd_q") || "null"); if (s) { A = s.A || {}; i = s.i || 0; } } catch (e) {}
  const save = () => { try { localStorage.setItem("pnd_q", JSON.stringify({ A, i })); } catch (e) {} };
  const vis = () => S.filter((s) => !s.w || s.w(A));
  const opts = (s) => (typeof s.o === "function" ? s.o(A) : s.o);

  const pre = new URLSearchParams(location.search).get("type");
  if (pre && PRE[pre.toLowerCase()]) { A.type = PRE[pre.toLowerCase()]; A.pre = 1; }

  const stage = $("#stage");

  function brief() {
    const rows = S.filter((s) => A[s.id] != null && A[s.id] !== "" && (s.id === "type" || !s.w || s.w(A)) && !["contact", "about", "final"].includes(s.t));
    $("#briefList").innerHTML = rows.map((s) => `<li><b>${esc(s.lab)}</b>${esc([].concat(A[s.id]).join(", "))}</li>`).join("");
    $("#briefEmpty").style.display = rows.length ? "none" : "block";
  }

  function render(anim = true) {
    const V = vis();
    i = Math.max(0, Math.min(i, V.length - 1));
    const s = V[i];
    $("#bar").style.width = (i / V.length) * 100 + "%";
    const mins = Math.round((V.length - i) * 0.2);
    $("#left").textContent = mins < 1 ? "Almost done" : `About ${mins} min left`;
    const head = `<h2>${esc(s.q)}</h2>${s.sub ? `<p class="hint">${esc(s.sub)}</p>` : ""}`;
    const back = i > 0 ? `<button type="button" class="q-back" data-back><i class='bx bx-arrow-back'></i> Back</button>` : "<span></span>";
    const cont = (label = "Continue") => `<div class="q-err" id="err"></div><div class="q-nav">${back}<button type="button" class="btn-primary" data-next>${label}</button></div>`;
    let b = "", foot = "";

    if (s.t === "s" || s.t === "c") {
      const cur = [].concat(A[s.id] || []);
      b = `<div class="opts">${opts(s).map((o) => { const l = ov(o), ic = Array.isArray(o) ? o[2] : ""; return `<button type="button" class="opt${cur.includes(l) ? " on" : ""}" data-v="${esc(l)}">${ic ? `<i class='bx ${ic}'></i>` : ""}<span>${esc(l)}</span></button>`; }).join("")}</div>`;
      foot = s.t === "s" ? `<div class="q-nav">${back}<span></span></div>` : cont(s.req ? "Continue" : cur.length ? "Continue" : "Skip");
    } else if (s.t === "x") {
      b = `<div class="q-field"><input id="f_x" type="url" inputmode="url" placeholder="${esc(s.ph || "")}" value="${esc(A[s.id] || "")}"></div>`;
      foot = cont(A[s.id] ? "Continue" : "Skip");
    } else if (s.t === "contact") {
      b = `<div class="q-grid"><div class="q-field"><label for="f_name">Your name</label><input id="f_name" autocomplete="name" value="${esc(A.name || "")}"></div>
      <div class="q-field"><label for="f_email">Email</label><input id="f_email" type="email" autocomplete="email" value="${esc(A.email || "")}"></div>
      <div class="q-field"><label for="f_phone">WhatsApp or phone number</label><input id="f_phone" type="tel" autocomplete="tel" value="${esc(A.phone || "")}"></div></div>`;
      foot = cont();
    } else if (s.t === "about") {
      const chips = ["WhatsApp", "Email", "Phone call"].map((m) => `<button type="button" class="opt${A.method === m ? " on" : ""}" data-m="${m}"><span>${m}</span></button>`).join("");
      b = `<div class="q-grid"><div class="q-field"><label for="f_co">Company (optional)</label><input id="f_co" autocomplete="organization" value="${esc(A.company || "")}"></div>
      <div class="q-field"><label for="f_heard">How did you find us?</label><select id="f_heard">${["", "Instagram", "LinkedIn", "GitHub", "Referral", "Google", "Other"].map((x) => `<option value="${x}"${A.heard === x ? " selected" : ""}>${x || "Choose one"}</option>`).join("")}</select></div></div>
      <div class="q-field"><label>Best way to reach you</label><div class="opts">${chips}</div></div>`;
      foot = cont();
    } else {
      b = `<div class="q-field"><textarea id="f_note" placeholder="Optional">${esc(A.note || "")}</textarea></div>
      <label class="q-check"><input type="checkbox" id="f_call"${A.call ? " checked" : ""}> I'd like a quick call to go over this</label>
      <div id="timeBox" ${A.call ? "" : "hidden"}><div class="opts">${["Morning", "Afternoon", "Evening"].map((m) => `<button type="button" class="opt${A.ctime === m ? " on" : ""}" data-t="${m}"><span>${m}</span></button>`).join("")}</div></div>
      <input type="checkbox" name="botcheck" id="f_hp" class="q-hp" tabindex="-1" autocomplete="off">
      <p class="q-fine">We only use this to respond to your project. We never share it.</p>`;
      foot = cont("Send my project");
    }
    const h = head + `<div class="q-body">${b}</div>` + foot;
    stage.innerHTML = h;
    if (anim) { stage.classList.remove("in"); void stage.offsetWidth; stage.classList.add("in"); }
    brief(); save(); track("step", { id: s.id });
  }

  const go = (d) => { i += d; render(); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const err = (m) => { const e = $("#err"); if (e) e.textContent = m; };

  function collect(s) {
    if (s.t === "x") { A[s.id] = ($("#f_x").value || "").trim(); }
    if (s.t === "contact") { A.name = $("#f_name").value.trim(); A.email = $("#f_email").value.trim(); A.phone = $("#f_phone").value.trim(); }
    if (s.t === "about") { A.company = $("#f_co").value.trim(); A.heard = $("#f_heard").value; }
    if (s.t === "final") { A.note = $("#f_note").value.trim(); A.call = $("#f_call").checked; }
  }

  stage.addEventListener("click", (e) => {
    const V = vis(), s = V[i];
    if (e.target.closest("[data-back]")) { collect(s); return go(-1); }
    const o = e.target.closest(".opt");
    if (o && o.dataset.m) { A.method = o.dataset.m; stage.querySelectorAll("[data-m]").forEach((b) => b.classList.toggle("on", b === o)); return save(); }
    if (o && o.dataset.t) { A.ctime = o.dataset.t; stage.querySelectorAll("[data-t]").forEach((b) => b.classList.toggle("on", b === o)); return save(); }
    if (o && s.t === "s") {
      A[s.id] = o.dataset.v;
      if (s.id === "country") delete A.budget;
      stage.querySelectorAll(".opt").forEach((b) => b.classList.toggle("on", b === o));
      brief(); save();
      return setTimeout(() => go(1), 240);
    }
    if (o && s.t === "c") {
      let cur = [].concat(A[s.id] || []); const v = o.dataset.v;
      if (cur.includes(v)) cur = cur.filter((x) => x !== v);
      else { if (s.max && cur.length >= s.max) cur.shift(); cur.push(v); }
      A[s.id] = cur;
      stage.querySelectorAll(".opt").forEach((b) => b.classList.toggle("on", cur.includes(b.dataset.v)));
      brief(); save();
      const n = $("[data-next]"); if (n) n.textContent = cur.length || s.req ? "Continue" : "Skip";
      return;
    }
    if (e.target.closest("[data-next]")) {
      collect(s);
      if (s.t === "c" && s.req && !(A[s.id] || []).length) return err("Pick at least one to continue.");
      if (s.t === "contact") {
        if (A.name.length < 2) return err("Please enter your name.");
        if (!/^\S+@\S+\.\S+$/.test(A.email)) return err("Please enter a valid email address.");
        if (A.phone.replace(/\D/g, "").length < 7) return err("Please enter a valid WhatsApp or phone number.");
      }
      if (s.t === "final") return submit();
      go(1);
    }
  });
  stage.addEventListener("change", (e) => { if (e.target.id === "f_call") { $("#timeBox").hidden = !e.target.checked; A.call = e.target.checked; save(); } });
  $("#briefToggle").addEventListener("click", () => { const b = $("#brief"); const on = b.classList.toggle("open"); $("#briefToggle").setAttribute("aria-expanded", on); });

  function summary() {
    const V = vis().filter((s) => !["contact", "about", "final"].includes(s.t));
    const lines = V.filter((s) => A[s.id] != null && A[s.id] !== "").map((s) => `${s.lab}: ${[].concat(A[s.id]).join(", ")}`);
    const fit = [
      `Budget ${A.budget && A.budget !== NS ? "✅" : "⚠️"}`,
      `Timeline ${A.time && A.time !== "Flexible" ? "✅" : "⚠️"}`,
      `Clarity ${A.type && A.type !== TY.u && A.goal && A.goal.length ? "✅" : "⚠️"}`,
      `Ready ${A.start && A.start !== "Just exploring" ? "✅" : "⚠️"}`
    ].join("  ");
    const head = `Lead: ${A.type} | ${A.budget} | ${A.time} | ${A.role} | ${A.start}`;
    return { head, text: [head, `Fit signals: ${fit}`, "", ...lines, "", `Name: ${A.name}`, `Email: ${A.email}`, `Phone: ${A.phone}`, `Company: ${A.company || "-"}`, `Best contact: ${A.method || "-"}`, `Found us via: ${A.heard || "-"}`, `Call requested: ${A.call ? "Yes, " + (A.ctime || "any time") : "No"}`, `Notes: ${A.note || "-"}`].join("\n") };
  }

  async function submit() {
    if (sending) return;
    if ($("#f_hp").checked) return done(); // bot: pretend success
    sending = true;
    const btn = $("[data-next]"); btn.disabled = true; btn.textContent = "Sending...";
    const { head, text } = summary();
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: CFG.key, subject: head, from_name: "PixelNestDev Questionnaire", name: A.name, email: A.email, message: text, botcheck: "" })
      });
      const j = await r.json();
      if (!j.success) throw new Error(j.message || "failed");
      track("submit", { type: A.type, country: A.country });
      done();
    } catch (e) {
      sending = false; btn.disabled = false; btn.textContent = "Send my project";
      err("That didn't send. Check your connection and try again, or message us on WhatsApp.");
    }
  }

  function done() {
    try { localStorage.removeItem("pnd_q"); } catch (e) {}
    $("#progress").style.display = "none";
    const first = esc((A.name || "").split(" ")[0]);
    stage.innerHTML = `<div class="q-done"><div class="q-tick"><i class='bx bx-check'></i></div>
      <h2>Thanks${first ? ", " + first : ""}. Your project is in.</h2>
      <p class="hint">We reply within 2 hours${A.method ? " on " + esc(A.method) : ""}. Here's what happens next.</p>
      <ul class="q-steps"><li><i class='bx bx-search-alt'></i><span>We review your brief.</span></li><li><i class='bx bx-message-dots'></i><span>We reach out within 2 hours to confirm details${A.call ? " and set up your call" : ""}.</span></li><li><i class='bx bx-file'></i><span>You get a clear scope and quote.</span></li></ul>
      <div class="q-actions">${CFG.wa.includes("X") ? "" : `<a class="btn-primary" target="_blank" rel="noopener" href="https://wa.me/${CFG.wa}?text=${encodeURIComponent("Hi, I just sent a project on your website.")}">Message us on WhatsApp</a>`}${CFG.cal ? `<a class="btn-secondary" target="_blank" rel="noopener" href="${esc(CFG.cal)}">Book a call time</a>` : ""}<a class="btn-secondary" href="index.html">Back to site</a></div></div>`;
    $("#bar").style.width = "100%";
    stage.classList.remove("in"); void stage.offsetWidth; stage.classList.add("in");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  render(false);
})();
