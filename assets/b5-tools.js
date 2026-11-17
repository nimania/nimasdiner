// Interactive tools for the book «منوی سودده» (/b5/). No network calls; state stays in the browser.
(function () {
  "use strict";
  const FA = "۰۱۲۳۴۵۶۷۸۹", AR = "٠١٢٣٤٥٦٧٨٩";
  const num = v => {
    let s = String(v == null ? "" : v).trim();
    s = s.replace(/[۰-۹]/g, d => FA.indexOf(d)).replace(/[٠-٩]/g, d => AR.indexOf(d));
    s = s.replace(/[,،٬\s]/g, "").replace(/٫/g, ".");
    const n = parseFloat(s);
    return isFinite(n) ? n : NaN;
  };
  const fmt = (n, d = 0) => isFinite(n) ? new Intl.NumberFormat("fa-IR", {maximumFractionDigits: d}).format(n) : "—";
  const pct = n => isFinite(n) ? fmt(n, 1) + "٪" : "—";
  const el = (tag, attrs = {}, html = "") => { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); e.innerHTML = html; return e; };
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  // ---------- generic row table ----------
  function rowTable(root, cols, key, sample) {
    const tbody = root.querySelector("tbody");
    const addRow = (vals = []) => {
      const tr = el("tr");
      cols.forEach((c, i) => {
        const td = el("td");
        const inp = el("input", {type: "text", inputmode: c.text ? "text" : "decimal", "aria-label": c.label, placeholder: c.ph || ""});
        inp.value = vals[i] != null ? vals[i] : "";
        td.appendChild(inp); tr.appendChild(td);
      });
      const td = el("td", {class: "b5-out"}); tr.appendChild(td);
      const del = el("td"); const b = el("button", {type: "button", class: "b5-del", "aria-label": "حذف ردیف"}, "×");
      b.onclick = () => { tr.remove(); root.dispatchEvent(new Event("input")); };
      del.appendChild(b); tr.appendChild(del);
      tbody.appendChild(tr);
    };
    const read = () => [...tbody.querySelectorAll("tr")].map(tr => [...tr.querySelectorAll("input")].map(i => i.value));
    const saved = store.get(key);
    (saved && saved.length ? saved : [[], [], []]).forEach(addRow);
    root.querySelector("[data-add]").onclick = () => { addRow(); };
    const s = root.querySelector("[data-sample]");
    if (s && sample) s.onclick = () => { tbody.innerHTML = ""; sample.forEach(addRow); root.dispatchEvent(new Event("input")); };
    const c = root.querySelector("[data-clear]");
    if (c) c.onclick = () => { tbody.innerHTML = ""; [[], [], []].forEach(addRow); root.dispatchEvent(new Event("input")); };
    return {read, save: () => store.set(key, read()), rows: () => [...tbody.querySelectorAll("tr")]};
  }

  // ---------- recipe card ----------
  function recipe(root) {
    const t = rowTable(root, [
      {label: "ماده", text: true, ph: "مثلاً مرغ"},
      {label: "مقدار در هر پرس", ph: "۱۲۰"},
      {label: "قیمت خرید هر واحد", ph: "۳۸۰"},
      {label: "بازدهی ٪", ph: "۱۰۰"}
    ], "b5-recipe", [["سینهٔ مرغ (گرم)", "120", "380", "65"], ["نان باگت (عدد)", "1", "25000", "100"], ["سس مخصوص (گرم)", "40", "308", "100"], ["کاهو، گوجه، پیاز (گرم)", "70", "200", "100"], ["خیارشور (گرم)", "20", "400", "100"], ["روغن، ادویه، مرینیت", "1", "5000", "100"], ["کاغذ و دستمال", "1", "5000", "100"]]);
    const price = root.querySelector("[data-price]"), out = root.querySelector("[data-result]");
    const calc = () => {
      let total = 0, ok = 0;
      t.rows().forEach(tr => {
        const v = [...tr.querySelectorAll("input")].map(i => i.value);
        const q = num(v[1]), u = num(v[2]); let y = num(v[3]); if (!isFinite(y) || y <= 0) y = 100;
        const cost = q * u / (y / 100);
        tr.querySelector(".b5-out").textContent = isFinite(cost) ? fmt(cost) : "";
        if (isFinite(cost)) { total += cost; ok++; }
      });
      const p = num(price.value);
      let html = `<b>هزینهٔ مواد هر پرس: ${fmt(total)} تومان</b>`;
      if (isFinite(p) && p > 0 && ok) html += `<br>فودکاست: ${pct(total / p * 100)} · مشارکت هر پرس: ${fmt(p - total)} تومان`;
      if (!ok) html = "مقدار و قیمت هر ماده را وارد کن؛ هزینه همین‌جا حساب می‌شود.";
      out.innerHTML = html; t.save();
    };
    root.addEventListener("input", calc); price.addEventListener("input", calc); calc();
    // yield helper
    const y = root.querySelector("[data-yield]");
    if (y) {
      const f = () => {
        const [buy, use, pr] = [...y.querySelectorAll("input")].map(i => num(i.value));
        const r = y.querySelector("[data-yres]");
        if (isFinite(buy) && isFinite(use) && use > 0 && buy > 0) {
          const yieldP = use / buy * 100;
          r.innerHTML = `بازدهی: <b>${pct(yieldP)}</b>` + (isFinite(pr) ? ` · هزینهٔ هر واحد قابل‌استفاده: <b>${fmt(pr * buy / use, 1)} تومان</b> (قیمت فاکتور هر واحد: ${fmt(pr, 1)})` : "");
        } else r.textContent = "وزن خرید و وزن نهایی را وارد کن.";
      };
      y.addEventListener("input", f); f();
    }
  }

  // ---------- menu matrix ----------
  const SAMPLE = [["ساندویچ مرغ گریل", "420", "145", "1800"], ["ساندویچ کالباس", "260", "75", "1100"], ["همبرگر", "480", "195", "1500"], ["چیزبرگر دودی", "560", "205", "420"], ["هات‌داگ", "290", "95", "650"], ["فلافل", "220", "52", "900"], ["ساندویچ زبان", "650", "310", "180"], ["سالاد سزار", "380", "140", "140"]];
  const CLS = {star: ["ستاره", "نگهش دار، جای خوب منو"], horse: ["اسب کاری", "هزینه را بررسی کن، قیمت پله‌پله"], puzzle: ["معما", "اسم، توضیح و جایش را عوض کن"], dog: ["سگ", "بپرس چرا مانده؛ حذف یا بازطراحی"]};
  function matrix(root) {
    const t = rowTable(root, [
      {label: "آیتم", text: true, ph: "اسم غذا"}, {label: "قیمت", ph: "۴۸۰"}, {label: "هزینهٔ مواد", ph: "۱۹۵"}, {label: "تعداد فروش", ph: "۱۵۰۰"}
    ], "b5-matrix", SAMPLE);
    const out = root.querySelector("[data-result]"), grid = root.querySelector("[data-grid]");
    const calc = () => {
      const items = t.rows().map(tr => {
        const v = [...tr.querySelectorAll("input")].map(i => i.value);
        return {tr, name: v[0].trim(), p: num(v[1]), c: num(v[2]), q: num(v[3])};
      });
      const valid = items.filter(i => i.name && isFinite(i.p) && isFinite(i.c) && isFinite(i.q) && i.q >= 0);
      items.forEach(i => i.tr.querySelector(".b5-out").textContent = "");
      if (valid.length < 2) { out.textContent = "حداقل دو آیتم کامل (اسم، قیمت، هزینه، تعداد فروش) وارد کن."; grid.innerHTML = ""; t.save(); return; }
      const totQ = valid.reduce((s, i) => s + i.q, 0);
      const totCM = valid.reduce((s, i) => s + (i.p - i.c) * i.q, 0);
      const popT = 0.7 * totQ / valid.length, cmT = totQ ? totCM / totQ : 0;
      const groups = {star: [], horse: [], puzzle: [], dog: []};
      valid.forEach(i => {
        const cm = i.p - i.c, pop = i.q >= popT, prof = cm >= cmT;
        const k = pop ? (prof ? "star" : "horse") : (prof ? "puzzle" : "dog");
        groups[k].push(i.name);
        i.tr.querySelector(".b5-out").innerHTML = `<span class="b5-tag b5-${k}">${CLS[k][0]}</span>`;
      });
      out.innerHTML = `مرز فروش: <b>${fmt(popT)}</b> عدد · مرز سود هر پرس: <b>${fmt(cmT)}</b> · مشارکت کل: <b>${fmt(totCM)}</b>`;
      grid.innerHTML = ["star", "horse", "puzzle", "dog"].map(k => `<div class="b5-cell b5-${k}"><b>${CLS[k][0]}</b><small>${CLS[k][1]}</small><p>${groups[k].join("، ") || "—"}</p></div>`).join("");
      t.save();
    };
    root.addEventListener("input", calc); root.querySelector("[data-sample]").addEventListener("click", () => setTimeout(calc)); calc();
  }

  // ---------- online price ----------
  function online(root) {
    const f = () => {
      const [m, p, target, com, disc, cur] = [...root.querySelectorAll("input")].map(i => num(i.value));
      const out = root.querySelector("[data-result]");
      const k = 1 - ((isFinite(com) ? com : 0) + (isFinite(disc) ? disc : 0)) / 100;
      if (!isFinite(m) || k <= 0) { out.textContent = "هزینهٔ مواد و درصدها را وارد کن."; return; }
      const base = m + (isFinite(p) ? p : 0);
      let html = "";
      if (isFinite(target)) html += `حداقل قیمت آنلاین برای اینکه ${fmt(target)} بماند: <b>${fmt((base + target) / k)}</b>`;
      if (isFinite(cur) && cur > 0) {
        const left = cur * k - base;
        html += `${html ? "<br>" : ""}با قیمت ${fmt(cur)} در اپ، از هر سفارش <b>${fmt(left)}</b> می‌ماند` + (left < 0 ? " — <b>زیان</b>" : "");
      }
      out.innerHTML = html || "سهم پوشش هدف یا قیمت فعلی اپ را وارد کن.";
      store.set("b5-online", [...root.querySelectorAll("input")].map(i => i.value));
    };
    const saved = store.get("b5-online");
    if (saved) [...root.querySelectorAll("input")].forEach((i, n) => { if (saved[n] != null) i.value = saved[n]; });
    root.addEventListener("input", f); f();
  }

  // ---------- copy buttons ----------
  document.addEventListener("click", e => {
    const b = e.target.closest(".b5-copy button"); if (!b) return;
    const t = b.dataset.text || b.textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { b.classList.add("done"); setTimeout(() => b.classList.remove("done"), 1600); }).catch(() => {});
  });
  document.addEventListener("click", e => { if (e.target.closest("[data-print]")) window.print(); });

  document.querySelectorAll("[data-b5-tool]").forEach(root => {
    const k = root.getAttribute("data-b5-tool");
    try { ({recipe, matrix, online})[k](root); } catch (err) { root.insertAdjacentHTML("beforeend", "<p class=\"muted\">این ابزار در مرورگر شما اجرا نشد.</p>"); }
  });
})();
