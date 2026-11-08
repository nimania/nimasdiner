
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
 const status=byId("search-status"),results=byId("search-results"),term=new URLSearchParams(location.search).get("q")||"";
 search.value=term;
 const tokens=normalize(term).split(" ").filter(Boolean);
 if(!tokens.length)return;
 status.textContent="در حال بررسی مطالب منتشرشده…";
 fetch("/nimasdiner/search-index.json",{cache:"no-store"})
 .then(r=>{if(!r.ok)throw Error("Unavailable");return r.json();})
 .then(pages=>{
 const matches=pages.filter(p=>tokens.every(t=>normalize(p.title+" "+p.description+" "+p.body).includes(t)));
 results.replaceChildren();
 status.textContent=matches.length?fmt.format(matches.length)+" نتیجه مرتبط یافت شد.":"مطلب مرتبطی در آرشیو منتشرشده پیدا نشد.";
 for(const p of matches){const card=document.createElement("article");card.className="card";
 const h=document.createElement("h3"),a=document.createElement("a"),desc=document.createElement("p");
 a.href=p.url;a.textContent=p.title;h.appendChild(a);desc.textContent=p.description;card.append(h,desc);results.appendChild(card);}
 })
 .catch(()=>{status.textContent="بارگذاری فهرست جست‌وجو انجام نشد. لطفاً دوباره تلاش کنید.";});
}
})();
