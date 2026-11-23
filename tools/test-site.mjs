import assert from "node:assert/strict";
import crypto from "node:crypto";
import {renderBrandTopicPages} from "./brand-topic-pages.mjs";
import {persianDigits, persianizeHTML} from "./persian-digits-html.mjs";
import fs from "node:fs";
import path from "node:path";

const dist=path.join(process.cwd(),"site-dist");
const read=p=>fs.readFileSync(path.join(dist,p),"utf8");
const mustExist=["index.html","get-book/index.html","library/index.html","library/01/index.html","library/02/index.html","library/03/index.html","magazine/index.html","magazine/01/index.html","guides/index.html","guides/food-cost/index.html","guides/menu-engineering/index.html","guides/restaurant-permits/index.html","tools/index.html","services/index.html","consultation/index.html","consulting/index.html","app/index.html","robots.txt","sitemap.xml","search-index.json"];
for(const p of mustExist){assert.ok(fs.existsSync(path.join(dist,p)),p+" missing");}

for(const p of ["media/index.html","jan-kalam/index.html"]){assert.ok(fs.existsSync(path.join(dist,p)),p+" missing");}
const personalHome=read("media/index.html");
const janKalamHub=read("jan-kalam/index.html");
assert.match(personalHome,/روزنامه‌نگار، عکاس، پژوهشگر و تحلیل‌گر/,"Professional identity missing");
assert.match(personalHome,/href="\/jan-kalam\/"/,"Jan Kalam link missing in personal homepage");
assert.match(janKalamHub,/نقل سخنان اشخاص/,"Editorial attribution policy missing");
assert.match(janKalamHub,/https:\/\/www\.youtube\.com\/@nimaafsharnaderi/,"Official video channel missing");
assert.match(personalHome,/rel="canonical" href="https:\/\/nimania\.net\/media\/"/);
assert.match(janKalamHub,/rel="canonical" href="https:\/\/nimania\.net\/jan-kalam\/"/);
assert.match(read("sitemap.xml"),/https:\/\/nimania\.net\/media\//);
assert.match(read("sitemap.xml"),/https:\/\/nimania\.net\/jan-kalam\//);
assert.ok(!fs.existsSync(path.join(dist,"jan-kalam/merchandise/index.html")),"Unverified draft must not publish");
assert.match(read("index.html"),/href="\/media\/"/,"Diner must expose a restrained link to personal works");
console.log("Personal media archive routes, draft exclusion, canonical, sitemap and Diner footer passed");

const photoRoutes=["photography/index.html","photography/blog/index.html","photography/collections/index.html","photography/archive/index.html"];
for(const filename of photoRoutes)assert.ok(fs.existsSync(path.join(dist,filename)),"Missing photography route: "+filename);
const photohome=read("photography/index.html");
const photoblog=read("photography/blog/index.html");
const photoCollections=read("photography/collections/index.html");
const photoArchive=read("photography/archive/index.html");
assert.match(photohome,/دیدن، ثبت‌کردن، روایت‌کردن/);
assert.match(photohome,/rel="canonical" href="https:\/\/nimania\.net\/photography\/"/);
assert.match(photoblog,/rel="canonical" href="https:\/\/nimania\.net\/photography\/blog\/"/);
assert.match(photoblog,/فوتوبلاگ/);
assert.match(photoCollections,/مجموعه‌عکس‌ها/);
assert.match(photoArchive,/آرشیو تصویری/);
assert.match(photohome,/href="\/photography\/blog\/"/);
assert.match(photohome,/href="\/photography\/collections\/"/);
assert.match(read("media/index.html"),/href="\/photography\/"/,"Personal identity hub must link to photography");
assert.match(read("jan-kalam/index.html"),/href="\/photography\/"/,"Personal menu must link to photography");
assert.match(read("sitemap.xml"),/https:\/\/nimania\.net\/photography\/</,"Photography landing must be discoverable");
assert.doesNotMatch(read("sitemap.xml"),/https:\/\/nimania\.net\/photography\/blog\/</,"Empty photoblog should not be indexed");
for(const empty of [photoblog,photoCollections,photoArchive]){
 assert.match(empty,/noindex,follow/,"Empty photo sections should not be indexed until works are added");
 assert.match(empty,/آرشیو در حال تکمیل است/);
 assert.doesNotMatch(empty,/class="ph-tile"/,"Never invent a photo portfolio entry");
}
const photoCatalog=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/photography.json"),"utf8"));
assert.ok(Array.isArray(photoCatalog.entries),"Photography catalog must be data-driven");
assert.ok(photoCatalog.entries.every(item=>item.status!=="published"||item.photographs?.length),"Published photo entries must carry images");
console.log("Photography portfolio, photoblog, collections, archive, canonical and non-indexing of empty galleries passed");
const worldBookPages=["books/index.html","books/foreign/index.html","books/iranian/index.html","books/foreign/restaurant-success-by-the-numbers/index.html","books/foreign/setting-the-table/index.html","books/foreign/unreasonable-hospitality/index.html","books/foreign/the-e-myth-revisited/index.html","books/foreign/work-clean/index.html","books/iranian/ketab-mostatab-ashpazi/index.html","books/iranian/honar-e-ashpazi/index.html","books/iranian/honar-e-ashpazi-dar-gilan/index.html","books/iranian/khuraki-haye-sarzamin-baran/index.html","books/iranian/kuchak-khanom/index.html"];
for(const p of worldBookPages){ assert.ok(fs.existsSync(path.join(dist,p)),p+" missing"); const html=read(p);assert.match(html,/rel="canonical"/);assert.match(html,/lang="fa" dir="rtl"/);}
for(const url of ["/books/","/books/foreign/","/books/iranian/"]){assert.ok(read("sitemap.xml").includes(url),"World book index missing in sitemap: "+url);}
assert.ok(read("library/index.html").includes("/books/foreign/"),"Existing author library must link to foreign titles");
assert.ok(read("library/index.html").includes("/books/iranian/"),"Existing author library must link to Iranian titles");
assert.ok(read("books/index.html").includes("/library/"),"World catalog must link to existing author library");
assert.ok(!read("books/foreign/setting-the-table/index.html").includes("دانلود رایگان کتاب"),"Must not market unauthorized free full texts");
for(const slug of ["restaurant-success-by-the-numbers","setting-the-table","unreasonable-hospitality","the-e-myth-revisited","work-clean"]){ const html=read("books/foreign/"+slug+"/index.html");assert.match(html,/<img src="https:\/\//, "Real foreign book jacket missing: "+slug);assert.match(html,/alt="جلد کتاب/, "Accessible alt missing");assert.match(html,/figcaption/, "Cover source credit missing"); }
for(const slug of ["ketab-mostatab-ashpazi","honar-e-ashpazi","honar-e-ashpazi-dar-gilan","kuchak-khanom"]){ const html=read("books/iranian/"+slug+"/index.html");assert.match(html,/<img src="https:\/\//,"Real Iranian book jacket missing: "+slug);assert.match(html,/figcaption/,"Cover source credit missing"); }
assert.match(read("books/iranian/khuraki-haye-sarzamin-baran/index.html"),/تصویر جلد این چاپ هنوز تأیید نشده است/,"Do not invent image for unverified title");
assert.match(read("books/foreign/index.html"),/world-book-card/);
assert.match(read("books/iranian/index.html"),/world-book-card/);
assert.match(read("site-v2.css"),/world-book-cover/);
console.log("Cover provenance, accessible image markup and missing-cover disclosure passed");

// Editorial review depth and downloadable PDFs for the full 10-book collection.
const worldCatalog=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/world-books.json"),"utf8"));
const worldAnalyses=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/world-book-reviews.json"),"utf8"));
assert.equal(worldCatalog.books.length,10);
assert.equal(worldAnalyses.reviews.length,10);
const reviewKeys=new Set(worldAnalyses.reviews.map(x=>x.slug));
for(const b of worldCatalog.books){
  assert.ok(reviewKeys.has(b.slug),"Editorial analysis missing: "+b.slug);
  const dir="books/"+b.group+"/"+b.slug+"/";
  const html=read(dir+"index.html");
  assert.match(html,/world-book-analysis-item/,"Deep analysis not rendered: "+b.slug);
  assert.match(html,/سه تمرین برای رستوران‌های ایران/,"Exercises missing: "+b.slug);
  assert.match(html,/مرور فارسی قابل دریافت/,"PDF content section missing: "+b.slug);
  assert.match(html,/summary\.pdf/,"PDF link missing: "+b.slug);
  const pdfPath=path.join(dist,dir,"summary.pdf");
  assert.ok(fs.existsSync(pdfPath),"Persian PDF missing: "+pdfPath);
  const pdf=fs.readFileSync(pdfPath);
  assert.ok(pdf.length>5000,"Empty PDF: "+pdfPath);
  assert.equal(pdf.toString("ascii",0,5),"%PDF-","Invalid PDF header: "+pdfPath);
}
console.log("Ten sourced, full editorial reviews and Persian PDFs passed");

for(const b of worldCatalog.books){
  const epubPath=path.join(dist,"books",b.group,b.slug,"summary.epub");
  assert.ok(fs.existsSync(epubPath),"Missing EPUB: "+epubPath);
  const epub=fs.readFileSync(epubPath);
  assert.ok(epub.length>1500,"Unexpectedly small EPUB: "+epubPath);
  assert.equal(epub.toString("ascii",0,2),"PK","Invalid EPUB archive: "+epubPath);
  const html=read("books/"+b.group+"/"+b.slug+"/index.html");
  assert.match(html,/summary\.epub/,"EPUB download link missing: "+b.slug);
  assert.match(html,/books\/reader\/\?book=/,"EPUB reader link missing: "+b.slug);
}
const readerHtml=read("books/reader/index.html");
assert.match(readerHtml,/epub\.min\.js/);
assert.match(readerHtml,/diner-epub-/);
console.log("Ten EPUB files and browser reader links passed");


console.log("World food books index and individual pages passed");
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
const catalogBooks=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/catalog.json"),"utf8")).books;
const plannedBookPaths=catalogBooks.filter(b=>b.status!=="published").map(b=>"/library/"+String(b.n).padStart(2,"0")+"/");
assert.ok(plannedBookPaths.length>0,"roadmap should list planned books");
for(const u of plannedBookPaths)assert.ok(!sitemap.includes(u),"unpublished books must not be indexed: "+u);
assert.match(sitemap,/\/library\/04\//,"published e-book «دیده شو» must be indexed");
assert.doesNotMatch(sitemap,/\/search\//,"search should not be indexed");
assert.match(read("search/index.html"),/noindex,follow/);
const items=JSON.parse(read("search-index.json"));
assert.ok(items.length>=10,"search pages too few");
assert.ok(items.every(item=>item.url.startsWith("/")),"search URLs incorrect");
assert.ok(!items.some(item=>plannedBookPaths.some(u=>item.url.includes(u))),"planned content in search index");
assert.equal((read("library/index.html").match(/timeline-item/g)||[]).length,catalogBooks.length,"missing roadmap volumes");
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
const tfcHtml=read("reviews/tehran-fried-chicken-tfc/index.html");
assert.ok(tfcHtml.includes("رضا هراتی تهرانی"),"TFC successor mentioned with factual context");
assert.ok(tfcHtml.includes("محسن هراتی تهرانی"),"TFC founder retained");
assert.ok(tfcHtml.includes("tehranfriedchicken.com/about-us/"),"Founder facts linked to official history");
assert.ok(tfcHtml.includes("Tehran Fried Chicken"),"English brand alias indexable");
const offsideSeoHtml=read("reviews/offside-nowshahr/index.html");
assert.ok(offsideSeoHtml.includes("آفساید نوشهر | نقد، منو، قیمت و عکس"),"Offside search-intent title");
assert.ok(offsideSeoHtml.includes("Offside Nowshahr"),"English discovery alias");
const ciabbataSeoHtml=read("reviews/ciabatta-cucina-gandhi/index.html");
assert.ok(ciabbataSeoHtml.includes("Ciabbata Cucina Tehran"),"Ciabbata English naming");
// Review improvements must answer real search intents without inventing prices or experiences.
const offsideImproved=read("reviews/offside-nowshahr/index.html");
assert.ok(offsideImproved.includes("پاسخ کوتاه به پرسش‌های رایج درباره آفساید نوشهر"));
assert.ok(offsideImproved.includes("گالری چه اطلاعاتی می‌دهد؟"));
assert.ok(offsideImproved.includes("https://sepidz.menu/caferestaurant/offside"));
assert.ok(offsideImproved.includes("review-gallery-offside-nowshahr"));
assert.ok(offsideImproved.includes("۲۴ آبان ۱۴۰۵"));
const ciabbataImproved=read("reviews/ciabatta-cucina-gandhi/index.html");
assert.ok(ciabbataImproved.includes("منوی چاباتا کوچینا تهران؛ چه می‌دانیم و چه نمی‌دانیم؟"));
assert.ok(ciabbataImproved.includes("پرسش‌های رایج درباره چاباتا کوچینا"));
assert.ok(ciabbataImproved.includes("قیمت روز هر ساندویچ"));
assert.ok(ciabbataImproved.includes("غذا نخورده‌ام"));
assert.ok(ciabbataImproved.includes("شماره واحد نیازمند تأیید"));
assert.ok(!ciabbataImproved.includes("منوی رسمی و به‌روز چاباتا کوچینا را ببینید"));
const offsideRecord=reviews.reviews.find(r=>r.slug==="offside-nowshahr");
const ciabbataRecord=reviews.reviews.find(r=>r.slug==="ciabatta-cucina-gandhi");
assert.equal(offsideRecord.updatedAt,"2026-11-21");
assert.equal(ciabbataRecord.updatedAt,"2026-11-21");
assert.equal(offsideRecord.photoGallery.length>=16,true,"Offside gallery must remain intact");
assert.equal(ciabbataRecord.photos.length,0,"Do not invent Ciabbata photos");
assert.ok(!ciabbataImproved.includes('FAQPage'),"No FAQ rich-result markup on editorial reviews");
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



const glossaryPage=read("glossary/index.html");
assert.equal((glossaryPage.match(/data-glossary-term=/g)||[]).length,JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/glossary.json"),"utf8")).terms.length,"glossary terms missing");
assert.match(glossaryPage,/rel="canonical" href="https:\/\/nimania\.net\/glossary\/"/,"glossary canonical");
assert.match(glossaryPage,/"@type":"DefinedTermSet"/,"glossary structured data");
assert.match(read("sitemap.xml"),/\/glossary\//,"glossary missing from sitemap");
assert.match(read("guides/index.html"),/href="\/glossary\/"/,"glossary link missing from guides hub");
{
 const {renderGlossary}=await import("./glossary-page.mjs");
 const g=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/glossary.json"),"utf8"));
 const e=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/glossary-entries.json"),"utf8"));
 const future=[];renderGlossary({glossary:structuredClone(g),entries:e,today:"2999-01-01",add:p=>future.push(p),crumbs:()=>"",link:p=>"/"+p,esc:s=>String(s)});
 assert.equal(future.filter(p=>p.startsWith("glossary/")&&p!=="glossary/").length,e.entries.length,"every scheduled glossary entry must render");
 const past=[];renderGlossary({glossary:structuredClone(g),entries:e,today:"2000-01-01",add:p=>past.push(p),crumbs:()=>"",link:p=>"/"+p,esc:s=>String(s)});
 assert.deepEqual(past,["glossary/"],"unscheduled entries must not be published early");
}
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
for(const n of ["01","02","03","04","05"]){
 const preview="library/"+n+"/sample/index.html";
 assert.ok(fs.existsSync(path.join(dist,preview)),"Five-page book sample missing: "+preview);
 const html=read(preview);
 assert.match(html,/noindex,follow/);
 assert.equal((html.match(/class="sample-paper"/g)||[]).length,5,"Five preview pages required: "+n);
 assert.ok(!html.includes("NimaDiner_Book"+Number(n)+"_Complete_"),"Paid ebook source file must never be linked");
 assert.match(read("library/"+n+"/index.html"),new RegExp("href=\"/library/"+n+"/sample/\""));
}
assert.doesNotMatch(read("sitemap.xml"),/\/library\/(01|02|03|04|05)\/sample\//,"Samples should not crowd the public sitemap");
console.log("Book prices, savings, five-page samples and paid ebook isolation checked.");

{
 const ebook=read("library/04/index.html");
 assert.match(ebook,/چاپی به‌زودی/,"digital-only book must say print is coming");
 assert.match(ebook,/۵۰۰٬۰۰۰/,"digital-only book must show the e-book price");
 assert.doesNotMatch(ebook,/سفارش چاپی ←/,"digital-only book must not offer a print order");
}
for(const n of ["01","02","03","04","05"]){
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


/* Layout/SEO regression: sidebar must improve discovery, preserve main content,
   Article metadata, canonical and existing page URLs. */
const exampleGuide=read("guides/menu-engineering/index.html");
const exampleCase=read("reading/starbucks-closed-stores-barista-training-lesson/index.html");
for(const [page,html] of [["guides/menu-engineering/",exampleGuide],["reading/starbucks-closed-stores-barista-training-lesson/",exampleCase]]){
  assert.match(html,/<article class="article wrap knowledge-layout">/,"Missing contextual article layout: "+page);
  assert.match(html,/<aside class="knowledge-sidebar" aria-label="دسترسی سریع/,"Missing server-rendered navigation: "+page);
  assert.match(html,/<nav class="knowledge-side-nav"/,"Missing crawlable navigation: "+page);
  const jumps=[...html.matchAll(/<a href="#(section-\d+)">/g)].map(m=>m[1]);
  assert.ok(jumps.length>=2,"No heading jump anchors: "+page);
  for(const id of jumps)assert.ok(html.includes('id="'+id+'"'),"Broken jump destination "+id+" in "+page);
  assert.match(html,/<h1>/,"Main heading missing "+page);
  assert.match(html,/rel="canonical"/,"Canonical removed "+page);
  assert.match(html,/"@type":"Article"/,"Article schema removed "+page);
  assert.ok(sitemap.includes("/"+page),"Indexed URL missing from sitemap "+page);
}
assert.match(exampleCase,/href="\/reading\/brands\/starbucks\/"/,"Missing crawlable brand link in sidebar");
assert.match(exampleGuide,/href="\/tools\/"/,"Missing related tools link");
assert.doesNotMatch(read("index.html"),/class="knowledge-sidebar"/,"Home must remain full width");
assert.doesNotMatch(read("reading/brand-lessons/index.html"),/class="knowledge-sidebar"/,"Brand grid must remain full width");
const densityStyles=read("site-v2.css");
assert.match(densityStyles,/\.hero-inner\{min-height:410px/,"Compact desktop hero missing");
assert.match(densityStyles,/\.pagehead\{padding-block:26px 8px/,"Compact page heading missing");
assert.match(densityStyles,/@media\(max-width:950px\)/,"Responsive nav breakpoint missing");
assert.match(densityStyles,/\.knowledge-side-nav\{display:flex;gap:8px;overflow-x:auto/,"Mobile nav should scroll horizontally");
console.log("Compact layouts and crawlable sidebar/mobile navigation checks passed");

// Book 05 «منوی سودده»: QR-printed companion routes and tools must exist.
for(const p of ["b5/","b5/3/","b5/4/","b5/7/","b5/8/","b5/10/","b5/13/"]){
 const html=read(p+"index.html");
 assert.match(html,/persian-digits\.js/,"localization script missing on "+p);
 if(["b5/3/","b5/4/","b5/10/"].includes(p))assert.match(html,/assets\/b5-tools\.js/,"tool script missing on "+p);
}
{
 const e5=read("library/05/index.html");
 assert.match(e5,/چاپی به‌زودی/,"book 05 must say print is coming");
 assert.match(e5,/۵۰۰٬۰۰۰/,"book 05 must show the e-book price");
 assert.doesNotMatch(e5,/سفارش چاپی ←/,"book 05 must not offer a print order");
 assert.match(read("sitemap.xml"),/\/library\/05\//,"book 05 must be indexed");
 assert.match(read("b5/index.html"),/href="\/library\/05\/"/,"/b5/ must link to /library/05/");
 for(const n of ["01","02","03","04","05"])assert.match(read("library/"+n+"/index.html"),/other-book-5|other-book-1/,"other-books section missing on "+n);
 assert.match(read("library/01/index.html"),/\/library\/05\//,"book pages must link to book 05");
}
console.log("Book 05 companion pages and tools checked.");


// Prompt library: accessible illustrated examples, honest labeling, and stable routes.
{
  const promptData=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/prompts.json"),"utf8"));
  const samples=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/prompt-examples.json"),"utf8"));
  assert.equal(samples.entries.length,12,"Launch showcase should have 12 examples");
  assert.equal(new Set(samples.entries.map(x=>x.slug)).size,12,"Sample slugs must be unique");
  assert.ok(fs.statSync(path.join(dist,"assets/prompts/showcase.jpg")).size>10000,"Bundled photo asset missing");
  const archive=read("prompts/index.html");
  assert.match(archive,/id="prompt-only-examples"/,"Sample-only filter missing");
  assert.match(archive,/نمونه تصویری/,"Sample badges absent");
  assert.match(archive,/نمونه پاسخ/,"Text example badge absent");
  assert.match(read("assets/prompts.css"),/\/assets\/prompts\/showcase\.jpg/,"Sprite URL must be rewritten to the domain root");
  for(const sample of samples.entries){
    assert.ok(promptData.prompts.some(p=>p.slug===sample.slug),"Sample references unknown prompt "+sample.slug);
    const html=read("prompts/"+sample.slug+"/index.html");
    assert.match(html,/id="prompt-example-heading"/,"Output example section missing: "+sample.slug);
    assert.match(html,/نمونه خروجی/,"Example label missing: "+sample.slug);
    assert.match(html,/تصویر مفهومی|ماکت تبلیغاتی|متن نمونه/,"Example type missing: "+sample.slug);
    assert.match(html,/نمونه|فرضی|نمایشی/,"Demo nature not disclosed: "+sample.slug);
    assert.match(html,/کپی پرامپت/,"Prompt itself must remain copyable: "+sample.slug);
    assert.ok(sitemap.includes("/prompts/"+sample.slug+"/"),"Missing prompt in sitemap: "+sample.slug);
    if(sample.kind==="text")assert.match(html,/prompt-example-output/,"Text example missing: "+sample.slug);
    else assert.match(html,/prompt-sample-image/,"Visual example missing: "+sample.slug);
  }
  assert.equal([...read("prompts/index.html").matchAll(/class="prompt-card" data-category/g)].length,promptData.prompts.length,"Original card count must be preserved");
  console.log("Prompt gallery, 12 samples, and indexed routes checked.");
}


// Prompt Studio v2: no removed routes, browser-only customization, honest sample provenance.
{
 const studio=read("prompts/studio/index.html");
 const gallery=read("prompts/showcase/index.html");
 const archive=read("prompts/index.html");
 const quality=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/prompt-quality.json"),"utf8"));
 const examples=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/prompt-comparisons.json"),"utf8"));
 assert.match(studio,/id="studio-template"/);
 assert.match(studio,/id="studio-templates"/);
 assert.match(studio,/id="studio-copy"/);
 assert.match(studio,/id="studio-result"/);
 assert.match(gallery,/class="compare-range"/);
 assert.match(gallery,/تصاویر فرضی/);
 assert.match(gallery,/ساختگی/);
 assert.match(archive,/\/prompts\/studio\//);
 assert.match(archive,/\/prompts\/showcase\//);
 assert.match(sitemap,/\/prompts\/studio\//);
 assert.match(sitemap,/\/prompts\/showcase\//);
 assert.equal(examples.comparisons.length,2);
 for(const item of examples.comparisons) {
   assert.ok(fs.existsSync(path.join(dist,item.before)),item.before+" missing");
   assert.ok(fs.existsSync(path.join(dist,item.after)),item.after+" missing");
   assert.match(read("prompts/"+item.slug+"/index.html"),/class="compare-range"/);
 }
 for(const slug of Object.keys(quality.profiles)) {
   const html=read("prompts/"+slug+"/index.html");
   assert.match(html,/شناسنامه پرامپت/);
   assert.match(html,/آزمون مستقل مستند نشده/);
   assert.match(html,/پرامپت‌ساز اختصاصی/);
   assert.doesNotMatch(html,/آزمون مستقل موفق|تضمین نتیجه/);
 }
 const js=read("assets/prompts-studio.js");
 assert.match(js,/navigator\.clipboard/);
 assert.match(js,/data-compare-card/);
 assert.doesNotMatch(js,/\bfetch\(/);
 assert.doesNotMatch(js,/localStorage|sessionStorage/);
 console.log("Prompt Studio v2, before-after samples and transparent quality profiles checked.");
}

// Long-form Shooka case study remains crawlable and connected to its archival sources.
const shookaCasePath="reading/yarali-pourmoghadam-shooka-cafe-management/index.html";
const shookaCase=read(shookaCasePath);
assert.match(shookaCase,/یارعلی پورمقدم/,"Shooka case study must name its subject");
assert.match(shookaCase,/کافه شوکا/,"Shooka case study must identify the cafe");
assert.match(shookaCase,/هریسه/,"Shooka case study must include archival product evidence");
assert.match(shookaCase,/وفاداری مشتری/,"Shooka case study must include customer loyalty analysis");
assert.match(shookaCase,/انسان‌شناسی و فرهنگ/,"Shooka case study must credit historical primary interview");
assert.match(read("sitemap.xml"),/\/reading\/yarali-pourmoghadam-shooka-cafe-management\//,"Shooka case must enter sitemap");
for(const oldRoute of ["shooka-cafe","shooka-cafe-1405","gandhi-shopping-center"]){
 const old=read("reviews/"+oldRoute+"/index.html");
 assert.match(old,/\/reading\/yarali-pourmoghadam-shooka-cafe-management\//,"Historic or related review must link to Shooka analysis: "+oldRoute);
}
console.log("Shooka case study SEO, source attribution and archival links passed");


 // Mag 02 public assets: stable, same-origin PDFs and exact SHA-256-verified inputs.
 const issue02Dir="assets/magazine/";
 const issuePdf=fs.readFileSync(path.join(dist,issue02Dir+"02.pdf"));
 const issueCover=fs.readFileSync(path.join(dist,issue02Dir+"02-cover.png"));
 assert.equal(issuePdf.length,5600477,"Diner 02 PDF size changed unexpectedly");
 assert.equal(issueCover.length,1919074,"Diner 02 cover size changed unexpectedly");
 assert.equal(issuePdf.toString("ascii",0,5),"%PDF-","Magazine 02 must be an actual PDF");
 assert.equal(issueCover.toString("hex",0,8),"89504e470d0a1a0a","Magazine 02 must be a PNG");
 assert.equal(crypto.createHash("sha256").update(issuePdf).digest("hex"),"025d5b5d6b32d5de157211b4e937f66e68df4db3e685f4bb976853c795170f3b");
 assert.equal(crypto.createHash("sha256").update(issueCover).digest("hex"),"2877d4c1199bd00fe4e4395fcf19832af0a22438d79cec51e732b57146a407de");
 const issuePage=read("magazine/02/index.html");
 const magazineArchivePage=read("magazine/index.html");
 const shookaArticlePage=read("reading/yarali-pourmoghadam-shooka-cafe-management/index.html");
 for(const h of [issuePage,magazineArchivePage,shookaArticlePage]){
   assert.doesNotMatch(h,/solar-loop\.space\.fast/i,"Old temporary host leaked into published pages");
 }
 assert.match(issuePage,/https:\/\/nimania\.net\/assets\/magazine\/02\.pdf/);
 assert.match(issuePage,/https:\/\/nimania\.net\/assets\/magazine\/02-cover\.png/);
 assert.match(shookaArticlePage,/\/magazine\/02\//,"Shooka article must link to magazine");
 assert.match(shookaArticlePage,/https:\/\/nimania\.net\/assets\/magazine\/02\.pdf/);
 assert.match(magazineArchivePage,/\/magazine\/01\//,"Croissant magazine 01 must remain available");
 assert.match(magazineArchivePage,/\/magazine\/02\//,"New magazine 02 must be discoverable");
 assert.match(read("sitemap.xml"),/\/magazine\/02\//,"New magazine must appear in sitemap");
 console.log("Diner magazine 02 verified: original binary assets, canonical URLs, archive, SEO, and no temporary host");


// Diner OS phase one must preserve search URL, source-grounded answers and static SEO.
const dinerSearch=read("search/index.html");
assert.match(dinerSearch,/DINER OS/,"Diner OS search identity missing");
assert.match(dinerSearch,/id="local-search"/,"Hybrid search input missing");
assert.match(dinerSearch,/id="diner-os-answer"/,"Source-grounded answer panel missing");
assert.match(dinerSearch,/data-diner-example="چطور فودکاست/,"Example controls missing");
assert.match(dinerSearch,/noindex,follow/,"Search results route must stay noindex");
assert.doesNotMatch(read("sitemap.xml"),/<loc>[^<]*\/search\//,"Search route must not appear in sitemap");
assert.match(read("index.html"),/از داینر بپرس/,"Global navigation must expose new search");
assert.match(read("site-v2.js"),/const ranked=\(pages,q\)/,"Ranking script missing");
assert.match(read("site-v2.js"),/answerSummary\.textContent=best\.description/,"Answer must come from published descriptions");
assert.match(read("site-v2.js"),/search-index\.json/,"Existing local search index must remain");
assert.doesNotMatch(dinerSearch,/sk-proj-|OPENAI_API_KEY/i,"No credentials on public page");
console.log("Diner OS hybrid search and SEO-preserving checks passed");


// Academy: publish only released lessons, retain existing URLs, and index the course.
const academyIndex=read("academy/index.html");
const courseIndex=read("academy/restaurant-management-101/index.html");
const academyLessonOne=read("academy/restaurant-management-101/lesson-01/index.html");
const academySitemap=read("sitemap.xml");
const academySearch=JSON.parse(read("search-index.json"));
for(const url of ["/academy/","/academy/restaurant-management-101/","/academy/restaurant-management-101/lesson-01/"]){
  assert.ok(academySitemap.includes("https://nimania.net"+url),"Academy page missing from sitemap: "+url);
  assert.ok(academySearch.some(x=>x.url===url),"Academy page missing from search index: "+url);
}
assert.match(academyIndex,/restaurant-management-101/);
assert.match(courseIndex,/قوانین ۱ تا ۱۵/);
assert.match(courseIndex,/در برنامه/);
assert.match(courseIndex,/schema.org/);
assert.match(academyLessonOne,/www.youtube-nocookie.com\/embed\/P9y2UdNuztc/);
assert.match(academyLessonOne,/www.aparat.com\/v\/rstd525/);
assert.match(academyLessonOne,/قوانین ۱ تا ۱۵/);
assert.match(academyLessonOne,/مرجع جامع مدیریت رستوران/);
assert.ok(!fs.existsSync(path.join(dist,"academy/restaurant-management-101/lesson-02/index.html")),"Unreleased lesson should not create a thin page");
assert.ok(read("index.html").includes("/academy/"),"Homepage lacks academy entry");
assert.ok(read("library/01/index.html").includes("/academy/restaurant-management-101/"),"Yellow book lacks course entry");
assert.ok(read("assets/academy.css").includes(".academy-video"),"Academy styling missing from output");
console.log("Academy course, lesson, SEO, availability, and cross-links passed");
