// Companion pages and tools for the book «دخل» (book 12 in the library, «کتاب هفتم» of the Nima Diner
// series). These URLs are printed as QR codes in the book: never rename or remove /b7/ routes.
// Interactive logic lives in assets/b7-tools.js; downloads live in assets/b7/.
const UPDATED = "۱۴۰۵/۰۹/۰۲";

const STYLE = `<style>
.b7-hero{border-right:6px solid #26406B}
.b7-box{background:#fff;border:1px solid #dde3ee;border-radius:14px;padding:16px;margin:12px 0}
.b7-table{width:100%;border-collapse:collapse;font-size:.95rem}
.b7-table th{background:#1B2130;color:#fff;padding:.55rem .5rem;text-align:right;font-weight:700;white-space:nowrap}
.b7-table td{border-bottom:1px solid #eee;padding:.35rem .3rem;vertical-align:middle}
.b7-table td[data-label]{font-weight:700;white-space:nowrap}
.b7-table input{width:100%;min-width:84px;padding:.55rem .5rem;border:1px solid #c3c9d4;border-radius:8px;font:inherit;background:#fbfcfe}
.b7-table input[data-c="name"]{min-width:150px}
.b7-scroll{overflow-x:auto}
.b7-table [data-ro]{font-weight:700;white-space:nowrap}
.b7-del{all:unset;cursor:pointer;color:#b23b2e;font-size:1.3rem;padding:0 .4rem}
.b7-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin:.8rem 0}
.b7-actions button,.b7-btn{cursor:pointer;border:1px solid #1B2130;background:#fff;border-radius:10px;padding:.55rem .9rem;font:inherit;color:#1B2130;text-decoration:none;display:inline-block}
.b7-actions button.primary,.b7-btn.primary{background:#26406B;border-color:#26406B;color:#fff}
.b7-result{background:#EAF0F8;border-right:5px solid #26406B;border-radius:10px;padding:.8rem 1rem;line-height:2.1;margin-top:.6rem}
.b7-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}
.b7-fields label span{display:block;margin-bottom:4px;font-size:.92rem}
.b7-fields input{width:100%;padding:.6rem;border:1px solid #c3c9d4;border-radius:8px;font:inherit;background:#fbfcfe}
.b7-list{padding-right:1.2rem;line-height:2}
.b7-ok{color:#2e7d32}.b7-warn{color:#a66a00}.b7-bad{color:#b23b2e}
.b7-formula{background:#F5F5F2;border-radius:10px;padding:.7rem 1rem;font-weight:700;text-align:center;margin:.6rem 0}
.b7-print-table{width:100%;border-collapse:collapse}.b7-print-table th{background:#1B2130;color:#fff;padding:.5rem;text-align:right}.b7-print-table td{border-bottom:1px solid #ddd;padding:.5rem;height:2.2rem}
.b7-buy{background:#DCE5F2;border-radius:1rem;padding:1.3rem;display:flex;gap:1.2rem;align-items:center}.b7-buy img{width:110px;height:auto;border-radius:4px;box-shadow:0 6px 18px rgba(0,0,0,.18)}.b7-buy .button{margin:.3rem 0 .3rem .5rem}
.b7-dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
.b7-dl a{display:block;background:#fff;border:1px solid #dde3ee;border-right:5px solid #E3B341;border-radius:12px;padding:.8rem 1rem;text-decoration:none;color:inherit}
.b7-dl a b{display:block;color:#26406B}
@media(max-width:560px){.b7-buy{flex-direction:column;align-items:flex-start}}
@media print{.topbar,.site-footer,footer,.b7-noprint,.breadcrumbs,.comment-zone,.knowledge-sidebar{display:none!important}body{background:#fff}.b7-print-table td{height:1.1cm}}
</style>`;

export function renderBook7Pages({add, section, crumbs, link, esc, orderURL = "https://t.me/nimaafsharnaderi"}) {
  const buy = `<section class="block wrap b7-noprint"><div class="b7-buy"><img src="${link("assets/book-12.webp")}" alt="جلد کتاب «دخل»، نوشتهٔ نیما افشارنادری" width="110" height="156" loading="lazy"><div><h2>کتاب «دخل»؛ حساب‌وکتاب ساده برای رستوران‌های کوچک</h2><p>این ابزارها همراه کتاب «دخل» از کتابخانهٔ نیما داینر ساخته شده‌اند: روزی ۱۰ دقیقه، بدون حسابدار، برای رستوران، ساندویچی و کافهٔ ۴ تا ۵ نفره. نسخهٔ الکترونیکی کتاب عرضه شده و نسخهٔ چاپی به‌زودی منتشر می‌شود.</p><a class="button button-dark" href="${link("library/12/")}">معرفی کتاب و ۵ صفحه نمونه ←</a><a class="button button-outline" href="${esc(orderURL)}" rel="noopener">سفارش نسخهٔ الکترونیکی در تلگرام</a></div></div></section>`;
  const head = (chapter, title, lead) => `<section class="pagehead wrap b7-hero">${crumbs([["دخل", "b7/"], [title, null]])}<p class="eyebrow">همراه کتاب «دخل» · ${esc(chapter)}</p><h1>${esc(title)}</h1><p class="lead">${esc(lead)}</p><p class="muted">آخرین بازبینی: ${UPDATED}. عددها در مرورگر خودت حساب و همان‌جا نگه داشته می‌شوند و جایی فرستاده نمی‌شوند. دکمهٔ «نمونهٔ ساندویچی رفیق» عددهای رستوران نمونهٔ کتاب را می‌گذارد.</p></section>`;
  const tail = buy + STYLE;
  const opt = {script: "assets/b7-tools.js"};
  const pages = [];
  const page = (slug, chapter, title, description, lead, body) => { pages.push({slug, chapter, title, description}); add(`b7/${slug}/`, title, description, head(chapter, title, lead) + body + tail, opt); };

  const fields = list => `<div class="b7-fields">${list.map(([k, label, ph]) => `<label><span>${esc(label)}</span><input type="text" inputmode="decimal" data-k="${k}" placeholder="${esc(ph || "")}" autocomplete="off"></label>`).join("")}</div>`;
  // cols: [key,label,ro?,text?]; rows: number of blank rows, or array of fixed row labels
  const table = (cols, rows, {del = true, label = ""} = {}) => {
    const labels = Array.isArray(rows) ? rows : Array.from({length: rows}, () => null);
    const cells = cols.map(([k, l, ro, text]) => ro ? `<td data-ro="${k}"></td>` : `<td><input type="text" inputmode="${text ? "text" : "decimal"}" data-c="${k}" aria-label="${esc(l)}" autocomplete="off"></td>`).join("");
    return `<div class="b7-scroll"><table class="b7-table"><thead><tr>${label ? `<th>${esc(label)}</th>` : ""}${cols.map(c => `<th>${esc(c[1])}</th>`).join("")}${del ? "<th></th>" : ""}</tr></thead><tbody data-rows>${labels.map(l => `<tr>${label ? `<td data-label>${esc(l || "")}</td>` : ""}${cells}${del ? `<td><button type="button" class="b7-del" data-del aria-label="حذف ردیف">×</button></td>` : ""}</tr>`).join("")}</tbody></table></div>`;
  };
  const actions = ({add = true, csv = false} = {}) => `<div class="b7-actions b7-noprint">${add ? `<button type="button" data-add>+ ردیف تازه</button>` : ""}<button type="button" class="primary" data-sample>نمونهٔ ساندویچی رفیق</button><button type="button" data-clear>پاک کردن</button>${csv ? `<button type="button" data-csv>خروجی CSV برای اکسل</button>` : ""}<button type="button" data-print>چاپ</button></div>`;
  const tool = (name, inner) => `<div class="b7-box" data-b7-tool="${name}">${inner}<div class="b7-result" data-o="res" role="status" aria-live="polite"></div></div>`;
  const dl = items => `<div class="b7-dl">${items.map(([href, t, d]) => `<a href="${link(href)}" download><b>${esc(t)}</b>${esc(d)}</a>`).join("")}</div>`;
  const DAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

  page("2", "فصل ۲", "دفتر دخل روزانه و جمع هفتگی", "دفتر دخل رستوران کوچک: فروش نقد، کارت و اپلیکیشن، خرج نقدی، برداشت صاحب و اختلاف صندوق را هر شب ثبت کن؛ جمع هفته، میانگین هر سفارش و مقایسه با سفارش سربه‌سر خودکار حساب می‌شود. فایل اکسل ماهانه هم دارد.",
    "هر شب ۱۰ دقیقه: یک سطر. اگر وقت نداری فقط نقد، کارت و اپ را بنویس. شنبه صبح جمع هفته را این‌جا ببین و عددهایش را در سود و زیان ماهانه بگذار.",
    section("ابزار", "دفتر دخل این هفته", tool("ledger", `${fields([["be", "سفارش سربه‌سر روزانه (از فصل ۱۰)", "۷۲"]])}<p class="muted" style="margin-top:.8rem">مبلغ‌ها به هزار تومان (مثلاً ۹٬۴۰۰ یعنی ۹ میلیون و ۴۰۰ هزار). فروش اپ را ناخالص و از پنل اپلیکیشن بنویس، نه مبلغ واریزی. اختلاف صندوق را با علامت منفی بنویس اگر کم آمده.</p>${table([["orders", "سفارش"], ["cash", "نقد"], ["card", "کارت"], ["app", "اپ"], ["ex", "خرج نقدی"], ["w", "برداشت صاحب"], ["diff", "اختلاف صندوق"], ["sales", "فروش روز", true]], DAYS, {del: false, label: "روز"})}${actions({add: false, csv: true})}`))
    + section("فایل", "دفتر دخل ماهانه در اکسل", `<p class="rich">فایل اکسل یک ماه کامل (۳۱ سطر)، با جمع هفتگی و ماهانه، میانگین هر سفارش، سهم هر کانال فروش و نمودار فروش روزانه. فرمول‌ها آماده‌اند؛ فقط عدد بنویس.</p>${dl([["assets/b7/dakhl-daftar-dakhl.xlsx", "دفتر دخل ماهانه (اکسل)", "۳۱ روز، جمع هفتگی، نمودار فروش"], ["assets/b7/dakhl-forms.pdf", "فرم‌های چاپی کتاب (PDF)", "هفت فرم پیوست کتاب، هر کدام یک صفحه"]])}`)
    + section("یادآوری", "سه قانون دفتر دخل", `<ol class="b7-list"><li><b>هر شب، حتی اگر خسته‌ای.</b> یک شب جاافتاده یعنی فردا از حافظه می‌نویسی.</li><li><b>هر خرجی رسید دارد.</b> رسیدها را در یک پاکت روزانه بینداز.</li><li><b>هفته‌ای یک بار جمع بزن.</b> همین جمع هفتگی، مادهٔ خام سود و زیان ماهانه است.</li></ol><p class="rich">جیب رستوران را از جیب خودت جدا کن: یک حساب بانکی فقط برای رستوران و یک حقوق ثابت برای خودت. ستون «برداشت صاحب» باید به صفر برسد.</p>`));

  page("4", "فصل ۴", "بازبینی ماهانهٔ قیمت و قانون آستانه", "ابزار بازبینی قیمت منو در تورم: تغییر قیمت مواد اولیه را ببین، فودکاست هر غذا را با هدفش مقایسه کن و غذاهایی را که از آستانهٔ ۳ واحد رد شده‌اند، همراه قیمت پیشنهادی پیدا کن.",
    "اولین شنبهٔ هر ماه: قیمت روز اقلام اصلی خرید را وارد کن، بعد هزینهٔ تازهٔ هر غذا را با قیمت فروش و فودکاست هدفش بسنج.",
    section("گام ۱", "تغییر قیمت مواد این ماه", tool("prices", `${table([["name", "قلم و واحد", false, true], ["old", "قیمت ماه قبل"], ["now", "قیمت امروز"], ["ch", "تغییر", true]], 5)}${actions({csv: true})}`))
    + section("گام ۲", "کدام غذا از آستانه رد شده؟", tool("items", `${fields([["gap", "آستانه (واحد درصد بالاتر از هدف)", "۳"]])}${table([["name", "غذا", false, true], ["cost", "قیمت تمام‌شدهٔ مواد"], ["price", "قیمت فروش"], ["target", "فودکاست هدف ٪"], ["fc", "فودکاست", true], ["gp", "سود ناخالص", true], ["st", "وضعیت", true], ["np", "قیمت برای رسیدن به هدف", true]], 4)}${actions({csv: true})}`))
    + section("راهنما", "چهار راه، نه یک راه", `<ol class="b7-list"><li><b>گران‌کردن:</b> کم و منظم، گرد، و منو و اپ در همان روز.</li><li><b>تنظیم جزء فرعی:</b> مثلاً سیب‌زمینی کنار؛ مادهٔ اصلی را پنهانی کوچک نکن.</li><li><b>عوض کردن ماده یا تأمین‌کننده</b> با کیفیت یکسان.</li><li><b>طراحی دوباره:</b> کومبو، نسخهٔ دوبل یا ترکیب تازه.</li></ol><p class="rich">قیمت تمام‌شدهٔ هر غذا را با <a class="textlink" href="${link("tools/pricing/")}">ماشین‌حساب قیمت‌گذاری</a> یا <a class="textlink" href="${link("b5/3/")}">کارت رسپی کتاب «منوی سودده»</a> بساز.</p>`));

  page("5", "فصل ۵", "حد موجودی و لیست خرید", "ابزار حد موجودی رستوران: با مصرف روزانه، فاصلهٔ دو خرید، ذخیرهٔ احتیاط و موجودی فعلی، مقدار سفارش هر قلم را حساب کن تا نه کم بیاوری و نه زیادی بخری.",
    "برای هر قلم اصلی یک حد موجودی بگذار. صبح روز خرید، موجودی را بشمار و فقط به اندازهٔ ستون «سفارش امروز» بخر. این برگه را می‌شود به کمک‌آشپز هم سپرد.",
    section("ابزار", "حد موجودی من", tool("par", `<div class="b7-formula">حد موجودی = مصرف روزانه × روزهای بین دو خرید + ذخیرهٔ احتیاط · سفارش = حد موجودی − موجودی فعلی</div>${table([["name", "قلم و واحد", false, true], ["use", "مصرف روزانه"], ["days", "روز بین دو خرید"], ["safe", "ذخیرهٔ احتیاط"], ["have", "موجودی فعلی"], ["par", "حد موجودی", true], ["buy", "سفارش امروز", true]], 5)}${actions({csv: true})}`))
    + section("یادآوری", "قبل از خرید عمده، سه سؤال", `<ol class="b7-list"><li>جا دارم؟</li><li>خراب نمی‌شود؟ (عمده فقط برای کالای خشک و بادوام)</li><li>پولش را از کجا می‌آورم؟ پولی که در انبار خوابید، برای اجارهٔ اول ماه نیست.</li></ol><p class="rich">برای ۱۰ قلم گران‌تر، هر ماه از یک تأمین‌کنندهٔ دوم هم قیمت بگیر، و نسیه‌ها را در دفتر دخل با یک روز ثابت تسویه ثبت کن.</p>`));

  page("6", "فصل ۶", "شمارش انبار هفتگی و کسری انبار", "ماشین‌حساب کسری انبار رستوران: مصرف واقعی یک ماده را با مصرفی که طبق فروش باید می‌شد مقایسه کن و درصد و ارزش کسری را ببین؛ همراه فرم شمارش هفتگی ۲۰ قلم برای چاپ.",
    "فقط ۲۰ قلم پرهزینه را هر هفته، در زمان و ترتیب و واحد ثابت بشمار. بعد گران‌ترین مادهٔ اصلی را در این ابزار بگذار. تا ۳ درصد طبیعی است.",
    section("ابزار", "کسری مادهٔ اصلی", tool("shortage", `<div class="b7-formula">مصرف شد = موجودی اول + خرید − موجودی آخر · مصرف باید = تعداد فروش × مقدار در هر پرس</div>${fields([["open", "موجودی اول دوره", "۱۸"], ["buy", "خرید دوره", "۵۶"], ["close", "موجودی آخر دوره", "۲۱"], ["sold", "تعداد فروش غذاهای این ماده", "۳۱۵"], ["per", "مقدار در هر پرس (همان واحد)", "۰٫۱۵"], ["unit", "قیمت هر واحد (تومان، اختیاری)", "۹۰۰۰۰۰"]])}${actions({add: false})}`))
    + section("فرم چاپی", "شمارش انبار هفتگی", `<p class="muted b7-noprint">فهرست را به ترتیب قرارگیری در انبار و یخچال بنویس؛ یک نفر بشمارد و بلند بگوید، دیگری بنویسد.</p><table class="b7-print-table"><thead><tr><th>#</th><th>قلم</th><th>واحد</th><th>موجودی</th><th>قیمت واحد</th><th>ارزش</th></tr></thead><tbody>${Array.from({length: 20}, (_, i) => `<tr><td>${i + 1}</td><td></td><td></td><td></td><td></td><td></td></tr>`).join("")}</tbody></table><p class="b7-noprint"><button class="b7-btn" type="button" data-print>چاپ این فرم</button></p>`)
    + section("یادآوری", "اول ورود، اول خروج", `<p class="rich">جنس تازه پشت یا زیر جنس قدیمی، و روی هر ظرف برچسب: چه چیزی و چه روزی. کسری بالا را با سیستم حل کن (ترازو، قالب پرس، برچسب)، نه با پیدا کردن مقصر.</p>`));

  page("9", "فصل ۹", "سود هر سفارش دلیوری", "ماشین‌حساب سود دلیوری رستوران: با قیمت در اپلیکیشن، هزینهٔ مواد، بسته‌بندی و درصد کمیسیون ببین از هر سفارش دلیوری چقدر می‌ماند، با همان غذا در سالن مقایسه کن و قیمت منصفانهٔ منوی دلیوری را پیدا کن.",
    "عدد واقعی کمیسیون را از گزارش تسویهٔ اپ دربیاور (فروش ناخالص منهای واریزی، تقسیم بر فروش ناخالص)، نه فقط از قرارداد.",
    section("ابزار", "یک غذا، دو حساب", tool("delivery", `${fields([["price", "قیمت در اپ (تومان)", "۴۸۰۰۰۰"], ["salon", "قیمت همین غذا در سالن", "۴۸۰۰۰۰"], ["food", "هزینهٔ مواد هر پرس", "۲۰۳۰۰۰"], ["pack", "بسته‌بندی دلیوری", "۱۸۰۰۰"], ["comm", "کمیسیون و هزینه‌های اپ ٪", "۲۵"], ["ratio", "هدف: چند درصدِ ماندهٔ سالن؟", "۶۰"]])}${actions({add: false})}`))
    + section("یادآوری", "منوی دلیوری، منوی جدا", `<ul class="b7-list"><li>غذای دلیوری کارت هزینهٔ جدا لازم دارد: جعبه، کیسه، ظرف سس و دستمال.</li><li>قیمت منوی اپ معمولاً کمی بالاتر از سالن است؛ مشتری برای آوردن غذا تا در خانه پول می‌دهد.</li><li>اگر ماندهٔ دلیوری خیلی کم است، اول منوی دلیوری را کوتاه کن و غذاهای پرسود را جلو بیاور.</li></ul><p class="rich">ابزارهای مرتبط: <a class="textlink" href="${link("b5/10/")}">حداقل قیمت آنلاین (منوی سودده)</a> · <a class="textlink" href="${link("tools/discount/")}">اثر تخفیف و کارمزد دلیوری</a></p>`));

  page("10", "فصل ۱۰", "سود و زیان ماهانه و نقطهٔ سربه‌سر", "ماشین‌حساب سود و زیان یک‌صفحه‌ای رستوران و نقطهٔ سربه‌سر: دوازده خط هزینه را وارد کن تا سود عملیاتی، ماندهٔ آزاد، سه نسبت طلایی، فروش سربه‌سر و تعداد سفارش سربه‌سر در روز را ببینی.",
    "همهٔ مبلغ‌ها را با یک واحد بنویس (مثلاً میلیون تومان). میانگین هر سفارش را هم با همان واحد بنویس؛ مثلاً ۴۶۵ هزار تومان می‌شود ۰٫۴۶۵.",
    section("ابزار", "سود و زیان ماه من", tool("pnl", `<h3>فروش و هزینه‌های جاری</h3>${fields([["sales", "۱. فروش ماه"], ["food", "۲. مواد و بسته‌بندی (مصرف واقعی)"], ["labor", "۳. نیرو، بدون حقوق صاحب"], ["rent", "۴. اجاره و شارژ"], ["comm", "۵. کمیسیون اپلیکیشن‌ها"], ["util", "۶. قبض‌ها"], ["pos", "۷. کارمزد کارت‌خوان و بانک"], ["maint", "۸. تعمیر و نگهداری"], ["mkt", "۹. تبلیغات"], ["misc", "۱۰. متفرقه"]])}<h3 style="margin-top:1rem">زیر خط</h3>${fields([["owner", "حقوق ثابت صاحب"], ["loan", "قسط‌ها"], ["taxres", "ذخیرهٔ مالیات (متغیر)"], ["fixres", "ذخیرهٔ عیدی، سنوات و تعویض"]])}<h3 style="margin-top:1rem">برای سفارش سربه‌سر</h3>${fields([["days", "روزهای کاری ماه", "۲۸"], ["ticket", "میانگین هر سفارش (همان واحد)", "۰٫۴۶۵"]])}${actions({add: false})}`))
    + section("راهنما", "از کجا هر خط را بیاورم؟", `<ul class="b7-list"><li><b>فروش:</b> جمع دفتر دخل ماه (<a class="textlink" href="${link("b7/2/")}">دفتر دخل</a>).</li><li><b>مواد:</b> موجودی اول ماه + خرید ماه − موجودی آخر ماه (<a class="textlink" href="${link("b7/6/")}">شمارش انبار</a>).</li><li><b>کمیسیون:</b> فروش ناخالص اپ منهای واریزی.</li><li><b>هزینهٔ ثابت</b> با فروش کم و زیاد نمی‌شود؛ <b>هزینهٔ متغیر</b> درصدی از فروش است.</li></ul><div class="b7-formula">فروش سربه‌سر = هزینهٔ ثابت ÷ (۱ − درصد هزینه‌های متغیر)</div><p class="rich">نسخهٔ ساده‌تر: <a class="textlink" href="${link("tools/breakeven/")}">ماشین‌حساب نقطهٔ سربه‌سر</a>. مقالهٔ دانشنامه: <a class="textlink" href="${link("guides/restaurant-profit/")}">سود رستوران چگونه محاسبه می‌شود؟</a></p>`));

  page("11", "فصل ۱۱", "تقویم پرداخت ۹۰ روزه", "تقویم پرداخت ۱۳ هفته‌ای رستوران: ورودی و خروجی هر هفته (تأمین‌کننده، اجاره و قسط، حقوق، چک) را بنویس تا هفته‌های منفی را از قبل ببینی و صندوق احتیاط را برنامه‌ریزی کنی. نسخهٔ اکسل هم دارد.",
    "ماه خوب هم می‌تواند هفتهٔ منفی داشته باشد. هر هفته یک ستون تازه پر کن و ستون گذشته را با عدد واقعی جایگزین کن.",
    section("ابزار", "سیزده هفتهٔ آینده", tool("cash", `${fields([["start", "مانده اول دوره"], ["target", "هدف صندوق احتیاط (یک ماه هزینهٔ ثابت)"]])}<p class="muted" style="margin-top:.8rem">همهٔ مبلغ‌ها با یک واحد (مثلاً میلیون تومان). خروجی‌ها را مثبت بنویس.</p>${table([["in", "ورودی"], ["sup", "تأمین‌کننده"], ["fix", "اجاره و قسط"], ["pay", "حقوق"], ["chq", "چک‌ها"], ["oth", "بقیه و ذخیره‌ها"], ["net", "خالص", true], ["bal", "مانده", true]], Array.from({length: 13}, (_, i) => `هفتهٔ ${i + 1}`), {del: false, label: "هفته"})}${actions({add: false, csv: true})}`))
    + section("فایل", "تقویم پرداخت در اکسل", dl([["assets/b7/dakhl-taghvim-pardakht.xlsx", "تقویم پرداخت ۹۰ روزه (اکسل)", "۱۳ هفته، ماندهٔ خودکار، هشدار هفتهٔ منفی"]]))
    + section("یادآوری", "چه چیزهایی در تقویم بیاید", `<ul class="b7-list"><li>پرداخت‌های ثابت با تاریخ: اجاره، قسط، حقوق، بیمه</li><li>چک‌هایی که کشیده‌ای، با تاریخ و مبلغ</li><li>پرداخت‌های سالانه و فصلی: مالیات، عوارض، تمدید پروانه، عیدی</li><li>ورودی‌های قابل انتظار: فروش متوسط هفته و تاریخ واریز اپ‌ها</li></ul>`));

  page("12", "فصل ۱۲", "داشبورد هفت‌عددی هفتگی", "داشبورد هفتگی رستوران کوچک: هفت عدد هشدار (سفارش در برابر سربه‌سر، فودکاست واقعی، کسری انبار، ضایعات، هزینهٔ نیرو، سود دلیوری و صندوق احتیاط) با محدودهٔ هدف و وضعیت؛ نسخهٔ اکسل و قابل چاپ.",
    "تا وقتی همه در محدوده‌اند، کاری نکن. یک هفته بیرون، علتش را پیدا کن. دو هفته پشت سر هم، تصمیم بگیر.",
    section("ابزار", "داشبورد این هفته", tool("dash", `<div class="b7-scroll"><table class="b7-table"><thead><tr><th>عدد</th><th>هدف</th><th>این هفته</th><th>وضعیت</th></tr></thead><tbody>${[
      ["۱. سفارش روزانه در برابر سربه‌سر", "be", "سربه‌سر", "ord"], ["۲. فودکاست واقعی ٪", "fcT", "حداکثر", "fc"], ["۳. کسری انبار مادهٔ اصلی ٪", null, "۳٪", "sh"],
      ["۴. ضایعات هفته (تومان)", "waT", "حداکثر", "wa"], ["۵. هزینهٔ نیرو ٪ فروش", "labT", "حداکثر", "lab"], ["۶. ماندهٔ دلیوری ٪ ماندهٔ سالن", null, "۶۰٪", "del"], ["۷. صندوق احتیاط (ماه هزینهٔ ثابت)", "resT", "هدف", "res"]
    ].map(([t, tk, ph, k]) => `<tr><td data-label>${esc(t)}</td><td>${tk ? `<input type="text" inputmode="decimal" data-k="${tk}" aria-label="هدف ${esc(t)}" placeholder="${esc(ph)}">` : esc(ph)}</td><td><input type="text" inputmode="decimal" data-k="${k}" aria-label="${esc(t)}"></td><td><span data-o="s-${k}"></span></td></tr>`).join("")}</tbody></table></div>${actions({add: false})}`))
    + section("فایل", "داشبورد در اکسل", dl([["assets/b7/dakhl-dashboard.xlsx", "داشبورد هفت‌عددی (اکسل)", "۱۳ هفته، محدودهٔ هدف، رنگ وضعیت"], ["assets/b7/dakhl-forms.pdf", "فرم‌های چاپی کتاب (PDF)", "داشبورد پیوست ۷ و شش فرم دیگر"]]))
    + section("یادآوری", "تصمیم‌هایی که با عدد گرفته می‌شوند", `<ul class="b7-list"><li><b>حذف غذا:</b> کم‌فروش و کم‌سود؛ روش کامل در <a class="textlink" href="${link("b5/4/")}">ماتریس منو</a>.</li><li><b>ساعت کار:</b> ساعتی که فروشش هزینهٔ نیرو و برق همان ساعت را نمی‌پوشاند.</li><li><b>رشد دلیوری:</b> فقط وقتی ماندهٔ هر سفارش دلیوری به سالن نزدیک است.</li><li><b>شعبهٔ دوم:</b> نه پیش از شش ماه ماندهٔ آزاد مثبت، صندوق احتیاط پر و سیستمی که بدون تو کار کند.</li></ul>`));

  const hub = `<section class="pagehead wrap b7-hero">${crumbs([["دخل", null]])}<p class="eyebrow">کتابخانهٔ نیما داینر · کتاب «دخل»</p><h1>ابزارهای کتاب «دخل»؛ حساب‌وکتاب رستوران کوچک، روزی ۱۰ دقیقه</h1><p class="lead">ماشین‌حساب‌ها، فایل‌های اکسل و فرم‌های چاپی همراه کتاب «دخل»: دفتر دخل، قیمت در تورم، حد موجودی، کسری انبار، سود دلیوری، سود و زیان و سربه‌سر، تقویم پرداخت و داشبورد هفتگی. هر QR کتاب به یکی از این صفحه‌ها می‌رسد. استفاده رایگان است، حتی اگر کتاب را نخوانده باشی.</p></section>`
    + section("ابزارها و صفحه‌ها", "از کجا شروع کنم؟", `<div class="cards three">${pages.map(p => `<article class="card"><span class="kicker">${esc(p.chapter)}</span><h3><a href="${link(`b7/${p.slug}/`)}">${esc(p.title)}</a></h3><p>${esc(p.description)}</p></article>`).join("")}</div>`)
    + section("دانلود", "فایل‌های اکسل و فرم‌های چاپی", dl([["assets/b7/dakhl-daftar-dakhl.xlsx", "دفتر دخل ماهانه", "اکسل، ۳۱ روز با نمودار"], ["assets/b7/dakhl-taghvim-pardakht.xlsx", "تقویم پرداخت ۹۰ روزه", "اکسل، ۱۳ هفته"], ["assets/b7/dakhl-dashboard.xlsx", "داشبورد هفت‌عددی", "اکسل، ۱۳ هفته"], ["assets/b7/dakhl-forms.pdf", "هفت فرم چاپی کتاب", "PDF، قطع A5"]]))
    + section("ابزارهای دیگر", "ماشین‌حساب‌های تک‌کارهٔ سایت", `<p class="rich"><a class="textlink" href="${link("tools/foodcost/")}">فودکاست</a> · <a class="textlink" href="${link("tools/pricing/")}">قیمت‌گذاری غذا</a> · <a class="textlink" href="${link("tools/waste/")}">بازده و ضایعات مواد</a> · <a class="textlink" href="${link("tools/breakeven/")}">نقطهٔ سربه‌سر</a> · <a class="textlink" href="${link("tools/labor/")}">سهم هزینهٔ کارکنان</a> · <a class="textlink" href="${link("tools/startup-runway/")}">دوام سرمایه در گردش</a></p><p class="rich">برای خواندن بیشتر در دانشنامه: <a class="textlink" href="${link("guides/restaurant-cost-control/")}">کنترل هزینهٔ رستوران</a> · <a class="textlink" href="${link("guides/restaurant-accounting/")}">حسابداری رستوران</a> · <a class="textlink" href="${link("guides/food-waste/")}">کاهش ضایعات</a> · <a class="textlink" href="${link("guides/delivery-economics/")}">اقتصاد دلیوری</a></p>`)
    + tail;
  add("b7/", "ابزارهای کتاب دخل؛ حساب‌وکتاب رستوران کوچک", "ابزارهای رایگان حساب‌وکتاب رستوران کوچک همراه کتاب «دخل»: دفتر دخل روزانه، قیمت‌گذاری در تورم، حد موجودی، کسری انبار، سود دلیوری، سود و زیان و نقطهٔ سربه‌سر، تقویم پرداخت و داشبورد هفتگی؛ با فایل اکسل.", hub);
}
