import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

// Companion pages for the book «دیده شو». Their URLs are printed as QR codes in the book:
// never rename or remove /b4/ routes once the book is printed.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");

const STYLE=`<style>
.b4-hero{border-right:6px solid #ffce25}
.b4-table{width:100%;border-collapse:collapse;margin:1rem 0;font-size:.95rem}
.b4-table th{background:#1a2126;color:#fff;padding:.6rem .7rem;text-align:right}
.b4-table td{border-bottom:1px solid #e3e1d8;padding:.6rem .7rem;vertical-align:top;height:2.2rem}
.b4-table tr:nth-child(even) td{background:#fafaf7}
.b4-scroll{overflow-x:auto}
.b4-list{padding-right:1.2rem;line-height:2}
.b4-copy{display:grid;gap:.6rem;margin:1rem 0}
.b4-copy button{all:unset;cursor:pointer;display:block;white-space:pre-line;background:#fff8e1;border-right:5px solid #ffce25;padding:.8rem 1rem;border-radius:.5rem;line-height:1.9}
.b4-copy button:hover,.b4-copy button:focus-visible{background:#ffefb0;outline:2px solid #1a2126}
.b4-copy button.done::after{content:"  ✓ کپی شد";font-weight:700;color:#2e7d32}
.b4-diagram{max-width:340px;margin:.5rem 0 1rem}
.b4-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:1rem}
.b4-buy{background:#f5a3c0;border-radius:1rem;padding:1.4rem}
.b4-buy .button{margin:.3rem 0 .3rem .5rem}
@media print{.topbar,.site-footer,footer,.b4-noprint,.breadcrumbs,.comment-zone{display:none!important}.b4-table td{height:1.4cm}body{background:#fff}}
</style>`;

const SCRIPT=`<script>document.addEventListener("click",e=>{const b=e.target.closest(".b4-copy button");if(!b)return;const t=b.dataset.text||b.textContent;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{b.classList.add("done");setTimeout(()=>b.classList.remove("done"),1600)}).catch(()=>{});});</script>`;

const SVG_PARTS={
  side:`<rect x="10" y="40" width="14" height="140" fill="#9fd3f0"/><text x="30" y="30" font-size="13">پنجره</text><path d="M24 110 H95" stroke="#ffce25" stroke-width="5" marker-end="url(#a)"/><rect x="250" y="60" width="10" height="100" fill="#fff" stroke="#1a2126"/><text x="196" y="185" font-size="13">مقوای سفید</text>`,
  back:`<rect x="90" y="10" width="160" height="14" fill="#9fd3f0"/><text x="150" y="45" font-size="13">پنجره</text><path d="M200 26 L170 70" stroke="#ffce25" stroke-width="5" marker-end="url(#a)"/><rect x="250" y="80" width="10" height="80" fill="#fff" stroke="#1a2126"/>`,
  night:`<rect x="14" y="70" width="18" height="80" fill="#ffce25" stroke="#1a2126"/><rect x="44" y="60" width="6" height="100" fill="#eee" stroke="#999"/><text x="8" y="60" font-size="12">LED</text><text x="30" y="185" font-size="12">پارچهٔ سفید</text><path d="M52 110 H100" stroke="#ffce25" stroke-width="5" marker-end="url(#a)"/><rect x="250" y="60" width="10" height="100" fill="#fff" stroke="#1a2126"/>`,
  out:`<circle cx="40" cy="40" r="18" fill="#ffce25" stroke="#1a2126"/><text x="64" y="44" font-size="13">خورشید پایین، از کنار</text><path d="M55 55 L115 95" stroke="#ffce25" stroke-width="5" marker-end="url(#a)"/>`
};
const diagram=k=>`<svg class="b4-diagram" viewBox="0 0 280 200" role="img" aria-label="نقشهٔ چیدمان نور" xmlns="http://www.w3.org/2000/svg" font-family="Vazirmatn,Tahoma" direction="ltr" style="direction:ltr"><defs><marker id="a" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="7" refY="7" orient="auto"><path d="M0 0 L14 7 L0 14z" fill="#1a2126"/></marker></defs><rect x="1" y="1" width="278" height="198" rx="10" fill="#fffdf5" stroke="#e3e1d8"/>${SVG_PARTS[k]}<circle cx="150" cy="110" r="34" fill="#fff" stroke="#1a2126" stroke-width="2"/><circle cx="150" cy="110" r="18" fill="#e9a23b"/><rect x="138" y="170" width="24" height="14" rx="3" fill="#1a2126"/><text x="168" y="182" font-size="12">گوشی</text></svg>`;

export function renderBook4Pages({add,section,crumbs,link,esc,orderURL="https://t.me/nimaafsharnaderi"}){
  const data=JSON.parse(fs.readFileSync(path.join(root,"content/book4-companion.json"),"utf8"));
  const book=data.book;
  const buy=`<section class="block wrap b4-noprint"><div class="b4-buy"><h2>کتاب «${esc(book.title)}» و کتاب‌های دیگر نیما داینر</h2><p>برای سفارش کتاب یا پرسیدن سؤال دربارهٔ اینستاگرام کسب‌وکارت، در تلگرام یا دایرکت اینستاگرام پیام بده. سفارش با هماهنگی انجام می‌شود و پرداخت خودکار نیست.</p><a class="button button-dark" href="${orderURL}" target="_blank" rel="noopener noreferrer">پیام در تلگرام ←</a><a class="button button-outline" href="https://instagram.com/nimasdiner" target="_blank" rel="noopener noreferrer">دایرکت اینستاگرام</a><a class="button button-outline" href="${link("library/")}">کتابخانهٔ نیما داینر</a></div></section>`;
  const block=s=>{
    let h="";
    if(s.diagram)h+=diagram(s.diagram);
    for(const p of s.p||[])h+=`<p class="rich">${esc(p)}</p>`;
    if(s.list)h+=`<ul class="b4-list">${s.list.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`;
    if(s.copy)h+=`<div class="b4-copy">${s.copy.map(x=>`<button type="button" data-text="${esc(x)}" aria-label="کپی متن">${esc(x)}</button>`).join("")}</div>`;
    if(s.table)h+=`<div class="b4-scroll"><table class="b4-table"><thead><tr>${s.table.head.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${s.table.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    return section(s.eyebrow||"",s.h,h);
  };
  for(const pg of data.pages){
    const url=`b4/${pg.slug}/`;
    const print=pg.printable?`<p class="b4-noprint"><button class="button button-dark" type="button" onclick="window.print()">چاپ این صفحه</button></p>`:"";
    const sources=pg.sources?section("منبع","برای بررسی بیشتر",`<ul class="b4-list">${pg.sources.map(([t,u])=>`<li><a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(t)}</a></li>`).join("")}</ul>`):"";
    const main=`<section class="pagehead wrap b4-hero">${crumbs([["دیده شو","b4/"],[pg.title,null]])}<p class="eyebrow">همراه کتاب «${esc(book.title)}» · ${esc(pg.chapter)}</p><h1>${esc(pg.title)}</h1><p class="lead">${esc(pg.lead)}</p><p class="muted">آخرین بازبینی: ${esc(book.updated)}</p>${print}</section>`
      +pg.sections.map(block).join("")+sources+buy+STYLE+SCRIPT;
    add(url,pg.title,pg.description,main);
  }
  const hub=`<section class="pagehead wrap b4-hero">${crumbs([["دیده شو",null]])}<p class="eyebrow">کتابخانهٔ نیما داینر</p><h1>«${esc(book.title)}»؛ ${esc(book.subtitle)}</h1><p class="lead">صفحه‌های همراه کتاب: نمونه‌ها، قالب‌ها و نسخهٔ به‌روز بخش‌هایی که در کتاب با QR مشخص شده‌اند. مناسب برای ${esc(book.audience)}.</p></section>`
    +section("صفحه‌های همراه","هر QR کتاب به یکی از این صفحه‌ها می‌رسد",`<div class="b4-grid">${data.pages.map(pg=>`<article class="card"><span class="kicker">${esc(pg.chapter)}</span><h3><a href="${link(`b4/${pg.slug}/`)}">${esc(pg.title)}</a></h3><p>${esc(pg.description)}</p></article>`).join("")}</div>`)
    +buy+STYLE;
  add("b4/",`صفحه‌های همراه کتاب ${book.title}`,`نمونه‌ها، قالب‌ها و ابزارهای قابل چاپ همراه کتاب «${book.title}»؛ اینستاگرام بدون بودجهٔ تبلیغات برای کسب‌وکارهای غذایی.`,hub);
}
