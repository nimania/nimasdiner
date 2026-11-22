import fs from "node:fs";
import path from "node:path";
import {renderReviews} from "./review-pages.mjs";
import {renderManagerPages} from "./manager-pages.mjs";
import {renderConsultation} from "./consultation-page.mjs";
import {renderBrandTopicPages} from "./brand-topic-pages.mjs";
import {renderKnowledgeSidebar} from "./knowledge-sidebar.mjs";
import {persianizeHTML} from "./persian-digits-html.mjs";
import {renderGlossary} from "./glossary-page.mjs";
import {renderBook4Pages} from "./book4-pages.mjs";
import {renderBook5Pages} from "./book5-pages.mjs";
import {renderPromptPages} from "./prompt-pages.mjs";
import {renderWorldBooks} from "./world-books.mjs";
import {renderCoursePages} from "./course-pages.mjs";

// Generated pages are the source of deployed HTML. Do not edit site-dist by hand.
function renderSite(data, editorial = {articles: []}, keywordMap = {targets: {}}, reviews = {reviews: []}) {
  const BASE="/nimasdiner/";
  const ORIGIN="https://nimania.github.io/nimasdiner";
  const esc=(s)=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const link=(path)=>BASE+path;
  const num=n=>String(n).padStart(2,"0");
  const ld=o=>JSON.stringify(o).replace(/</g,"\\u003c");
  const HOST="https://nimania.github.io";
  const SITE_NAME="نیما داینر";
  const OG_DEFAULT=ORIGIN+"/assets/og-cover.png";
  const BUILD_DATE=new Date().toISOString().slice(0,10);
  const absURL=u=>u?(u.startsWith("http")?u:HOST+u):OG_DEFAULT;
  const crumbLabels={"":"خانه",b4:"دیده شو",b5:"منوی سودده",library:"کتابخانه",magazine:"مجله داینر",guides:"دانشنامه",tools:"ابزارها",journal:"ژورنال",kits:"کاربرگ‌ها",reading:"خواندنی‌ها",news:"رادار صنعت غذا",analysis:"تحلیل و تجربه",reviews:"نقدهای نیما",services:"خدمات",consultation:"مشاورهٔ ۹۰ دقیقه‌ای",glossary:"فرهنگ اصطلاحات",prompts:"پرامپت‌خانه",about:"درباره داینر","get-book":"سفارش کتاب",membership:"عضویت داینر",search:"جست‌وجو",academy:"آکادمی"};
  const nav=[["خانه",""],["کتابخانه","library/"],["آکادمی","academy/"],["دانشنامه","guides/"],["ابزارها","tools/"],["پرامپت‌خانه","prompts/"],["ژورنال","journal/"],["کاربرگ‌ها","kits/"],["خواندنی‌ها","reading/"],["نقدهای نیما","reviews/"],["از داینر بپرس","search/"]];
  const navHTML=`<nav class="nav" aria-label="ناوبری اصلی">${nav.map(([l,p])=>`<a href="${link(p)}">${esc(l)}</a>`).join("")}</nav>`;
  const header=`<header class="topbar"><div class="wrap top-inner"><a class="brand" href="${BASE}" aria-label="خانه نیما داینر"><span>نیما داینر<span class="brand-dot">.</span></span><small dir="ltr">NIMA'S DINER</small></a>${navHTML}<div class="header-actions"><a class="get-link" href="${link("library/")}">سفارش کتاب</a><a class="get-link get-link-consultation" href="${link("consultation/")}">درخواست مشاوره</a></div></div></header>`;
  const footer=`<footer class="footer"><div class="wrap footer-grid"><div><strong>نیما داینر</strong><p>دانش، ابزار و تصمیم بهتر برای کسب‌وکار غذا.</p></div><div><a href="${link("library/")}">کتابخانه</a><a href="${link("academy/")}">آکادمی</a><a href="${link("magazine/")}">مجله</a><a href="${link("guides/")}">دانشنامه</a><a href="${link("glossary/")}">فرهنگ اصطلاحات</a><a href="${link("prompts/")}">پرامپت‌خانه</a><a href="${link("services/")}">خدمات مشاوره</a><a href="${link("consultation/")}">مشاورهٔ ۹۰ دقیقه‌ای</a></div><div><a href="https://www.instagram.com/nimasdiner" rel="noopener">اینستاگرام</a><a href="https://t.me/nimasdiner" rel="noopener">تلگرام</a><a href="${link("about/")}">درباره داینر</a><a href="${link("privacy.html")}">حریم خصوصی</a><a href="mailto:nimania@gmail.com">تماس</a></div></div><div class="wrap footer-end">© نیما داینر · محتوای تخصصی برای صاحبان کسب‌وکار غذا</div></footer>`;
  const crumbs=items=>`<nav class="breadcrumbs" aria-label="مسیر صفحه"><a href="${BASE}">خانه</a>${items.map(i=>`<span aria-hidden="true">/</span>${i[1]?`<a href="${link(i[1])}">${esc(i[0])}</a>`:`<span aria-current="page">${esc(i[0])}</span>`}`).join("")}</nav>`;
  const badge=(s,type="")=>`<span class="chip ${type}">${esc(s)}</span>`;
  const card=(href,kicker,title,description)=>`<article class="card"><span class="kicker">${esc(kicker)}</span><h3>${href?`<a href="${link(href)}">${esc(title)}</a>`:esc(title)}</h3><p>${esc(description)}</p>${href?`<a class="textlink" href="${link(href)}">مشاهده و مطالعه ←</a>`:""}</article>`;
  const section=(eyebrow,title,body)=>`<section class="block wrap"><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2>${body}</section>`;
  const instagramEmbed=(item,fallbackTitle="ویدئوی همراه پرونده")=>{
    const raw=typeof item==="string"?item:item?.url;
    const match=/^https:\/\/www\.instagram\.com\/(reel|p)\/([A-Za-z0-9_-]+)\/?/i.exec(String(raw||""));
    if(!match)return "";
    const permalink="https://www.instagram.com/"+match[1]+"/"+match[2]+"/";
    const title=typeof item==="object"&&item?.title?item.title:fallbackTitle;
    const description=typeof item==="object"&&item?.description?item.description:"این ویدئو از حساب اینستاگرام داینر نیما منتشر شده است.";
    return '<section class="instagram-feature" aria-label="'+esc(title)+'"><div class="instagram-feature-copy"><span class="eyebrow">ویدئوی همراه پرونده</span><h2>'+esc(title)+'</h2><p>'+esc(description)+'</p><a class="textlink" href="'+esc(permalink)+'" target="_blank" rel="noopener noreferrer">مشاهده در اینستاگرام ←</a></div><div class="instagram-feature-frame"><blockquote class="instagram-media" data-instgrm-permalink="'+esc(permalink)+'" data-instgrm-version="14"><a href="'+esc(permalink)+'" target="_blank" rel="noopener noreferrer">مشاهده ریل در اینستاگرام</a></blockquote></div></section><script async src="https://www.instagram.com/embed.js"></script>';
  };
  const comment=(subject,{kind="general",venue=""}={})=>{
    const isReview=kind==="review";
    const title=isReview?"تو از این رستوران چه خاطره‌ای داری؟":"چیزی برای اضافه کردن داری؟";
    const intro=isReview?"طعم غذا، رفتار کارکنان یا حتی یک جزئیات کوچک که در خاطرت مانده؛ تجربه‌ات کمک می‌کند این نقد کامل‌تر شود.":"تجربه، پرسش یا نکته‌ای برای اصلاح این نوشته داری؟ برایمان بفرست تا در بازبینی‌های بعدی دقیق‌تر بنویسیم.";
    const mailSubject=isReview?"تجربه دربارهٔ "+(venue||subject):"بازخورد دربارهٔ "+subject;
    const button=isReview?"تجربه‌ام را می‌فرستم":"ارسال بازخورد";
    return `<section class="comment-zone ${isReview?'comment-zone--review':'comment-zone--general'}" id="comments" aria-labelledby="feedback-heading">
      <div class="comment-zone-copy"><span class="comment-zone-kicker">${isReview?"حرف شما هم شنیدنی‌ست":"گفت‌وگو ادامه دارد"}</span><h2 id="feedback-heading">${esc(title)}</h2><p>${esc(intro)}</p></div>
      <div class="comment-zone-action"><a class="comment-zone-button" href="mailto:nimania@gmail.com?subject=${encodeURIComponent(mailSubject)}" aria-label="${esc(button+'؛ ارسال ایمیل درباره '+(venue||subject))}"><span>${esc(button)}</span><span class="comment-zone-arrow" aria-hidden="true">←</span></a><span class="comment-zone-hint">با انتخاب دکمه، برنامهٔ ایمیل باز می‌شود.</span></div>
    </section>`;
  };
  const pages=[];
  function add(path,title,description,content,{noindex=false,structured=null,script="",keywords="",image="",head="",lastmod=""}={}){
    const canonical=ORIGIN+(path?"/"+path:"/");
    const robots=noindex?'<meta name="robots" content="noindex,follow">':'<meta name="robots" content="index,follow">';
    const og=esc(absURL(image));
    const types=Array.isArray(structured)?structured.filter(Boolean):(structured?[structured]:[]);
    const firstType=types[0]?.["@type"];
    const ogType=firstType==="Article"||firstType==="NewsArticle"?"article":"website";
    const datePub=types.find(o=>o?.datePublished)?.datePublished;
    const segs=path?path.replace(/\/$/,"").split("/"):[];
    if(segs.length){
      const items=[{"@type":"ListItem",position:1,name:"خانه",item:ORIGIN+"/"}];
      segs.forEach((s,i)=>{items.push({"@type":"ListItem",position:i+2,name:i===segs.length-1?title:(crumbLabels[s]||s),item:ORIGIN+"/"+segs.slice(0,i+1).join("/")+"/"});});
      types.push({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:items});
    }
    const ldHTML=types.map(o=>`<script type="application/ld+json">${ld(o)}</script>`).join("");
    const social=`<meta property="og:type" content="${ogType}"><meta property="og:site_name" content="${esc(SITE_NAME)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:locale" content="fa_IR"><meta property="og:image" content="${og}"><meta property="og:image:alt" content="${esc(title)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${og}">`;
    const html=`<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="google-site-verification" content="Dn8BoEITUIXrF7N1QXzz99mTvFvtI5sfz9t4YTVo38Q"><meta name="theme-color" content="#ffce25"><title>${esc(title)} | نیما داینر</title><meta name="description" content="${esc(description)}">${robots}<link rel="canonical" href="${esc(canonical)}">${social}${datePub?`<meta property="article:published_time" content="${esc(datePub)}">`:""}<link rel="icon" type="image/svg+xml" href="${link("assets/favicon.svg")}"><link rel="stylesheet" href="${link("site-v2.css")}"><link rel="alternate" type="application/rss+xml" href="${link("feed.xml")}" title="خواندنی‌های داینر">${ldHTML}${head}${script?`<script ${script.endsWith(".mjs")?'type="module"':'defer'} src="${link(script)}"></script>`:""}</head><body><a class="skip" href="#main">رفتن به محتوا</a>${header}<main id="main">${content}</main>${footer}</body></html>`;
    const terms=keywordMap.targets?.["/"+path]?.keywords||[];
    const searchable=content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&(?:nbsp|amp|quot|lt|gt);/g," ").replace(/\s+/g," ").slice(0,24000);
    pages.push({path:path?path+"index.html":"index.html",content:html,index:!noindex,title,description,lastmod,searchText:[keywords,searchable,...terms].join(" ")});
  }
  const reviewArchive=renderReviews({reviews,add,section,crumbs,link,esc,comment,instagramEmbed});
  const bs=data.books.filter(b=>b.status==="published");
  const planned=data.books.filter(b=>b.status!=="published");
  // A book with formats:["digital"] is sold as PDF only until its print edition exists (owner, 18 Nov 2026).
  const digitalOnly=b=>Array.isArray(b.formats)&&!b.formats.includes("print");
  const printBooks=bs.filter(b=>!digitalOnly(b));
  const bookURL=b=>`library/${num(b.n)}/`;
  const orderURL="https://t.me/nimaafsharnaderi";
  const pricing=data.bookPricing;
  if(!pricing||!data.bookSamples?.books)throw new Error("Book pricing or five-page samples missing.");
  const money=n=>new Intl.NumberFormat("fa-IR").format(n)+" تومان";
  const percent=n=>new Intl.NumberFormat("fa-IR",{maximumFractionDigits:1}).format(n)+"٪";
  const sampleURL=b=>bookURL(b)+"sample/";
  const choiceFor=b=>`<div class="book-format-choices">${digitalOnly(b)?`<article class="format-choice"><span class="format-label">نسخه چاپی</span><strong>به‌زودی</strong><p>نسخهٔ چاپی در دست آماده‌سازی است؛ فعلاً نسخهٔ الکترونیکی عرضه می‌شود.</p></article>`:`<article class="format-choice"><span class="format-label">نسخه چاپی</span><strong>${money(pricing.single.print)}</strong><p>کتاب فیزیکی برای مطالعه و استفاده کنار دست مدیر</p><a class="button button-dark" href="${orderURL}" target="_blank" rel="noopener noreferrer">سفارش چاپی ←</a></article>`}<article class="format-choice"><span class="format-label">نسخه الکترونیکی</span><strong>${money(pricing.single.digital)}</strong><p>نسخه PDF برای مطالعه روی گوشی، تبلت یا رایانه</p><a class="button button-outline" href="${orderURL}" target="_blank" rel="noopener noreferrer">سفارش الکترونیکی ←</a></article></div>`;
  const bundleOffer=kind=>{const physical=kind==="print",single=physical?pricing.single.print:pricing.single.digital,bundle=physical?pricing.bundleAllThree.print:pricing.bundleAllThree.digital,original=single*printBooks.length,saving=original-bundle,pct=saving/original*100;return `<article class="bundle-card ${physical?"bundle-print":"bundle-digital"}"><div class="bundle-card-top"><span class="kicker">مجموعه سه‌جلدی</span><span class="bundle-save">صرفه‌جویی ${percent(pct)}</span></div><h3>${physical?"هر سه کتاب چاپی":"هر سه کتاب الکترونیکی"}</h3><p class="bundle-was">قیمت خرید جداگانه: <s>${money(original)}</s></p><strong class="bundle-price">${money(bundle)}</strong><p class="bundle-savings">مجموعاً ${money(saving)} کمتر از خرید تکی</p><a class="button ${physical?"button-dark":"button-outline"}" href="${orderURL}" target="_blank" rel="noopener noreferrer">سفارش بسته ${physical?"چاپی":"الکترونیکی"} ←</a></article>`;};
  const bundleCards=()=>`<div class="bundle-grid">${bundleOffer("print")}${bundleOffer("digital")}</div>`;
  const bookActions=b=>digitalOnly(b)?`<div class="book-actions-mini"><div class="book-price-line"><span>الکترونیکی <strong>${money(pricing.single.digital)}</strong></span><span>چاپی <strong>به‌زودی</strong></span></div><div class="actions"><a class="button button-dark" href="${orderURL}" target="_blank" rel="noopener noreferrer">سفارش نسخهٔ الکترونیکی ←</a><a class="button button-outline" href="${link(sampleURL(b))}">۵ صفحه نمونه رایگان</a></div><p class="muted">برای سفارش «${esc(b.title)}» نام کتاب را در تلگرام یا دایرکت اینستاگرام بفرستید.</p></div>`:`<div class="book-actions-mini"><div class="book-price-line"><span>چاپی <strong>${money(pricing.single.print)}</strong></span><span>الکترونیکی <strong>${money(pricing.single.digital)}</strong></span></div><div class="actions"><a class="button button-dark" href="${orderURL}" target="_blank" rel="noopener noreferrer">سفارش کتاب چاپی یا الکترونیکی ←</a><a class="button button-outline" href="${link(sampleURL(b))}">۵ صفحه نمونه رایگان</a></div><p class="muted">برای سفارش «${esc(b.title)}» نام کتاب و نوع نسخه را در تلگرام اعلام کنید.</p></div>`;
  const bookCover=b=>b.n===1?"assets/cover.webp":`assets/book-${num(b.n)}.webp`;
  const bookThumb=(b,extra="")=>`<a class="book-cover-link ${extra}" href="${link(bookURL(b))}" aria-label="معرفی کتاب ${esc(b.title)}"><img src="${link(bookCover(b))}" alt="تصویر جلد چاپی کتاب ${esc(b.title)}، نوشته نیما افشارنادری" width="330" height="468" loading="lazy" decoding="async"></a>`;
  const trioBooks=bs.filter(b=>b.n<=5);
  const coverTrio=(extra="")=>`<div class="book-cover-trio ${trioBooks.length===4?"cover-quad ":trioBooks.length>=5?"cover-quint ":""}${extra}">${trioBooks.map(b=>bookThumb(b,`trio-book trio-book-${b.n}`)).join("")}</div>`;
  // Homepage hero shelf (owner instruction, 19 Nov 2026): main yellow book first, then 02–03, then «شف» and «منوی سودده», with the five country guides in the margin.
  const shelfBook=(n,cls,eager=false)=>{const b=bs.find(x=>x.n===n);if(!b)return "";return `<a class="shelf-book ${cls}" href="${link(bookURL(b))}" aria-label="معرفی کتاب ${esc(b.title)}"><img src="${link(bookCover(b))}" alt="جلد کتاب ${esc(b.title)}، نوشته نیما افشارنادری" width="330" height="468" loading="${eager?"eager":"lazy"}" decoding="async"${eager?' fetchpriority="high"':""}></a>`;};
  const countryGuide=(n,label)=>{const b=bs.find(x=>x.n===n);if(!b)return "";return `<a class="shelf-country" href="${link(bookURL(b))}" aria-label="معرفی کتاب ${esc(b.title)}"><img src="${link(bookCover(b))}" alt="جلد کتاب ${esc(b.title)}" width="330" height="468" loading="lazy" decoding="async"><span>${label}</span></a>`;};
  const heroShelf=()=>`<div class="hero-shelf"><div class="shelf-books"><div class="shelf-tier shelf-tier-main">${shelfBook(2,"shelf-side shelf-side-a")}${shelfBook(1,"shelf-main",true)}${shelfBook(3,"shelf-side shelf-side-b")}</div><div class="shelf-label"><b>کتاب اصلی</b> · همراه «کوچک شروع کن» و «دوام بیاور»</div><div class="shelf-tier shelf-tier-kitchen">${shelfBook(6,"shelf-small")}${shelfBook(5,"shelf-small")}</div><div class="shelf-label">آشپزخانه و منو: «شف» و «منوی سودده»</div></div><aside class="shelf-countries" aria-label="راهنماهای کشوری"><strong>راهنمای کشوری</strong>${countryGuide(8,"ترکیه")}${countryGuide(9,"آمریکا")}${countryGuide(10,"انگلستان")}${countryGuide(11,"ایتالیا")}${countryGuide(7,"سوئد")}</aside></div>`;
  const bookCard=b=>`<article class="book-showcase-card book-showcase-card-${b.n}">${bookThumb(b)}<div class="book-showcase-content"><span class="kicker">کتاب ${num(b.n)} · ${b.pages} صفحه</span><h3><a href="${link(bookURL(b))}">${esc(b.title)}</a></h3><p>${esc(b.summary)}</p><p class="book-audience"><strong>مناسب برای:</strong> ${esc(b.audience||"صاحبان کسب‌وکار غذا")}</p><div class="book-card-prices"><div><span>نسخه چاپی</span><strong>${digitalOnly(b)?"به‌زودی":money(pricing.single.print)}</strong></div><div><span>نسخه الکترونیکی</span><strong>${money(pricing.single.digital)}</strong></div></div><div class="book-card-actions"><a class="button button-outline" href="${link(sampleURL(b))}">۵ صفحه نمونه</a><a class="button button-dark" href="${link(bookURL(b))}">مقایسه و خرید ←</a></div></div></article>`;
  const sampleReader=b=>{const item=data.bookSamples.books[String(b.n)];if(!item||item.pages.length!==5)throw Error("Missing complete five-page preview for "+b.title);return `<section class="pagehead wrap sample-intro">${crumbs([["کتابخانه","library/"],[b.title,bookURL(b)],["نمونه کتاب",null]])}<p class="eyebrow">۵ صفحه از داخل کتاب</p><h1>نمونهٔ مطالعهٔ «${esc(b.title)}»</h1><p class="lead">پیش از خرید، پنج صفحه واقعی از متن کتاب را مرور کنید. ${item.pages.every(x=>x.image)?"این‌ها خود صفحه‌های کتاب‌اند، با همان صفحه‌آرایی نسخهٔ الکترونیکی؛ نسخه PDF کامل پس از خرید ارائه می‌شود.":"این نمایش، استخراج متنی از صفحات نسخهٔ الکترونیکی است؛ برای دیدن صفحه‌آرایی دقیق، نسخه PDF کامل پس از خرید ارائه می‌شود."}</p><div class="actions"><a class="button button-dark" href="${link(bookURL(b))}">قیمت و خرید کتاب ←</a><a class="button button-outline" href="${link("get-book/")}">مقایسه بسته‌های سه‌جلدی</a></div><nav class="sample-page-nav" aria-label="انتخاب صفحه نمونه">${item.pages.map((p,i)=>`<a href="#sample-page-${i+1}">صفحه ${new Intl.NumberFormat("fa-IR").format(i+1)}</a>`).join("")}</nav></section><div class="sample-reader wrap">${item.pages.map((p,i)=>`<section class="sample-paper" ${p.image?"data-img ":""}id="sample-page-${i+1}" aria-label="صفحه نمونه ${i+1} از ۵"><header><span>کتابخانه نیما داینر</span><strong>${esc(b.title)}</strong></header>${p.image?`<img class="sample-page-img" src="${link(p.image)}" alt="صفحهٔ ${new Intl.NumberFormat("fa-IR").format(i+1)} از نمونهٔ کتاب ${esc(b.title)}، همان‌طور که در کتاب چاپ شده" width="874" height="1240" loading="${i?"lazy":"eager"}"><p class="sr-only">${esc(p.text)}</p>`:`<p class="sample-page-text">${esc(p.text)}</p>`}<footer>نمونه مطالعه · صفحه ${new Intl.NumberFormat("fa-IR").format(i+1)} از ۵</footer></section>`).join("")}</div><section class="sample-end wrap"><h2>این فقط پنج صفحه از کتاب بود.</h2><p>ادامهٔ کتاب در دو نسخهٔ چاپی و الکترونیکی عرضه می‌شود. قیمت و اطلاعات سفارش در صفحه کتاب مشخص است.</p><a class="button button-dark" href="${link(bookURL(b))}">مشاهده قیمت و سفارش ←</a></section>`;};
  const articleTools={
    "opening-budget-versus-survival-cash":["startup-runway","محاسبهٔ دوام نقدینگی",[["سرمایه نقدی در دسترس","تومان"],["هزینه ثابت ماهانه","تومان"],["فروش نقدی ماهانه","تومان"],["هزینه متغیر نقدی ماهانه","تومان"]],"مدت دوام = نقدینگی ÷ (هزینه ثابت + هزینه متغیر − دریافت نقدی). سرمایه‌گذاری اولیه، اقساط و مالیات را در فرض‌های خود لحاظ کنید."],
    "why-top-selling-menu-items-may-not-be-profitable":["menu","مشارکت یک آیتم منو",[["قیمت فروش","تومان"],["مواد اولیه هر پرس","تومان"],["سایر هزینه‌های متغیر هر پرس","تومان"],["تعداد فروش دوره","عدد"]],"مشارکت = قیمت − تمام هزینه‌های متغیر؛ سپس در تعداد فروش ضرب می‌شود."],
    "buffet-economics-fixed-price":["buffet","اقتصاد بوفه آزاد",[["قیمت ورودی هر مهمان","تومان"],["مصرف متوسط مواد هر مهمان","تومان"],["سایر هزینه متغیر هر مهمان","تومان"],["هزینه ثابت دوره","تومان"],["تعداد مهمان دوره","نفر"]],"این محاسبه حساس به متوسط مصرف واقعی، ترکیب مشتریان، ضایعات و ظرفیت خدمات است."],
    "smaller-customer-bills-in-a-downturn":["menu","ارزیابی یک آیتم کم‌قیمت",[["قیمت فروش","تومان"],["مواد اولیه","تومان"],["سایر هزینه‌های متغیر","تومان"],["تعداد فروش","عدد"]],"افزایش تعداد سفارش لزوماً به افزایش سود خالص منجر نمی‌شود."],
    "restaurant-cost-pressure-2026":["pricing","قیمت‌گذاری بر پایهٔ نسبت مواد",[["هزینه مواد اولیه هر پرس","تومان"],["هدف فودکاست","درصد"]],"قیمت = هزینه مواد ÷ نسبت هدف. سهم کارکنان، اجاره و هزینه‌های ثابت جداگانه بررسی شوند."],
    "consistent-food-brings-customers-back":["waste","پایش بازده مواد اولیه",[["وزن مواد خریداری‌شده","گرم یا کیلو"],["وزن قابل استفاده","همان واحد"]],"یکسان بودن واحدها ضروری است. ثبات رسپی را با وزن‌کشی و کنترل پرت بررسی کنید."],
    "good-cook-or-restaurant-owner":["breakeven","آزمون نقطه سربه‌سر",[["هزینه ثابت ماهانه","تومان"],["میانگین مبلغ سفارش","تومان"],["هزینه متغیر متوسط سفارش","تومان"]],"تعداد سفارش = هزینه ثابت ÷ مشارکت هر سفارش؛ نتیجه به عدد صحیح رو به بالا گرد می‌شود."],
    "restaurant-technology-connected-2026":["labor","بررسی هزینه نیروی انسانی",[["حقوق دوره","تومان"],["بیمه و مزایای کارفرما","تومان"],["فروش خالص همان دوره","تومان"]],"اطلاعات فروش و حقوق باید مربوط به یک دوره باشند."],
    "menu-trends-value-comfort-2026":["foodcost","آزمون اقتصادی یک غذای جدید",[["هزینه مواد اولیه","تومان"],["قیمت فروش","تومان"]],"در کنار سلیقه مشتری، هزینه مواد و مشارکت آیتم جدید را بسنجید."],
    "recipe-card-standardization":["waste","محاسبهٔ ضایعات آماده‌سازی",[["وزن مواد خام","گرم"],["وزن قابل‌استفاده","گرم"]],"رسپی استاندارد به وزن، بازده، روش پخت و اندازه پرس متکی است."],
    "restaurant-menu-pricing":["pricing","قیمت لازم بر اساس فودکاست",[["بهای مواد پرس","تومان"],["درصد هدف مواد اولیه","درصد"]],"این فرمول نقطه شروع قیمت‌گذاری است و قیمت قابل‌قبول بازار را تعیین نمی‌کند."],
    "restaurant-break-even":["breakeven","نقطه سربه‌سر رستوران",[["هزینه ثابت ماهانه","تومان"],["میانگین فروش هر سفارش","تومان"],["هزینه متغیر سفارش","تومان"]],"این مدل فرض می‌کند میانگین مشارکت ثابت می‌ماند."],
    "restaurant-delivery-discounts":["discount","اثر تخفیف و کارمزد دلیوری",[["قیمت پیش از تخفیف","تومان"],["مواد اولیه","تومان"],["بسته‌بندی و هزینه متغیر","تومان"],["تخفیف مجموعه","تومان"],["کارمزد مؤثر","درصد"]],"مبنای کارمزد را با قرارداد پلتفرم تطبیق دهید."],
    "restaurant-staffing-cost":["labor","سهم نیروی انسانی از فروش",[["دستمزد","تومان"],["بیمه و مزایا","تومان"],["فروش خالص","تومان"]],"نسبت هزینه کارکنان = مجموع هزینه کارکنان ÷ فروش خالص × ۱۰۰."],
    "restaurant-seat-capacity":["capacity","ظرفیت نظری درآمد سالن",[["صندلی فعال","صندلی"],["گردش میز روزانه","مرتبه"],["روزهای فعالیت","روز"],["میانگین فاکتور هر نفر","تومان"]],"برای تخمین واقع‌بینانه نرخ اشغال و محدودیت عملیاتی را نیز منظور کنید."]
  };
  const calcArticle=slug=>{const config=articleTools[slug];if(!config)return "";const [key,title,fields,note]=config;return `<section class="source-note diner-calc" data-diner-calculator="${esc(key)}"><h2>ابزار تعاملی مقاله: ${esc(title)}</h2><p>عددهای کسب‌وکار خودتان را وارد کنید؛ نتیجه همان‌جا محاسبه می‌شود.</p><div class="diner-calc-fields">${fields.map(([name,unit],i)=>`<label style="display:block;margin:12px 0"><span style="display:block;margin-bottom:5px">${esc(name)} (${esc(unit)})</span><input data-calc-input type="text" inputmode="decimal" autocomplete="off" aria-label="${esc(name)}" style="width:100%;max-width:340px;padding:12px;border:1px solid #9a9a9a;border-radius:8px"></label>`).join("")}</div><p data-calc-output role="status" aria-live="polite" class="calc-output">برای شروع عددها را وارد کنید.</p><p class="muted"><strong>فرمول و فرض:</strong> ${esc(note)}</p><p class="muted">این محاسبه راهنمای تصمیم است، نه صورت سود و زیان رسمی.</p></section>`;};
  const dinerActions=()=>`<aside class="source-note book-order book-promo"><div class="book-promo-art">${coverTrio("small")}</div><div class="book-promo-copy"><p class="kicker">کتابخانه نیما داینر</p><h2>برای تصمیم‌های سخت، فقط به حدس تکیه نکن.</h2><p>یازده کتاب برای راه‌اندازی، مدیریت، دوام‌آوردن، دیده‌شدن، سودآوری منو و آشپزخانه، و پنج راهنمای کشوری برای رستوران‌داری ایرانی‌ها در سوئد، ترکیه، آمریکا، انگلستان و ایتالیا؛ سه کتاب چاپی و الکترونیکی و بقیه در نسخهٔ الکترونیکی. کتاب مناسب مسئله خودت را انتخاب کن. برای بررسی اختصاصی هم می‌توانی مشاوره بگیری.</p><div class="actions"><a class="button button-dark" href="${link("library/")}">دیدن کتاب‌ها و انتخاب ←</a><a class="button button-outline" href="${orderURL}" target="_blank" rel="noopener noreferrer">سفارش کتاب چاپی ←</a><a class="button button-outline" href="${orderURL}" target="_blank" rel="noopener noreferrer">درخواست جلسه مشاوره ←</a></div><p class="muted">برای سفارش یا مشاوره در تلگرام به @nimaafsharnaderi پیام بدهید. هماهنگی زمان و هزینهٔ مشاوره پس از گفتگو انجام می‌شود.</p></div></aside>`;
  const articleBookAd=dinerActions;

  const relatedBooks=numbers=>{const books=numbers.map(n=>bs.find(b=>b.n===n)).filter(Boolean);return books.length?`<aside class="source-note book-order"><h2>کتاب مرتبط با این مطلب</h2>${books.map(b=>`<div class="book-related-item">${bookThumb(b,"book-related-cover")}<div><h3><a href="${link(bookURL(b))}">${esc(b.title)}</a></h3><p>${esc(b.subtitle)}</p>${bookActions(b)}</div></div>`).join("")}</aside>`:"";};
  const sourceBooks=(refs=[])=>{const books=refs.map(ref=>({ref,book:bs.find(b=>b.n===ref.n)})).filter(x=>x.book);return books.length?`<aside class="source-note book-order"><h2>از کتابخانهٔ نیما داینر</h2>${books.map(({book:b,ref})=>`<p>برگرفته از کتاب <a class="textlink" href="${link(bookURL(b))}">«${esc(b.title)}»</a>، نوشتهٔ نیما افشارنادری${ref.chapter?`؛ ${esc(ref.chapter)}`:""}${ref.pages?`، صفحه‌های ${esc(ref.pages)}`:""}.</p>${bookActions(b)}`).join("")}</aside>`:"";};

  const mgURL=m=>`magazine/${num(m.n)}/`;
  const timeline=`<div class="timeline">${data.books.map(b=>`<div class="timeline-item ${b.status==="published"?"published":"future"}"><span class="timeline-index">${num(b.n)}</span><div><span class="tiny">${b.status==="published"?"منتشر شده":"در برنامه پیشنهادی · بدون تاریخ انتشار"}</span><h3>${b.status==="published"?`<a href="${link(bookURL(b))}">${esc(b.title)}</a>`:esc(b.title)}</h3><p>${esc(b.subtitle)}</p></div></div>`).join("")}</div>`;
  const recentReading=(editorial.articles||[]).filter(x=>x.status==="published").slice(0,3);
  const readingCards=recentReading.map(a=>card("reading/"+a.slug+"/",a.type==="news"?"رادار صنعت":"تحلیل مدیریتی",a.title,a.excerpt)).join("");
  const home=`<section class="hero"><div class="wrap hero-inner"><div><span class="eyebrow">مرجع مستقل کسب‌وکار غذا</span><h1>رستوران را با <em>عدد و سیستم</em> اداره کن، نه با حدس.</h1><p class="lead">از راه‌اندازی با سرمایه محدود تا مدیریت حرفه‌ای و عبور از بحران؛ یازده کتاب، از جمله «منوی سودده» دربارهٔ مهندسی منو، «شف» دربارهٔ توسعهٔ غذا و پنج راهنمای راه‌اندازی رستوران در سوئد، ترکیه، آمریکا، انگلستان و ایتالیا، در کنار دانشنامه، ابزارهای مدیریتی و مطالب کاربردی داینر.</p><div class="actions"><a class="button button-dark" href="${link("library/")}">دیدن یازده کتاب نیما داینر ←</a><a class="button button-outline" href="${link("get-book/")}">روش سفارش کتاب‌ها</a></div><p class="hero-note">۳ کتاب چاپی و الکترونیکی · ۸ کتاب الکترونیکی، از جمله «شف» و پنج راهنمای کشوری · امکان دیدن ۵ صفحه نمونه · مجله داینر · دانشنامه و ابزارهای اجرایی</p></div><div class="hero-art hero-art-books hero-art-shelf"><div class="art-tag">THE BUSINESS OF FOOD</div>${heroShelf()}<div class="art-caption">یازده کتاب برای مسیر رستوران‌داری، در ایران و بیرون از ایران</div></div></div></section><div class="checker"></div>`

    + section("اکوسیستم داینر","چه چیزی در داینر پیدا می‌کنی؟",`<div class="cards three">${card("library/","کتابخانه در حال رشد","کتاب‌ها و جزوه‌های تخصصی","یازده کتاب منتشرشده، از جمله پنج راهنمای کشوری، و برنامه‌ای برای گسترش موضوعات، از ضوابط کسب‌وکار تا بازاریابی و مدیریت کارکنان.")}${card("magazine/","شماره‌های پی‌درپی","مجله تک‌موضوعی داینر","هر شماره یک محصول یا مسئله، با پیوند تاریخ، فناوری، اقتصاد و مدیریت.")}${card("tools/","ابزار عملی","محاسبه و تصمیم‌گیری","محاسبه‌گرهای مالی، ژورنال روزانه با پشتیبان و کاربرگ‌های آمادهٔ چاپ.")}</div>`)
    +section("آکادمی داینر","۱۰۱ قانون طلایی را ویدئویی یاد بگیر",`<div class="cards two">${card("academy/restaurant-management-101/","دورهٔ رایگان · هفت قسمت","آموزش ویدئویی کتاب زرد","اولین قسمت، قوانین ۱ تا ۱۵ دربارهٔ پیش از راه‌اندازی منتشر شده است؛ ادامهٔ درس‌ها به‌ترتیب اضافه می‌شوند.")}${card("academy/restaurant-management-101/lesson-01/","قسمت اول منتشر شده","پیش از راه‌اندازی","تماشای قسمت اول در یوتیوب و آپارات، همراه با تمرین‌های اجرایی و منابع مرتبط.")}</div><p><a class="button button-dark" href="${link("academy/")}">رفتن به آکادمی داینر ←</a></p>`)
    +section("پرامپت‌خانه داینر","برای محتوای بهتر، از یک دستور آماده شروع کن",`<p class="rich">از عکاسی برگر و قهوه تا سناریوی ریلز، چک‌لیست شیفت و ایده‌های فروش؛ پرامپت‌های آماده را جست‌وجو و رایگان کپی کن.</p><a class="button button-dark" href="${link("prompts/")}">ورود به پرامپت‌خانه ←</a>`)
    +section("خواندنی‌های داینر","خبر و تحلیل برای اهل کسب‌وکار غذا",`<div class="cards three">${readingCards}</div><p><a class="textlink" href="${link("reading/")}">همه خواندنی‌ها ←</a></p>`)
    +section("شروع با یک مسئله واقعی","مسیرت را انتخاب کن",`<div class="cards three">${card("guides/start-restaurant/","در آستانه شروع","می‌خواهم کسب‌وکار غذا راه بیندازم","از مدل کسب‌وکار و بودجه تا افتتاح آزمایشی، مسئله‌ها را به ترتیب ببین.")}${card("guides/restaurant-profit/","در حال اداره","فروش دارم؛ پول کجا می‌رود؟","تفاوت فروش، نقدینگی و سود را پیدا کن و دادهٔ درست ثبت کن.")}${card("guides/menu-engineering/","در حال اصلاح","منویم را دقیق‌تر مدیریت کنم","رسپی، تعداد فروش و مشارکت هر سفارش را کنار هم بگذار.")}</div>`)
    +section("نقدهای نیما","غذا، آدم‌ها و خاطرهٔ شهر",`<p class="rich">نوشته‌های من از رستوران‌ها و کافه‌ها؛ غذا، میزبانی، پاتوق‌ها و خاطرهٔ شهر.</p><div class="cards three">${reviewArchive.cards}</div><p><a class="button button-outline" href="${link("reviews/")}">دیدن همهٔ نقدها ←</a></p>`)
    +section("ابزارهای اجرایی","این هفته یک کار را دقیق‌تر انجام بده",`<div class="cards three">${card("journal/","ثبت و پیگیری","ژورنال روزانهٔ مدیر","فروش، دریافتی، خرید، ضایعات و اقدام فردا را ثبت کن؛ با خروجی و پشتیبان.")}${card("kits/","قابل چاپ","کاربرگ‌های کنار دست مدیر","تحویل شیفت، ثبت ضایعات و جلسهٔ مرور هفتگی را با یک برگه شروع کن.")}${card("tools/","محاسبه سریع","قبل از تصمیم، حساب کن","نسبت مواد اولیه و نقطهٔ سربه‌سر را با عددهای خودت بسنج.")}</div>`)
    +section("خرید به‌صرفه","مجموعه سه‌جلدی را یک‌جا تهیه کن",`<p class="rich">هر سه کتاب را می‌توان جداگانه یا به‌صورت یک بسته کامل خرید. تخفیف مجموعه نسبت به قیمت تکی به‌طور شفاف محاسبه شده است.</p>${bundleCards()}`)
    +`<section class="cta-panel book-library-cta" id="get-book"><div class="wrap cta-inner"><div><span class="eyebrow">کتاب‌های چاپی و الکترونیکی نیما داینر</span><h2>از ایده تا اداره، از بحران تا ادامه.</h2><p>برای شروع کوچک، مدیریت اصولی و روزهای سخت، نسخهٔ چاپی یا الکترونیکی متناسب با نیازت را پیدا کن.</p><a class="button button-dark" href="${link("get-book/")}">انتخاب و سفارش کتاب‌ها ←</a></div>${coverTrio("small")}</div></section>`;
  add("","نیما داینر؛ مدیریت رستوران، کافه و صنعت غذا","مرجع تخصصی فارسی مدیریت رستوران و کافه: کتابخانه، مجله داینر، مهندسی منو، فودکاست، ابزارهای مدیریتی و راه‌اندازی کسب‌وکار غذا.",home,{head:`<link rel="preload" as="image" href="${link("assets/cover.webp")}" fetchpriority="high">`,structured:[{"@context":"https://schema.org","@type":"WebSite",name:"نیما داینر",alternateName:"NIMA'S DINER",url:ORIGIN+"/",inLanguage:"fa",publisher:{"@type":"Organization",name:"نیما داینر",logo:{"@type":"ImageObject",url:ORIGIN+"/assets/logo-512.png"}},potentialAction:{"@type":"SearchAction",target:{"@type":"EntryPoint",urlTemplate:ORIGIN+"/search/?q={search_term_string}"},"query-input":"required name=search_term_string"}},{"@context":"https://schema.org","@type":"Organization",name:"نیما داینر",alternateName:"NIMA'S DINER",url:ORIGIN+"/",logo:ORIGIN+"/assets/logo-512.png",image:OG_DEFAULT,description:"مرجع مستقل و فارسیِ مدیریت رستوران، کافه و کسب‌وکار غذا؛ کتاب، مجله، دانشنامه و ابزارهای مدیریتی.",founder:{"@type":"Person",name:"نیما افشارنادری"},sameAs:["https://www.instagram.com/nimasdiner","https://t.me/nimasdiner","https://t.me/nimaafsharnaderi"]}]});
  const library=`<section class="pagehead wrap">${crumbs([["کتابخانه",null]])}<p class="eyebrow">کتابخانه نیما داینر</p><h1>از شروع کوچک تا مدیریت حرفه‌ای</h1><p class="lead">کتاب‌های منتشرشده و مسیر پیشنهادی عنوان‌های آینده. انتشار هر عنوان همراه با صفحه اختصاصی، مطالب مرتبط و ابزارهای اجرایی خواهد بود.</p></section>`
    +section("منتشرشده",`${({3:"سه",4:"چهار",5:"پنج"})[bs.length]||bs.length} کتاب، یک مسیر`,`<p class="rich">هر کتاب برای یک مرحله از کسب‌وکار غذا نوشته شده است؛ جلدها را ببین، موضوع را مقایسه کن و و سپس نسخهٔ چاپی یا الکترونیکی را سفارش بده.</p><div class="cards three book-showcase-grid">${bs.map(bookCard).join("")}</div>`)
    +section("خرید مجموعه","هر سه کتاب با قیمت بسته",`<p class="rich">برای کسانی که می‌خواهند مسیر راه‌اندازی، مدیریت و تاب‌آوری را یک‌جا داشته باشند، خرید بستهٔ سه‌جلدی اقتصادی‌تر است.</p>${bundleCards()}`)
    +section("پیش رو","خط زمانی کتابخانه",`<p class="muted">این ترتیب یک نقشه توسعه است. ${({6:"شش",7:"هفت"})[planned.length]||planned.length} عنوان آینده هنوز در دست طراحی‌اند و در نتایج جست‌وجو به‌عنوان کتاب منتشرشده معرفی نمی‌شوند.</p>${timeline}`);
  add("library/","کتابخانه تخصصی مدیریت رستوران و کافه","فهرست کتاب‌های نیما داینر: ۱۰۱ قانون مدیریت رستوران، کوچک شروع کن، دوام بیاور و عناوین پیشنهادی مهندسی منو و مقررات.",library+section("کتابخانه جهان غذا","کتاب‌های خارجی و ایرانی را هم بشناسید",`<div class="cards two"><article class="card"><span class="kicker">کتاب‌های خارجی</span><h3><a href="${link("books/foreign/")}">آثار خارجی صنعت غذا و رستوران‌داری</a></h3><p>معرفی مستقل و مرور کاربردی کتاب‌های خارجی درباره مدیریت، آشپزی و مهمان‌نوازی.</p><a class="textlink" href="${link("books/foreign/")}">دیدن کتاب‌ها ←</a></article><article class="card"><span class="kicker">کتاب‌های ایرانی دیگران</span><h3><a href="${link("books/iranian/")}">آثار نویسندگان ایرانی</a></h3><p>کتاب‌های آشپزی، رسپی، فرهنگ خوراک و میراث غذایی ایران.</p><a class="textlink" href="${link("books/iranian/")}">دیدن کتاب‌ها ←</a></article></div><p><a class="textlink" href="${link("books/")}">ورود به کتابخانه جهان غذا ←</a></p>`)+section("قدم بعد از مطالعه","وقتی مسئله به تصمیم نیاز دارد",`<div class="consult-library-crosssell"><div><h3>جلسهٔ ۹۰ دقیقه‌ای مشاورهٔ داینر</h3><p>اگر برای راه‌اندازی، اصلاح قیمت، تیم یا عبور از یک وضعیت دشوار نیاز به بررسی اختصاصی داری، شرح کامل جلسه، تعرفه‌ها و روش رزرو را ببین.</p></div><a class="button button-dark" href="${link("consultation/")}">مشاهدهٔ مشاورهٔ ۹۰ دقیقه‌ای ←</a></div>`));
  renderWorldBooks({add, section, crumbs, link, esc});
  renderCoursePages({add, link, crumbs, esc, section, data:data.courses});
  for(const b of bs){
    const main=`<section class="pagehead wrap book-detail-hero"><div class="book-detail-layout"><div>${crumbs([["کتابخانه","library/"],[b.title,null]])}<p class="eyebrow">کتاب ${num(b.n)} از مجموعه داینر · ${digitalOnly(b)?"نسخهٔ الکترونیکی؛ چاپی به‌زودی":"چاپی و الکترونیکی"}</p><h1>${esc(b.title)}</h1><p class="lead">${esc(b.subtitle)}</p><div class="chips">${badge(`${b.pages} صفحه`)}${badge("منتشرشده","active")}${badge("نسخه ۱۴۰۵")}</div><p>${esc(b.summary)}</p><div class="book-who"><strong>این کتاب برای چه کسی مناسب است؟</strong><p>${esc(b.audience||b.summary)}</p><strong>چه چیزی به دست می‌آورید؟</strong><p>${esc(b.takeaway||b.summary)}</p></div>${choiceFor(b)}<div class="actions"><a class="button button-outline" href="${link(sampleURL(b))}">۵ صفحه نمونه رایگان از کتاب ←</a><a class="button button-outline" href="${link("get-book/")}">مقایسه قیمت مجموعه سه‌جلدی</a></div></div><div class="book-detail-art">${bookThumb(b,"book-detail-cover")}</div></div></section>`
      +section("درباره این کتاب","برای چه مسئله‌ای نوشته شده؟",`<p class="rich">${esc(b.summary)}</p><p class="rich">${digitalOnly(b)?"این صفحه معرفی مستقل اثر است. نسخهٔ الکترونیکی (PDF) این کتاب را می‌توانید با پیام در تلگرام یا دایرکت اینستاگرام سفارش دهید؛ نسخهٔ چاپی به‌زودی منتشر می‌شود.":"این صفحه معرفی مستقل اثر است. نسخهٔ چاپی این کتاب را می‌توانید با ارسال پیام در تلگرام سفارش دهید."}</p>${b.n===4?`<p class="rich"><a class="textlink" href="${link("b4/")}">صفحه‌های همراه کتاب: نمونه‌ها و قالب‌های قابل چاپ ←</a></p>`:""}`)
      +(b.n===1?section("آموزش رایگان همراه کتاب","کتاب زرد را در هفت قسمت ویدئویی یاد بگیر",`<p class="rich">دورهٔ ویدئویی «۱۰۱ قانون طلایی مدیریت رستوران» آغاز شده است. قسمت اول، قوانین ۱ تا ۱۵ با موضوع «پیش از راه‌اندازی»، در یوتیوب و آپارات منتشر شده است.</p><div class="actions"><a class="button button-dark" href="${link("academy/restaurant-management-101/")}">ورود به دورهٔ ویدئویی ←</a><a class="button button-outline" href="${link("academy/restaurant-management-101/lesson-01/")}">تماشای قسمت اول ←</a></div>`):"")
      +section("پیش از انتخاب","پنج صفحه از داخل کتاب را ببین",`<div class="preview-teaser">${bookThumb(b,"preview-teaser-cover")}<div><p>با دیدن پنج صفحه واقعی از متن کتاب، لحن، سطح جزئیات و نوع راهکارها را بررسی کن؛ سپس درباره خرید تصمیم بگیر.</p><a class="button button-dark" href="${link(sampleURL(b))}">مطالعه رایگان ۵ صفحه نمونه ←</a></div></div>`)
      +section("مسیر مطالعه","محورهای اصلی",`<ol class="topics">${b.chapters.map(t=>`<li>${esc(t)}</li>`).join("")}</ol>`)
      +section("کتابخانهٔ نیما داینر","کتاب‌های دیگر این مجموعه",`<div class="other-books">${bs.filter(o=>o.n!==b.n).map(o=>`<article class="other-book other-book-${o.n}">${bookThumb(o,"other-book-cover")}<div><span class="kicker">کتاب ${num(o.n)} · ${digitalOnly(o)?"الکترونیکی؛ چاپی به‌زودی":"چاپی و الکترونیکی"}</span><h3><a href="${link(bookURL(o))}">${esc(o.title)}</a></h3><p>${esc(o.subtitle)}</p><a class="textlink" href="${link(bookURL(o))}">معرفی و خرید ←</a></div></article>`).join("")}</div>`)
      +section("از خواندن به اجرا","گام بعدی",`<div class="cards two">${card("tools/","ابزار اجرایی","محاسبه و خودارزیابی","از ابزارهای فعلی برای مرور یک تصمیم مالی استفاده کن.")}${card("guides/","دانشنامه","راهنماهای تکمیلی","مباحث مرتبط با مدیریت مالی، منو و ضوابط را در وب بخوان.")}</div>${bookActions(b)}`)
      +`<div class="wrap">${comment(b.title)}</div>`;
    add(bookURL(b),`${b.title}؛ ${b.subtitle}`,b.summary,main,{image:ORIGIN+"/"+bookCover(b),structured:{"@context":"https://schema.org","@type":"Book",name:b.title,description:b.summary,image:ORIGIN+"/"+bookCover(b),author:{"@type":"Person",name:"نیما افشارنادری"},inLanguage:"fa",isPartOf:{"@type":"CreativeWorkSeries",name:"کتابخانه نیما داینر"}}});
    add(sampleURL(b),`پنج صفحه نمونه از کتاب ${b.title}`,`نمونه متنی پنج صفحه از کتاب ${b.title} برای بررسی پیش از خرید نسخه چاپی یا الکترونیکی.`,sampleReader(b),{noindex:true});
  }
  const magazineReel=editorial.articles.find(a=>a.slug==="yarali-pourmoghadam-shooka-cafe-management")?.instagramReel;
  const magazine=`<section class="pagehead wrap">${crumbs([["مجله داینر",null]])}<p class="eyebrow">Diner Magazine</p><h1>مجله داینر: هر شماره، یک پرونده</h1><p class="lead">شماره‌های متوالی و تک‌موضوعی با نگاه تاریخی، فنی، اقتصادی و مدیریتی؛ ویژه صاحبان نانوایی، کافه، رستوران و کسب‌وکار غذا.</p></section>`
    +section("آرشیو شماره‌ها","شماره‌های منتشرشده",`<div class="cards two">${data.magazines.filter(m=>m.status==="published").map(m=>m.cover?`<article class="card diner-issue-card"><a href="${link(mgURL(m))}"><img src="${esc(m.cover)}" alt="جلد ماهنامه داینر شماره ${num(m.n)}" loading="lazy"></a><div><span class="kicker">شماره ${num(m.n)} · ${m.pages} صفحه · رایگان</span><h3><a href="${link(mgURL(m))}">${esc(m.title)}</a></h3><p>${esc(m.summary)}</p><a class="textlink" href="${link(mgURL(m))}">مطالعه رایگان ←</a></div></article>`:card(mgURL(m),`شماره ${num(m.n)} · ${m.pages} صفحه`,m.title,m.summary)).join("")}</div><p class="muted">کرواسان و یارعلی و شوکا، دو شماره منتشرشده مجله داینر هستند.</p>`) +(magazineReel?instagramEmbed(magazineReel):"");
  add("magazine/","مجله داینر؛ پرونده‌های تخصصی صنعت غذا","مجله تک‌موضوعی کسب‌وکار غذا؛ آرشیو شماره‌های پی‌درپی درباره تاریخ محصول، فناوری، تولید، اقتصاد و مدیریت.",magazine);
  for (const m of data.magazines.filter(x=>x.status==="published")) {
    const body=`<section class="pagehead wrap">${crumbs([["مجله داینر","magazine/"],[`شماره ${num(m.n)}`,null]])}<p class="eyebrow">مجله داینر · شماره ${num(m.n)}</p><h1>${esc(m.title)}</h1><p class="lead">${esc(m.subtitle)}</p><div class="chips">${badge("پرونده تک‌موضوعی","active")}${badge(`${m.pages} صفحه`)}${m.pdf?badge("مطالعه رایگان","active"):""}</div></section>`
      +(m.pdf?section("مطالعه رایگان","مجله را ورق بزنید یا دریافت کنید",`<div class="magazine-issue-intro"><img src="${esc(m.cover)}" alt="جلد شماره ${num(m.n)} مجله داینر" loading="eager"><div><p class="rich">${esc(m.summary)}</p><div class="actions"><a class="button button-dark" href="${esc(m.pdf)}" target="_blank" rel="noopener noreferrer">مطالعه و دریافت PDF رایگان ←</a><a class="button button-outline" href="https://app.nimania.net/#read/mag2/1" target="_blank" rel="noopener noreferrer">مطالعه در اپ داینر ←</a></div><p class="muted">عکس‌ها: ${esc(m.photosCredit||"نیما افشارنادری")}</p></div></div><div class="magazine-pdf-frame"><iframe src="${esc(m.pdf)}#toolbar=1" title="مطالعه ماهنامه داینر شماره ${num(m.n)}" loading="lazy"></iframe><p class="muted">اگر PDF در صفحه باز نشد، از دکمه دریافت استفاده کنید.</p></div>`):"")
      +section("پرسش محوری","پشت ویترین چه می‌گذرد؟",`<p class="rich">${esc(m.summary)}</p><p class="rich">در این شماره، روایت تاریخی محصول از تصمیم‌های واقعی کسب‌وکار تفکیک می‌شود: انتخاب مدل تولید، تأمین مواد، ثبات کیفیت، محاسبه هزینه و آزمون بازار.</p>`)
      +section("فهرست پرونده","شش محور این شماره",`<ol class="topics">${m.sections.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>`)
      +(m.n===2?section("درس مدیریتی","وفاداری مشتری چگونه ساخته می‌شود؟",`<p class="rich">از کافه شوکا می‌توان شناخت مهمان، قصه‌گویی واقعی درباره غذا، ساختن حس تعلق و حفظ خاطرات جمعی را آموخت.</p><p><a class="textlink" href="${link("reading/yarali-pourmoghadam-shooka-cafe-management/")}">تحلیل کامل ۱۰ درس مدیریتی یارعلی پورمقدم ←</a></p>`):section("درس مدیریتی","محصول خوب، سیستم خوب می‌خواهد",`<p class="rich">در مقایسه تولید کامل در محل، نیمه‌آماده و مرکز تولید، هیچ مدلی ذاتاً برای همه مناسب نیست. توان تیم، ظرفیت، کیفیت هدف، هزینه‌های پنهان و ریسک تأمین تعیین‌کننده‌اند.</p><p class="rich">در مثال آموزشی خود مجله، محاسبات مالی فرضی‌اند و حاشیه مشارکت با سود خالص تفاوت دارد. این تفکیک در تصمیم‌گیری درباره توسعه محصول اهمیت دارد.</p><p><a class="textlink" href="${link("guides/menu-engineering/")}">راهنمای مهندسی منو ←</a></p>`))
      +(m.instagramReel?instagramEmbed(m.instagramReel):"")
      +`<div class="wrap">${comment(`مجله داینر شماره ${num(m.n)}: ${m.title}`)}</div>`;
    add(mgURL(m),`مجله داینر شماره ${num(m.n)}: ${m.title}`,m.summary,body,{structured:{"@context":"https://schema.org","@type":"CreativeWork",name:`مجله داینر شماره ${num(m.n)}: ${m.title}`,description:m.summary,inLanguage:"fa",publisher:{"@type":"Organization",name:"نیما داینر",logo:{"@type":"ImageObject",url:ORIGIN+"/assets/logo-512.png"}},isPartOf:{"@type":"Periodical",name:"مجله داینر"}}});
  }
  add("guides/","دانشنامه مدیریت رستوران، کافه و کسب‌وکار غذا","راهنماهای تخصصی و قابل جست‌وجو درباره فودکاست، مهندسی منو، ضوابط و مجوزها، با اتصال به کتابخانه و ابزارهای داینر.",
    `<section class="pagehead wrap">${crumbs([["دانشنامه",null]])}<p class="eyebrow">دانشنامه داینر</p><h1>یادگیری درباره مسائل واقعی رستوران‌داری</h1><p class="lead">هر موضوع صفحه پایدار، توضیح قابل خواندن، پیوند به منبع و مسیر عملی خواهد داشت. راهنماها با بررسی و راستی‌آزمایی تکمیل می‌شوند.</p></section>`
      +section("مطالب موجود","از اینجا شروع کن",`<div class="cards three">${data.guides.map(g=>card(`guides/${g.slug}/`,g.tags.join(" · "),g.title,g.summary)).join("")}</div>`)
      +section("فرهنگ اصطلاحات","معنی یک اصطلاح را می‌خواهی؟",`<p class="rich">فودکاست، پرایم کاست، میزانپلاس، FIFO و ده‌ها اصطلاح ضروری دیگر را با معادل انگلیسی در فرهنگ اصطلاحات رستوران‌داری داینر پیدا کن.</p><a class="button button-outline" href="${link("glossary/")}">فرهنگ اصطلاحات رستوران‌داری ←</a>`));
  for(const g of data.guides){
    const guideSidebar=renderKnowledgeSidebar({
      headings:g.sections.map(item=>item.h),
      related:[
        {label:"همه راهنماهای دانشنامه",path:"guides/"},
        {label:"ابزارها و محاسبه‌گرها",path:"tools/"},
        {label:"درس‌های برندهای بزرگ",path:"reading/brand-lessons/"},
        {label:"کتاب مرجع مدیریت رستوران",path:"library/01/"}
      ],link,esc
    });
    const sourceNote=g.regulatory
      ?`<aside class="source-note" style="border-right:4px solid var(--red,#c94232);background:#fff6f4"><strong>هشدار مهم: این راهنما مرجع رسمی نیست</strong><p>این صفحه فقط ترتیب کلی کارها و مدارک رایج را برای جهت‌دهی توضیح می‌دهد. مقررات، مدارک، مبالغ، نرخ‌ها و مراحل بسته به شهر، صنف و زمان تغییر می‌کند. پیش از هر اقدام، شرایط روز را مستقیماً از مرجع رسمی مربوط (اتحادیهٔ صنفی، ادارهٔ نظارت بر اماکن عمومی، مرکز بهداشت یا سازمان امور مالیاتی) استعلام کنید. این مطلب مشاورهٔ حقوقی یا مالیاتی نیست.</p></aside>`
      :`<aside class="source-note"><strong>درباره منابع و حدود اعتبار</strong><p>این صفحه بر پایه مباحث کتابخانه و پرونده‌های نیما داینر تدوین شده است. نمونه‌های عددی آموزشی‌اند. الزامات بهداشتی و حقوقی باید جداگانه با منابع رسمیِ معتبر در تاریخ و شهر مربوط بررسی شوند.</p></aside>`;
    const body=`<section class="pagehead wrap">${crumbs([["دانشنامه","guides/"],[g.title,null]])}<p class="eyebrow">${esc(g.tags.join(" · "))}</p><h1>${esc(g.title)}</h1><p class="lead">${esc(g.summary)}</p><div class="chips">${badge("راهنمای مرجع")}${g.regulatory?badge("نیازمند استعلام رسمی","active"):badge("آخرین تدوین: آبان ۱۴۰۵")}</div></section>`
      +`<article class="article wrap knowledge-layout">${guideSidebar}<div class="article-body">${g.regulatory?sourceNote:""}${g.sections.map((s,i)=>`<section id="section-${i+1}"><h2>${esc(s.h)}</h2>${s.p.map(p=>`<p>${esc(p)}</p>`).join("")}</section>`).join("")}${g.regulatory?"":sourceNote}<div class="related"><h2>در ادامه</h2><a href="${link("library/01/")}">کتاب مرجع مدیریت رستوران</a><a href="${link("tools/")}">محاسبه‌گرهای داینر</a><a href="${link("magazine/")}">آرشیو مجله داینر</a></div>${relatedBooks([(["start-restaurant","start-cafe","start-fastfood","restaurant-startup-cost"].includes(g.slug)?2:1)])}${comment(g.title)}</div></article>`;
    add(`guides/${g.slug}/`,g.title,g.summary,body,{structured:{"@context":"https://schema.org","@type":"Article",headline:g.title,description:g.summary,inLanguage:"fa",author:{"@type":"Organization",name:"تحریریه نیما داینر"},publisher:{"@type":"Organization",name:"نیما داینر",logo:{"@type":"ImageObject",url:ORIGIN+"/assets/logo-512.png"}}},keywords:g.tags.join(" ")});
  }
  const toolCatalog=[
    ["startup-runway","دوام سرمایه در گردش","راه‌اندازی","ببینید ذخیره پول شما با هزینه‌ها و درآمد فعلی چند ماه دوام می‌آورد.","opening-budget-versus-survival-cash"],
    ["breakeven","نقطه سربه‌سر","مالی","حساب کنید برای پوشش هزینه‌های ثابت چند سفارش نیاز دارید.","restaurant-break-even"],
    ["foodcost","درصد هزینه مواد اولیه","منو","ببینید چه سهمی از قیمت هر غذا صرف مواد اولیه می‌شود.","menu-trends-value-comfort-2026"],
    ["pricing","قیمت‌گذاری غذا","منو","با بهای مواد و درصد هدف، قیمت اولیه غذا را حساب کنید.","restaurant-menu-pricing"],
    ["menu","مشارکت و سودآوری آیتم منو","منو","ببینید بعد از هزینه‌های متغیر چقدر از فروش هر غذا باقی می‌ماند.","why-top-selling-menu-items-may-not-be-profitable"],
    ["buffet","اقتصاد بوفه آزاد","مالی","درآمد و هزینه متوسط هر مهمان بوفه را کنار هم بگذارید.","buffet-economics-fixed-price"],
    ["labor","سهم هزینه کارکنان","کارکنان","مجموع هزینه نیروی انسانی را با فروش همان دوره مقایسه کنید.","restaurant-staffing-cost"],
    ["waste","بازده و ضایعات مواد","آشپزخانه","از وزن خرید و وزن قابل استفاده، ضایعات واقعی را حساب کنید.","recipe-card-standardization"],
    ["discount","تخفیف و کارمزد دلیوری","فروش","ببینید بعد از تخفیف و کارمزد چه مبلغی باقی می‌ماند.","restaurant-delivery-discounts"],
    ["capacity","ظرفیت نظری فروش سالن","راه‌اندازی","با صندلی و گردش میز، سقف فرضی فروش را تخمین بزنید.","restaurant-seat-capacity"]
  ];
  const toolsIntro=`<section class="pagehead wrap">${crumbs([["ابزارها",null]])}<p class="eyebrow">آزمایشگاه داینر</p><h1>قبل از تصمیم، حساب کن</h1><p class="lead">ابزار موردنیاز را انتخاب کنید، عددهای خودتان را وارد کنید و نتیجه را همان‌جا ببینید. نیازی به ثبت‌نام ندارید.</p><p class="muted">عددها فقط در همین مرورگر محاسبه می‌شوند و به سرور فرستاده نمی‌شوند. نتیجه‌ها برآورد آموزشی‌اند.</p></section>`;
  const toolCards=toolCatalog.map(([slug,title,category,description])=>`<article class="card" data-tool-card data-tool-category="${esc(category)}"><span class="kicker">${esc(category)}</span><h3><a href="${link("tools/"+slug+"/")}">${esc(title)}</a></h3><p>${esc(description)}</p><a class="textlink" href="${link("tools/"+slug+"/")}">باز کردن محاسبه‌گر ←</a></article>`).join("");
  const tools=toolsIntro+`<section class="block wrap"><h2>ابزار مناسب مسئله شما</h2><p class="muted">موضوع را انتخاب کنید یا نام ابزار را جست‌وجو کنید. هر ابزار در یک صفحه مستقل باز می‌شود.</p><div class="tool-categories" role="group" aria-label="دسته‌بندی ابزارها"><button type="button" class="tool-category active" data-tool-filter-category="همه" aria-pressed="true">همه ابزارها</button>${[...new Set(toolCatalog.map(x=>x[2]))].map(category=>`<button type="button" class="tool-category" data-tool-filter-category="${esc(category)}" aria-pressed="false">${esc(category)}</button>`).join("")}</div><label for="tool-filter">جست‌وجوی ابزار</label><input id="tool-filter" type="search" autocomplete="off" placeholder="مثلاً قیمت غذا یا حقوق کارکنان" style="display:block;width:100%;max-width:520px;padding:14px;margin:10px 0 20px;border:1px solid #999;border-radius:8px"><p class="muted" id="tool-count" role="status" aria-live="polite">۱۰ ابزار برای استفاده</p><div class="cards two">${toolCards}</div></section>`+dinerActions();
  add("tools/","ابزارهای رایگان مدیریت رستوران و کافه","۱۰ محاسبه‌گر تخصصی برای مدیریت رستوران: فودکاست، نقطه سربه‌سر، قیمت‌گذاری، کارکنان، رسپی، فروش و دلیوری.",tools,{script:"article-calculators.js"});
  for(const [slug,title,category,description,articleSlug] of toolCatalog){
    const config=articleTools[articleSlug],article=editorial.articles.find(x=>x.slug===articleSlug);
    if(!config||!article)throw Error("Missing tool source: "+slug);
    const [, , ,note]=config;
    const aliasPath={foodcost:"/tools/food-cost-calculator/",breakeven:"/tools/restaurant-break-even/",menu:"/tools/menu-matrix/"}[slug];
    const aliasKw=aliasPath?(keywordMap.targets?.[aliasPath]?.keywords||[]):[];
    const aliasLine=aliasKw.length?`<p class="muted">این ابزار برای جست‌وجوهایی مانند «${esc(aliasKw.slice(0,3).join("»، «"))}» هم کاربرد دارد.</p>`:"";
    const how=`<section class="source-note"><h2>چطور از این ابزار استفاده کنم؟</h2><p>۱. عددهای واقعی کسب‌وکار خودتان را وارد کنید.</p><p>۲. نتیجه بلافاصله زیر فرم نمایش داده می‌شود.</p><p>۳. برای مقایسه، عددها را عوض کنید یا تا سه حالت را ثبت کنید.</p><p><strong>این عدد چه می‌گوید؟</strong> ${esc(description)}</p><p><strong>نکته:</strong> ${esc(note)}</p>${aliasLine}</section>`;
    const content=`<section class="pagehead wrap">${crumbs([["ابزارها","tools/"],[title,null]])}<p class="eyebrow">${esc(category)} · ابزار رایگان</p><h1>${esc(title)}</h1><p class="lead">${esc(description)}</p></section><article class="article wrap"><div class="article-body">${how}${calcArticle(articleSlug)}<div class="source-note"><h2>نتیجه را نگه دارید یا مقایسه کنید</h2><p>در کادر بالا می‌توانید سه حالت متفاوت را ثبت و مقایسه کنید، گزارش CSV برای اکسل بگیرید یا از «چاپ / ذخیره PDF» استفاده کنید.</p><p class="muted">خروجی‌ها روی دستگاه خودتان ساخته می‌شوند؛ برای PDF از گزینه ذخیره به‌صورت PDF در پنجره چاپ مرورگر استفاده کنید.</p></div><div class="related"><h2>برای یادگیری بیشتر</h2><a href="${link("reading/"+article.slug+"/")}">مقاله مرتبط: ${esc(article.title)}</a><a href="${link("library/")}">کتابخانه داینر</a><a href="${link("tools/")}">همه ابزارها</a></div>${dinerActions()}</div></article>`;
    add("tools/"+slug+"/",title+" | محاسبه‌گر داینر",description,content,{keywords:aliasKw.join(" "),script:"article-calculators.js",structured:{"@context":"https://schema.org","@type":"WebApplication",name:title,description,applicationCategory:"BusinessApplication",operatingSystem:"Web",offers:{"@type":"Offer",price:"0",priceCurrency:"IRR"},inLanguage:"fa"}});
  }
  renderManagerPages({add,section,crumbs,link,esc,card});
  add("membership/","عضویت داینر؛ کتابخانه شخصی و ابزارهای مدیریتی","معرفی مسیر عضویت رایگان و حرفه‌ای داینر برای دسترسی به کتابخانه، کیت‌ها، ژورنال و ابزارهای کسب‌وکار غذا.",
    `<section class="pagehead wrap">${crumbs([["عضویت داینر",null]])}<p class="eyebrow">عضویت در حال طراحی</p><h1>دانش و ابزارهای خودت را یک‌جا داشته باش</h1><p class="lead">کتابخانه شخصی، ذخیره مقاله‌ها، ابزارهای حرفه‌ای و ژورنال مدیریتی هدف این بخش است. عضویت واقعی با ورود امن از طریق ایمیل پیاده‌سازی خواهد شد.</p></section>`
    +section("مسیر عضویت","چه چیزی در برنامه است؟",`<div class="cards three">${card(null,"عضویت رایگان","کتابخانه من","مطالب ذخیره‌شده و ابزارهای پایه.")}${card(null,"عضویت حرفه‌ای","ژورنال و کیت‌ها","برنامه‌ریزی، پایش عملکرد و بسته‌های تخصصی.")}${card(null,"خدمات","مشاوره و ممیزی","پرونده اختصاصی با حفاظت داده و دسترسی مجاز.")}</div><p class="muted">اطلاعات مخاطبان ثبت‌شده در گذشته، بدون تبدیل خودکار به عضو حفظ می‌شوند و صرف داشتن اطلاعات تماس به معنای رضایت به خبرنامه نیست.</p>`),{noindex:true});
  add("services/","مشاوره و خدمات مدیریت رستوران و کافه","خدمات نیما داینر برای بررسی مسائل مالی، عملیات، مهندسی منو، مدیریت کارکنان و راه‌اندازی کسب‌وکار غذا.",
    `<section class="pagehead wrap">${crumbs([["خدمات",null]])}<p class="eyebrow">از آموزش تا اجرا</p><h1>خدمات و مشاوره داینر</h1><p class="lead">شناسایی مسئله واقعی کسب‌وکار، بررسی اطلاعات و پیشنهاد مسیر اصلاح. برای جلسهٔ تشخیصی ۹۰ دقیقه‌ای، شرح خدمات، تعرفه‌ها و مسیر رزرو به‌صورت شفاف در صفحهٔ اختصاصی آمده است.</p><div class="actions"><a class="button button-dark" href="${link("consultation/")}">جزئیات مشاورهٔ ۹۰ دقیقه‌ای ←</a><a class="button button-outline" href="https://t.me/nimaafsharnaderi" target="_blank" rel="noopener noreferrer">درخواست جلسه در تلگرام</a><a class="button button-outline" href="${link("consulting/")}">ابزار فعلی پرونده مشاوره</a></div><p class="muted">هشدار: نسخه فعلی ابزار پرونده مشاوره اطلاعات را بدون رمزگذاری در همین مرورگر نگه می‌دارد؛ روی دستگاه مشترک یا برای اطلاعات بسیار محرمانه از آن استفاده نکنید.</p></section>`
    +section("حوزه‌های مسئله","چه موضوعاتی بررسی می‌شوند؟",`<div class="cards three">${card(null,"۱","اقتصاد و قیمت‌گذاری","فروش، بهای تمام‌شده، هزینه‌ها و جریان نقدی.")}${card(null,"۲","عملیات و کارکنان","رسپی، شیفت، تدارکات، کیفیت و ضایعات.")}${card(null,"۳","راه‌اندازی و توسعه","انتخاب مدل، بودجه، منو و برنامه رشد.")}</div>`));
  renderConsultation({add,section,crumbs,link,esc});
  renderBook4Pages({add,section,crumbs,link,esc,orderURL:pricing.orderChannel||"https://t.me/nimaafsharnaderi"});
  renderBook5Pages({add,section,crumbs,link,esc,orderURL:pricing.orderChannel||"https://t.me/nimaafsharnaderi"});
  renderGlossary({glossary:data.glossary,entries:data.glossaryEntries,add,crumbs,link,esc});
  const getbookContent=`<section id="get-book" class="pagehead wrap order-page-head">${crumbs([["سفارش کتاب",null]])}<p class="eyebrow">کتابخانه نیما داینر</p><h1>پنج کتاب، دو قالب؛ انتخاب با تو</h1><p class="lead">نسخه چاپی برای همراهی روی میز کار و نسخه الکترونیکی برای مطالعه روی گوشی و رایانه. سه کتاب اول را می‌توان تکی یا به‌صورت بستهٔ سه‌جلدی سفارش داد؛ «دیده شو» و «منوی سودده» فعلاً فقط نسخهٔ الکترونیکی دارند و نسخهٔ چاپی‌شان به‌زودی می‌آید.</p>${coverTrio("order-books")}<div class="actions"><a class="button button-dark" href="#bundle-prices">قیمت بسته‌های سه‌جلدی</a><a class="button button-outline" href="#single-prices">قیمت هر کتاب</a></div></section>`+`<div id="bundle-prices"></div>`+section("انتخاب اقتصادی","قیمت بسته‌های سه‌جلدی",`<p class="rich">هر سه عنوان در بسته قرار می‌گیرند. قیمت جداگانه و میزان صرفه‌جویی هر بسته در کنار قیمت نهایی نمایش داده شده است.</p>${bundleCards()}`)+`<div id="single-prices"></div>`+section("انتخاب تکی","یک کتاب متناسب با نیازت",`<p class="rich">قیمت هر عنوان مستقل از موضوع کتاب یکسان است: چاپی ${money(pricing.single.print)} و الکترونیکی ${money(pricing.single.digital)}. پیش از خرید می‌توانی پنج صفحه نمونه از هر عنوان را بخوانی.</p><div class="cards three book-showcase-grid">${bs.map(bookCard).join("")}</div>`)+section("چطور سفارش بدهم؟","ثبت سفارش در تلگرام",`<p class="rich">هنگام پیام‌دادن، عنوان کتاب یا «بسته سه‌جلدی» و قالب چاپی یا الکترونیکی را مشخص کن. اطلاعات پرداخت و تحویل در ارتباط مستقیم اعلام می‌شود؛ هزینه ارسال کتاب چاپی، در صورت وجود، جداگانه هماهنگ می‌شود.</p><div class="actions"><a class="button button-dark" href="${orderURL}" target="_blank" rel="noopener noreferrer">ثبت سفارش در تلگرام ←</a></div>`);
  add("get-book/","سفارش کتاب‌های نیما داینر","معرفی کتاب‌ها و مسیر سفارش مجموعه تخصصی مدیریت رستوران و کافه.",getbookContent);
  const about=`<section class="pagehead wrap">${crumbs([["درباره داینر",null]])}<p class="eyebrow">About Nima’s Diner</p><h1>درباره نیما داینر</h1><p class="lead">پروژه مستقل فارسی برای صاحبان رستوران، کافه، نانوایی و دیگر کسب‌وکارهای غذا؛ با تمرکز بر تصمیم‌های قابل سنجش.</p></section>`
    +section("روش کار","از کتاب تا ابزار و داده",`<p class="rich">کتابخانه، مجله تک‌موضوعی، راهنماهای عملی، محاسبه‌گرها و تحلیل صنعت به یکدیگر متصل هستند تا موضوعی که می‌خوانید به اقدام مشخص ختم شود.</p>`)
    +section("سیاست انتشار","منبع و تاریخ قابل بررسی",`<p class="rich">خبر باید منبع اصلی و تاریخ داشته باشد؛ داده بازار کشورهای دیگر نباید بی‌دلیل به ایران تعمیم داده شود. مثال‌های عددی فرضی مشخص شده‌اند. محتوای مقررات و بهداشت پیش از تبدیل‌شدن به دستورالعمل باید با مرجع رسمی به‌روز بررسی شود.</p><p class="rich">برای گزارش خطا، پیشنهاد موضوع یا ارسال تجربه از راه ایمیل درج‌شده در پانوشت ارتباط بگیرید.</p>`);
  add("about/","درباره نیما داینر و سیاست انتشار","مأموریت نیما داینر، ساخت کتابخانه و رسانه تخصصی کسب‌وکار غذا؛ با روش مستندسازی خبر، تحلیل کاربردی و بازبینی محتوا.",about);
  const search=`<section class="pagehead wrap diner-os-search" aria-labelledby="diner-os-heading">
 ${crumbs([["جست‌وجو",null]])}
 <div class="diner-os-eyebrow"><span class="diner-os-pulse" aria-hidden="true"></span> DINER OS · راهنمای دانش داینر</div>
 <h1 id="diner-os-heading">از داینر بپرس؛ جواب و منبعش را پیدا کن.</h1>
 <p class="lead">مسئله رستوران یا کافه‌ات را به زبان خودت بنویس. از میان مقاله‌ها، مجله‌ها، نقدها، کتابخانه و ابزارهای منتشرشده نیمانیا، نزدیک‌ترین پاسخ‌ها و مسیرهای اجرایی را نشان می‌دهیم.</p>
 <form action="${link("search/")}" method="get" id="diner-os-form" class="search-form diner-os-form" role="search">
  <label for="local-search">سؤال یا عبارت موردنظر</label>
  <div class="search-controls"><input id="local-search" name="q" type="search" enterkeyhint="search" autocomplete="off" maxlength="240" placeholder="مثلاً رستورانم شلوغه ولی سود نمی‌کنم…"><button class="button button-dark" type="submit">پیدا کن ←</button></div>
 </form>
 <div class="diner-os-examples" aria-label="پرسش‌های پیشنهادی"><span>از اینجا شروع کن:</span><button type="button" data-diner-example="چطور فودکاست را حساب کنم؟">محاسبه فودکاست</button><button type="button" data-diner-example="رستورانم شلوغه ولی سود ندارم">شلوغی بدون سود</button><button type="button" data-diner-example="چرا مشتری‌های کافه برنمی‌گردن؟">وفاداری مشتری</button><button type="button" data-diner-example="برای راه‌اندازی رستوران از کجا شروع کنم؟">شروع رستوران</button></div>
 <p class="diner-os-disclosure">این نسخه از محتوای واقعی و عمومی نیمانیا راهنمایی می‌سازد؛ گفت‌وگوی زنده و بررسی اطلاعات اختصاصی کسب‌وکار هنوز فعال نیست.</p>
</section>
<section class="block wrap diner-os-output" aria-label="پاسخ و منابع جست‌وجو">
 <p id="search-status" class="muted" role="status" aria-live="polite">برای شروع سؤال بپرس یا یکی از موضوع‌ها را انتخاب کن.</p>
 <section id="diner-os-answer" class="diner-os-answer" hidden aria-labelledby="diner-os-answer-title">
  <span class="diner-os-answer-label">نزدیک‌ترین پاسخ از آرشیو نیمانیا</span><h2 id="diner-os-answer-title"></h2>
  <p id="diner-os-answer-summary"></p><a id="diner-os-answer-source" class="button button-outline" href="${link("reading/")}">مطالعه منبع ←</a>
  <p class="diner-os-answer-footnote">این چکیده بر اساس توضیح صفحه منتشرشده است؛ جایگزین بررسی اختصاصی کسب‌وکار نیست.</p>
 </section>
 <div id="diner-os-results-wrap" hidden><div class="diner-os-results-heading"><h2>مطالب و ابزارهای مرتبط</h2><p>نتایج از صفحات منتشرشده و دارای نشانی مستقل انتخاب شده‌اند.</p></div><div id="diner-os-filters" class="diner-os-filters" aria-label="فیلتر نوع محتوا"></div><div id="search-results" class="cards two diner-os-results"></div></div>
 <div id="diner-os-empty" class="diner-os-empty" hidden><strong>پاسخ دقیقی در آرشیو پیدا نشد.</strong><p>سؤال را کوتاه‌تر بنویس یا از موضوع‌های پیشنهادی استفاده کن. محتوای منتشرنشده به‌عنوان پاسخ نمایش داده نمی‌شود.</p></div>
 <div class="diner-os-next"><div><strong>مسئله‌ات به عدد و تصمیم نیاز دارد؟</strong><p>برای محاسبه هزینه، حاشیه مشارکت، قیمت‌گذاری و بررسی فرآیند، از ابزارهای اجرایی داینر استفاده کن.</p></div><a class="button button-outline" href="${link("tools/")}">ورود به ابزارهای داینر ←</a></div>
</section>`;
  add("search/","از داینر بپرس | جست‌وجوی دانش نیما داینر","جست‌وجوی ترکیبی در مقاله‌ها، کتاب‌ها، مجله‌ها، نقدهای نیما و ابزارهای منتشرشده؛ پاسخ کوتاه همراه با لینک منبع واقعی.",search,{noindex:true,script:"site-v2.js"});
  
  // خواندنی‌های داینر: خبر موثق، تحلیل کاربردی و پرونده تک‌موضوعی.
  const artItems=(editorial.articles||[]).filter(a=>a.status==="published");
  const artPath=a=>"reading/"+a.slug+"/";
  const cardArticle=a=>`<article class="card editorial-card"><span class="kicker">${esc(a.type==="news"?"رادار صنعت غذا":"تحلیل و تجربه")} · ${esc(a.topic)}</span><h3><a href="${link(artPath(a))}">${esc(a.title)}</a></h3><p>${esc(a.excerpt)}</p><div class="card-meta"><time datetime="${esc(a.publishedAt)}">${esc(a.publishedAt)}</time><a class="textlink" href="${link(artPath(a))}">ادامه مطلب ←</a></div></article>`;
  const introReading=(label,title,desc)=>`<section class="pagehead wrap">${crumbs([["خواندنی‌ها","reading/"],...(label?[ [label,null] ]:[])])}<p class="eyebrow">رسانه تخصصی نیما داینر</p><h1>${esc(title)}</h1><p class="lead">${esc(desc)}</p><div class="actions"><a class="button button-outline" href="${link("reading/")}">همه مطالب</a><a class="button button-outline" href="${link("reading/news/")}">رادار صنعت</a><a class="button button-outline" href="${link("reading/analysis/")}">تحلیل‌های کاربردی</a><a class="button button-outline" href="${link("guides/")}">دانشنامه</a></div></section>`;
  const editorialCards=arr=>arr.length?`<div class="cards three">${arr.map(cardArticle).join("")}</div>`:`<p class="muted">مطلب تأییدشده‌ای در این بخش ثبت نشده است.</p>`;
  const brandTopic=renderBrandTopicPages({editorial,add,section,crumbs,editorialCards,link,esc});
  const homeReading=introReading(null,"خواندنی‌های داینر","از خبرهای معتبر صنعت غذا تا تحلیل تصمیم‌های واقعی مدیران رستوران، کافه و نانوایی. هر خبر با تاریخ منبع و پیامد اجرایی همراه است.")
    +section("آخرین مطالب","تازه‌های تحریریه",editorialCards(artItems))
    +section("درس‌هایی از برندهای بزرگ","تجربهٔ برندها، درس برای رستوران‌ها",`<p class="rich">پرونده‌های مدیریتی برندهای شناخته‌شده را هم بر اساس نام برند و هم بر اساس مسئله‌ای مثل مهندسی منو، آموزش کارکنان یا قیمت‌گذاری دنبال کنید.</p><a class="button button-outline" href="${link("reading/brand-lessons/")}">مشاهده درس‌های برندها ←</a>`)
    +section("روش انتشار","چطور خبر و تحلیل منتشر می‌کنیم؟",`<p class="rich">خبرها فقط با منبع و تاریخ قابل بررسی منتشر می‌شوند؛ تحلیل‌ها با مثال و محاسبه مستند می‌شوند. گزارش‌های بازار آمریکا یا اروپا به‌صورت خودکار معادل وضعیت ایران نیستند و این مرز در متن مشخص می‌شود.</p><p class="rich">مطالب قدیمی در صورت تغییر داده یا مقررات بازبینی می‌شوند؛ تاریخ انتشار بی‌دلیل برای تازه‌نمایی تغییر نمی‌کند.</p>`);
  add("reading/","خواندنی‌های داینر؛ خبر، تحلیل و مطالب صنعت غذا","خبرهای مستند صنعت غذا، تحلیل اقتصاد رستوران، مدیریت کافه، فناوری، مهندسی منو و پرونده‌های تخصصی نیما داینر.",homeReading);
  add("reading/news/","رادار صنعت غذا؛ اخبار و روندهای رستوران و کافه","تازه‌ترین گزارش‌های مستند و تحلیل کاربردی خبرهای اقتصاد، فناوری و صنعت رستوران با تاریخ و منبع قابل بررسی.",introReading("رادار صنعت","رادار صنعت غذا","خبرهای بررسی‌شده، با منبع اصلی و توضیح اثر احتمالی بر تصمیم‌های کسب‌وکار غذا.")
    +section("گزارش‌های دارای منبع","خبرهایی که برای مدیر معنا دارند",editorialCards(artItems.filter(a=>a.type==="news"))));
  add("reading/analysis/","تحلیل صنعت رستوران و اقتصاد غذا","تحلیل مدل‌های درآمد، فودکاست، مدیریت منو، بوفه‌ها و بازگشت مشتری برای صاحبان کسب‌وکار غذا.",introReading("تحلیل‌ها","تحلیل و تجربه","مطالعات مسئله‌محور و مثال‌های اجرایی؛ اعداد فرضی به‌روشنی از داده‌های واقعی جدا می‌شوند.")
    +section("مسائل کسب‌وکار","نگاهی عمیق‌تر به تصمیم‌های مدیر",editorialCards(artItems.filter(a=>a.type==="analysis"))));
  for(const a of artItems){
    const tagged=editorial.brandTaxonomy.articleTags[a.slug]||{};
    const brandSlug=a.brand||tagged.brand;
    const brand=editorial.brandTaxonomy.brands.find(item=>item.slug===brandSlug);
    const topicSlugs=a.topics||tagged.topics||[];
    const topicLinks=topicSlugs.slice(0,2).map(slug=>editorial.brandTaxonomy.topics.find(t=>t.slug===slug)).filter(Boolean)
      .map(t=>({label:t.title,path:"reading/topics/"+t.slug+"/"}));
    const articleSidebar=renderKnowledgeSidebar({
      headings:a.sections.map(item=>item.h),
      related:[
        ...(brand?[{label:"تمام مطالب "+brand.fa,path:"reading/brands/"+brand.slug+"/"}]:[]),
        ...topicLinks,
        {label:"همه خواندنی‌های داینر",path:"reading/"},
        {label:"دانشنامه رستوران‌داری",path:"guides/"},
        {label:"ابزارهای مدیریتی",path:"tools/"}
      ],link,esc
    });
    const sourceLinks=(a.sources||[]).map(x=>`<li><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)}</a></li>`).join("");
    const relatedTitles={"magazine/02/":"شماره دوم ماهنامه داینر؛ مطالعه رایگان","reviews/shooka-cafe/":"آرشیو ۱۳۸۵: میهمانی دانگی در کافه شوکا","reviews/shooka-cafe-1405/":"کافه شوکا، بیست سال بعد","reviews/gandhi-shopping-center/":"پرونده مرکز خرید گاندی"};
    const links=(a.related||[]).map(u=>`<a href="${link(u)}">${esc((relatedTitles[u]||{"tools/":"محاسبه‌گرهای داینر","journal/":"ژورنال مدیر","magazine/01/":"مجلهٔ کرواسان"}[u]||data.guides.find(g=>"guides/"+g.slug+"/"===u)?.title||"مطالعهٔ مرتبط"))}</a>`).join("");
    const body=`<section class="pagehead wrap">${crumbs([["خواندنی‌ها","reading/"],[a.type==="news"?"رادار صنعت":"تحلیل و تجربه",a.type==="news"?"reading/news/":"reading/analysis/"],[a.title,null]])}<p class="eyebrow">${esc(a.type==="news"?"خبر و تفسیر برای مدیران":"تحلیل کسب‌وکار غذا")} · ${esc(a.topic)}</p><h1>${esc(a.title)}</h1><p class="lead">${esc(a.excerpt)}</p><div class="chips"><span class="chip">تدوین: ${esc(a.byline)}</span><span class="chip">انتشار در داینر: <time datetime="${esc(a.publishedAt)}">${esc(a.publishedAt)}</time></span>${a.sourcePublishedAt?`<span class="chip">تاریخ خبر اصلی: <time datetime="${esc(a.sourcePublishedAt)}">${esc(a.sourcePublishedAt)}</time></span>`:""}</div></section>
    <article class="article wrap knowledge-layout">${articleSidebar}<div class="article-body">${a.heroImage?`<figure class="review-photo"><img src="${esc(a.heroImage)}" alt="${esc(a.heroAlt||a.title)}" loading="eager" decoding="async"><figcaption>${esc(a.heroCaption||"تصویر آرشیوی کافه شوکا")}</figcaption></figure>`:""}${a.instagramReel?instagramEmbed(a.instagramReel):""}${a.slug==="yarali-pourmoghadam-shooka-cafe-management"?`<section class="magazine-article-banner"><h2>شماره دوم ماهنامه داینر؛ یارعلی و شوکا</h2><p>روایت مصور ۱۶صفحه‌ای کافه شوکا، رایگان و کامل.</p><a class="button button-dark" href="${link("magazine/02/")}">مطالعه آنلاین ماهنامه ←</a><a class="button button-outline" href="https://nimania.net/assets/magazine/02.pdf" target="_blank" rel="noopener noreferrer">دریافت PDF رایگان ←</a></section>`:""}${a.sections.map((s,i)=>`<section id="section-${i+1}"><h2>${esc(s.h)}</h2>${s.p.map(p=>`<p>${esc(p)}</p>`).join("")}</section>`).join("")}
    <aside class="source-note"><strong>منابع و شیوه تدوین</strong><p>${a.type==="news"?"گزارش خبری بر پایه منبع اصلی و تحلیل عملی داینر تهیه شده است. دامنه جغرافیایی داده‌ها در متن مشخص است.":"این یادداشت تحلیلی و آموزشی است. مثال‌های عددی فرضی هستند و نباید داده مشاهده‌شده از بازار تلقی شوند."}</p>${sourceLinks?`<ul class="source-links">${sourceLinks}</ul>`:"<p>روش: تحلیل مفهومی و مثال محاسباتی؛ بدون ادعای انجام پژوهش میدانی.</p>"}</aside>
    <div class="related"><h2>مطالعه و ابزار مرتبط</h2>${links}${brandTopic.articleLinks(a)}</div>${calcArticle(a.slug)}${articleTools[a.slug]?`<p><a class="button button-outline" href="${link("tools/"+articleTools[a.slug][0]+"/")}">صفحه مستقل این محاسبه‌گر ←</a></p>`:""}${sourceBooks(a.bookSources||[])}${articleBookAd()}${comment(a.title)}</div></article>`;
    const articleSchema={"@context":"https://schema.org","@type":a.type==="news"?"NewsArticle":"Article",headline:a.title,description:a.excerpt,datePublished:a.publishedAt,author:{"@type":a.byline==="نیما افشارنادری"?"Person":"Organization",name:a.byline},publisher:{"@type":"Organization",name:"نیما داینر",logo:{"@type":"ImageObject",url:ORIGIN+"/assets/logo-512.png"}},inLanguage:"fa",mainEntityOfPage:ORIGIN+"/"+artPath(a)};
    const about=brandTopic.about(a);
    if(about.length)articleSchema.about=about;
    add(artPath(a),a.title,a.excerpt,body,{structured:articleSchema,keywords:a.keyword,image:a.heroImage||"",script:"article-calculators.js",lastmod:a.publishedAt});
  }


  renderPromptPages({add,esc,link,crumbs});

  // No separate indexable pages for keywords without complete content.
  const indexed=pages.filter(x=>x.index);
  const searchIndex=indexed.map(x=>({title:x.title,description:x.description,url:BASE+x.path.replace(/index\.html$/,""),body:x.searchText||""}));
  const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexed.map(x=>`  <url><loc>${esc(ORIGIN+"/"+x.path.replace(/index\.html$/,""))}</loc><lastmod>${esc(x.lastmod||BUILD_DATE)}</lastmod></url>`).join("\n")}\n</urlset>\n`;
  const robots=`User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`;
  const feedItems=(editorial.articles||[]).filter(a=>a.status==="published").slice().sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  const rssEntry=a=>`<item><title>${esc(a.title)}</title><link>${ORIGIN}/reading/${a.slug}/</link><guid isPermaLink="true">${ORIGIN}/reading/${a.slug}/</guid><pubDate>${new Date(a.publishedAt+"T12:00:00Z").toUTCString()}</pubDate><description>${esc(a.excerpt)}</description></item>`;
  const feed=`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>خواندنی‌های نیما داینر</title><link>${ORIGIN}/reading/</link><description>خبر، تحلیل و مطالب کسب‌وکار غذا</description><language>fa</language>${feedItems.map(rssEntry).join("")}</channel></rss>`;
  return {pages,generated:[...pages,{path:"search-index.json",content:JSON.stringify(searchIndex,null,2)+"\n"},{path:"sitemap.xml",content:sitemap},{path:"robots.txt",content:robots},{path:"feed.xml",content:feed}],count:indexed.length};
}

const root=process.cwd();
const out=path.join(root,"site-dist");
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
for(const file of ["site-global.css","download.html","privacy.html","style.css","app.js","site-v2.css","site-v2.js","article-calculators.js","persian-digits.js","journal.mjs","journal-model.mjs",".nojekyll"]){fs.copyFileSync(path.join(root,file),path.join(out,file));}
for(const dir of ["assets","consulting","advisor","app","investment","sarvino"]){fs.cpSync(path.join(root,dir),path.join(out,dir),{recursive:true});}
const data=JSON.parse(fs.readFileSync(path.join(root,"content/catalog.json"),"utf8"));
data.bookPricing=JSON.parse(fs.readFileSync(path.join(root,"content/book-pricing.json"),"utf8"));
data.bookSamples=JSON.parse(fs.readFileSync(path.join(root,"content/book-samples.json"),"utf8"));
data.glossary=JSON.parse(fs.readFileSync(path.join(root,"content/glossary.json"),"utf8"));
data.glossaryEntries=JSON.parse(fs.readFileSync(path.join(root,"content/glossary-entries.json"),"utf8"));
data.courses=JSON.parse(fs.readFileSync(path.join(root,"content/courses.json"),"utf8"));
if(data.courses.schemaVersion!==1||!Array.isArray(data.courses.courses))throw new Error("Invalid academy course catalog");

const extended=JSON.parse(fs.readFileSync(path.join(root,"content/expanded-guides.json"),"utf8"));
const editorial=JSON.parse(fs.readFileSync(path.join(root,"content/editorial.json"),"utf8"));
editorial.brandTaxonomy=JSON.parse(fs.readFileSync(path.join(root,"content/brand-topics.json"),"utf8"));
const brandLessonFiles=["brand-lessons-part1.json","brand-lessons-part2.json"];
for(const file of brandLessonFiles){
  const data=JSON.parse(fs.readFileSync(path.join(root,"content",file),"utf8"));
  if(data.schemaVersion!==1||!Array.isArray(data.articles))throw Error("Invalid brand lesson file: "+file);
  for(const a of data.articles){
    if(a.status!=="published")throw Error("Unreviewed brand lesson must not appear in the published feed: "+a.slug);
    if(!a.brand||!editorial.brandTaxonomy.brands.some(b=>b.slug===a.brand))throw Error("Unknown case-study brand: "+a.slug);
    if(!a.topics?.length||a.topics.some(t=>!editorial.brandTaxonomy.topics.some(z=>z.slug===t)))throw Error("Invalid subject taxonomy for "+a.slug);
    if(!a.sources||a.sources.length<2||a.sources.some(s=>!s.url?.startsWith("https://")))throw Error("At least two cited HTTPS sources required for "+a.slug);
    if(!a.sections?.length||a.sections.some(s=>!s.h||!s.p?.length))throw Error("Invalid sections for "+a.slug);
    if(editorial.articles.some(x=>x.slug===a.slug))throw Error("Duplicate source/editorial article: "+a.slug);
    editorial.articles.push(a);
  }
}

const seo=JSON.parse(fs.readFileSync(path.join(root,"content/seo-keywords.json"),"utf8"));
const known=new Set(data.guides.map(g=>g.slug));
for(const g of extended.guides){if(known.has(g.slug))throw Error("Duplicate SEO guide slug: "+g.slug);known.add(g.slug);data.guides.push(g);}
const activeSlugs=new Set();
for(const a of editorial.articles.filter(a=>a.status==="published")){
 if(activeSlugs.has(a.slug))throw Error("Duplicate article slug: "+a.slug);
 activeSlugs.add(a.slug);
 if(a.type==="news"&&(!a.sources?.length||!a.sourcePublishedAt))throw Error("News requires verifiable dated source: "+a.slug);
}
const reviews=JSON.parse(fs.readFileSync(path.join(root,"content/reviews.json"),"utf8"));
const reviewSlugs=new Set();
for(const r of reviews.reviews){if(reviewSlugs.has(r.slug))throw Error("Duplicate review slug: "+r.slug);reviewSlugs.add(r.slug);}
const result=renderSite(data,editorial,seo,reviews);
for(const item of result.generated){const target=path.join(out,item.path);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,item.content,"utf8");}

// Keep typography and navigation consistent on every deployed HTML page.
// Generated pages already contain the primary navigation; standalone tools
// receive a compact cross-site directory without exposing private tool URLs.
const sharedNav='<nav class="diner-global-nav" aria-label="دسترسی سریع سایت"><a href="/nimasdiner/">خانه</a><a href="/nimasdiner/tools/">ابزارها</a><a href="/nimasdiner/library/">کتابخانه</a><a href="/nimasdiner/guides/">دانشنامه</a><a href="/nimasdiner/reading/">خواندنی‌ها</a><a href="/nimasdiner/consultation/">مشاوره</a><a href="/nimasdiner/search/">جست‌وجو</a></nav>';
function finishHTML(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const full=path.join(dir,entry.name);
  if(entry.isDirectory()){finishHTML(full);continue;}
  if(!entry.name.endsWith(".html"))continue;
  // Sarvino is intentionally a separate public-but-unlisted project workspace.
  if(path.relative(out,full).startsWith("sarvino"+path.sep))continue;
  let html=fs.readFileSync(full,"utf8");
  const stylesheet='<link rel="stylesheet" href="/nimasdiner/site-global.css">';
  if(!html.includes('site-global.css'))html=html.replace(/<\/head>/i,stylesheet+'</head>');
  // The generated page shell already has complete top-level navigation.
  if(!html.includes('aria-label="ناوبری اصلی"')&&!html.includes('class="diner-global-nav"')){
   html=html.replace(/<body([^>]*)>/i,(match,attrs)=>'<body'+attrs+'>'+sharedNav);
  }
  // Browser-side localization catches results generated after page load.
  if(!html.includes('src="/nimasdiner/persian-digits.js"')){
    html=html.replace(new RegExp("</body>","i"),'<script defer src="/nimasdiner/persian-digits.js"></script></body>');
  }
  // Render crawled/static HTML text in Persian; leave markup, IDs, links, data and JS intact.
  html=persianizeHTML(html);
  fs.writeFileSync(full,html,"utf8");
 }
}
finishHTML(out);

// Publish at the custom domain root, including copied standalone tools and data.
function migrateDomain(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const full=path.join(dir,entry.name);
  if(entry.isDirectory()){migrateDomain(full);continue;}
  if(!/\.(html|css|js|mjs|json|xml|txt|webmanifest)$/.test(entry.name))continue;
  const original=fs.readFileSync(full,"utf8");
  const migrated=original.replaceAll("https://nimania.github.io/nimasdiner","https://nimania.net")
    .replaceAll("https://nimania.github.io","https://nimania.net")
    .replaceAll("/nimasdiner/","/");
  if(migrated!==original)fs.writeFileSync(full,migrated,"utf8");
 }
}
migrateDomain(out);
console.log("Built",result.generated.length,"files,",result.count,"indexable pages");
