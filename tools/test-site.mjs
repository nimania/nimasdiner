import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const dist=path.join(process.cwd(),"site-dist");
const read=p=>fs.readFileSync(path.join(dist,p),"utf8");
const mustExist=["index.html","get-book/index.html","library/index.html","library/01/index.html","library/02/index.html","library/03/index.html","magazine/index.html","magazine/01/index.html","guides/index.html","guides/food-cost/index.html","guides/menu-engineering/index.html","guides/restaurant-permits/index.html","tools/index.html","services/index.html","consulting/index.html","app/index.html","robots.txt","sitemap.xml","search-index.json"];
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
