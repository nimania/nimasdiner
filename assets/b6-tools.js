// Interactive tools for the book «شف» (/b6/). No network calls; state stays in the visitor's browser.
// The small binding engine is shared in shape with assets/b7-tools.js.
(function () {
  "use strict";
  const FA = "۰۱۲۳۴۵۶۷۸۹", AR = "٠١٢٣٤٥٦٧٨٩";
  const num = v => {
    let s = String(v == null ? "" : v).trim();
    s = s.replace(/[۰-۹]/g, d => FA.indexOf(d)).replace(/[٠-٩]/g, d => AR.indexOf(d));
    s = s.replace(/[,،٬\s]/g, "").replace(/٫/g, ".").replace(/[−–]/g, "-");
    const n = parseFloat(s);
    return isFinite(n) ? n : NaN;
  };
  const z = v => { const n = num(v); return isFinite(n) ? n : 0; };
  const fmt = (n, d = 0) => isFinite(n) ? new Intl.NumberFormat("fa-IR", {maximumFractionDigits: d}).format(n) : "—";
  const pct = n => isFinite(n) ? fmt(n, 1) + "٪" : "—";
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  // ---------- helpers bound to one tool root ----------
  function bind(root, calc, sample) {
    const key = "b6-" + root.dataset.b7Tool;
    const tbody = root.querySelector("tbody[data-rows]");
    const template = tbody ? tbody.querySelector("tr").cloneNode(true) : null;
    const fields = () => [...root.querySelectorAll("[data-k]")];
    const rows = () => tbody ? [...tbody.querySelectorAll("tr")] : [];
    const rowVals = tr => { const o = {}; tr.querySelectorAll("[data-c]").forEach(i => { o[i.dataset.c] = i.value; }); return o; };
    const out = (name, html, cls) => root.querySelectorAll(`[data-o="${name}"]`).forEach(e => { e.innerHTML = html; if (cls !== undefined) e.className = cls; });
    const addRow = vals => {
      const tr = template.cloneNode(true);
      tr.querySelectorAll("[data-c]").forEach(i => { i.value = vals && vals[i.dataset.c] != null ? vals[i.dataset.c] : ""; });
      tr.querySelectorAll("[data-ro]").forEach(e => { e.textContent = ""; });
      const lab = tr.querySelector("[data-label]");
      if (lab && vals && vals._label) lab.textContent = vals._label;
      tbody.appendChild(tr);
    };
    const snapshot = () => ({f: Object.fromEntries(fields().map(i => [i.dataset.k, i.value])), r: rows().map(rowVals)});
    const restore = s => {
      if (!s) return;
      fields().forEach(i => { if (s.f && s.f[i.dataset.k] != null) i.value = s.f[i.dataset.k]; });
      if (tbody && s.r && s.r.length) {
        const labels = rows().map(tr => (tr.querySelector("[data-label]") || {}).textContent);
        tbody.innerHTML = "";
        s.r.forEach((v, i) => addRow(Object.assign({_label: labels[i]}, v)));
      }
    };
    const api = {
      f: k => { const i = root.querySelector(`[data-k="${k}"]`); return i ? i.value : ""; },
      rows, rowVals, out,
      setRo: (tr, name, html, cls) => { const e = tr.querySelector(`[data-ro="${name}"]`); if (e) { e.innerHTML = html; if (cls !== undefined) e.className = cls; } }
    };
    const run = () => { calc(api); store.set(key, snapshot()); };
    restore(store.get(key));
    root.addEventListener("input", run);
    const add = root.querySelector("[data-add]");
    if (add && tbody) add.onclick = () => { addRow(); run(); };
    root.addEventListener("click", e => {
      const del = e.target.closest("[data-del]");
      if (del && tbody && rows().length > 1) { del.closest("tr").remove(); run(); }
    });
    const s = root.querySelector("[data-sample]");
    if (s && sample) s.onclick = () => { restore(sample); run(); };
    const c = root.querySelector("[data-clear]");
    if (c) c.onclick = () => {
      fields().forEach(i => { i.value = ""; });
      rows().forEach(tr => tr.querySelectorAll("[data-c]").forEach(i => { i.value = ""; }));
      run();
    };
    const csv = root.querySelector("[data-csv]");
    if (csv) csv.onclick = () => {
      const head = [...root.querySelectorAll("thead th")].map(th => th.textContent.trim()).filter(Boolean);
      const lines = [head.join(",")].concat(rows().map(tr => [...tr.querySelectorAll("td")].map(td => {
        const i = td.querySelector("input"); return '"' + String(i ? i.value : td.textContent.trim()).replace(/"/g, '""') + '"';
      }).filter((_, k) => k < head.length).join(",")));
      const blob = new Blob(["﻿" + lines.join("\n")], {type: "text/csv;charset=utf-8"});
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = key + ".csv"; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    };
    run();
  }

  const status = (ok, warn) => ok ? ["در محدوده", "b7-ok"] : warn ? ["زیر نظر بگیر", "b7-warn"] : ["بیرون از محدوده", "b7-bad"];

  const TOOLS = {
    // فصل ۲: فیلتر ایده
    filter: [api => {
      let pass = 0, n = 0;
      api.rows().forEach(tr => {
        const v = api.rowVals(tr), sc = ["cust", "stat", "skill", "mat", "cost"].map(k => num(v[k]));
        if (!v.name && sc.every(x => !isFinite(x))) { api.setRo(tr, "sum", ""); api.setRo(tr, "st", "", ""); return; }
        const ok = sc.every(x => isFinite(x)), sum = sc.reduce((a, b) => a + (isFinite(b) ? b : 0), 0);
        api.setRo(tr, "sum", fmt(sum));
        if (!ok) { api.setRo(tr, "st", "نمره کامل نیست", "b7-warn"); return; }
        n++;
        const go = sum >= 10 && sc.every(x => x > 1); if (go) pass++;
        api.setRo(tr, "st", go ? "برو سراغ اجاق" : "فعلاً کنار برود", go ? "b7-ok" : "b7-bad");
      });
      api.out("res", n ? `ایده‌هایی که از فیلتر گذشتند: <b>${fmt(pass)}</b> از ${fmt(n)}. اگر چند ایده نمرهٔ برابر گرفتند، جای خالی منو تصمیم آخر را می‌گیرد.` : "به هر سؤال از ۱ تا ۳ نمره بده. جمع کمتر از ۱۰، یا نمرهٔ ۱ در یک سؤال، یعنی فعلاً کنار برود.");
    }, {r: [{name: "سوپ کدو حلوایی با کشک و نعناع داغ", cust: "2", stat: "3", skill: "3", mat: "3", cost: "3"}, {name: "سالاد انار، گردو و پنیر محلی", cust: "3", stat: "3", skill: "3", mat: "1", cost: "2"}, {name: "بادمجان کبابی با ماست دودی، گردو و انار", cust: "3", stat: "2", skill: "3", mat: "3", cost: "3"}]}],

    // فصل ۴: برگهٔ نمرهٔ تست طعم
    taste: [api => {
      let weak = [], all = [];
      api.rows().forEach(tr => {
        const v = api.rowVals(tr), xs = ["j1", "j2", "j3", "j4", "j5"].map(k => num(v[k])).filter(isFinite);
        const name = (tr.querySelector("[data-label]") || {}).textContent;
        if (!xs.length) { api.setRo(tr, "avg", "", ""); return; }
        const a = xs.reduce((p, c) => p + c, 0) / xs.length; all.push(a);
        if (a < 3.5) weak.push(name);
        api.setRo(tr, "avg", fmt(a, 1), a < 3.5 ? "b7-bad" : "b7-ok");
      });
      const fives = api.rows().every(tr => { const v = api.rowVals(tr); return ["j1", "j2", "j3", "j4", "j5"].every(k => v[k] === "" || num(v[k]) === 5); });
      api.out("res", all.length ? (weak.length ? `معیارهای زیر ۳٫۵: <b>${weak.join("، ")}</b>. برگرد به دفترچهٔ آزمایش و فقط روی همین معیار نسخهٔ تازه بساز.` : "همهٔ معیارها ۳٫۵ یا بالاتر است.") + (fives && all.length ? " همهٔ نمره‌ها ۵ است؛ احتمالاً کسی صادق نبوده. برگهٔ بی‌نام را امتحان کن." : "") : "هر داور به هر معیار از ۱ تا ۵ نمره بدهد. میانگین هر معیار را جدا ببین، نه فقط جمع کل.");
    }, {r: [{j1: "5", j2: "4", j3: "4", j4: "5", j5: "4"}, {j1: "4", j2: "4", j3: "5", j4: "4", j5: "4"}, {j1: "4", j2: "3", j3: "4", j4: "4", j5: "4"}, {j1: "4", j2: "4", j3: "4", j4: "4", j5: "4"}, {j1: "4", j2: "4", j3: "3", j4: "4", j5: "4"}, {j1: "5", j2: "4", j3: "5", j4: "5", j5: "4"}]}],

    // فصل ۶: ماشین‌حساب بازده
    yield: [api => {
      const w = num(api.f("w")), price = num(api.f("price")), clean = num(api.f("clean")), cooked = num(api.f("cooked")), por = num(api.f("portion"));
      const fin = isFinite(cooked) && cooked > 0 ? cooked : clean;
      if (!(w > 0 && price > 0 && fin > 0)) { api.out("res", "وزن خرید، قیمت کل خرید و دست‌کم یکی از وزن‌های بعد از پاک کردن یا پخت را وارد کن."); return; }
      const y = fin / w * 100, cpk = price / fin, buyk = price / w;
      api.out("res", (clean > 0 ? `<b>بعد از پاک کردن:</b> ${pct(clean / w * 100)} · ` : "") + `<b>درصد بازده نهایی:</b> ${pct(y)}<br><b>قیمت خرید هر کیلو:</b> ${fmt(buyk)} تومان · <b>هزینهٔ هر کیلوی قابل سرو:</b> ${fmt(cpk)} تومان (${fmt(cpk / buyk, 2)} برابر)`
        + (por > 0 ? `<br><b>سهم این ماده در هر پرس ${fmt(por)} گرمی:</b> ${fmt(cpk * por / 1000)} تومان؛ با قیمت خرید ${fmt(buyk * por / 1000)} تومان دیده می‌شد.` : ""));
    }, {f: {w: "10", price: "600000", clean: "9.2", cooked: "6.4", portion: "225"}}]
  };

  document.querySelectorAll("[data-b7-tool]").forEach(root => {
    const t = TOOLS[root.dataset.b7Tool];
    if (t) bind(root, t[0], t[1]);
  });
  document.querySelectorAll("[data-print]").forEach(b => { b.onclick = () => window.print(); });
})();
