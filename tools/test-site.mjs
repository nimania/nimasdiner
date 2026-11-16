import assert from "node:assert/strict";
import {renderBrandTopicPages} from "./brand-topic-pages.mjs";
import {persianDigits, persianizeHTML} from "./persian-digits-html.mjs";
import fs from "node:fs";
import path from "node:path";

const dist=path.join(process.cwd(),"site-dist");
const read=p=>fs.readFileSync(path.join(dist,p),"utf8");
const mustExist=["index.html","get-book/index.html","library/index.html","library/01/index.html","library/02/index.html","library/03/index.html","magazine/index.html","magazine/01/index.html","guides/index.html","guides/food-cost/index.html","guides/menu-engineering/index.html","guides/restaurant-permits/index.html","tools/index.html","services/index.html","consultation/index.html","consulting/index.html","app/index.html","robots.txt","sitemap.xml","search-index.json"];
for(const p of mustExist){assert.ok(fs.existsSync(path.join(dist,p)),p+" missing");}
const orderPage=read("get-book/index.html");
assert.match(orderPage,/سفارش کتاب/);
assert.match(orderPage,/https:\/\/t\.me\/nimaafsharnaderi/);
assert.doesNotMatch(orderPage,/<form\b|id="book-form"|nimasdiner-delivery|دانلود کتاب|دریافت رایگان کتاب/);
const verifyTag='<meta name="google-site-verification" content="Dn8BoEITUIXrF7N1QXzz99mTvFvtI5sfz9t4YTVo38Q">';
const homeMeta=read("index.html");
assert.ok(homeMeta.includes(verifyTag),"Google Search Console verification meta tag missing on public homepage");
assert.equal(homeMeta.split('name="google-site-verification"').length-1,1,"Google verification tag must be unique");
const home=read("index.html");
assert.match(home,/id="get-book"/,"old hash deep link broken");
assert.match(home,/href="\/library\/"/);
assert.doesNotMatch(home,/دریافت رایگان کتاب|دانلود کتاب|کتاب را رایگان/);
assert.match(home,/<h1>/);
const sitemap=read("sitemap.xml");
assert.match(sitemap,/\/get-book\//);
assert.match(sitemap,/\/magazine\/01\//);
assert.doesNotMatch(sitemap,/\/library\/04\//,"unpublished books must not be indexed");
assert.doesNotMatch(sitemap,/\/search\//,"search should not be indexed");
assert.match(read("search/index.html"),/noindex,follow/);
const items=JSON.parse(read("search-index.json"));
assert.ok(items.length>=10,"search pages too few");
assert.ok(items.every(item=>item.url.startsWith("/")),"search URLs incorrect");
assert.ok(!items.some(item=>item.url.includes("/library/04/")),"planned content in search index");
assert.equal((read("library/index.html").match(/timeline-item/g)||[]).length,10,"missing roadmap volumes");
for(const p of mustExist.filter(x=>x.endsWith("index.html")&&!x.startsWith("app/")&&!x.startsWith("consulting/"))){
 const txt=read(p);
 assert.match(txt,/<html lang="fa" dir="rtl">/,"RTL missing "+p);
 assert.match(txt,/<meta name="description"/,"meta description missing "+p);
 assert.match(txt,/rel="canonical"/,"canonical missing "+p);
}
const extraPages=["reading/index.html","reading/news/index.html","reading/analysis/index.html","reading/restaurant-technology-connected-2026/index.html","reading/menu-trends-value-comfort-2026/index.html","reading/why-top-selling-menu-items-may-not-be-profitable/index.html","about/index.html","feed.xml","guides/restaurant-management/index.html","guides/menu-pricing/index.html","guides/restaurant-profit/index.html"];
for(const p of extraPages)assert.ok(fs.existsSync(path.join(dist,p)),"Editorial/SEO page missing: "+p);
assert.match(read("index.html"),/href="\/reading\//,"reading link missing in homepage");
assert.match(read("reading/index.html"),/رادار صنعت/,"reading archive missing");
assert.match(read("reading/restaurant-technology-connected-2026/index.html"),/۲۰۲۶-۱۱-۰۵|2026-11-05/,"news source date must be visible");
assert.match(read("reading/restaurant-technology-connected-2026/index.html"),/restaurant\.org/,"official source link missing");
assert.match(read("sitemap.xml"),/\/reading\//,"reading articles missing from sitemap");
assert.match(read("feed.xml"),/<rss version="2\.0">/,"valid RSS root missing");
assert.ok(items.some(i=>i.url.includes("/reading/")),"editorial article not searchable");
assert.ok(items.some(i=>i.url.includes("/guides/restaurant-management/")),"SEO guide not searchable");
const mapping=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/seo-keywords.json"),"utf8"));
assert.equal(mapping.meta.keywords,305);
assert.equal(mapping.meta.targets,44);
const editorial=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/editorial.json"),"utf8"));
assert.ok(editorial.articles.filter(a=>a.status==="published").every(a=>a.type!=="news"||(a.sourcePublishedAt&&a.sources?.length)),"unsourced published news");
assert.match(read("get-book/index.html"),/href="\/privacy\.html"/,"privacy link broken");
assert.doesNotMatch(read("download.html"),/ثبت‌نام و دریافت رایگان|دانلود PDF/);
console.log("Editorial tests passed:",extraPages.length,"additional pages,",mapping.meta.keywords,"keywords");
const reviews=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/reviews.json"),"utf8"));
assert.ok(fs.existsSync(path.join(dist,"reviews/index.html")),"Reviews archive must exist");
assert.match(read("reviews/index.html"),/نقدهای نیما/,"Archive title missing");
assert.match(read("index.html"),/href="\/reviews\//,"Review link missing on homepage");
if(!reviews.reviews.some(r=>r.status==="published")){
  assert.match(read("reviews/index.html"),/noindex,follow/,"Unpopulated archive must not be indexed");
  assert.doesNotMatch(read("sitemap.xml"),/\/reviews\//,"Empty archive should not enter sitemap");
}
console.log("Review archive tests passed");

// Video structured data must use a true timezone-aware publication DateTime.
// The article's display date remains separate and can be localized in Persian.
const barokReview=reviews.reviews.find(r=>r.slug==="barok-nowshahr");
assert.ok(barokReview,"Barok review missing");
assert.equal(barokReview.videoGallery?.[0]?.uploadDate,"2026-11-15T19:29:51Z");
const barokHtml=read("reviews/barok-nowshahr/index.html");
const schemas=[...barokHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map(x=>JSON.parse(x[1])).flat();
const videos=schemas.flatMap(x=>Array.isArray(x)?x:[x]).filter(x=>x?.["@type"]==="VideoObject");
assert.equal(videos.length,1,"Expected one Barok VideoObject in JSON-LD");
for(const video of videos){
 assert.match(video.uploadDate,/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/,"VideoObject uploadDate requires an ISO datetime with timezone");
 assert.ok(Number.isFinite(Date.parse(video.uploadDate)),"Unparseable video uploadDate");
 assert.equal(video.uploadDate,barokReview.videoGallery[0].uploadDate);
 assert.match(video.contentUrl,/\/assets\/reviews\/barok-exterior-night\.mp4$/);
}
console.log("VideoObject published timestamp and timezone checks passed");


const taxonomy=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/brand-topics.json"),"utf8"));
assert.equal(taxonomy.brands.length,25,"Expected 25 case-study brands");
assert.equal(taxonomy.topics.length,11,"Expected 11 consolidated management subjects");
assert.equal(Object.keys(taxonomy.articleTags).length,30,"Expected tags for all 30 uploaded drafts");
const brandKeys=new Set(taxonomy.brands.map(b=>b.slug));
const topicKeys=new Set(taxonomy.topics.map(t=>t.slug));
for(const [slug,tags] of Object.entries(taxonomy.articleTags)){
  assert.ok(brandKeys.has(tags.brand),"Unknown brand for "+slug);
  assert.ok(tags.topics?.length && tags.topics.every(t=>topicKeys.has(t)),"Invalid topic for "+slug);
}
const brandLessonHub="reading/brand-lessons/index.html";
assert.ok(fs.existsSync(path.join(dist,brandLessonHub)),"Brand lesson archive missing");
assert.match(read("reading/index.html"),/\/reading\/brand-lessons\//,"Editorial archive must link to brand lessons");
const publishedMapped=[...editorial.articles,...["brand-lessons-part1.json","brand-lessons-part2.json"].flatMap(name=>JSON.parse(fs.readFileSync(path.join(process.cwd(),"content",name),"utf8")).articles)].filter(a=>a.status==="published"&&taxonomy.articleTags[a.slug]);
for(const a of publishedMapped){
  const tags=taxonomy.articleTags[a.slug];
  const page=read("reading/"+a.slug+"/index.html");
  assert.ok(page.includes("/reading/brands/"+tags.brand+"/"),"Brand backlink missing: "+a.slug);
  for(const t of tags.topics)assert.ok(page.includes("/reading/topics/"+t+"/"),"Topic backlink missing: "+a.slug+" / "+t);
  assert.ok(fs.existsSync(path.join(dist,"reading/brands/"+tags.brand+"/index.html")),"Brand hub missing");
}
for(const slug of Object.keys(taxonomy.articleTags)){
  if(!publishedMapped.some(a=>a.slug===slug))assert.doesNotMatch(sitemap,new RegExp("/reading/"+slug+"/"),"Draft leaked into sitemap: "+slug);
}
if(!publishedMapped.length){
  assert.match(read(brandLessonHub),/noindex,follow/,"Empty brand collection should not be indexed");
  assert.doesNotMatch(sitemap,/\/reading\/brand-lessons\//,"Empty hub should not be in sitemap");
}
console.log("Brand/topic taxonomy checks passed:",taxonomy.brands.length,"brands,",taxonomy.topics.length,"topics");

const approvedLogos=taxonomy.brands.filter(b=>b.logo);
assert.ok(approvedLogos.length>=10,"Expected verified logos for the initial brand catalog");
for(const b of approvedLogos){
  assert.ok(b.logo.alt.includes(b.fa) && b.logo.alt.includes(b.en),"Descriptive bilingual alt missing "+b.slug);
  assert.ok(b.logo.src.startsWith("https://upload.wikimedia.org/wikipedia/commons/"),"Unexpected image host "+b.slug);
  assert.ok(b.logo.sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:"),"Missing licensing source "+b.slug);
  assert.ok(b.logo.license && b.logo.width>0 && b.logo.height>0,"Incomplete attribution or layout dimensions for "+b.slug);
}
const mockPages=[];
const fakeCases=[
  {status:"published",slug:"starbucks-closed-stores-barista-training-lesson",title:"نمونه استارباکس"},
  {status:"published",slug:"mcdonalds-1948-short-menu-lesson",title:"نمونه مک‌دونالد"},
  {status:"published",slug:"costco-hot-dog-anchor-price-lesson",title:"نمونه کاستکو"}
];
renderBrandTopicPages({
  editorial:{articles:fakeCases,brandTaxonomy:taxonomy},
  add:(path,title,description,html,opts)=>mockPages.push({path,html,opts}),
  section:(label,title,body)=>'<section><h2>'+title+'</h2>'+body+'</section>',
  crumbs:()=>'<nav aria-label="مسیر صفحه"></nav>',
  editorialCards:arr=>'<p>'+arr.map(a=>a.title).join("، ")+'</p>',
  link:path=>"/"+path,
  esc:s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))
});
const sampleBrandHub=mockPages.find(p=>p.path==="reading/brand-lessons/");
assert.ok(sampleBrandHub,"Hub not generated when case studies exist");
assert.match(sampleBrandHub.html,/brand-logo-grid/,"Missing responsive logo grid");
assert.equal((sampleBrandHub.html.match(/class="brand-logo-link"/g)||[]).length,25,"All 25 brands must be visible before articles are published");
assert.equal(mockPages.filter(p=>p.path.startsWith("reading/brands/")).length,25,"Every brand card must have a real destination");
assert.equal(mockPages.filter(p=>p.path.startsWith("reading/topics/")).length,11,"All 11 subject hubs must be present");
assert.match(sampleBrandHub.html,/در دست آماده‌سازی/,"Unpublished brand label should be explicit");
assert.match(sampleBrandHub.html,/<a class="brand-logo-link" href="\/reading\/brands\/starbucks\/"/,"Logo must link to the brand hub via HTML");
assert.match(sampleBrandHub.html,/alt="لوگوی استارباکس \(Starbucks\)"/,"Logo image needs accessible alt text");
assert.match(sampleBrandHub.html,/loading="lazy"/,"Logo images should lazy-load");
assert.match(sampleBrandHub.html,/brand-fallback-mark/,"Unverified logo must use named textual fallback");
assert.doesNotMatch(sampleBrandHub.html,/href="https:\/\/www\.starbucks\.com\/"/,"Logo must not redirect to an external brand");
const sampleBrandProfile=mockPages.find(p=>p.path==="reading/brands/starbucks/");
assert.ok(sampleBrandProfile&&sampleBrandProfile.html.includes("brand-profile-logo"),"Brand profile logo missing");
assert.match(sampleBrandProfile.html,/commons.wikimedia.org/,"Brand logo source attribution missing");
const noLogoProfile=mockPages.find(p=>p.path==="reading/brands/costco/");
assert.ok(noLogoProfile,"Brand without approved logo must still have its own page");
assert.doesNotMatch(noLogoProfile.html,/brand-profile-logo/,"Unapproved brand mark must not appear");
console.log("Brand logo card tests passed:",approvedLogos.length,"source-checked marks and text fallbacks");

const localeSample = '<div title="2026 edition"><p>Price: 150,000 | 2026-11-16</p><time datetime="2026-11-16">2026-11-16</time></div>' +
  '<script type="application/ld+json">{"price":"150000","date":"2026-11-16"}</script>' +
  '<style>.x{width:2026px}</style><pre>2026 / 01</pre><code>2026</code><!-- release 2026 -->';
const localizedSample=persianizeHTML(localeSample);
assert.match(localizedSample, /Price: ۱۵۰,۰۰۰ \| ۲۰۲۶-۱۱-۱۶/);
assert.match(localizedSample, /<time datetime="2026-11-16">۲۰۲۶-۱۱-۱۶<\/time>/);
assert.match(localizedSample, /title="2026 edition"/,"Never mutate machine-readable HTML attributes");
assert.match(localizedSample, /"price":"150000"/,"Keep structured data as provided");
assert.match(localizedSample, /width:2026px/,"Keep CSS source unchanged");
assert.match(localizedSample, /<pre>2026 \/ 01<\/pre>/,"Keep preformatted examples unchanged");
assert.match(localizedSample, /<!-- release 2026 -->/,"Keep HTML comments unchanged");
assert.equal(persianDigits("2026, 150000"),"۲۰۲۶, ۱۵۰۰۰۰");
const brandView=read("reading/brand-lessons/index.html");
assert.match(brandView,/۴ مطلب منتشرشده/,"Brand article counts must have Persian digits in built HTML");
assert.match(brandView,/href="\/reading\/brands\/starbucks\/"/,"Internal URLs must remain ASCII and stable");
const liveArticle=read("reading/starbucks-closed-stores-barista-training-lesson/index.html");
assert.match(liveArticle,/<time datetime="2026-11-16">۲۰۲۶-۱۱-۱۶<\/time>/,"Visible article dates should be Persian while ISO datetime remains machine-readable");
for(const page of ["index.html","reading/index.html","reading/brand-lessons/index.html","reading/brands/starbucks/index.html","tools/index.html","consultation/index.html","app/index.html"]){
  const html=read(page);
  assert.match(html,/<script defer src="\/persian-digits\.js"><\/script>/,"Missing live number localization on "+page);
}
assert.ok(fs.existsSync(path.join(dist,"persian-digits.js")),"Missing dynamic numeral localization script");
assert.match(read("persian-digits.js"),/MutationObserver/,"Dynamic UI values must also be localized");
console.log("Persian numeral localization passed on static HTML and dynamic UI bootstrap");


const publishedBrandLessons=["brand-lessons-part1.json","brand-lessons-part2.json"].flatMap(name=>JSON.parse(fs.readFileSync(path.join(process.cwd(),"content",name),"utf8")).articles);
assert.equal(publishedBrandLessons.length,13,"Initial verified editorial release should include 13 case studies");
assert.equal(new Set(publishedBrandLessons.map(a=>a.slug)).size,13,"Duplicate published brand article slugs");
for(const a of publishedBrandLessons){
  assert.equal(a.status,"published");
  assert.ok(a.sources?.length>=2 && a.sources.every(s=>s.url.startsWith("https://")),"Missing sources: "+a.slug);
  const page=read("reading/"+a.slug+"/index.html");
  assert.ok(page.includes(a.title),"Published article title missing: "+a.slug);
  assert.ok(page.includes("/reading/brands/"+a.brand+"/"),"Brand backlink missing: "+a.slug);
  assert.ok(page.includes("منابع و شیوه تدوین"),"Editorial source list missing: "+a.slug);
  assert.ok(page.includes("2026-11-16"),"Original Diner publication date missing: "+a.slug);
  for(const t of a.topics)assert.ok(page.includes("/reading/topics/"+t+"/"),"Topic backlink missing: "+a.slug+" "+t);
  assert.ok(sitemap.includes("reading/"+a.slug+"/"),"Published story missing from sitemap: "+a.slug);
  assert.ok(items.some(x=>x.url==="/reading/"+a.slug+"/"),"Story missing from site search: "+a.slug);
}
const brandLanding=read("reading/brand-lessons/index.html");
assert.match(brandLanding,/برندهایی که مطلب منتشرشده دارند/);
assert.match(brandLanding,/جدیدترین پرونده‌ها/);
assert.match(brandLanding,/پرونده‌های در حال راستی‌آزمایی/);
assert.match(brandLanding,/استارباکس چرا ۷ هزار شعبه را بست/);
assert.match(brandLanding,/منوی ۹ آیتمی مک‌دونالد/);
const starbucksHub=read("reading/brands/starbucks/index.html");
const dominosHub=read("reading/brands/dominos/index.html");
for(const q of publishedBrandLessons.filter(a=>a.brand==="starbucks")){
  assert.ok(starbucksHub.includes("/reading/"+q.slug+"/"),"Starbucks article missing in brand hub "+q.slug);
}
assert.equal(publishedBrandLessons.filter(a=>a.brand==="starbucks").length,4);
assert.equal(publishedBrandLessons.filter(a=>a.brand==="dominos").length,2);
for(const q of publishedBrandLessons.filter(a=>a.brand==="dominos")){
  assert.ok(dominosHub.includes("/reading/"+q.slug+"/"),"Dominos article missing in brand hub "+q.slug);
}
assert.doesNotMatch(starbucksHub,/name="robots" content="noindex/,"Multi-article Starbucks brand hub should be indexed");
assert.match(read("reading/brands/starbucks/index.html"),/مهندسی منو/);
console.log("Published brand lessons checked:",publishedBrandLessons.length,"articles and bidirectional links");



console.log("Site tests passed:",mustExist.length,"required files,",items.length,"searchable pages");

const calculatorSlugs=["good-cook-or-restaurant-owner","opening-budget-versus-survival-cash","smaller-customer-bills-in-a-downturn","restaurant-technology-connected-2026","menu-trends-value-comfort-2026","restaurant-cost-pressure-2026","why-top-selling-menu-items-may-not-be-profitable","buffet-economics-fixed-price","consistent-food-brings-customers-back","recipe-card-standardization","restaurant-menu-pricing","restaurant-break-even","restaurant-delivery-discounts","restaurant-staffing-cost","restaurant-seat-capacity"];
assert.ok(fs.existsSync(path.join(dist,"article-calculators.js")),"article calculator engine missing from deployment");
for(const slug of calculatorSlugs){
 const html=read("reading/"+slug+"/index.html");
 assert.match(html,/data-diner-calculator="/,"missing calculator in "+slug);
 assert.match(html,/data-calc-output/,"missing calculation result in "+slug);
 assert.match(html,/https:\/\/t\.me\/nimaafsharnaderi/,"missing print book order in "+slug);
 assert.match(html,/article-calculators\.js/,"missing calculator script in "+slug);
 assert.match(sitemap,new RegExp("reading/"+slug+"/"),"missing sitemap entry "+slug);
}
console.log("Article calculators and book advertisements checked:",calculatorSlugs.length);

const standaloneTools=["startup-runway","breakeven","foodcost","pricing","menu","buffet","labor","waste","discount","capacity"];
const toolHub=read("tools/index.html");
assert.match(toolHub,/id="tool-filter"/,"tool search missing");
assert.equal((toolHub.match(/data-tool-card/g)||[]).length,standaloneTools.length,"tool catalog incomplete");
for(const slug of standaloneTools){
 const html=read("tools/"+slug+"/index.html");
 assert.match(html,/data-diner-calculator=/,"calculator missing "+slug);
 assert.match(html,/article-calculators\.js/,"shared engine missing "+slug);
 assert.match(html,/درخواست جلسه مشاوره/,"consultation action missing "+slug);
 assert.match(html,/سفارش کتاب چاپی/,"print book action missing "+slug);
 assert.match(html,/https:\/\/t\.me\/nimaafsharnaderi/,"contact missing "+slug);
 assert.match(html,/مقاله مرتبط/,"related article missing "+slug);
 assert.match(sitemap,new RegExp("tools/"+slug+"/"),"not in sitemap "+slug);
}
for(const slug of calculatorSlugs)assert.match(read("reading/"+slug+"/index.html"),/درخواست جلسه مشاوره/,"article consultation missing "+slug);
console.log("Standalone tools and consultations checked:",standaloneTools.length);

assert.match(read("index.html"), /https:\/\/nimania\.net/);
assert.doesNotMatch(read("index.html"), /["\']\/nimasdiner\//);

const bookPrices=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/book-pricing.json"),"utf8"));
assert.equal(bookPrices.single.print,1000000);
assert.equal(bookPrices.single.digital,500000);
assert.equal(bookPrices.bundleAllThree.print,2500000);
assert.equal(bookPrices.bundleAllThree.digital,1200000);
assert.equal(3*bookPrices.single.print-bookPrices.bundleAllThree.print,500000);
assert.equal(3*bookPrices.single.digital-bookPrices.bundleAllThree.digital,300000);
for(const amount of ["۱٬۰۰۰٬۰۰۰","۵۰۰٬۰۰۰","۲٬۵۰۰٬۰۰۰","۱٬۲۰۰٬۰۰۰","۳۰۰٬۰۰۰"]){
 assert.ok(orderPage.includes(amount),"Missing price in order page: "+amount);
}
for(const n of ["01","02","03"]){
 const preview="library/"+n+"/sample/index.html";
 assert.ok(fs.existsSync(path.join(dist,preview)),"Five-page book sample missing: "+preview);
 const html=read(preview);
 assert.match(html,/noindex,follow/);
 assert.equal((html.match(/class="sample-paper"/g)||[]).length,5,"Five preview pages required: "+n);
 assert.ok(!html.includes("NimaDiner_Book"+Number(n)+"_Complete_"),"Paid ebook source file must never be linked");
 assert.match(read("library/"+n+"/index.html"),new RegExp("href=\"/library/"+n+"/sample/\""));
}
assert.doesNotMatch(read("sitemap.xml"),/\/library\/(01|02|03)\/sample\//,"Samples should not crowd the public sitemap");
console.log("Book prices, savings, five-page samples and paid ebook isolation checked.");

for(const n of ["01","02","03"]){
 const detail=read("library/"+n+"/index.html");
 assert.match(detail,/این کتاب برای چه کسی مناسب است/);
 assert.match(detail,/چه چیزی به دست می‌آورید/);
}

const bookingActions=read("index.html");
assert.match(bookingActions,/class="header-actions"[^>]*><a class="get-link" href="\/library\/">سفارش کتاب<\/a><a class="get-link get-link-consultation" href="\/consultation\/">درخواست مشاوره<\/a>/,"Both booking buttons must appear in the global header");
assert.match(read("library/index.html"),/get-link-consultation" href="\/consultation\/"/,"Consultation button should appear on library page as well");
const consultation=read("consultation/index.html");
for(const word of ["۹۰ دقیقه","۳۰٬۰۰۰٬۰۰۰","۵۰٬۰۰۰٬۰۰۰","۱۰٬۰۰۰٬۰۰۰","تعرفهٔ حمایتی","پیش از تأیید رزرو","پرسش‌های متداول"]){
 assert.ok(consultation.includes(word),"Consultation page missing "+word);
}
assert.match(consultation,/t\.me\/nimaafsharnaderi/);
assert.match(consultation,/<link rel="stylesheet" href="\/assets\/consultation\.css">/);
assert.match(consultation,/"@type":"Service"/);
assert.match(consultation,/"@type":"FAQPage"/);
assert.ok(consultation.includes("href=\"/library/\""));
assert.match(read("services/index.html"),/href="\/consultation\/"/);
assert.match(read("library/index.html"),/href="\/consultation\/"/);
assert.match(read("sitemap.xml"),/https:\/\/nimania\.net\/consultation\//);
assert.match(read("index.html"),/href="\/consultation\/"/);
for(const deny of [/ChatGPT/i, /\bAI\b/i, /افزایش فروش تضمینی/]){
 assert.doesNotMatch(consultation,deny,"Consultation page must avoid disallowed or guaranteed claims");
}

// Primary navigation: the CTAs remain while two menu entries are hidden.
const topNav=read("index.html").split('<nav class="nav"')[1]?.split("</nav>")[0];
assert.ok(topNav,"Primary top navigation must exist");
assert.ok(!topNav.includes("مشاورهٔ ۹۰ دقیقه‌ای")&&!topNav.includes("مجله داینر"),"Keep consultation and magazine out of the primary menu");
assert.ok(read("index.html").includes('class="get-link get-link-consultation" href="/consultation/"'),"Consultation CTA must remain in the header");
assert.match(read("magazine/index.html"),/مجله/);
