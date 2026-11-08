
(()=>{"use strict";
const byId=id=>document.getElementById(id);
const normalize=text=>String(text||"").normalize("NFKC").replace(/[يى]/g,"ی").replace(/ك/g,"ک").replace(/[\u064B-\u065F]/g,"").replace(/\u200c/g," ").replace(/\s+/g," ").toLowerCase().trim();
const fmt=new Intl.NumberFormat("fa-IR",{maximumFractionDigits:1});
const amount=id=>{const el=byId(id);if(!el||el.value.trim()==="")return null;const v=Number(el.value);return Number.isFinite(v)&&v>=0?v:null;};
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
