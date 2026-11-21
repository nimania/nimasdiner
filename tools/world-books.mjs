import {readFileSync} from "node:fs";
const books = JSON.parse(readFileSync(new URL("../content/world-books.json",import.meta.url),"utf8")).books;
const worldReviews = JSON.parse(readFileSync(new URL("../content/world-book-reviews.json",import.meta.url),"utf8"));
const reviewsBySlug = new Map(worldReviews.reviews.map(review=>[review.slug,review]));

export function renderWorldBooks({add, section, crumbs, link, esc}) {
  const catName = {foreign:"کتاب‌های خارجی",iranian:"کتاب‌های ایرانی دیگران"};
  const groupPath = g => "books/"+g+"/";
  const onePath = b => groupPath(b.group)+b.slug+"/";
  const coverHTML = (b, kind="card") => {
    if (!b.cover) return `<div class="world-book-cover world-book-cover--unverified" role="status"><span>تصویر جلد این چاپ هنوز تأیید نشده است.</span></div>`;
    return `<figure class="world-book-cover world-book-cover--${kind}"><a href="${link(onePath(b))}" aria-label="معرفی کتاب ${esc(b.title)}"><img src="${esc(b.cover.img)}" alt="جلد کتاب ${esc(b.original)}" loading="${kind==="detail"?"eager":"lazy"}" decoding="async" width="320" height="460" referrerpolicy="no-referrer"></a>${kind==="detail"?`<figcaption><a href="${esc(b.cover.url)}" target="_blank" rel="noopener noreferrer">${esc(b.cover.credit)}</a></figcaption>`:""}</figure>`;
  };
  const itemCard = b => `<article class="card world-book-card">${coverHTML(b)}<span class="kicker">${esc(b.topic)}</span><h3><a href="${link(onePath(b))}">${esc(b.title)}</a></h3><p><strong>${esc(b.author)}</strong> · ${esc(b.publisher)}</p><p>${esc(b.description)}</p><a class="textlink" href="${link(onePath(b))}">مرور و دانلود PDF ←</a></article>`;
  const directory = `<section class="pagehead wrap">${crumbs([["کتابخانه جهان غذا",null]])}<p class="eyebrow">کتابخانه جهان غذا</p><h1>سه قفسه برای شناخت بهتر صنعت غذا</h1><p class="lead">کتاب‌های نیما داینر، آثار خارجی و کتاب‌های نویسندگان ایرانی؛ معرفی مستقل، مرور تحلیلی و مسیر دسترسی به نسخه اصلی.</p></section>`
    + section("سه بخش اصلی","از کدام قفسه شروع می‌کنی؟",`<div class="cards three"><article class="card"><span class="kicker">نوشته‌های نیما داینر</span><h3><a href="${link("library/")}">کتاب‌های نیما داینر</a></h3><p>تمام عنوان‌های تألیفی و نسخه‌های چاپی و الکترونیکی؛ همراه با نمونه‌های مجاز و روش سفارش.</p><a class="textlink" href="${link("library/")}">دیدن کتاب‌ها ←</a></article><article class="card"><span class="kicker">منتخب جهان</span><h3><a href="${link(groupPath("foreign"))}">کتاب‌های خارجی</a></h3><p>آثار شناخته‌شده درباره مدیریت رستوران، عملیات، مهمان‌نوازی و آشپزی.</p><a class="textlink" href="${link(groupPath("foreign"))}">دیدن کتاب‌ها ←</a></article><article class="card"><span class="kicker">نویسندگان ایران</span><h3><a href="${link(groupPath("iranian"))}">کتاب‌های ایرانی دیگران</a></h3><p>آشپزی، رسپی، میراث خوراک و کتاب‌های مستقل نویسندگان و ناشران ایرانی.</p><a class="textlink" href="${link(groupPath("iranian"))}">دیدن کتاب‌ها ←</a></article></div>`)
    + section("انتخاب تحریریه","کتاب‌هایی برای شروع",`<div class="cards three">${[books[0],books[2],books[5],books[6],books[7],books[9]].map(itemCard).join("")}</div>`)
    + section("معرفی اثر","کتابی می‌شناسی که در فهرست نیست؟",`<p class="rich">نویسنده، ناشر یا خواننده می‌تواند عنوان کتاب، نویسنده، ناشر، شابک در صورت وجود و نشانی معتبر معرفی یا خرید را برای بررسی ارسال کند. درج کتاب پس از ارزیابی مستقل تحریریه انجام می‌شود و هزینه‌ای برای معرفی دریافت نمی‌شود.</p><p><a class="button button-outline" href="mailto:nimania@gmail.com?subject=${encodeURIComponent("پیشنهاد کتاب برای کتابخانه جهان غذا")}">پیشنهاد کتاب با ایمیل ←</a></p>`);
  add("books/","کتابخانه جهان غذا؛ آشپزی و مدیریت رستوران","کتاب‌های نیما داینر، کتاب‌های خارجی و آثار نویسندگان ایرانی درباره خوراک، آشپزی و رستوران‌داری.",directory);
  for (const group of ["foreign","iranian"]) {
    const selected=books.filter(b=>b.group===group);
    const body=`<section class="pagehead wrap">${crumbs([["کتابخانه جهان غذا","books/"],[catName[group],null]])}<p class="eyebrow">کتابخانه جهان غذا</p><h1>${catName[group]}</h1><p class="lead">${group==="foreign"?"منتخبی از آثار مطرح درباره اقتصاد، عملیات و تجربه مهمان. عنوان‌های فارسی، ترجمه پیشنهادی نام کتاب‌اند.":"آثار نویسندگان ایرانی درباره آشپزی، میراث خوراک و فرهنگ غذایی؛ با معرفی مستقل و پیوند به شناسنامه یا فروشنده."}</p></section>`
      +section("فهرست کتاب‌ها",`${selected.length} عنوان برای شروع`,`<div class="cards three">${selected.map(itemCard).join("")}</div><p class="muted">معرفی‌های این مرحله بر اساس اطلاعات ناشر و فهرست‌های کتاب‌شناختی تهیه شده‌اند؛ ادعای مطالعه کامل همه کتاب‌ها یا بازنشر متن آن‌ها نداریم.</p>`)
      +section("برگشت به کتابخانه","قفسه‌های دیگر",`<div class="cards two"><article class="card"><h3><a href="${link("books/")}">همه بخش‌های کتابخانه جهان غذا</a></h3></article><article class="card"><h3><a href="${link("library/")}">کتاب‌های نیما داینر</a></h3></article></div>`);
    add(groupPath(group),`${catName[group]}؛ کتابخانه جهان غذا`,group==="foreign"?"معرفی و مرور فارسی کتاب‌های خارجی درباره رستوران‌داری و مهمان‌نوازی.":"معرفی کتاب‌های نویسندگان ایرانی در حوزه آشپزی، رسپی و خوراک محلی.",body);
    for(const b of selected) {
      const review=reviewsBySlug.get(b.slug);
      if(!review)throw new Error("Missing editorial review: "+b.slug);
      const reviewSections=review.sections.map(x=>`<article class="world-book-analysis-item"><h3>${esc(x.heading)}</h3><p class="rich">${esc(x.body)}</p></article>`).join("");
      const steps=review.plan.map(x=>`<li><strong>${esc(x.label)}</strong> — ${esc(x.task)}</li>`).join("");
      const refs=review.sources.map(x=>`<li><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.label)}</a></li>`).join("");
      const pdfURL=onePath(b)+"summary.pdf";
      const body=`<section class="pagehead wrap world-book-detail">${crumbs([["کتابخانه جهان غذا","books/"],[catName[group],groupPath(group)],[b.title,null]])}<div class="world-book-detail-grid"><div class="world-book-detail-art">${coverHTML(b,"detail")}</div><div><p class="eyebrow">${esc(b.topic)}</p><h1>${esc(b.title)}</h1>${b.original!==b.title?`<p class="lead" dir="${group==="foreign"?"ltr":"rtl"}">${esc(b.original)}</p>`:""}<p class="lead">${esc(b.description)}</p><div class="chips"><span class="chip">${esc(b.author)}</span><span class="chip">${esc(b.publisher)}</span></div><div class="actions"><a class="button button-dark" target="_blank" rel="noopener noreferrer" href="${esc(b.source)}">${esc(b.sourceLabel)} ←</a><a class="button button-outline" href="${link(groupPath(group))}">بازگشت به فهرست ←</a><a class="button button-outline" href="${link(pdfURL)}" type="application/pdf" download>دریافت رایگان مرور فارسی (PDF) ↓</a></div></div></div></section>`
      +section("مرور تحریریه","این کتاب درباره چیست؟",`<p class="rich">${esc(b.description)}</p><p class="muted">این مرور براساس اطلاعات معتبر معرفی و شناسنامه اثر و تحلیل مستقل تحریریه نوشته شده است؛ جایگزین خواندن متن کامل کتاب نیست.</p>`)
      +section("نگاه تحلیلی داینر","آنچه از این کتاب می‌توان آموخت",`<p class="rich">${esc(review.thesis)}</p><div class="world-book-analysis">${reviewSections}</div>`)
      +section("جمع‌بندی","چهار نکته قابل استفاده",`<ul class="topics">${review.insights.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`)
      +section("مخاطب و محدودیت","برای چه کسی مناسب است؟",`<p class="rich">${esc(review.audience)}</p><h3>محدودیت و احتیاط</h3><p class="rich">${esc(review.limitations)}</p>`)
      +section("برنامه اجرایی","سه تمرین برای رستوران‌های ایران",`<ol class="topics">${steps}</ol>`)
      +section("مرور فارسی قابل دریافت","PDF مستقل این کتاب",`<p class="rich">این PDF شامل معرفی، تحلیل اختصاصی، نکات اجرایی، محدودیت‌ها و منابع است و جای متن کامل یا ترجمه کتاب اصلی را نمی‌گیرد.</p><a class="button button-dark" href="${link(pdfURL)}" type="application/pdf" download>دریافت مرور فارسی کتاب (PDF) ↓</a><p class="muted">${esc(worldReviews.editorialPolicy)}</p>`)
      +section("منابع بررسی","برای تأیید اطلاعات کتاب‌شناختی",`<ul class="topics">${refs}</ul>`)
      +section("سه نکته کلیدی","چه چیزهایی می‌توان از موضوع کتاب آموخت؟",`<ol class="topics">${b.ideas.map(x=>`<li>${esc(x)}</li>`).join("")}</ol><p class="muted">این نکات جمع‌بندی تحریریه‌اند و نقل‌قول مستقیم یا ادعای پوشش فصل‌به‌فصل کتاب نیستند.</p>`)
      +section("برای رستوران‌های ایران","یک تمرین عملی",`<p class="rich">${esc(b.application)}</p>`)
      +section("نسخه و منبع","خرید یا بررسی نسخه اصلی",`<p>نویسنده: <strong>${esc(b.author)}</strong> · ناشر/نسخه: <strong>${esc(b.publisher)}</strong>${b.isbn?` · شابک: <span dir="ltr">${esc(b.isbn)}</span>`:""}</p><p><a class="button button-outline" href="${esc(b.source)}" target="_blank" rel="noopener noreferrer">${esc(b.sourceLabel)} ←</a></p><p class="muted">موجودی و قیمت را فروشنده تعیین می‌کند. از لینک‌های این صفحه فعلاً کمیسیونی دریافت نمی‌شود. فایل کامل دارای حق نشر در این صفحه میزبانی نمی‌شود.</p>`)
      +section("ادامه مطالعه","کتاب‌های مرتبط",`<div class="cards two">${selected.filter(x=>x.slug!==b.slug).slice(0,2).map(itemCard).join("")}</div>`);
      add(onePath(b),`${b.title}؛ مرور فارسی، PDF و نسخه اصلی`,`${b.description} مرور تحلیلی مستقل، تمرین‌های کاربردی و PDF فارسی قابل دریافت.`,body,{structured:{"@context":"https://schema.org","@type":"Book",name:b.original,author:{"@type":"Person",name:b.author},publisher:{"@type":"Organization",name:b.publisher},inLanguage:group==="foreign"?"en":"fa", ...(b.isbn?{isbn:b.isbn}:{}),...(b.cover?{image:b.cover.img}:{})}});
    }
  }
}
