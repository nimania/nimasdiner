// Menu-building questionnaire: answers stay in this browser only (localStorage); nothing is sent automatically.
(function () {
  var form = document.getElementById("menu-questionnaire");
  if (!form) return;
  var KEY = "nimasdiner-menu-questionnaire-v1";
  var status = form.querySelector(".mq-status");
  var say = function (t) { if (status) status.textContent = t; };

  function load() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { saved = null; }
    if (!saved) return;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || !(el.name in saved)) return;
      if (el.type === "checkbox") el.checked = !!saved[el.name];
      else el.value = saved[el.name];
    });
  }
  function save() {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      data[el.name] = el.type === "checkbox" ? el.checked : el.value;
    });
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* storage unavailable: keep in page only */ }
  }
  function compose() {
    var out = ["پرسشنامهٔ ساخت منو — نیما داینر", ""];
    form.querySelectorAll(".mq-section").forEach(function (sec) {
      out.push("■ " + sec.getAttribute("data-title"));
      sec.querySelectorAll("fieldset.mq-checks").forEach(function (fs) {
        var picked = Array.prototype.filter.call(fs.querySelectorAll("input[type=checkbox]"), function (c) { return c.checked; })
          .map(function (c) { return c.value; });
        out.push(fs.getAttribute("data-group") + " " + (picked.length ? picked.join("، ") : "—"));
      });
      sec.querySelectorAll("[data-label]").forEach(function (el) {
        out.push("• " + el.getAttribute("data-label") + ": " + (el.value.trim() || "—"));
      });
      sec.querySelectorAll("table[data-table] tbody tr").forEach(function (tr, i) {
        var cells = Array.prototype.map.call(tr.querySelectorAll("input"), function (inp) { return inp.value.trim(); });
        if (cells.some(Boolean)) {
          out.push("• رقیب " + (i + 1) + ": " + Array.prototype.map.call(tr.querySelectorAll("input"), function (inp) {
            return inp.getAttribute("data-col") + ": " + (inp.value.trim() || "—");
          }).join(" | "));
        }
      });
      out.push("");
    });
    return out.join("\n");
  }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  load();
  form.addEventListener("input", save);
  form.addEventListener("change", save);
  form.addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-mq]");
    if (!btn) return;
    var act = btn.getAttribute("data-mq");
    if (act === "copy") {
      copy(compose()).then(function () { say("متن پاسخ‌ها کپی شد. حالا آن را در تلگرام بفرستید."); },
        function () { say("کپی خودکار انجام نشد. از دکمهٔ چاپ یا ذخیرهٔ PDF استفاده کنید."); });
    } else if (act === "print") {
      window.print();
    } else if (act === "clear") {
      form.reset();
      try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
      say("پاسخ‌ها از این مرورگر پاک شد.");
    }
  });
})();
