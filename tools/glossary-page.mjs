// فرهنگ اصطلاحات رستوران‌داری: one indexable hub page at /glossary/.
// Terms without a written entry are listed only on this hub (no thin per-term pages).
// When an entry is published, set its `entryPath` in content/glossary.json and it becomes a link.
const LEVELS={essential:"ضروری",practical:"کاربردی",specialist:"تخصصی"};

// Today's date in Tehran (YYYY-MM-DD): entries go live on their publishOn day.
export function tehranToday(now=new Date()){
  return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Tehran",year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
}

export function renderGlossary({glossary,entries={entries:[]},today=tehranToday(),add,crumbs,link,esc}){
  if(glossary?.schemaVersion!==1||!Array.isArray(glossary.terms)||!Array.isArray(glossary.categories))throw Error("Invalid content/glossary.json");
  const cats=glossary.categories;
  const known=new Set(cats.map(c=>c.slug));
  for(const t of glossary.terms){
    if(!t.fa||!t.en||!known.has(t.category)||!LEVELS[t.level])throw Error("Invalid glossary term: "+JSON.stringify(t));
  }
  const total=glossary.terms.length;
  // Published entries: validate, attach to their term, and render one page each.
  if(entries.schemaVersion!==1||!Array.isArray(entries.entries))throw Error("Invalid content/glossary-entries.json");
  const slugs=new Set();
  for(const en of entries.entries){
    if(!/^[a-z0-9-]+$/.test(en.slug||"")||slugs.has(en.slug))throw Error("Bad or duplicate glossary slug: "+en.slug);
    slugs.add(en.slug);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(en.publishOn||""))throw Error("Glossary entry needs publishOn: "+en.slug);
    if(!glossary.terms.some(t=>t.fa===en.fa))throw Error("Glossary entry has no matching term: "+en.fa);
    if(!en.summary||!en.sections?.length)throw Error("Glossary entry incomplete: "+en.slug);
  }
  const live=entries.entries.filter(en=>en.publishOn<=today);
  const liveBySlug=new Map(live.map(en=>[en.slug,en]));
  for(const en of live){glossary.terms.find(t=>t.fa===en.fa).entryPath="glossary/"+en.slug+"/";}
  const catTitle=slug=>cats.find(c=>c.slug===slug)?.title||"";
  for(const en of live){
    const term=glossary.terms.find(t=>t.fa===en.fa);
    const body=en.sections.map((s,i)=>`<section id="section-${i+1}"><h2>${esc(s.h)}</h2>${(s.p||[]).map(p=>`<p>${esc(p)}</p>`).join("")}${s.items?.length?`<ul>${s.items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}</section>`).join("");
    const formula=en.formula?`<aside class="source-note glossary-formula"><strong>فرمول</strong><p>${esc(en.formula)}</p></aside>`:"";
    const rel=(en.related||[]).map(s=>liveBySlug.get(s)).filter(Boolean);
    const relHTML=rel.length?`<div class="related"><h2>اصطلاحات مرتبط</h2>${rel.map(r=>`<a href="${link("glossary/"+r.slug+"/")}">${esc(r.fa)}</a>`).join("")}<a href="${link("glossary/")}">همهٔ اصطلاحات</a></div>`:`<div class="related"><h2>اصطلاحات مرتبط</h2><a href="${link("glossary/")}">همهٔ اصطلاحات</a></div>`;
    const linksHTML=(en.links||[]).length?`<div class="related"><h2>ابزار و مطالعهٔ بیشتر</h2>${en.links.map(l=>`<a href="${link(l.path)}">${esc(l.label)}</a>`).join("")}</div>`:"";
    const books=`<aside class="source-note book-order"><strong>از کتابخانهٔ نیما داینر</strong><p>این مفهوم و کاربردش در تصمیم‌های روزمرهٔ رستوران، در کتاب <a class="textlink" href="${link("library/01/")}">«مرجع جامع مدیریت رستوران»</a> با جزئیات بیشتر آمده است. <a class="textlink" href="${link("library/")}">دیدن کتاب‌ها ←</a></p></aside>`;
    const content=`<section class="pagehead wrap">${crumbs([["فرهنگ اصطلاحات","glossary/"],[en.fa,null]])}<p class="eyebrow">فرهنگ اصطلاحات رستوران‌داری · ${esc(catTitle(term.category))}</p><h1>${esc(en.fa)} <span class="glossary-h1-en" lang="en" dir="ltr">${esc(term.en)}</span></h1><p class="lead">${esc(en.summary)}</p></section><article class="article wrap"><div class="article-body">${formula}${body}<aside class="source-note"><strong>دربارهٔ عددها</strong><p>مثال‌های عددی این صفحه فرضی و آموزشی‌اند. بازه‌هایی که از منابع بین‌المللی آمده، معیار رسمی بازار ایران نیستند.</p></aside>${relHTML}${linksHTML}${books}</div></article>`;
    add("glossary/"+en.slug+"/",`${en.fa} (${term.en}) چیست؟`,en.summary,content,{
      lastmod:en.publishOn,
      keywords:[en.fa,term.en,"تعریف "+en.fa,en.fa+" چیست"].join(" "),
      structured:{"@context":"https://schema.org","@type":"DefinedTerm",name:en.fa,alternateName:term.en,description:en.summary,inLanguage:"fa",inDefinedTermSet:{"@type":"DefinedTermSet",name:"فرهنگ اصطلاحات رستوران‌داری نیما داینر"}}
    });
  }
  const termHTML=t=>{
    const inner=`<span class="glossary-fa">${esc(t.fa)}</span><span class="glossary-en" lang="en" dir="ltr">${esc(t.en)}</span>`;
    return `<li class="glossary-term" data-glossary-term="${esc((t.fa+" "+t.en).toLowerCase())}">${t.entryPath?`<a href="${link(t.entryPath)}">${inner}</a>`:inner}</li>`;
  };
  const sections=cats.map(c=>{
    const items=glossary.terms.filter(t=>t.category===c.slug);
    if(!items.length)return "";
    return `<section class="glossary-cat" id="${esc(c.slug)}" data-glossary-section><h2>${esc(c.title)} <span class="glossary-count">${items.length} اصطلاح</span></h2><ul class="glossary-terms">${items.map(termHTML).join("")}</ul></section>`;
  }).join("");
  const chips=cats.filter(c=>glossary.terms.some(t=>t.category===c.slug)).map(c=>`<a class="chip" href="#${esc(c.slug)}">${esc(c.title)}</a>`).join("");
  const script=`<script>(function(){var q=document.getElementById("glossary-filter"),st=document.getElementById("glossary-status");if(!q)return;var n=function(s){return(s||"").toLowerCase().replace(/[\\u200c\\s]+/g," ").replace(/ي/g,"ی").replace(/ك/g,"ک").trim()};q.addEventListener("input",function(){var v=n(q.value),c=0;document.querySelectorAll("[data-glossary-section]").forEach(function(sec){var s=0;sec.querySelectorAll("[data-glossary-term]").forEach(function(li){var h=!v||n(li.getAttribute("data-glossary-term")).indexOf(v)!==-1;li.hidden=!h;if(h)s++});sec.hidden=!s;c+=s});st.textContent=v?(c?c+" اصطلاح پیدا شد":"اصطلاحی با این عبارت پیدا نشد."):"${total} اصطلاح"})})();</script>`;
  const content=`<section class="pagehead wrap">${crumbs([["فرهنگ اصطلاحات",null]])}<p class="eyebrow">فرهنگ اصطلاحات رستوران‌داری</p><h1>زبان مشترک مدیریت رستوران</h1><p class="lead">اصطلاحاتی که هر رستوران‌دار باید بشناسد، با معادل انگلیسی؛ از فودکاست و نقطهٔ سربه‌سر تا میزانپلاس، انبار، سالن و بهداشت. این فهرست سطح «ضروری» است و تعریف کامل هر اصطلاح، با مثال و محاسبه، به‌تدریج منتشر می‌شود.</p><div class="actions"><a class="button button-outline" href="${link("guides/")}">دانشنامه داینر</a><a class="button button-outline" href="${link("tools/")}">ابزارهای محاسبه</a></div></section>`
    +`<div class="glossary-tools"><div class="wrap"><label for="glossary-filter">جست‌وجوی اصطلاح</label><input id="glossary-filter" type="search" autocomplete="off" placeholder="فارسی یا انگلیسی؛ مثلاً فودکاست یا FIFO"><p class="muted" id="glossary-status" role="status" aria-live="polite">${total} اصطلاح</p><nav class="chips glossary-chips" aria-label="دسته‌های فرهنگ اصطلاحات">${chips}</nav></div></div>`
    +`<div class="wrap glossary-body">${sections}<aside class="source-note"><strong>این فرهنگ‌نامه در حال تکمیل است</strong><p>اصطلاح‌ها در سه سطح ضروری، کاربردی و تخصصی گسترش می‌یابند. برای پیشنهاد اصطلاح یا اصلاح یک معادل، به تحریریه ایمیل بزنید. برای یادگیری منسجم مدیریت رستوران، <a class="textlink" href="${link("library/")}">کتاب‌های نیما داینر</a> را ببینید.</p></aside></div>`
    +script;
  add("glossary/","فرهنگ اصطلاحات رستوران‌داری","فرهنگ اصطلاحات مدیریت رستوران و کافه با معادل انگلیسی: فودکاست، پرایم کاست، نقطه سربه‌سر، میزانپلاس، FIFO، مهندسی منو، HACCP و ده‌ها اصطلاح ضروری دیگر.",content,{
    keywords:"فرهنگ اصطلاحات رستوران اصطلاحات رستوران‌داری واژه‌نامه رستوران "+glossary.terms.map(t=>t.fa+" "+t.en).join(" "),
    structured:{"@context":"https://schema.org","@type":"DefinedTermSet",name:"فرهنگ اصطلاحات رستوران‌داری نیما داینر",inLanguage:"fa",hasDefinedTerm:glossary.terms.map(t=>({"@type":"DefinedTerm",name:t.fa,alternateName:t.en}))}
  });
}
