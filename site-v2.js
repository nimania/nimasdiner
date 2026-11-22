
(()=>{"use strict";
const byId=id=>document.getElementById(id);
const normalize=text=>String(text||"").normalize("NFKC").replace(/[يى]/g,"ی").replace(/ك/g,"ک").replace(/[\u064B-\u065F]/g,"").replace(/\u200c/g," ").replace(/\s+/g," ").toLowerCase().trim();
const fmt=new Intl.NumberFormat("fa-IR",{maximumFractionDigits:1});
const amount=id=>{const el=byId(id);if(!el||el.value.trim()==="")return null;const s=el.value.trim().replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[٬,\s]/g,'').replace(/٫/g,'.');if(!/^\d+(?:\.\d+)?$/.test(s))return null;const v=Number(s);return Number.isFinite(v)&&v>=0&&v<=1e15?v:null;};
if(byId("food-price")){
 const update=()=>{const p=amount("food-price"),c=amount("food-cost"),out=byId("food-result");
 if(p===null||c===null){out.textContent="قیمت فروش و هزینه مواد را وارد کنید.";return;}
 if(p===0){out.textContent="قیمت فروش باید بیشتر از صفر باشد.";return;}
 out.textContent="نسبت مواد اولیه: "+fmt.format(c/p*100)+"٪"+(c>p?" · هزینه مواد از قیمت فروش بیشتر است.":"");};
 ["food-price","food-cost"].forEach(id=>byId(id).addEventListener("input",update));
 update();
}
if(byId("fixed-costs")){
 const update=()=>{const f=amount("fixed-costs"),p=amount("sale-price"),v=amount("variable-costs"),out=byId("break-result");
 if([f,p,v].some(x=>x===null)){out.textContent="هر سه عدد را وارد کنید.";return;}
 if(p<=v){out.textContent="مبلغ مشارکت هر سفارش مثبت نیست؛ با این مفروضات نقطه سربه‌سر قابل محاسبه نیست.";return;}
 const orders=Math.ceil(f/(p-v));out.textContent="تقریباً "+fmt.format(orders)+" سفارش در ماه برای پوشش هزینه ثابت ثبت‌شده.";};
 ["fixed-costs","sale-price","variable-costs"].forEach(id=>byId(id).addEventListener("input",update));
 update();
}
// Restore archive cover photos from alternate WordPress hosts when one CDN refuses a request.
// Keep the final fallback within this site so a card never exposes broken-image alt text.
if(byId("review-grid")){
  const mediaVariants=src=>{
    let url;
    try{url=new URL(src,location.href)}catch{return []}
    let file="";
    if(url.hostname==="nimania.files.wordpress.com" && url.pathname.startsWith("/2026/11/"))file=url.pathname.slice(9);
    if(url.hostname==="nimania.wordpress.com" && url.pathname.startsWith("/wp-content/uploads/2026/11/"))file=url.pathname.slice("/wp-content/uploads/2026/11/".length);
    if(!file)return [];
    return [
      "https://nimania.wordpress.com/wp-content/uploads/2026/11/"+file,
      "https://nimania.files.wordpress.com/2026/11/"+file,
      "https://i0.wp.com/nimania.files.wordpress.com/2026/11/"+file,
      "https://i0.wp.com/nimania.wordpress.com/wp-content/uploads/2026/11/"+file
    ];
  };
  document.querySelectorAll(".review-cover img").forEach(img=>{
    const src=img.getAttribute("src")||"";
    const urls=[...new Set([...mediaVariants(src),img.dataset.imageFallback||""])].filter(url=>url && url!==src);
    let index=0;
    const retry=()=>{
      if(index<urls.length){img.src=urls[index++];return}
      img.hidden=true;
      const text=document.createElement("span");
      text.className="review-cover-text";
      text.textContent=img.closest(".review-card")?.querySelector("h3")?.textContent||"تصویر رستوران";
      img.parentElement?.appendChild(text);
    };
    img.addEventListener("error",retry);
    if(img.complete && img.naturalWidth===0)retry();
  });
}
const search=byId("local-search");
if(byId('delivery-price')){
 const ids=['delivery-price','delivery-food','delivery-pack','delivery-discount','delivery-fee'];
 const update=()=>{const [p,f,b,d,c]=ids.map(amount),out=byId('delivery-result');if([p,f,b,d,c].some(x=>x===null)){out.textContent='هر پنج عدد را وارد کن؛ اگر هزینه‌ای نداری صفر بگذار.';return;}if(!p||d>p||c>100){out.textContent='قیمت باید مثبت، تخفیف حداکثر برابر قیمت و کارمزد بین صفر و صد باشد.';return;}const net=p-d,fee=net*c/100,contribution=net-fee-f-b;out.textContent='مشارکت هر سفارش: '+fmt.format(contribution)+' تومان · کارمزد: '+fmt.format(fee)+' تومان'+(contribution<0?' · با این مفروضات هر سفارش مشارکت منفی دارد.':'');};
 ids.forEach(id=>byId(id).addEventListener('input',update));update();
}
document.querySelectorAll('[data-print]').forEach(button=>{button.hidden=false;button.addEventListener('click',()=>window.print());});
const reviewFilters=byId('review-filters');
if(reviewFilters){
 reviewFilters.hidden=false;
 const cards=Array.from(document.querySelectorAll('[data-review-category]'));
 const category=byId('review-category'),city=byId('review-city'),type=byId('review-type'),query=byId('review-query');
 const params=new URLSearchParams(location.search);
 for(const [key,el] of [['category',category],['city',city],['type',type]]){const value=params.get(key);if(value&&Array.from(el.options).some(o=>o.value===value))el.value=value;}
 query.value=params.get('q')||'';
 const filter=()=>{let count=0;const tokens=normalize(query.value).split(' ').filter(Boolean);
 for(const card of cards){const d=card.dataset;const show=(category.value==='all'||d.reviewCategory===category.value)&&(!city.value||d.reviewCity===city.value)&&(!type.value||d.reviewType===type.value)&&tokens.every(t=>normalize(card.textContent).includes(t));card.hidden=!show;if(show)count++;}
 byId('review-filter-count').textContent=fmt.format(count)+' نوشته مطابق انتخاب شما';byId('review-empty').hidden=count!==0;
 const next=new URLSearchParams();if(category.value!=='food')next.set('category',category.value);if(city.value)next.set('city',city.value);if(type.value)next.set('type',type.value);if(query.value.trim())next.set('q',query.value.trim());history.replaceState(null,'',location.pathname+(next.size?'?'+next.toString():''));};
 reviewFilters.addEventListener('submit',event=>event.preventDefault());
 [category,city,type].forEach(el=>el.addEventListener('change',filter));query.addEventListener('input',filter);filter();
}
if(search){
 const status=byId("search-status"),results=byId("search-results"),resultsWrap=byId("diner-os-results-wrap"),answer=byId("diner-os-answer"),answerTitle=byId("diner-os-answer-title"),answerSummary=byId("diner-os-answer-summary"),answerSource=byId("diner-os-answer-source"),empty=byId("diner-os-empty"),filters=byId("diner-os-filters");
 const stop=new Set("چطور چگونه چرا چی چیست کی کجا از در با به برای من ما منو رستورانم کافه ام یک یه رو را این آن که هست است می کنم کنیم کنند ولی اما و یا هم چه دارم ندارم میخوام میخواهم می تونم".split(" "));
 const rules=[
  {test:/فود\s*کاست|food\s*cost|مواد اولیه|هزینه غذا|foodcost/,terms:["فودکاست","هزینه مواد","food cost"],route:"/guides/food-cost/"},
  {test:/سود|ضرر|شلوغ|درآمد|حاشیه|قیمت\s*گذار|قیمت\s*فروش/,terms:["سود رستوران","حاشیه مشارکت","فودکاست","مهندسی منو"],route:"/guides/restaurant-profit/"},
  {test:/مشتری|وفادار|بازگشت|برنمیگرد|بر نمیگرد|شوکا|یارعلی/,terms:["وفاداری مشتری","کافه شوکا","تجربه مشتری"],route:"/reading/yarali-pourmoghadam-shooka-cafe-management/"},
  {test:/افتتاح|راه\s*انداز|تأسیس|تاسیس|رستوران بزن|کافه بزن|سرمایه/,terms:["راه اندازی","سرمایه محدود","مجوز رستوران"],route:"/guides/restaurant-management/"},
  {test:/مجله|ماهنامه|کرواسان/,terms:["مجله داینر","کرواسان","یارعلی و شوکا"],route:"/magazine/"},
  {test:/رسپی|دستور پخت|دستور غذا|مواد مصرف|پخت/,terms:["رسپی","کارت رسپی","استانداردسازی"],route:"/tools/"},
  {test:/ضایعات|دورریز|موجودی|انبار/,terms:["ضایعات","انبار","هزینه مواد"],route:"/tools/"}
 ];
 const category=url=>url.startsWith("/tools/")?"tools":url.startsWith("/guides/")?"guide":url.startsWith("/reading/")?"reading":url.startsWith("/reviews/")?"review":url.startsWith("/magazine/")?"magazine":url.startsWith("/library/")||url.startsWith("/books/")?"book":"other";
 const labels={all:"همه",guide:"دانشنامه",tools:"ابزار",reading:"خواندنی‌ها",review:"نقد رستوران",magazine:"ماهنامه",book:"کتابخانه",other:"سایر"};
 const tokenize=q=>[...new Set(normalize(q).split(/[^\p{L}\p{N}]+/u).filter(t=>t.length>2&&!stop.has(t)))].slice(0,12);
 const safePath=url=>typeof url==="string"&&url.startsWith("/")&&!url.startsWith("//")&&!url.includes("\\")?url:"";
 let current=[],chosen="all",catalogPromise;
 const index=()=>catalogPromise||(catalogPromise=fetch("/nimasdiner/search-index.json",{cache:"no-store"})
  .then(r=>{if(!r.ok)throw Error("index");return r.json()})
  .then(pages=>{if(!Array.isArray(pages))throw Error("invalid index");return pages.filter(p=>safePath(p.url)&&p.title&&p.description)})
  .catch(error=>{catalogPromise=null;throw error}));
 const ranked=(pages,q)=>{
  const n=normalize(q),tokens=tokenize(q),intent=rules.find(r=>r.test.test(n));
  const extra=intent?intent.terms.flatMap(tokenize):[];
  const related=[...new Set(extra)].filter(t=>!tokens.includes(t)).slice(0,9);
  const items=[];
  for(const p of pages){
   const title=normalize(p.title),description=normalize(p.description),body=normalize((p.body||"").slice(0,24000));
   let score=0,primary=0;
   if(n.length>2&&title.includes(n))score+=35;
   if(n.length>2&&description.includes(n))score+=16;
   for(const t of tokens){if(title.includes(t)){score+=11;primary++}else if(description.includes(t)){score+=5;primary++}else if(body.includes(t)){score+=1;primary++}}
   for(const t of related){if(title.includes(t))score+=5;else if(description.includes(t))score+=2;else if(body.includes(t))score+=.5}
   if(intent&&p.url===intent.route)score+=24;
   if(score>0&&(primary>0||(intent&&score>=8)))items.push({page:p,score,kind:category(p.url)});
  }
  return items.sort((a,b)=>b.score-a.score||a.page.title.localeCompare(b.page.title,"fa")).slice(0,24);
 };
 const render=()=>{
  results.replaceChildren();
  filters.replaceChildren();
  for(const type of ["all",...new Set(current.map(x=>x.kind))]){
   const button=document.createElement("button");button.type="button";button.textContent=labels[type];button.className="diner-os-filter"+(chosen===type?" is-active":"");button.setAttribute("aria-pressed",String(chosen===type));
   button.addEventListener("click",()=>{chosen=type;render()});filters.append(button);
  }
  for(const entry of current.filter(x=>chosen==="all"||x.kind===chosen).slice(0,12)){
   const p=entry.page,card=document.createElement("article"),k=document.createElement("span"),h=document.createElement("h3"),a=document.createElement("a"),desc=document.createElement("p");
   card.className="card diner-os-result";k.className="kicker";k.textContent=labels[entry.kind];a.href=p.url;a.textContent=p.title;h.append(a);desc.textContent=p.description;card.append(k,h,desc);results.append(card);
  }
 };
 const run=async(q,changeUrl)=>{
  const term=q.trim().slice(0,240);search.value=term;
  if(changeUrl){const url=new URL(location.href);term?url.searchParams.set("q",term):url.searchParams.delete("q");history.replaceState(null,"",url.pathname+url.search)}
  answer.hidden=true;empty.hidden=true;resultsWrap.hidden=true;current=[];chosen="all";
  if(!term){status.textContent="برای شروع سؤال بپرس یا یکی از موضوع‌ها را انتخاب کن.";return}
  status.textContent="در حال بررسی محتوای منتشرشده…";
  try{
   const pages=await index();if(search.value!==term)return;
   current=ranked(pages,term);status.textContent=current.length?fmt.format(current.length)+" نتیجه مرتبط از آرشیو نیمانیا":"پاسخ دقیقی در آرشیو پیدا نشد.";
   if(!current.length){empty.hidden=false;return}
   const best=current[0].page;answerTitle.textContent=best.title;answerSummary.textContent=best.description;
   answerSource.href=best.url;answerSource.textContent="مطالعه منبع: "+best.title+" ←";answer.hidden=false;resultsWrap.hidden=false;render();
  }catch(error){status.textContent="بارگذاری آرشیو ممکن نشد. اتصال اینترنت را بررسی و دوباره تلاش کن.";empty.hidden=false;console.warn("Diner search index",error)}
 };
 byId("diner-os-form")?.addEventListener("submit",event=>{event.preventDefault();run(search.value,true)});
 document.querySelectorAll("[data-diner-example]").forEach(button=>button.addEventListener("click",()=>run(button.dataset.dinerExample||"",true)));
 const initial=new URLSearchParams(location.search).get("q")||"";if(initial)run(initial,false);
}
})();
