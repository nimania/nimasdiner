// Interactive tools for the book «دخل» (/b7/). No network calls; state stays in the visitor's browser.
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
    const key = "b7-" + root.dataset.b7Tool;
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
    // فصل ۲: دفتر دخل هفتگی
    ledger: [api => {
      let o = 0, cash = 0, card = 0, app = 0, ex = 0, w = 0, d = 0, best = null, worst = null;
      api.rows().forEach(tr => {
        const v = api.rowVals(tr), sales = z(v.cash) + z(v.card) + z(v.app);
        o += z(v.orders); cash += z(v.cash); card += z(v.card); app += z(v.app); ex += z(v.ex); w += z(v.w); d += z(v.diff);
        api.setRo(tr, "sales", sales ? fmt(sales) : "");
        const name = (tr.querySelector("[data-label]") || {}).textContent;
        if (sales) { if (!best || sales > best[1]) best = [name, sales]; if (!worst || sales < worst[1]) worst = [name, sales]; }
      });
      const sales = cash + card + app, days = api.rows().filter(tr => z(api.rowVals(tr).orders) > 0).length || 0;
      const be = num(api.f("be"));
      api.out("res", `<b>فروش هفته:</b> ${fmt(sales)} · <b>سفارش:</b> ${fmt(o)} · <b>میانگین هر سفارش:</b> ${o ? fmt(sales / o) : "—"}<br>`
        + `<b>سهم نقد / کارت / اپ:</b> ${sales ? pct(cash / sales * 100) + " / " + pct(card / sales * 100) + " / " + pct(app / sales * 100) : "—"}<br>`
        + `<b>خرج نقدی:</b> ${fmt(ex)} · <b>برداشت صاحب:</b> ${fmt(w)} · <b>جمع اختلاف صندوق:</b> ${fmt(d)}<br>`
        + (best ? `<b>پرفروش‌ترین روز:</b> ${best[0]} · <b>کم‌فروش‌ترین:</b> ${worst[0]}<br>` : "")
        + (isFinite(be) && days ? `<b>میانگین سفارش روزانه:</b> ${fmt(o / days, 1)} در برابر سربه‌سر ${fmt(be)} ← ${o / days >= be ? "بالای سربه‌سر" : "زیر سربه‌سر"}` : "برای مقایسه، سفارش سربه‌سر روزانه را از فصل ۱۰ وارد کن."));
    }, {f: {be: "72"}, r: [
      {orders: "84", cash: "9100", card: "18200", app: "11600", ex: "2100", w: "0", diff: "-50"},
      {orders: "86", cash: "9400", card: "18800", app: "11900", ex: "900", w: "0", diff: "0"},
      {orders: "81", cash: "8700", card: "17900", app: "11300", ex: "1200", w: "0", diff: "20"},
      {orders: "88", cash: "9500", card: "19400", app: "12200", ex: "800", w: "0", diff: "0"},
      {orders: "99", cash: "10600", card: "21500", app: "13900", ex: "3100", w: "0", diff: "-30"},
      {orders: "104", cash: "11200", card: "22600", app: "14600", ex: "700", w: "0", diff: "0"},
      {orders: "88", cash: "9300", card: "19600", app: "12100", ex: "600", w: "0", diff: "0"}]}],

    // فصل ۴: تغییر قیمت مواد
    prices: [api => {
      let n = 0, up = 0;
      api.rows().forEach(tr => {
        const v = api.rowVals(tr), a = num(v.old), b = num(v.now);
        if (a > 0 && isFinite(b)) { const ch = (b - a) / a * 100; n++; up += ch; api.setRo(tr, "ch", pct(ch), ch >= 5 ? "b7-bad" : ch > 0 ? "b7-warn" : "b7-ok"); }
        else api.setRo(tr, "ch", "", "");
      });
      api.out("res", n ? `میانگین تغییر قیمت ${fmt(n)} قلم: <b>${pct(up / n)}</b>. اقلامی که ۵٪ یا بیشتر گران شده‌اند قرمزند؛ کارت هزینهٔ غذاهایی که این مواد را دارند همین امروز به‌روز کن.` : "قیمت قبلی و قیمت امروز هر قلم را وارد کن.");
    }, {r: [{name: "گوشت چرخ‌کرده (کیلو)", old: "820000", now: "900000"}, {name: "پنیر ورقه‌ای (ورق)", old: "13000", now: "14000"}, {name: "نان برگر (عدد)", old: "16000", now: "18000"}, {name: "روغن (حلب)", old: "2400000", now: "2450000"}, {name: "سیب‌زمینی (کیلو)", old: "70000", now: "80000"}]}],

    // فصل ۴: قانون آستانه
    items: [api => {
      const gap = num(api.f("gap")) || 3;
      let bad = 0;
      api.rows().forEach(tr => {
        const v = api.rowVals(tr), c = num(v.cost), p = num(v.price), t = num(v.target);
        if (c > 0 && p > 0) {
          const fc = c / p * 100;
          api.setRo(tr, "fc", pct(fc));
          if (t > 0) {
            const over = fc - t >= gap; if (over) bad++;
            api.setRo(tr, "st", over ? "همین ماه تصمیم" : fc > t ? "نزدیک آستانه" : "در محدوده", over ? "b7-bad" : fc > t ? "b7-warn" : "b7-ok");
            api.setRo(tr, "np", fmt(Math.ceil(c / (t / 100) / 10000) * 10000));
          } else { api.setRo(tr, "st", "", ""); api.setRo(tr, "np", ""); }
          api.setRo(tr, "gp", fmt(p - c));
        } else ["fc", "st", "np", "gp"].forEach(k => api.setRo(tr, k, "", ""));
      });
      api.out("res", bad ? `غذاهایی که از آستانه رد شده‌اند: <b>${fmt(bad)}</b>. پیش از گران کردن، چهار راه فصل ۴ را مرور کن: قیمت، جزء فرعی، ماده یا تأمین‌کننده، طراحی دوباره. «قیمت برای رسیدن به هدف» فقط با تغییر قیمت حساب شده و به ده هزار تومان گرد شده است.` : "هیچ غذایی از آستانه رد نشده است، یا هنوز عددی وارد نکرده‌ای.");
    }, {f: {gap: "3"}, r: [{name: "همبرگر رفیق", cost: "208000", price: "420000", target: "40"}, {name: "ساندویچ مرغ گریل", cost: "128000", price: "380000", target: "35"}, {name: "سیب‌زمینی ویژه", cost: "52000", price: "190000", target: "25"}]}],

    // فصل ۵: حد موجودی
    par: [api => {
      api.rows().forEach(tr => {
        const v = api.rowVals(tr), u = num(v.use), d = num(v.days), s = z(v.safe), h = z(v.have);
        if (u > 0 && d > 0) { const par = u * d + s, q = Math.max(0, par - h); api.setRo(tr, "par", fmt(par, 1)); api.setRo(tr, "buy", fmt(q, 1), q > 0 ? "b7-warn" : "b7-ok"); }
        else { api.setRo(tr, "par", ""); api.setRo(tr, "buy", "", ""); }
      });
      const n = api.rows().filter(tr => { const v = api.rowVals(tr); return num(v.use) > 0 && num(v.days) > 0 && Math.max(0, num(v.use) * num(v.days) + z(v.safe) - z(v.have)) > 0; }).length;
      api.out("res", n ? `امروز <b>${fmt(n)}</b> قلم را باید سفارش بدهی. فقط به اندازهٔ ستون «سفارش امروز» بخر؛ نه کمتر که وسط سرویس تمام شود، نه بیشتر که در یخچال بماند.` : "برای هر قلم مصرف روزانه، فاصلهٔ دو خرید، ذخیره و موجودی فعلی را وارد کن.");
    }, {r: [{name: "گوشت چرخ‌کرده (کیلو)", use: "7", days: "3.5", safe: "3", have: "8"}, {name: "سینهٔ مرغ (کیلو)", use: "6", days: "3.5", safe: "2", have: "5"}, {name: "نان برگر (عدد)", use: "48", days: "1", safe: "6", have: "4"}, {name: "پنیر ورقه‌ای (ورق)", use: "45", days: "7", safe: "30", have: "120"}, {name: "روغن (حلب)", use: "0.25", days: "14", safe: "1", have: "2"}]}],

    // فصل ۶: کسری انبار
    shortage: [api => {
      const a = z(api.f("open")), b = z(api.f("buy")), c = z(api.f("close")), s = num(api.f("sold")), q = num(api.f("per")), pr = num(api.f("unit"));
      const used = a + b - c, exp = s * q;
      if (!(used > 0) || !(exp > 0)) { api.out("res", "موجودی اول، خرید، موجودی آخر، تعداد فروش و مقدار هر پرس را وارد کن."); return; }
      const sh = used - exp, p = sh / exp * 100, [lab, cls] = status(p <= 3, p <= 5);
      api.out("res", `<b>مصرف شد:</b> ${fmt(used, 2)} · <b>مصرف باید:</b> ${fmt(exp, 2)} · <b>کسری:</b> ${fmt(sh, 2)} (<span class="${cls}">${pct(p)}، ${lab}</span>)`
        + (pr > 0 ? `<br><b>ارزش کسری:</b> ${fmt(sh * pr)} تومان در این دوره؛ اگر دوره یک هفته است، حدود ${fmt(sh * pr * 4.3)} تومان در ماه.` : "")
        + (p > 5 ? "<br>بیش از ۵ درصد: یک سرویس کامل کنار ایستگاه آماده‌سازی بایست؛ ترازو، قالب و برچسب را چک کن." : ""));
    }, {f: {open: "18", buy: "56", close: "21", sold: "315", per: "0.15", unit: "900000"}}],

    // فصل ۹: سود هر سفارش دلیوری
    delivery: [api => {
      const p = num(api.f("price")), s = num(api.f("salon")), f = num(api.f("food")), k = z(api.f("pack")), c = z(api.f("comm")) / 100, r = (num(api.f("ratio")) || 60) / 100;
      if (!(p > 0 && f > 0)) { api.out("res", "قیمت در اپ و هزینهٔ مواد را وارد کن."); return; }
      const left = p * (1 - c) - f - k, sl = s > 0 ? s - f : NaN, need = s > 0 ? (r * sl + f + k) / (1 - c) : NaN;
      api.out("res", `<b>از هر سفارش دلیوری برای نیرو، اجاره و سود می‌ماند:</b> ${fmt(left)} تومان (کمیسیون ${fmt(p * c)})`
        + (s > 0 ? `<br><b>همین غذا در سالن:</b> ${fmt(sl)} تومان · دلیوری ${pct(left / sl * 100)} سالن است.<br><b>قیمت دلیوری برای رسیدن به ${fmt(r * 100)}٪ سالن:</b> ${fmt(Math.ceil(need / 10000) * 10000)} تومان (گرد به ده هزار)` : ""));
    }, {f: {price: "480000", salon: "480000", food: "203000", pack: "18000", comm: "25", ratio: "60"}}],

    // فصل ۱۰: سود و زیان و سربه‌سر
    pnl: [api => {
      const g = k => z(api.f(k)), sales = g("sales");
      if (!(sales > 0)) { api.out("res", "فروش ماه و هزینه‌ها را وارد کن (به میلیون تومان یا تومان؛ فقط یکی را در همه خانه‌ها به کار ببر)."); return; }
      const costs = g("food") + g("labor") + g("rent") + g("comm") + g("util") + g("pos") + g("maint") + g("mkt") + g("misc");
      const op = sales - costs, below = g("owner") + g("loan") + g("taxres") + g("fixres"), free = op - below;
      const fixed = g("labor") + g("rent") + g("util") + g("maint") + g("mkt") + g("misc") + g("owner") + g("loan") + g("fixres");
      const varr = (g("food") + g("comm") + g("pos") + g("taxres")) / sales;
      const be = varr < 1 ? fixed / (1 - varr) : NaN, days = g("days"), tk = g("ticket");
      const beDay = days ? be / days : NaN, beOrd = tk ? beDay / tk : NaN, nowOrd = days && tk ? sales / days / tk : NaN;
      api.out("res", `<b>سود عملیاتی:</b> ${fmt(op, 1)} (${pct(op / sales * 100)} فروش) · <b>ماندهٔ آزاد:</b> <span class="${free >= 0 ? "b7-ok" : "b7-bad"}">${fmt(free, 1)}</span><br>`
        + `<b>فودکاست:</b> ${pct(g("food") / sales * 100)} · <b>نیرو با حقوق صاحب:</b> ${pct((g("labor") + g("owner")) / sales * 100)} · <b>اجاره:</b> ${pct(g("rent") / sales * 100)} · <b>هزینهٔ اصلی:</b> ${pct((g("food") + g("labor") + g("owner")) / sales * 100)}<br>`
        + `<b>هزینهٔ ثابت:</b> ${fmt(fixed, 1)} · <b>هزینهٔ متغیر:</b> ${pct(varr * 100)} فروش<br>`
        + `<b>فروش سربه‌سر ماه:</b> ${fmt(be, 1)}` + (days ? ` · <b>در روز:</b> ${fmt(beDay, 2)}` : "")
        + (isFinite(beOrd) ? `<br><b>سفارش سربه‌سر در روز:</b> ${fmt(Math.ceil(beOrd))} · <b>سفارش فعلی:</b> ${fmt(nowOrd, 1)} · <b>حاشیهٔ امن:</b> ${pct((nowOrd - beOrd) / nowOrd * 100)}` : "<br>برای سفارش سربه‌سر، روزهای کاری و میانگین هر سفارش را هم وارد کن (با همان واحد فروش)."));
    }, {f: {sales: "1172", food: "410", labor: "135", rent: "120", comm: "98", util: "36", pos: "6", maint: "18", mkt: "10", misc: "12", owner: "80", loan: "65", taxres: "35", fixres: "22", days: "28", ticket: "0.465"}}],

    // فصل ۱۱: تقویم پرداخت ۱۳ هفته
    cash: [api => {
      let bal = z(api.f("start")), low = null, neg = 0;
      api.rows().forEach(tr => {
        const v = api.rowVals(tr), net = z(v.in) - z(v.sup) - z(v.fix) - z(v.pay) - z(v.chq) - z(v.oth);
        const has = ["in", "sup", "fix", "pay", "chq", "oth"].some(k => v[k] !== "");
        if (has) { bal += net; if (bal < 0) neg++; if (low === null || bal < low[1]) low = [(tr.querySelector("[data-label]") || {}).textContent, bal]; }
        api.setRo(tr, "net", has ? fmt(net, 1) : ""); api.setRo(tr, "bal", has ? fmt(bal, 1) : "", has ? (bal < 0 ? "b7-bad" : "b7-ok") : "");
      });
      const target = num(api.f("target"));
      api.out("res", low ? `<b>پایین‌ترین مانده:</b> ${fmt(low[1], 1)} در ${low[0]}` + (neg ? ` · <span class="b7-bad">${fmt(neg)} هفتهٔ منفی</span>؛ از همین حالا خرید عمده را عقب بینداز، تاریخ چک را تنظیم کن یا از صندوق احتیاط کمک بگیر.` : " · هیچ هفته‌ای منفی نمی‌شود.")
        + (target > 0 ? `<br><b>هدف صندوق احتیاط:</b> ${fmt(target, 1)}؛ اگر ماهی ${fmt(target / 12, 1)} کنار بگذاری، در یک سال می‌رسی.` : "") : "مانده اول دوره و ورودی و خروجی هفته‌ها را وارد کن.");
    }, {f: {start: "30", target: "500"}, r: [
      {in: "269", sup: "103", fix: "120", pay: "", chq: "", oth: "20"}, {in: "268", sup: "103", fix: "65", pay: "40", chq: "", oth: "20"},
      {in: "269", sup: "102", fix: "", pay: "", chq: "", oth: "21"}, {in: "268", sup: "102", fix: "", pay: "175", chq: "", oth: "78"}]}],

    // فصل ۱۲: داشبورد هفت‌عددی
    dash: [api => {
      const g = k => num(api.f(k));
      const rows = [
        ["ord", g("ord") >= g("be"), g("ord") >= g("be") * 0.95],
        ["fc", g("fc") <= g("fcT"), g("fc") <= g("fcT") + 2],
        ["sh", g("sh") <= 3, g("sh") <= 5],
        ["wa", g("wa") <= g("waT"), g("wa") <= g("waT") * 1.2],
        ["lab", g("lab") <= g("labT"), g("lab") <= g("labT") + 1],
        ["del", g("del") >= 60, g("del") >= 50],
        ["res", g("res") >= g("resT"), g("res") > 0]];
      let bad = 0;
      rows.forEach(([k, ok, warn]) => {
        const v = g(k);
        if (!isFinite(v)) { api.out("s-" + k, "", ""); return; }
        const [lab, cls] = status(ok, warn); if (!ok && !warn) bad++;
        api.out("s-" + k, lab, cls);
      });
      api.out("res", bad ? `<b>${fmt(bad)}</b> عدد بیرون از محدوده است. همین هفته علتش را پیدا کن؛ اگر هفتهٔ بعد هم بیرون ماند، تصمیم بگیر.` : "تا وقتی همه در محدوده‌اند، کاری نکن.");
    }, {f: {be: "72", ord: "90", fcT: "36", fc: "35", sh: "2.4", waT: "4000000", wa: "3200000", labT: "12", lab: "11.5", del: "64", resT: "1", res: "0.3"}}]
  };

  document.querySelectorAll("[data-b7-tool]").forEach(root => {
    const t = TOOLS[root.dataset.b7Tool];
    if (t) bind(root, t[0], t[1]);
  });
  document.querySelectorAll("[data-print]").forEach(b => { b.onclick = () => window.print(); });
})();
