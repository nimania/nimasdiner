import fs from "node:fs";
import path from "node:path";
import {loadPromptExamples,promptExampleThumbnail,renderPromptExample} from "./prompt-samples.mjs";
import {promptStudio,promptComparisonData,promptQualityData,qualityCard,comparisonSection} from "./prompt-studio.mjs";

/** Public prompt library. Data lives in content/prompts.json; pages share the main site shell. */
export function renderPromptPages({add,esc,link,crumbs}) {
  const source = JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/prompts.json"),"utf8"));
  const prompts = source.prompts;
  const {examples,updated:examplesUpdated}=loadPromptExamples(prompts);
  const exampleFor=p=>examples.get(p.slug);
  const comparisons=promptComparisonData();
  const quality=promptQualityData(prompts);
  const categories = [
    ["عکاسی غذا","🍔"],["فضای کافه","☕"],["شبکه‌های اجتماعی","📱"],
    ["ویدئو","🎬"],["منو و تبلیغات","📋"],["مدیریت و عملیات","📊"],
    ["نوشتن متن","✍️"],["ایده‌پردازی","💡"]
  ];
  const icons = Object.fromEntries(categories);
  const style = '<link rel="stylesheet" href="'+link("assets/prompts.css")+'"><link rel="stylesheet" href="'+link("assets/prompts-studio.css")+'"><script defer src="'+link("assets/prompts-studio.js")+'"></script>';
  const config = {head:style,script:"assets/prompts.js",lastmod:examplesUpdated||source.updated};
  const validTypes = new Set(["عکس","ویدئو","متن","طراحی"]);
  const seen = new Set();
  for (const p of prompts) {
    if (!/^[a-z0-9-]+$/.test(p.slug) || seen.has(p.slug)) throw Error("Invalid or duplicate prompt slug: "+p.slug);
    seen.add(p.slug);
    if (!categories.some(c=>c[0]===p.category) || !validTypes.has(p.type) || !p.prompt || !p.summary) throw Error("Invalid prompt: "+p.slug);
  }
  const pURL = p => "prompts/"+p.slug+"/";
  const pCard = (p,related=false) =>
    '<article class="prompt-card" data-category="'+esc(p.category)+'" data-type="'+esc(p.type)+'" data-has-example="'+(exampleFor(p)?"true":"false")+'" data-search="'+esc([p.title,p.summary,p.category,p.type,p.slug].join(" "))+'">'+
      '<a class="prompt-card-link" href="'+link(pURL(p))+'">'+
        '<div class="prompt-card-art" aria-hidden="true">'+promptExampleThumbnail(exampleFor(p),esc)+'<span class="prompt-card-number">DINER / '+String(p.id).padStart(3,"0")+'</span><span class="prompt-card-emoji">'+(exampleFor(p)&&exampleFor(p).kind!=="text"?"":icons[p.category]||"✦")+'</span><span class="prompt-card-art-label">'+esc(p.type)+'</span></div>'+
        '<div class="prompt-card-content"><span class="prompt-card-category">'+esc(p.category)+'</span><h3>'+esc(p.title)+'</h3><p>'+esc(p.summary)+'</p>'+
        '<div class="prompt-card-bottom"><span>'+esc(p.level)+' · '+esc(p.ratio)+'</span><strong>مشاهده پرامپت ←</strong></div></div>'+
      '</a></article>';
  const collectionDesc="پرامپت‌های آماده برای عکاسی غذا، ویدئو، اینستاگرام، منو، بازاریابی و مدیریت رستوران و کافه؛ رایگان، فارسی و قابل کپی.";

  const collection =
    '<section class="prompt-hero"><div class="wrap prompt-hero-inner">'+
      '<div><p class="prompt-overline">NIMA’S DINER / PROMPT LIBRARY</p><h1>پرامپت‌خانه<span class="prompt-heading-dot">.</span><br><span>دفترچه صنعت غذا</span></h1>'+
      '<p>از یک ایده ساده تا محتوای حرفه‌ای و تصمیم اجرایی. دستورهای آماده برای رستوران، کافه، فست‌فود، نانوایی و قنادی؛ انتخاب کن، کپی کن و برای کسب‌وکار خودت شخصی‌سازی کن.</p>'+
      '<div class="prompt-hero-actions"><a class="prompt-primary-link" href="#prompt-catalog">دیدن پرامپت‌ها ↓</a><a class="prompt-secondary-link" href="'+link("prompts/studio/")+'">پرامپت‌ساز شخصی ←</a><a class="prompt-secondary-link" href="https://t.me/nimasdiner" target="_blank" rel="noopener noreferrer">کانال تلگرام داینر ↗</a></div>'+
      '<div class="prompt-mini-stats"><span><b>'+new Intl.NumberFormat("fa-IR").format(prompts.length)+'</b> پرامپت آماده</span><span><b>'+new Intl.NumberFormat("fa-IR").format(categories.length)+'</b> دسته تخصصی</span><span><b>'+new Intl.NumberFormat("fa-IR").format(examples.size)+'</b> نمونه خروجی</span><span>بدون ثبت‌نام</span></div></div>'+
      '<div class="prompt-hero-aside" aria-hidden="true"><span class="ph-a">PHOTO <b>🍔</b></span><span class="ph-b">VIDEO <b>🎬</b></span><span class="ph-c">OPERATIONS <b>📊</b></span></div>'+
    '</div></section>'+
    '<section class="wrap prompt-collection" id="prompt-catalog" aria-labelledby="prompt-catalog-title">'+
      '<div class="prompt-section-head"><div><p class="prompt-overline">EXPLORE THE LIBRARY</p><h2 id="prompt-catalog-title">پرامپت مناسب کارت را پیدا کن</h2></div><p>عکاسی، تبلیغات، عملیات و ایده‌پردازی؛ همه در یک دفترچه قابل جست‌وجو.</p></div>'+
      '<div class="studio-link-strip"><a href="'+link("prompts/studio/")+'">ساخت پرامپت اختصاصی ←</a><a href="'+link("prompts/showcase/")+'">گالری قبل و بعد ←</a></div>'+
      '<div class="prompt-search-panel"><label for="prompt-query">جست‌وجو در دفترچه</label><input type="search" id="prompt-query" placeholder="مثلاً برگر، شیفت، قهوه، ریلز..." autocomplete="off">'+
      '<div class="prompt-filter-row" role="group" aria-label="فیلتر دسته‌بندی"><button type="button" data-prompt-category="all" class="selected" aria-pressed="true">همه</button>'+
      categories.map(c=>'<button type="button" data-prompt-category="'+esc(c[0])+'" aria-pressed="false">'+c[1]+' '+esc(c[0])+'</button>').join("")+'</div>'+
      '<div class="prompt-filter-meta"><span id="prompt-count" role="status" aria-live="polite">'+new Intl.NumberFormat("fa-IR").format(prompts.length)+' نتیجه</span><label class="prompt-only-examples" for="prompt-only-examples"><input id="prompt-only-examples" type="checkbox"> فقط نمونه‌دار</label><label for="prompt-type">نوع خروجی <select id="prompt-type"><option value="all">همه خروجی‌ها</option><option value="عکس">عکس</option><option value="ویدئو">ویدئو</option><option value="طراحی">طراحی</option><option value="متن">متن</option></select></label></div></div>'+
      '<div class="prompt-grid" id="prompt-results">'+prompts.map(p=>pCard(p)).join("")+'</div>'+
      '<p class="prompt-empty" id="prompt-empty" hidden>با این فیلترها پرامپتی پیدا نشد. عبارت جست‌وجو یا دسته را تغییر بده.</p>'+
    '</section>'+
    '<section class="wrap prompt-info-panel"><div><p class="prompt-overline">HOW IT WORKS</p><h2>سه قدم تا استفاده</h2><div class="prompt-steps"><span><b>۱</b> موضوع را انتخاب کن</span><span><b>۲</b> متن کامل را کپی کن</span><span><b>۳</b> مشخصات واقعی کسب‌وکارت را وارد کن</span></div></div>'+
    '<aside><h3>تصویر تبلیغاتی با محصول واقعی تفاوت نداشته باشد</h3><p>در معرفی منو، اندازه غذا، مواد اولیه، بسته‌بندی یا دکور واقعی را تغییر ندهید. هر خروجی را پیش از انتشار بررسی کنید؛ اعداد، ادعاهای بهداشتی و قیمت‌ها باید از اطلاعات واقعی تأیید شوند.</p></aside></section>'+
    '<section class="wrap prompt-end"><div><h2>پرامپت تازه می‌خواهی؟</h2><p>ایده‌های کاربردی و نمونه‌های جدید در تلگرام نیما داینر منتشر می‌شوند.</p></div><a class="prompt-primary-link" href="https://t.me/nimasdiner" target="_blank" rel="noopener noreferrer">عضویت در کانال ↗</a></section>';
  add("prompts/","پرامپت‌خانه نیما داینر؛ دفترچه پرامپت صنعت غذا",collectionDesc,collection,{
    ...config,
    keywords:"پرامپت عکاسی غذا تولید محتوا رستوران کافه ویدئو تبلیغات مدیریت",
    structured:{"@context":"https://schema.org","@type":"CollectionPage",name:"پرامپت‌خانه نیما داینر",description:collectionDesc,inLanguage:"fa",mainEntity:{"@type":"ItemList",numberOfItems:prompts.length,itemListElement:prompts.map((p,i)=>({"@type":"ListItem",position:i+1,name:p.title,url:"https://nimania.net/"+pURL(p)}))}}
  });
  add("prompts/studio/","پرامپت‌ساز اختصاصی صنعت غذا","پرامپت‌های عکاسی، ویدئو و مدیریت کسب‌وکار غذا را بر اساس برند، محصول، سبک و مخاطب خودتان شخصی‌سازی کنید.",
    '<section class="wrap studio-page-head">'+crumbs([["پرامپت‌خانه","prompts/"],["پرامپت‌ساز",null]])+'<h1>پرامپت‌ساز داینر</h1><p>یک دستور انتخاب کن و آن را مطابق محصول، رنگ برند، مخاطب و هدف خودت تنظیم کن. همه کارها بدون ثبت‌نام در مرورگر انجام می‌شود.</p>'+promptStudio({prompts,esc,link})+'<p><a href="'+link("prompts/")+'">بازگشت به دفترچه پرامپت ←</a></p></section>',config);
  add("prompts/showcase/","گالری نمونه و مقایسه قبل و بعد پرامپت‌ها","نمونه‌های شفاف و آموزشی از تصویر اولیه و خروجی ویرایش‌شده در صنعت غذا و کافه؛ با توضیح روش تولید و محدودیت‌ها.",
    '<section class="wrap studio-page-head">'+crumbs([["پرامپت‌خانه","prompts/"],["گالری خروجی‌ها",null]])+'<h1>گالری نمونه‌های پرامپت‌خانه</h1><p>تفاوت یک تصویر اولیه با نسخه ویرایش‌شده را بررسی کنید؛ تصاویر این بخش ساختگی و صرفاً آموزشی‌اند.</p></section>'+comparisonSection({items:comparisons.comparisons,esc,link,full:true})+'<section class="wrap"><p><a href="'+link("prompts/")+'">همه پرامپت‌ها ←</a></p></section>',config);
  for (const p of prompts) {
    const rel = prompts.filter(x=>x.slug!==p.slug && x.category===p.category).slice(0,3);
    if (rel.length<3) rel.push(...prompts.filter(x=>x.slug!==p.slug && !rel.includes(x)).slice(0,3-rel.length));
    const howto = p.reference?
      "عکس واقعی محصول یا فضای خودتان را همراه متن پرامپت بارگذاری کنید. پیش از انتشار، تناسب محصول و محیط را با نسخه واقعی تطبیق دهید.":
      "عبارت‌های داخل کروشه را با اطلاعات واقعی کسب‌وکارتان جایگزین کنید و نتیجه را پیش از استفاده بازبینی کنید.";
    const content =
      '<section class="wrap prompt-detail-top">'+crumbs([["پرامپت‌خانه","prompts/"],[p.title,null]])+
      '<a class="prompt-back" href="'+link("prompts/")+'">← بازگشت به دفترچه</a>'+
      '<div class="prompt-detail-hero"><div><p class="prompt-overline">PROMPT / '+String(p.id).padStart(3,"0")+'</p>'+
      '<h1>'+esc(p.title)+'</h1><p class="prompt-detail-summary">'+esc(p.summary)+'</p>'+
      '<div class="prompt-taglist"><span>'+esc(p.category)+'</span><span>'+esc(p.type)+'</span><span>'+esc(p.level)+'</span><span>خروجی: '+esc(p.ratio)+'</span><span>'+(p.reference?"نیازمند عکس مرجع":"بدون نیاز به عکس مرجع")+'</span></div></div>'+
      '<div class="prompt-detail-art" aria-hidden="true"><span>'+esc(p.category)+'</span><strong>'+(icons[p.category]||"✦")+'</strong><small>DINER PROMPTS</small></div></div>'+
      '</section>'+
      renderPromptExample(exampleFor(p),{esc,link})+
      comparisonSection({items:comparisons.comparisons.filter(x=>x.slug===p.slug),esc,link})+
      '<section class="wrap prompt-detail-layout"><article class="prompt-copy-box">'+
      '<div class="prompt-copy-head"><div><p class="prompt-overline">COPY & CUSTOMIZE</p><h2>پرامپت کامل</h2></div><button type="button" class="prompt-copy-btn" data-copy-prompt="#prompt-source">کپی پرامپت <span aria-hidden="true">⧉</span></button></div>'+
      '<pre id="prompt-source" class="prompt-source" lang="'+(p.type==="متن"?"en":"en")+'" dir="ltr">'+esc(p.prompt)+'</pre>'+
      '<p class="prompt-copy-status" id="prompt-copy-status" role="status" aria-live="polite">متن انگلیسی برای کپی آماده است.</p></article>'+
      '<aside class="prompt-guidance"><h2>راهنمای استفاده</h2><ol><li>پرامپت بالا را کپی کنید.</li><li>'+esc(howto)+'</li><li>خروجی را از نظر جزئیات، کیفیت و واقع‌نمایی بررسی کنید.</li></ol>'+
      '<div class="prompt-tip"><b>نکته داینر</b><p>'+esc(p.tip)+'</p></div>'+
      '<div class="prompt-guidance-note"><b>مناسب برای</b><p>'+esc(p.type==="متن"?"برنامه‌ریزی و اجرای کار روزمره":"تولید محتوای سایت و شبکه‌های اجتماعی")+' در کسب‌وکارهای غذایی.</p></div>'+
      '<a href="https://t.me/nimasdiner" target="_blank" rel="noopener noreferrer" class="prompt-tg-link">پرامپت‌های روزانه در تلگرام ↗</a></aside></section>'+
      '<div class="wrap">'+promptStudio({prompts,selected:p,esc,link})+'</div>'+
      qualityCard({prompt:p,quality,esc})+
      '<section class="wrap prompt-related"><div class="prompt-section-head"><div><p class="prompt-overline">KEEP EXPLORING</p><h2>پرامپت‌های مرتبط</h2></div><a href="'+link("prompts/")+'">مشاهده همه ←</a></div><div class="prompt-grid">'+rel.map(x=>pCard(x,true)).join("")+'</div></section>';
    add(pURL(p),p.title+"؛ پرامپت آماده",p.summary,content,{
      ...config,
      keywords:p.title+" "+p.category+" "+p.summary,
      structured:{"@context":"https://schema.org","@type":"CreativeWork",name:p.title,description:p.summary,inLanguage:"fa",isAccessibleForFree:true,author:{"@type":"Organization",name:"نیما داینر"},url:"https://nimania.net/"+pURL(p)}
    });
  }
}
