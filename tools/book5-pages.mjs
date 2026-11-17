// Companion pages and tools for the book «منوی سودده» (book 05). These URLs are printed as QR codes
// in the book: never rename or remove /b5/ routes. Interactive logic lives in assets/b5-tools.js.
const UPDATED = "۱۴۰۵/۰۸/۲۷";

const STYLE = `<style>
.b5-hero{border-right:6px solid #F28C28}
.b5-box{background:#fff;border:1px solid #eadfcf;border-radius:14px;padding:16px;margin:12px 0}
.b5-table{width:100%;border-collapse:collapse;font-size:.95rem}
.b5-table th{background:#1a2126;color:#fff;padding:.55rem .5rem;text-align:right;font-weight:700}
.b5-table td{border-bottom:1px solid #eee;padding:.35rem .3rem;vertical-align:middle}
.b5-table input{width:100%;min-width:64px;padding:.55rem .5rem;border:1px solid #c9c2b5;border-radius:8px;font:inherit;background:#fffdf8}
.b5-table td:first-child input{min-width:120px}
.b5-scroll{overflow-x:auto}
.b5-out{font-weight:700;white-space:nowrap}
.b5-del{all:unset;cursor:pointer;color:#c34f3d;font-size:1.3rem;padding:0 .4rem}
.b5-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin:.8rem 0}
.b5-actions button,.b5-btn{cursor:pointer;border:1px solid #1a2126;background:#fff;border-radius:10px;padding:.55rem .9rem;font:inherit}
.b5-actions button.primary{background:#1a2126;color:#fff}
.b5-result{background:#fdebd8;border-right:5px solid #F28C28;border-radius:10px;padding:.8rem 1rem;line-height:2;margin-top:.6rem}
.b5-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
.b5-cell{border-radius:12px;padding:12px;min-height:96px}.b5-cell b{display:block;font-size:1.05rem}.b5-cell small{color:#555}.b5-cell p{margin:.4rem 0 0}
.b5-star{background:#ffe9a8}.b5-horse{background:#d9efe9}.b5-puzzle{background:#fde0c4}.b5-dog{background:#f3d6d1}
.b5-tag{display:inline-block;border-radius:999px;padding:.1rem .6rem;font-size:.85rem}
.b5-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
.b5-fields label span{display:block;margin-bottom:4px;font-size:.92rem}
.b5-fields input{width:100%;padding:.6rem;border:1px solid #c9c2b5;border-radius:8px;font:inherit;background:#fffdf8}
.b5-list{padding-right:1.2rem;line-height:2}
.b5-copy{display:grid;gap:.5rem}.b5-copy button{all:unset;cursor:pointer;background:#fdebd8;border-right:5px solid #F28C28;padding:.6rem .9rem;border-radius:.5rem}
.b5-copy button.done::after{content:"  ✓ کپی شد";font-weight:700;color:#2e7d32}
.b5-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.b5-print-table{width:100%;border-collapse:collapse}.b5-print-table th{background:#1a2126;color:#fff;padding:.5rem;text-align:right}.b5-print-table td{border-bottom:1px solid #ddd;padding:.5rem;height:2.2rem}
.b5-buy{background:#F9C48E;border-radius:1rem;padding:1.3rem}.b5-buy .button{margin:.3rem 0 .3rem .5rem}
@media(max-width:560px){.b5-grid{grid-template-columns:1fr}}
@media print{.topbar,.site-footer,footer,.b5-noprint,.breadcrumbs,.comment-zone,.knowledge-sidebar{display:none!important}body{background:#fff}.b5-print-table td{height:1.1cm}}
</style>`;

export function renderBook5Pages({add, section, crumbs, link, esc, orderURL = "https://t.me/nimaafsharnaderi"}) {
  const buy = `<section class="block wrap b5-noprint"><div class="b5-buy"><h2>کتاب «منوی سودده» و کتاب‌های دیگر نیما داینر</h2><p>«منوی سودده» کتاب پنجم کتابخانهٔ نیما داینر است: کارگاه عملی مهندسی منو، قدم‌به‌قدم با منوی خودت. برای اطلاع از انتشار و سفارش، در تلگرام یا دایرکت اینستاگرام پیام بده. سفارش با هماهنگی انجام می‌شود و پرداخت خودکار نیست.</p><a class="button button-dark" href="${orderURL}" target="_blank" rel="noopener noreferrer">پیام در تلگرام ←</a><a class="button button-outline" href="https://instagram.com/nimasdiner" target="_blank" rel="noopener noreferrer">دایرکت اینستاگرام</a><a class="button button-outline" href="${link("library/")}">کتابخانهٔ نیما داینر</a><a class="button button-outline" href="${link("tools/")}">همهٔ ابزارها</a></div></section>`;
  const head = (chapter, title, lead) => `<section class="pagehead wrap b5-hero">${crumbs([["منوی سودده", "b5/"], [title, null]])}<p class="eyebrow">همراه کتاب «منوی سودده» · ${esc(chapter)}</p><h1>${esc(title)}</h1><p class="lead">${esc(lead)}</p><p class="muted">آخرین بازبینی: ${UPDATED}. عددها در مرورگر خودت حساب می‌شوند و به جایی فرستاده نمی‌شوند.</p></section>`;
  const tail = buy + STYLE;
  const opt = {script: "assets/b5-tools.js"};
  const pages = [];
  const page = (slug, chapter, title, description, lead, body) => { pages.push({slug, chapter, title, description}); add(`b5/${slug}/`, title, description, head(chapter, title, lead) + body + tail, opt); };

  page("3", "فصل ۳", "کارت رسپی و هزینهٔ واقعی هر پرس", "ابزار کارت رسپی: مواد، مقدار، قیمت و بازدهی را وارد کن تا هزینهٔ واقعی هر پرس، فودکاست و مشارکت را ببینی؛ همراه با ابزار بازدهی مواد.",
    "هر ماده را با مقدار در هر پرس، قیمت خرید هر واحد و بازدهی‌اش وارد کن. اگر بازدهی را نمی‌دانی، ۱۰۰ بگذار و بعد با ابزار پایین صفحه اندازه‌اش بگیر.",
    section("ابزار", "کارت رسپی", `<div class="b5-box" data-b5-tool="recipe"><p class="muted">واحد مقدار و واحد قیمت باید یکی باشند: اگر مقدار به گرم است، قیمت هر گرم را بنویس (قیمت هر کیلو ÷ ۱۰۰۰).</p><div class="b5-scroll"><table class="b5-table"><thead><tr><th>ماده</th><th>مقدار در هر پرس</th><th>قیمت خرید هر واحد (تومان)</th><th>بازدهی ٪</th><th>هزینه</th><th></th></tr></thead><tbody></tbody></table></div><div class="b5-actions b5-noprint"><button type="button" data-add>+ ردیف تازه</button><button type="button" data-sample>نمونهٔ کتاب: ساندویچ مرغ گریل</button><button type="button" data-clear>پاک کردن</button><button type="button" data-print>چاپ</button></div><div class="b5-fields"><label><span>قیمت فروش هر پرس (تومان)</span><input data-price type="text" inputmode="decimal" placeholder="۴۲۰۰۰۰"></label></div><div class="b5-result" data-result role="status" aria-live="polite"></div>
    <h3 style="margin-top:1.4rem">ابزار بازدهی مواد</h3><div data-yield class="b5-fields"><label><span>وزن خرید</span><input type="text" inputmode="decimal" placeholder="۱۰۰۰"></label><label><span>وزن نهایی قابل‌استفاده</span><input type="text" inputmode="decimal" placeholder="۶۵۰"></label><label><span>قیمت خرید هر واحد (اختیاری)</span><input type="text" inputmode="decimal" placeholder="۳۸۰"></label><div class="b5-result" data-yres role="status" aria-live="polite" style="grid-column:1/-1"></div></div></div>`)
    + section("یادآوری", "مواد پنهانی که کارت‌ها جا می‌اندازند", `<ul class="b5-list"><li>روغن سرخ‌کردن و گریل</li><li>نمک، ادویه، آبلیمو و مرینیت</li><li>سس کنار بشقاب و سس‌های بسته‌ای</li><li>نان یا برنج کنار غذا، گارنیش</li><li>بسته‌بندی بیرون‌بر: جعبه، ظرف سس، کیسه، قاشق، دستمال</li><li>مقداری که برای چشیدن و تست مصرف می‌شود</li></ul>`));

  page("4", "فصل ۴", "ماتریس منو: ستاره، اسب کاری، معما، سگ", "ابزار ماتریس منو (کاساوانا و اسمیت): آیتم‌های یک دستهٔ منو را با قیمت، هزینه و تعداد فروش وارد کن و خانهٔ هر آیتم را ببین.",
    "آیتم‌های یک دستهٔ منو را وارد کن (مثلاً فقط غذاهای اصلی). مرز فروش ۷۰ درصد سهم متوسط است و مرز سود، میانگین وزنی مشارکت هر پرس. هر دسته را جدا تحلیل کن.",
    section("ابزار", "ماتریس منوی من", `<div class="b5-box" data-b5-tool="matrix"><div class="b5-scroll"><table class="b5-table"><thead><tr><th>آیتم</th><th>قیمت</th><th>هزینهٔ مواد</th><th>تعداد فروش</th><th>خانه</th><th></th></tr></thead><tbody></tbody></table></div><div class="b5-actions b5-noprint"><button type="button" data-add>+ آیتم تازه</button><button type="button" data-sample>نمونهٔ کتاب: ساندویچی نمونه</button><button type="button" data-clear>پاک کردن</button><button type="button" data-print>چاپ</button></div><div class="b5-result" data-result role="status" aria-live="polite"></div><div class="b5-grid" data-grid></div></div>`)
    + section("راهنما", "هر خانه چه تصمیمی دارد", `<ul class="b5-list"><li><b>ستاره (پرفروش، پرسود):</b> کیفیت و پورشن را قفل کن؛ جای خوب منو؛ قیمت را تند تکان نده.</li><li><b>اسب کاری (پرفروش، کم‌سود):</b> هزینه را بررسی کن؛ قیمت را پله‌پله اصلاح کن؛ حذفش نکن.</li><li><b>معما (کم‌فروش، پرسود):</b> اسم، توضیح و جایش را عوض کن؛ پیشنهاد صندوق‌دار و کمبو.</li><li><b>سگ (کم‌فروش، کم‌سود):</b> بپرس چرا مانده؛ حذف یا بازطراحی با مواد مشترک.</li></ul><p class="muted">ماتریس دربارهٔ گذشته است؛ هر تصمیم را چهار هفته آزمایش کن و دوباره بسنج.</p>`));

  page("7", "فصل ۷", "منوی قبل و بعد و چک‌لیست طراحی منو", "نمونهٔ منوی قبل و بعد ساندویچی نمونهٔ کتاب منوی سودده و چک‌لیست کامل طراحی و چاپ منو.",
    "نمونهٔ کاری که کتاب روی منوی ساندویچی نمونه انجام داد، و چک‌لیستی که قبل از چاپ منوی تازه باید مرور کنی. عددها فرضی‌اند و قیمت‌ها به هزار تومان.",
    section("نمونه", "ساندویچی نمونه، قبل و بعد", `<div class="b5-scroll"><table class="b5-print-table"><thead><tr><th>آیتم</th><th>خانه</th><th>قبل</th><th>بعد</th><th>تصمیم</th></tr></thead><tbody>${[
      ["ساندویچ مرغ گریل", "ستاره", "۴۲۰", "۴۲۰", "بالای منو، پورشن با ترازو"], ["همبرگر", "ستاره", "۴۸۰", "۴۸۰", "پایهٔ کمبوی تازه"], ["ساندویچ کالباس", "اسب کاری", "۲۶۰", "۲۸۰", "پلهٔ قیمت"], ["فلافل", "اسب کاری", "۲۲۰", "۲۴۰", "پلهٔ قیمت"], ["هات‌داگ", "اسب کاری", "۲۹۰", "۳۱۰", "پلهٔ قیمت"], ["چیزبرگر دودی", "معما", "۵۶۰", "۵۶۰", "کادر، توضیح تازه، پیشنهاد صندوق‌دار"], ["ساندویچ زبان", "معما", "۶۵۰", "۶۵۰", "برچسب «ویژه»"], ["سالاد سزار", "سگ", "۳۸۰", "حذف", "مواد اختصاصی و ضایعات"], ["لیموناد خانگی", "معما", "۱۲۰", "۱۲۰", "نوشیدنی پیش‌فرض کمبو"]
    ].map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p>در سناریوی فرضی کتاب، مشارکت سه‌ماههٔ این ساندویچی حدود ۶ درصد بالا رفت؛ بدون تبلیغ و بدون ارزان کردن کیفیت.</p>`)
    + section("چک‌لیست", "قبل از چاپ منو", `<div class="b5-cols">${[
      ["محتوا", ["قیمت‌ها با کارت رسپی و ماتریس هماهنگ است", "آیتم‌های حذف‌شده برداشته شده‌اند", "هر توضیح: چه موادی، چطور پخته، چه حسی", "ادعای نادرست («دست‌ساز»، «تازه») نیست", "نشانهٔ تند، گیاهی، مغز و گلوتن", "کمبو و افزودنی با قیمت روشن"]],
      ["چیدمان", ["ستاره‌ها و معمای اصلی در نقطه‌های طلایی", "حداکثر یک یا دو کادر در هر صفحه", "قیمت‌ها در ستون مرتب نیستند", "بدون «تومان» و صفرهای طولانی", "عکس کم، واقعی، از غذای خودت"]],
      ["چاپ و بعد", ["خوانایی در نور سالن و از چند متری", "غلط‌گیری توسط یک نفر دیگر", "منوی آنلاین با قیمت جدا هماهنگ شد", "هایلایت منوی اینستاگرام به‌روز شد", "تیم کمبو و جملهٔ پیشنهاد را بلد است"]]
    ].map(([h, items]) => `<div class="b5-box"><h3>${esc(h)}</h3><ul class="b5-list">${items.map(i => `<li>☐ ${esc(i)}</li>`).join("")}</ul></div>`).join("")}</div><p class="b5-noprint"><button class="b5-btn" type="button" data-print>چاپ این صفحه</button></p>`));

  const words = [["روش پخت", ["گریل‌شده", "دودی", "آرام‌پز", "مرینیت‌شده", "تنوری", "برشته", "دست‌ساز", "خانگی", "تازه‌پخت", "دم‌کشیده", "تازه‌گرفته", "سرد دم"]], ["بافت و حس", ["ترد", "آبدار", "نرم", "کرمی", "لطیف", "سبک", "گرم", "سیرکننده", "آشنا"]], ["طعم", ["ملایم", "تند", "ترش", "دودی", "کاراملی", "معطر", "ترش‌وشیرین"]], ["زمان و منشأ (فقط اگر واقعی)", ["هر روز صبح", "تازهٔ امروز", "پخت چندساعته", "فقط در این فصل", "تا تمام شدن", "دستور خانوادگی", "نان نانوایی محل", "برشته‌کاری خود ما"]]];
  page("8", "فصل ۸", "بانک کلمه‌های منو", "کلمه‌های توصیف منو برای رستوران و کافه: روش پخت، بافت، طعم، زمان و منشأ؛ با یک لمس کپی کن.",
    "روی هر کلمه بزن تا کپی شود. فقط کلمه‌ای را بردار که دربارهٔ غذای تو واقعاً درست است.",
    words.map(([h, ws]) => section("کلمه‌ها", h, `<div class="b5-copy" style="grid-template-columns:repeat(auto-fill,minmax(130px,1fr))">${ws.map(w => `<button type="button" data-text="${esc(w)}">${esc(w)}</button>`).join("")}</div>`)).join("")
    + section("الگو", "توضیح منو در یک خط", `<div class="b5-copy"><button type="button" data-text="[ماده اصلی] [روش پخت] با [ماده خاص] و [سس یا همراه]، [حس یا بافت]">[مادهٔ اصلی] [روش پخت] با [مادهٔ خاص] و [سس یا همراه]، [حس یا بافت]</button><button type="button">برگر گوشت تازه با پنیر دودی، پیاز کاراملی و سس امضای ما، روی نان کره‌ای برشته</button><button type="button">لیموی تازه‌گرفته، نعنا و کمی عسل؛ هر روز صبح درست می‌شود</button></div><p class="muted">به جای «خوشمزه»، «عالی»، «ویژه» و «بهترین»، یک ویژگی مشخص بنویس.</p>`));

  page("10", "فصل ۱۰", "حداقل قیمت آنلاین با کمیسیون و بسته‌بندی", "ابزار قیمت منوی آنلاین و دلیوری: با هزینهٔ مواد، بسته‌بندی، کمیسیون پلتفرم و تخفیف، حداقل قیمت آنلاین و پول باقی‌مانده از هر سفارش را حساب کن.",
    "فرمول: (مواد + بسته‌بندی + سهم پوشش هدف) ÷ (۱ − کمیسیون − تخفیف). نرخ کمیسیون و تخفیف را از قرارداد پلتفرم خودت بخوان.",
    section("ابزار", "قیمت آنلاین من", `<div class="b5-box" data-b5-tool="online"><div class="b5-fields"><label><span>هزینهٔ مواد هر پرس (تومان)</span><input type="text" inputmode="decimal" placeholder="۱۹۵۰۰۰"></label><label><span>بسته‌بندی هر سفارش (تومان)</span><input type="text" inputmode="decimal" placeholder="۲۵۰۰۰"></label><label><span>سهم پوشش هدف: پولی که می‌خواهی بماند</span><input type="text" inputmode="decimal" placeholder="۲۰۰۰۰۰"></label><label><span>کمیسیون پلتفرم (درصد)</span><input type="text" inputmode="decimal" placeholder="۲۲"></label><label><span>تخفیف تبلیغاتی (درصد)</span><input type="text" inputmode="decimal" placeholder="۸"></label><label><span>قیمت فعلی در اپ (اختیاری)</span><input type="text" inputmode="decimal" placeholder="۴۸۰۰۰۰"></label></div><div class="b5-result" data-result role="status" aria-live="polite"></div></div><p class="muted">نمونهٔ کتاب: مواد ۱۹۵ هزار، بسته‌بندی ۲۵ هزار، سهم پوشش ۲۰۰ هزار، کمیسیون ۲۲٪ و تخفیف ۸٪ ⇐ حدود ۶۰۰ هزار تومان. نرخ‌ها فرضی‌اند.</p>`)
    + section("یادآوری", "منوی آنلاین، منوی جداگانه", `<ul class="b5-list"><li>آیتم‌هایی که در مسیر خراب می‌شوند را از اپ بردار.</li><li>کمبوها را بالای منو بیاور.</li><li>برای هر آیتم عکس واقعی و توضیح دقیق (اندازه، محتوا).</li><li>ماتریس منو را برای فروش آنلاین جدا بساز، با مشارکت بعد از کمیسیون.</li><li>ظرفیت آشپزخانه در ساعت اوج را ببین، نه فقط قیمت.</li></ul>`));

  const plan = [["۱ تا ۲", "گزارش فروش سه ماه و فاکتورها"], ["۳ تا ۶", "جدول حسابرسی: قیمت، هزینه، فروش، مشارکت"], ["۷ تا ۱۰", "کارت رسپی پنج آیتم گران؛ آزمایش بازدهی"], ["۱۱ تا ۱۲", "ماتریس منو برای هر دسته"], ["۱۳ تا ۱۴", "نامزدهای حذف و آزمایش چهارهفته‌ای"], ["۱۵ تا ۱۶", "پلهٔ اول قیمت اسب‌های کاری"], ["۱۷ تا ۲۰", "اسم و توضیح معماها؛ چیدمان تازه"], ["۲۱ تا ۲۲", "کمبوی تازه و جملهٔ پیشنهاد؛ آموزش تیم"], ["۲۳ تا ۲۴", "منوی آنلاین جدا و قیمت آنلاین"], ["۲۵ تا ۲۶", "منوی اضطراری روی کاغذ"], ["۲۷", "چاپ منوی تازه با چک‌لیست"], ["۲۸ تا ۳۰", "ثبت روزانهٔ میانگین فاکتور، زمان سرو و ضایعات"]];
  page("13", "فصل ۱۳", "برنامهٔ ۳۰ روزهٔ بازسازی منو", "برنامهٔ روزبه‌روز ۳۰ روزهٔ مهندسی و بازسازی منو، با جدول قابل چاپ تیک و فرم سنجش نتیجه.",
    "این صفحه را چاپ کن و کنار صندوق بگذار. بعد از روز ۳۰، چهار هفته صبر کن و نتیجه را با چهار هفتهٔ مشابه قبل مقایسه کن.",
    section("برنامه", "۳۰ روز", `<table class="b5-print-table"><thead><tr><th>روزها</th><th>کار</th><th>✓</th><th>یادداشت</th></tr></thead><tbody>${plan.map(([d, w]) => `<tr><td>${esc(d)}</td><td>${esc(w)}</td><td></td><td></td></tr>`).join("")}</tbody></table>`)
    + section("سنجش", "نتیجهٔ من", `<table class="b5-print-table"><thead><tr><th>شاخص</th><th>قبل</th><th>چهار هفته بعد</th></tr></thead><tbody>${["مشارکت کل", "میانگین فاکتور", "تعداد فاکتور", "زمان سرو در ساعت اوج", "ضایعات هفتگی", "تعداد آیتم منو"].map(x => `<tr><td>${esc(x)}</td><td></td><td></td></tr>`).join("")}</tbody></table><p class="b5-noprint"><button class="b5-btn" type="button" data-print>چاپ این صفحه</button></p>`));

  const hub = `<section class="pagehead wrap b5-hero">${crumbs([["منوی سودده", null]])}<p class="eyebrow">کتابخانهٔ نیما داینر · کتاب پنجم</p><h1>«منوی سودده»؛ مهندسی منو، قدم‌به‌قدم با منوی خودت</h1><p class="lead">صفحه‌ها و ابزارهای همراه کتاب: کارت رسپی، ماتریس منو، قیمت آنلاین، بانک کلمه‌ها و برنامهٔ ۳۰ روزه. هر QR کتاب به یکی از این صفحه‌ها می‌رسد.</p></section>`
    + section("ابزارها و صفحه‌ها", "از کجا شروع کنم؟", `<div class="cards three">${pages.map(p => `<article class="card"><span class="kicker">${esc(p.chapter)}</span><h3><a href="${link(`b5/${p.slug}/`)}">${esc(p.title)}</a></h3><p>${esc(p.description)}</p></article>`).join("")}</div>`)
    + section("ابزارهای دیگر", "محاسبه‌گرهای تک‌آیتمی سایت", `<p class="rich">برای حساب سریع یک آیتم: <a class="textlink" href="${link("tools/foodcost/")}">فودکاست</a> · <a class="textlink" href="${link("tools/menu/")}">مشارکت آیتم منو</a> · <a class="textlink" href="${link("tools/pricing/")}">قیمت از فودکاست هدف</a> · <a class="textlink" href="${link("tools/waste/")}">بازدهی مواد</a> · <a class="textlink" href="${link("tools/discount/")}">اثر تخفیف و کارمزد</a></p>`)
    + tail;
  add("b5/", "ابزارها و صفحه‌های همراه کتاب منوی سودده", "ابزارهای رایگان مهندسی منو همراه کتاب «منوی سودده»: کارت رسپی، ماتریس منو، قیمت آنلاین با کمیسیون، بانک کلمه‌های منو و برنامهٔ ۳۰ روزه.", hub);
}
