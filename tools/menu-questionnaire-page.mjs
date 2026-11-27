// Intake questionnaire for the "build a menu from scratch" service (owner request, 27 Nov 2026).
// New page only: /services/menu-questionnaire/. Answers stay in the visitor's browser; nothing is sent automatically.
const sections = [
  {id: "brand", title: "۱. مفهوم و هویت برند", fields: [
    ["نام برند (اگر انتخاب شده)"],
    ["نام و شمارهٔ تماس صاحب کسب‌وکار"],
    ["تاریخ تقریبی افتتاح"],
    ["تمرکز اصلی: همبرگر، ساندویچ سرد، ساندویچ گرم، یا همه؟"],
    ["سبک کار: اسمشی، کلاسیک آمریکایی، گورمه، اقتصادی، ساندویچی ایرانی (الویه، کالباس، هات‌داگ)، یا ترکیبی؟", true],
    ["مشتری باید شما را با چه چیزی به یاد بیاورد؟ (یک جمله)"],
    ["برندی که دوست دارید شبیهش باشید، داخلی یا خارجی"],
    ["برندی که نمی‌خواهید شبیهش باشید"],
    ["مالک یا شریک سابقهٔ کار در آشپزخانه یا رستوران دارد؟ چقدر؟"]
  ]},
  {id: "customer", title: "۲. مشتری هدف، قیمت و مدل فروش", fields: [
    ["مشتری اصلی چه کسانی هستند؟ (دانشجو، کارمند، خانواده، نوجوان، غیره)"],
    ["موقعیت اصلی خرید: ناهار سریع، شام خانوادگی، دورهمی دوستانه، آخر شب؟"],
    ["قیمت حدودی یک همبرگر اصلی در ذهنتان (تومان)"],
    ["میانگین فاکتور هدف برای هر نفر (تومان)"],
    ["سهم تقریبی فروش: سالن / بیرون‌بر / دلیوری (درصد)"],
    ["از کدام اپ‌ها سفارش می‌گیرید؟ (اسنپ‌فود، دیگر)"],
    ["پیک خودتان دارید یا فقط اپ؟"],
    ["تعداد صندلی سالن (اگر دارد)"],
    ["ساعت کاری و روزهای باز"],
    ["پیش‌بینی شما از تعداد سفارش در روز، در ماه‌های اول"]
  ]},
  {id: "location", title: "۳. موقعیت و رقبا", fields: [
    ["شهر، محله و نشانی دقیق"],
    ["اطراف مغازه چه چیزی هست؟ (دانشگاه، اداره، مدرسه، مسکونی، مرکز خرید)"],
    ["پارکینگ یا جای توقف پیک دارد؟"]
  ], competitors: true},
  {id: "kitchen", title: "۴. آشپزخانه، تجهیزات و پرسنل", checks: {label: "کدام تجهیزات را دارید یا قطعاً می‌خرید؟", items: [
    "گریل صاف (فلت‌تاپ)", "گریل زغالی یا شعله‌ای", "سرخ‌کن", "ساندویچ‌ساز یا پنینی‌پرس", "گرم‌کن نان",
    "یخچال زیرکانتری و فریزر", "چرخ گوشت برای پتی‌سازی", "فر یا مایکروویو", "دستگاه نوشیدنی (شیک، اسپرسو، نوشابه بشکه‌ای)"
  ]}, fields: [
    ["متراژ تقریبی آشپزخانه"],
    ["تجهیزات دیگری که دارید یا می‌خواهید (تعداد مخزن سرخ‌کن را هم بنویسید)", true],
    ["تعداد نیروی آشپزخانه در هر شیفت"],
    ["سرآشپز باتجربهٔ فست‌فود دارید یا نیروی تازه‌کار؟"],
    ["حداکثر زمان قابل قبول آماده‌سازی هر سفارش در ساعت شلوغی (دقیقه)"],
    ["پتی و سس را خودتان می‌سازید یا آماده می‌خرید؟"]
  ]},
  {id: "supply", title: "۵. تأمین مواد اولیه و بودجه", fields: [
    ["گوشت را از کجا می‌خرید؟ قیمت فعلی هر کیلو (تومان)"],
    ["نان همبرگر و ساندویچ: نانوایی طرف قرارداد دارید؟ قیمت هر عدد"],
    ["مرغ، سوسیس و کالباس: برند و تأمین‌کننده"],
    ["پنیر، سس و سیب‌زمینی آماده: برند و تأمین‌کننده"],
    ["ماده‌ای که پیدا کردنش سخت یا قیمتش پرنوسان است"],
    ["بسته‌بندی بیرون‌بر: نوع و قیمت جعبه، کاغذ و ساک"],
    ["بودجهٔ باقی‌مانده برای تجهیزات (تومان)"],
    ["بودجهٔ خرید اولیهٔ مواد (تومان)"],
    ["اجارهٔ ماهانهٔ مغازه (تومان)"],
    ["حقوق ماهانهٔ کل پرسنل (تومان، تقریبی)"]
  ], note: "اجاره و حقوق برای تعیین حداقل قیمت و تعداد فروش لازم برای سوددهی استفاده می‌شود."},
  {id: "taste", title: "۶. سلیقه و محدودیت‌ها", fields: [
    ["آیتم‌هایی که حتماً می‌خواهید در منو باشند", true],
    ["آیتم‌هایی که نمی‌خواهید باشند"],
    ["آیتم امضایی: غذایی که می‌خواهید فقط مال شما باشد (اگر ایده‌ای دارید)", true],
    ["سس مخصوص خودتان را می‌خواهید؟"],
    ["منوی گیاهی یا بدون گوشت لازم است؟"],
    ["منوی کودک می‌خواهید؟"],
    ["کناری‌ها: سیب‌زمینی، پیاز سوخاری، سالاد، غیره"],
    ["نوشیدنی: فقط بسته‌بندی یا شیک و نوشیدنی ساخت خودتان؟"],
    ["منوی کمبو یا ست گروهی می‌خواهید؟"],
    ["موضوع دیگری که باید بدانم", true]
  ]}
];

const attachments = [
  "لوگو و رنگ‌های برند (اگر آماده است)",
  "عکس فضای مغازه و آشپزخانه",
  "اسکرین‌شات منوی رقبا در اسنپ‌فود",
  "دستور پخت یا فهرست مواد هر آیتمی که تست کرده‌اید",
  "فاکتور یا لیست قیمت تأمین‌کننده‌ها"
];

const style = `<style>
.mq-form{max-width:880px}
.mq-section{border:1px solid var(--line,#e6e1d6);border-radius:16px;padding:20px 22px;margin:0 0 22px;background:var(--paper,#fff)}
.mq-section h2{margin:0 0 14px;font-size:1.25rem}
.mq-field{display:block;margin:0 0 14px}
.mq-field span{display:block;font-weight:600;margin-bottom:6px;line-height:1.7}
.mq-field input,.mq-field textarea{width:100%;box-sizing:border-box;font:inherit;padding:10px 12px;border:1px solid var(--line,#d8d2c4);border-radius:10px;background:#fff}
.mq-field textarea{min-height:76px;resize:vertical}
.mq-checks{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px 16px;margin:0 0 16px;padding:0;border:0}
.mq-checks legend{font-weight:600;margin-bottom:8px}
.mq-checks label{display:flex;gap:8px;align-items:center}
.mq-table{width:100%;border-collapse:collapse;margin:6px 0 10px}
.mq-table th,.mq-table td{border:1px solid var(--line,#e6e1d6);padding:6px;text-align:right;font-size:.92rem}
.mq-table input{width:100%;box-sizing:border-box;font:inherit;padding:6px;border:0;background:transparent}
.mq-scroll{overflow-x:auto}
.mq-actions{position:sticky;bottom:0;background:var(--bg,#fffaf0);padding:14px 0;display:flex;flex-wrap:wrap;gap:10px;border-top:1px solid var(--line,#e6e1d6)}
.mq-status{min-height:1.5em;font-size:.95rem}
@media print{.topbar,.footer,.mq-actions,.breadcrumbs,.mq-noprint{display:none!important}.mq-section{break-inside:avoid;border-color:#999}}
</style>`;

export function renderMenuQuestionnaire({add, crumbs, esc}) {
  const contact = "https://t.me/nimaafsharnaderi";
  let n = 0;
  const field = ([label, long]) => {
    const id = `mq-${++n}`;
    const input = long
      ? `<textarea id="${id}" name="${id}" data-label="${esc(label)}"></textarea>`
      : `<input id="${id}" name="${id}" type="text" data-label="${esc(label)}">`;
    return `<label class="mq-field" for="${id}"><span>${esc(label)}</span>${input}</label>`;
  };
  const checks = (group, prefix) => `<fieldset class="mq-checks" data-group="${esc(group.label)}"><legend>${esc(group.label)}</legend>${group.items.map((item, i) => `<label><input type="checkbox" name="${prefix}-${i}" value="${esc(item)}"> ${esc(item)}</label>`).join("")}</fieldset>`;
  const cols = ["نام رقیب", "فاصله از شما", "قیمت همبرگر اصلی (تومان)", "چه چیزش خوب است؟", "چه چیزش ضعیف است؟"];
  const competitors = `<p><strong>سه تا پنج رقیب نزدیک یا هم‌سبک شما:</strong></p><div class="mq-scroll"><table class="mq-table" data-table="رقبا"><thead><tr>${cols.map(c => `<th scope="col">${esc(c)}</th>`).join("")}</tr></thead><tbody>${[1, 2, 3, 4, 5].map(r => `<tr>${cols.map((c, ci) => `<td><input name="comp-${r}-${ci}" aria-label="${esc(c)} — رقیب ${r}" data-col="${esc(c)}"></td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const body = sections.map(s => `<section class="mq-section" id="mq-${s.id}" data-title="${esc(s.title)}"><h2>${esc(s.title)}</h2>${s.checks ? checks(s.checks, s.id) : ""}${s.fields.map(field).join("")}${s.competitors ? competitors : ""}${s.note ? `<p class="muted">${esc(s.note)}</p>` : ""}</section>`).join("");
  const attach = `<section class="mq-section" id="mq-attach" data-title="۷. مدارک پیوست"><h2>۷. مدارک پیوست</h2>${checks({label: "کدام مدارک را جداگانه در تلگرام می‌فرستید؟", items: attachments}, "attach")}</section>`;

  const content = `<section class="pagehead wrap">${crumbs([["خدمات", "services/"], ["پرسشنامهٔ ساخت منو", null]])}
    <p class="eyebrow">ساخت منو از صفر · فست‌فود</p>
    <h1>پرسشنامهٔ ساخت منوی فست‌فود ساندویچ و همبرگر</h1>
    <p class="lead">این پرسشنامه پایهٔ ساختن منوی شماست. هرچه پاسخ‌ها دقیق‌تر باشد، انتخاب آیتم‌ها، هزینه‌یابی، قیمت‌گذاری و چیدمان منو هم دقیق‌تر می‌شود.</p>
    <ul class="mq-noprint">
      <li><strong>زمان لازم:</strong> حدود ۳۰ تا ۶۰ دقیقه.</li>
      <li><strong>اگر عددی را دقیق نمی‌دانید:</strong> تخمین بزنید و کنارش بنویسید «تخمینی». خالی گذاشتن بدتر از تخمین است.</li>
      <li><strong>اگر هنوز دربارهٔ چیزی تصمیم نگرفته‌اید:</strong> بنویسید «هنوز معلوم نیست». تصمیم‌های باقی‌مانده بخشی از همین کار است.</li>
      <li><strong>حریم خصوصی:</strong> پاسخ‌ها فقط در مرورگر خودتان نگه داشته می‌شوند و خودکار برای کسی ارسال نمی‌شوند. در پایان، متن پاسخ‌ها را کپی کنید و در تلگرام بفرستید. روی دستگاه مشترک، بعد از ارسال دکمهٔ «پاک کردن» را بزنید.</li>
    </ul>
  </section>
  <div class="wrap"><form class="mq-form" id="menu-questionnaire" novalidate>${body}${attach}
    <div class="mq-actions">
      <button type="button" class="button button-dark" data-mq="copy">کپی متن پاسخ‌ها</button>
      <a class="button button-outline" href="${contact}" target="_blank" rel="noopener noreferrer">ارسال در تلگرام ←</a>
      <button type="button" class="button button-outline" data-mq="print">چاپ یا ذخیرهٔ PDF</button>
      <button type="button" class="button button-outline" data-mq="clear">پاک کردن</button>
      <p class="mq-status" role="status" aria-live="polite"></p>
    </div>
  </form>
  <p class="muted">بعد از دریافت پرسشنامه، زمان تحویل و هزینهٔ نهایی خدمت اعلام می‌شود. ارسال پرسشنامه به معنی سفارش قطعی یا پرداخت نیست.</p></div>`;

  add("services/menu-questionnaire/",
    "پرسشنامهٔ ساخت منوی فست‌فود ساندویچ و همبرگر",
    "پرسشنامهٔ آنلاین خدمت ساخت منو از صفر نیما داینر برای فست‌فودهای تازه‌کار: برند، مشتری، رقبا، تجهیزات، تأمین، بودجه و سلیقهٔ منو.",
    content,
    {head: style, script: "assets/menu-questionnaire.js", keywords: "پرسشنامه ساخت منو فست فود منوی همبرگر ساندویچی طراحی منو"});
}
