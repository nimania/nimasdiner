// فرهنگ اصطلاحات رستوران‌داری: one indexable hub page at /glossary/.
// Terms without a written entry are listed only on this hub (no thin per-term pages).
// When an entry is published, set its `entryPath` in content/glossary.json and it becomes a link.
const LEVELS={essential:"ضروری",practical:"کاربردی",specialist:"تخصصی"};

export function renderGlossary({glossary,add,crumbs,link,esc}){
  if(glossary?.schemaVersion!==1||!Array.isArray(glossary.terms)||!Array.isArray(glossary.categories))throw Error("Invalid content/glossary.json");
  const cats=glossary.categories;
  const known=new Set(cats.map(c=>c.slug));
  for(const t of glossary.terms){
    if(!t.fa||!t.en||!known.has(t.category)||!LEVELS[t.level])throw Error("Invalid glossary term: "+JSON.stringify(t));
  }
  const total=glossary.terms.length;
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
