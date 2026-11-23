// Personal photography portfolio, photo essays and documentary image archive.
// Published entries require actual owned photographs stored in assets/photography/.
// This module does not modify existing Diner routes.
import fs from "node:fs";
import path from "node:path";

const SITE = "https://nimania.net";
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sections = {
  blog: {title:"فوتوبلاگ",eyebrow:"PHOTO JOURNAL",url:"photography/blog/",description:"روایت‌های عکاسانه، یادداشت‌های تصویری و داستان پشت عکس‌ها؛ از نگاه نیما افشارنادری.",lead:"هر تصویر می‌تواند آغاز یک روایت باشد؛ فوتوبلاگ، محل پیوند عکس با یادداشت، خاطره و مشاهده روزنامه‌نگارانه است."},
  collections: {title:"مجموعه‌عکس‌ها",eyebrow:"SELECTED STORIES",url:"photography/collections/",description:"مجموعه‌عکس‌ها و پروژه‌های تصویری نیما افشارنادری؛ روایت موضوعات در چند قاب.",lead:"داستان‌هایی که در یک فریم تمام نمی‌شوند؛ مجموعه‌های تصویری با ترتیب و روایت مشخص."},
  archive: {title:"آرشیو تصویری",eyebrow:"DOCUMENTARY ARCHIVE",url:"photography/archive/",description:"آرشیو آثار تصویری و عکس‌های مستند نیما افشارنادری، همراه با تاریخ و شرح زمینه.",lead:"عکس‌های گذشته، همراه با توضیح زمان و زمینه ثبت؛ آرشیوی برای خواندن دوباره لحظه‌ها."}
};
const styling = [
"@font-face{font-family:PhotoVazir;src:url('/assets/Vazirmatn-Regular.ttf') format('truetype');font-weight:400;font-display:swap}",
"@font-face{font-family:PhotoVazir;src:url('/assets/Vazirmatn-Bold.ttf') format('truetype');font-weight:700;font-display:swap}",
".ph-body{margin:0;background:#f8f7f4;color:#222323;font:16px/1.9 PhotoVazir,Tahoma,sans-serif}",
".ph-body *{box-sizing:border-box}.ph-body a{color:inherit;text-decoration:none}.ph-body a:hover{text-decoration:underline;text-underline-offset:4px}",
".ph-wrap{width:min(1120px,calc(100% - 44px));margin-inline:auto}.ph-top{background:#fdfcf9;border-bottom:1px solid #e1dfd9}.ph-top-inner{display:flex;justify-content:space-between;align-items:center;gap:22px;min-height:76px}",
".ph-brand{font-weight:700;font-size:18px;line-height:1.3}.ph-brand small{display:block;font:11px/1.8 sans-serif;color:#72716d;letter-spacing:1px;text-align:right;direction:ltr}",
".ph-nav{display:flex;gap:17px;flex-wrap:wrap;align-items:center}.ph-nav a{font-size:13px;font-weight:700}.ph-nav a[aria-current='page']{border-bottom:2px solid #242424}",
".ph-eyebrow{font:700 11px/1.8 sans-serif;letter-spacing:2px;color:#a1a19c;direction:ltr;text-align:right;text-transform:uppercase}",
".ph-hero{background:#1b1d1c;color:#f9f8f4;position:relative;overflow:hidden;min-height:470px;display:flex;align-items:center}",
".ph-hero:before{content:'';width:37vw;max-width:440px;aspect-ratio:3/4;position:absolute;left:8%;top:-15%;border:1px solid #ffffff26;transform:rotate(-7deg)}",
".ph-hero:after{content:'';width:23vw;max-width:230px;aspect-ratio:3/4;position:absolute;left:20%;bottom:-45%;border:1px solid #ffffff40;transform:rotate(6deg)}",
".ph-hero-content{padding:72px 0;position:relative;z-index:1}.ph-hero h1{font-size:clamp(36px,6vw,72px);line-height:1.45;max-width:770px;margin:8px 0 18px;letter-spacing:-.7px}",
".ph-hero p{font-size:clamp(15px,1.7vw,19px);max-width:690px;color:#d0d0cb}.ph-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:29px}",
".ph-link{display:inline-flex;align-items:center;justify-content:center;padding:10px 19px;min-height:45px;border:1px solid #bdbdb8;font-size:13px;font-weight:700}",
".ph-link.primary{background:#faf9f6;color:#242424}.ph-link:hover{text-decoration:none;background:#ebebe7;color:#242424}",
".ph-section{padding:59px 0;border-bottom:1px solid #e3e1dd}.ph-section h2{font-size:clamp(23px,3vw,30px);margin:0 0 14px;line-height:1.5}.ph-lead{font-size:17px;max-width:820px;color:#5d5e5a}",
".ph-categories{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:29px}",
".ph-category{background:#fff;border:1px solid #e3e0d9;min-height:235px;padding:29px 23px;display:flex;flex-direction:column;justify-content:space-between}",
".ph-category .ph-index{color:#9a9b95;font:700 12px sans-serif}.ph-category h3{font-size:23px;line-height:1.4;margin:14px 0 10px}.ph-category p{font-size:13px;color:#62645f;line-height:1.95;margin:0 0 11px}",
".ph-category a{font-size:13px;font-weight:700}.ph-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;margin-top:30px}",
".ph-tile{background:#fff;border:1px solid #e3e0d9;overflow:hidden}.ph-tile img{width:100%;aspect-ratio:3/2;display:block;object-fit:cover}",
".ph-tile-body{padding:22px}.ph-tile h3{margin:6px 0 8px;font-size:20px;line-height:1.45}.ph-tile p{font-size:13px;color:#666861;margin:0}",
".ph-muted{font-size:13px;color:#777871}.ph-empty{padding:29px;background:#f0eee8;border-right:3px solid #a7a49a;color:#4d504a;margin-top:24px;max-width:850px}",
".ph-essay{max-width:940px;margin:0 auto;padding:47px 0 60px}.ph-essay h1{font-size:clamp(28px,5vw,48px);line-height:1.5;margin:8px 0 12px}",
".ph-prose{font-size:17px;line-height:2.15;max-width:830px}.ph-prose p{margin:14px 0 23px}.ph-figure{margin:36px 0 50px}",
".ph-figure img{display:block;max-height:820px;width:auto;max-width:100%;height:auto;margin-inline:auto}",
".ph-figure figcaption{color:#64655f;font-size:13px;margin:12px auto;max-width:820px;text-align:center}.ph-detail{display:flex;flex-wrap:wrap;gap:16px;margin:14px 0 30px;color:#5f615d;font-size:13px}",
".ph-breadcrumb{font-size:12px;margin-bottom:20px;color:#6b6e67}.ph-tags{display:flex;gap:8px;flex-wrap:wrap;margin-top:25px}.ph-tag{background:#eceae4;font-size:12px;padding:3px 11px}",
".ph-footer{background:#1c1e1d;color:#deded8;margin-top:28px;padding:33px 0;font-size:13px}.ph-footer-content{display:flex;gap:18px;align-items:center;justify-content:space-between;flex-wrap:wrap}",
".ph-footer a{color:#f8f6f0}.ph-access{position:absolute;right:-9999px}.ph-access:focus{right:10px;top:10px;background:#fff;padding:10px;z-index:99}",
"@media(max-width:800px){.ph-top-inner{padding:15px 0;align-items:flex-start;flex-direction:column;gap:15px}.ph-categories{grid-template-columns:1fr}.ph-category{min-height:165px}.ph-grid{grid-template-columns:1fr}}",
"@media(max-width:600px){.ph-wrap{width:min(100% - 30px,1120px)}.ph-hero{min-height:390px}.ph-hero-content{padding:48px 0}.ph-hero:before{left:-18%;width:80vw}.ph-hero:after{left:12%;width:50vw}.ph-section{padding:37px 0}.ph-nav{gap:13px}}",
"@media(prefers-reduced-motion:reduce){.ph-body *{scroll-behavior:auto}}"
].join("\n");

function schemaScript(value){return value?'<script type="application/ld+json">'+JSON.stringify(value).replace(/</g,"\\u003c")+'</script>':"";}
function add(pages,route,title,description,content,{index=true,modified="",schema=null,image=""}={}){
 const canonical=SITE+"/"+route;
 const metaImage=image?'<meta property="og:image" content="'+esc(SITE+image)+'"><meta name="twitter:card" content="summary_large_image">':"";
 const current=route.split("/")[1];
 const nav=[
  ["آثار نیما","/media/","media"],["عکاسی","/photography/","photography"],["فوتوبلاگ","/photography/blog/","blog"],
  ["مجموعه‌عکس‌ها","/photography/collections/","collections"],["آرشیو تصویری","/photography/archive/","archive"],["داینر","/","diner"]
 ].map(item=>'<a href="'+item[1]+'"'+(item[2]===current?' aria-current="page"':"")+'>'+item[0]+'</a>').join("");
 const html='<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+' | عکاسی نیما افشارنادری</title><meta name="description" content="'+esc(description)+'"><meta name="robots" content="'+(index?"index,follow":"noindex,follow")+'"><link rel="canonical" href="'+canonical+'"><meta property="og:site_name" content="نیما افشارنادری"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(description)+'"><meta property="og:url" content="'+canonical+'">'+metaImage+'<link rel="stylesheet" href="/site-v2.css"><style>'+styling+'</style>'+schemaScript(schema)+'</head><body class="ph-body"><a class="ph-access" href="#main">رفتن به محتوا</a><header class="ph-top"><div class="ph-wrap ph-top-inner"><a class="ph-brand" href="/photography/">نیما افشارنادری<small>PHOTOGRAPHY & PHOTO JOURNAL</small></a><nav class="ph-nav" aria-label="ناوبری عکاسی">'+nav+'</nav></div></header><main id="main">'+content+'</main><footer class="ph-footer"><div class="ph-wrap ph-footer-content"><div>عکاسی و روایت تصویری · نیما افشارنادری</div><div><a href="/media/">دیگر آثار</a> · <a href="/jan-kalam/">جان کلام</a> · <a href="/">داینر نیما</a></div></div></footer></body></html>';
 pages.push({path:route+"index.html",content:html,index,title,description,lastmod:modified||new Date().toISOString().slice(0,10),searchText:content.replace(/<[^>]*>/g," ").replace(/\s+/g," ").slice(0,22000)});
}
function teaser(entry){
 const first=entry.photographs[0];
 const target="/photography/"+entry.section+"/"+entry.slug+"/";
 return '<article class="ph-tile"><a href="'+target+'"><img loading="lazy" decoding="async" src="'+esc(first.src)+'" alt="'+esc(first.alt)+'" width="'+(first.width||1200)+'" height="'+(first.height||800)+'"></a><div class="ph-tile-body"><span class="ph-muted">'+esc(entry.publishedAt)+'</span><h3><a href="'+target+'">'+esc(entry.title)+'</a></h3><p>'+esc(entry.summary)+'</p></div></article>';
}
function emptyMessage(){
 return '<div class="ph-empty"><strong>آرشیو در حال تکمیل است.</strong><p>برای حفظ اصالت این مجموعه، فقط عکس‌ها و روایت‌های تأییدشده منتشر می‌شوند. تا ثبت نخستین آثار، این بخش بدون تصویر نمونه یا عکس منتسب‌نشده نمایش داده می‌شود.</p></div>';
}
function listing(pages,key,entries){
 const cfg=sections[key];
 const photos=entries.filter(item=>item.section===key);
 const head='<section class="ph-hero"><div class="ph-wrap ph-hero-content"><p class="ph-eyebrow">'+cfg.eyebrow+'</p><h1>'+cfg.title+'</h1><p>'+cfg.lead+'</p><div class="ph-actions"><a class="ph-link primary" href="/photography/">خانه عکاسی</a><a class="ph-link" href="/media/">آثار حرفه‌ای نیما</a></div></div></section>';
 const body='<section class="ph-wrap ph-section"><h2>آثار منتشرشده</h2><p class="ph-lead">'+cfg.description+'</p>'+(photos.length?'<div class="ph-grid">'+photos.map(teaser).join("")+'</div>':emptyMessage())+'</section>';
 // Empty sub-archives remain publicly navigable but are not indexed until they hold real photographs.
 add(pages,cfg.url,cfg.title,cfg.description,head+body,{index:photos.length>0});
}
function imageGallery(entry){
 return entry.photographs.map((img,i)=>'<figure class="ph-figure"><img src="'+esc(img.src)+'" alt="'+esc(img.alt)+'" loading="'+(i===0?"eager":"lazy")+'" decoding="async" width="'+(img.width||1200)+'" height="'+(img.height||800)+'"><figcaption>'+(img.caption?esc(img.caption)+" · ":"")+'عکس: '+esc(img.credit)+'</figcaption></figure>').join("");
}
function entryPage(pages,entry){
 const root=sections[entry.section].url;
 const location=entry.location?'<span>مکان: '+esc(entry.location)+'</span>':"";
 const date=entry.takenAt?'<span>زمان ثبت: '+esc(entry.takenAt)+'</span>':"";
 const camera=entry.camera?'<span>دوربین: '+esc(entry.camera)+'</span>':"";
 const tags=(entry.tags||[]).length?'<div class="ph-tags">'+entry.tags.map(tag=>'<span class="ph-tag">'+esc(tag)+'</span>').join("")+'</div>':"";
 const narrative=(entry.paragraphs||[]).map(para=>'<p>'+esc(para)+'</p>').join("");
 const body='<div class="ph-wrap"><article class="ph-essay"><nav class="ph-breadcrumb" aria-label="مسیر صفحه"><a href="/photography/">عکاسی</a> / <a href="/'+root+'">'+sections[entry.section].title+'</a> / '+esc(entry.title)+'</nav><p class="ph-eyebrow">'+sections[entry.section].eyebrow+'</p><h1>'+esc(entry.title)+'</h1><p class="ph-lead">'+esc(entry.summary)+'</p><div class="ph-detail"><span>انتشار: <time datetime="'+entry.publishedAt+'">'+entry.publishedAt+'</time></span>'+location+date+camera+'</div>'+imageGallery(entry)+'<div class="ph-prose">'+narrative+'</div>'+tags+'<p class="ph-muted">تمام حقوق تصاویر متعلق به صاحب اثر است. استفاده و بازنشر نیازمند اجازه است.</p></article></div>';
 const images=entry.photographs.map((img,i)=>({"@type":"ImageObject",contentUrl:SITE+img.src,description:img.alt,caption:img.caption||"",creator:{"@type":"Person",name:img.credit},position:i+1}));
 const schema={"@context":"https://schema.org","@type":entry.section==="blog"?"BlogPosting":"ImageGallery",headline:entry.title,name:entry.title,description:entry.summary,datePublished:entry.publishedAt,author:{"@type":"Person",name:"نیما افشارنادری"},image:images,mainEntityOfPage:SITE+"/"+root+entry.slug+"/",inLanguage:"fa"};
 add(pages,root+entry.slug+"/",entry.title,entry.summary,body,{index:true,modified:entry.publishedAt,schema,image:entry.photographs[0].src});
}
export function renderPhotographyPages({pages,catalog}){
 if(catalog?.schemaVersion!==1||!Array.isArray(catalog.entries))throw Error("Invalid photography catalog");
 const found=new Set(),published=[];
 for(const entry of catalog.entries){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug||"")||found.has(entry.section+"/"+entry.slug))throw Error("Invalid or duplicate photo slug: "+entry.slug);
  found.add(entry.section+"/"+entry.slug);
  if(!sections[entry.section])throw Error("Unknown photography section: "+entry.section);
  if(entry.status==="draft")continue;
  if(entry.status!=="published"||!entry.title||!entry.summary||!/^\d{4}-\d{2}-\d{2}$/.test(entry.publishedAt||"")||!Array.isArray(entry.photographs)||!entry.photographs.length||!Array.isArray(entry.paragraphs)||!entry.paragraphs.length){
   throw Error("Published photo entries need date, narrative, and photographs: "+entry.slug);
  }
  for(const img of entry.photographs){
   if(!/^\/assets\/photography\/[a-zA-Z0-9/_-]+\.(?:webp|jpg|jpeg|png)$/.test(img.src||"")||!img.alt||!img.credit||img.credit!=="نیما افشارنادری")throw Error("Photograph needs local image, alt and confirmed author credit: "+entry.slug);
   if(!fs.existsSync(path.join(process.cwd(),img.src.slice(1))))throw Error("Missing photography image asset: "+img.src);
  }
  published.push(entry);
 }
 published.sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
 const categories=Object.entries(sections).map(([key,item],i)=>'<article class="ph-category"><div><span class="ph-index">0'+(i+1)+' / '+item.eyebrow+'</span><h3>'+item.title+'</h3><p>'+item.lead+'</p></div><a href="/'+item.url+'">مشاهده بخش ←</a></article>').join("");
 const newest=published.length?'<div class="ph-grid">'+published.slice(0,4).map(teaser).join("")+'</div>':emptyMessage();
 const landing='<section class="ph-hero"><div class="ph-wrap ph-hero-content"><p class="ph-eyebrow">NIMA AFSHAR NADERI / PHOTOGRAPHY</p><h1>دیدن، ثبت‌کردن، روایت‌کردن</h1><p>عکاسی برای من ادامه نگاه روزنامه‌نگارانه است؛ ثبت لحظه‌ها، آدم‌ها و نشانه‌هایی که یک داستان را پیش چشم می‌گذارند.</p><div class="ph-actions"><a class="ph-link primary" href="/photography/blog/">ورود به فوتوبلاگ</a><a class="ph-link" href="/photography/collections/">تماشای مجموعه‌عکس‌ها</a></div></div></section><section class="ph-wrap ph-section"><p class="ph-eyebrow">THREE WAYS TO LOOK</p><h2>سه مسیر برای دیدن</h2><div class="ph-categories">'+categories+'</div></section><section class="ph-wrap ph-section"><h2>تازه‌ترین روایت‌های تصویری</h2><p class="ph-lead">مجموعه‌ای از آثار عکاسی و فوتوبلاگ نیما افشارنادری با تاریخ، شرح و زمینه ثبت هر تصویر.</p>'+newest+'</section>';
 add(pages,"photography/","عکاسی و فوتوبلاگ نیما افشارنادری","عکاسی، فوتوبلاگ، مجموعه‌عکس‌ها و آرشیو تصویری نیما افشارنادری؛ روایت تصویری و عکس‌های مستند.",landing);
 for(const key of Object.keys(sections))listing(pages,key,published);
 for(const entry of published)entryPage(pages,entry);
}
