(()=>{'use strict';
const fmt=new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2});
const parse=s=>{const t=String(s).replace(/[۰-۹]/g,c=>c.charCodeAt(0)-1776).replace(/[٠-٩]/g,c=>c.charCodeAt(0)-1632).replace(/[٬,\s]/g,'').replace(/٫/g,'.');return t.trim()===''?null:/^\d+(?:\.\d+)?$/.test(t)&&Number.isFinite(+t)?+t:null};
const calculations={
'startup-runway':v=>{const [cash,fixed,sales,variable]=v;const burn=fixed+variable-sales;return burn<=0?'با این فرض‌ها کسری نقدی ماهانه ندارید؛ مدت دوام سرمایه با این مدل محدود نیست.': 'کسری نقدی ماهانه: '+fmt.format(burn)+' تومان؛ ذخیره نقدی حدود '+fmt.format(cash/burn)+' ماه دوام می‌آورد.'},
'breakeven':v=>{const [fixed,price,variable]=v;if(price<=variable)return 'حاشیه مشارکت مثبت نیست؛ نقطه سربه‌سر قابل دستیابی نیست.';return 'مشارکت هر سفارش: '+fmt.format(price-variable)+' تومان؛ نقطه سربه‌سر: '+fmt.format(Math.ceil(fixed/(price-variable)))+' سفارش در ماه.'},
'foodcost':v=>{const [cost,price]=v;if(!price)return 'قیمت فروش باید بیشتر از صفر باشد.';return 'نسبت مواد اولیه: '+fmt.format(cost/price*100)+'٪؛ مشارکت پیش از سایر هزینه‌ها: '+fmt.format(price-cost)+' تومان.'},
'pricing':v=>{const [cost,target]=v;if(target>=100)return 'درصد هدف باید کمتر از ۱۰۰ باشد.';if(target===0)return 'درصد هدف باید بیشتر از صفر باشد.';return 'قیمت لازم برای نسبت مواد اولیه '+fmt.format(target)+'٪: '+fmt.format(cost/(target/100))+' تومان (پیش از مالیات و سایر هزینه‌ها).'},
'menu':v=>{const [price,food,other,units]=v;const m=price-food-other;return 'مشارکت هر سفارش: '+fmt.format(m)+' تومان؛ مشارکت کل دوره: '+fmt.format(m*units)+' تومان. این مبلغ سود خالص نیست.'},
'buffet':v=>{const [price,average,other,fixed,guests]=v;if(!guests)return 'تعداد مهمان باید مثبت باشد.';const m=price-average-other;return 'مشارکت هر مهمان: '+fmt.format(m)+' تومان؛ نتیجه پس از هزینه ثابت واردشده: '+fmt.format(m*guests-fixed)+' تومان.'},
'labor':v=>{const [wages,benefits,sales]=v;if(!sales)return 'فروش باید بیشتر از صفر باشد.';return 'سهم هزینه کارکنان از فروش: '+fmt.format((wages+benefits)/sales*100)+'٪. این شاخص به‌تنهایی درباره بهره‌وری قضاوت نمی‌کند.'},
'waste':v=>{const [purchased,usable]=v;if(!purchased)return 'مقدار خرید باید مثبت باشد.';if(usable>purchased)return 'مقدار قابل استفاده نمی‌تواند بیشتر از مقدار خرید باشد.';return 'بازده مواد: '+fmt.format(usable/purchased*100)+'٪؛ ضایعات: '+fmt.format((purchased-usable)/purchased*100)+'٪.'},
'discount':v=>{const [price,food,other,discount,fee]=v;if(discount>price||fee>100)return 'تخفیف نباید از قیمت و درصد کارمزد نباید از ۱۰۰ بیشتر باشد.';const revenue=price-discount;return 'مشارکت سفارش: '+fmt.format(revenue*(1-fee/100)-food-other)+' تومان؛ توجه: مبنای کارمزد در این مدل، مبلغ پس از تخفیف است.'},
'capacity':v=>{const [seats,turns,days,avg]=v;return 'ظرفیت نظری فروش دوره: '+fmt.format(seats*turns*days*avg)+' تومان در صورت پرشدن تمام صندلی‌ها در تمام نوبت‌ها. این عدد پیش‌بینی واقعی فروش نیست.'}
};
document.querySelectorAll('[data-diner-calculator]').forEach(root=>{
 const key=root.dataset.dinerCalculator,fn=calculations[key];if(!fn)return;
 const inputs=[...root.querySelectorAll('input[data-calc-input]')],output=root.querySelector('[data-calc-output]');
 const valid=()=>inputs.map(x=>parse(x.value));
 const isValid=v=>v.every(x=>x!==null);
 const update=()=>{const values=valid();if(!isValid(values)){output.textContent='همه ورودی‌ها را تکمیل کنید؛ برای هزینه‌های صفر، عدد ۰ بگذارید.';return false;}output.textContent=fn(values);return true;};
 inputs.forEach(x=>x.addEventListener('input',update));update();
 // Additional actions are available only on the standalone tool pages.
 if(root.closest('body')?.querySelector('[data-tool-card]')||!location.pathname.includes('/tools/'))return;
 const bar=document.createElement('div');bar.className='actions';bar.style.cssText='display:flex;flex-wrap:wrap;gap:10px;margin-top:18px';
 const make=(label)=>{const b=document.createElement('button');b.type='button';b.className='button button-outline';b.textContent=label;bar.appendChild(b);return b;};
 const compare=make('ثبت این حالت برای مقایسه');
 const csv=make('دریافت فایل اکسل CSV');
 const print=make('چاپ / ذخیره PDF');
 root.appendChild(bar);
 const history=document.createElement('div');history.setAttribute('aria-live','polite');history.style.marginTop='15px';root.appendChild(history);
 const snapshots=[];
 const csvCell=s=>'"'+String(s).replace(/"/g,'""')+'"';
 const rows=()=>snapshots.map((snap,index)=>({name:'حالت '+(index+1),...Object.fromEntries(inputs.map((input,i)=>[input.getAttribute('aria-label')||('ورودی '+(i+1)),snap.values[i]])),result:snap.result}));
 const showHistory=()=>{history.replaceChildren();if(!snapshots.length)return;const h=document.createElement('strong');h.textContent='مقایسه حالت‌های ثبت‌شده';history.append(h);const ul=document.createElement('ul');snapshots.forEach((snap,i)=>{const li=document.createElement('li');li.textContent='حالت '+(i+1)+': '+snap.result;ul.appendChild(li)});history.appendChild(ul);};
 compare.addEventListener('click',()=>{if(!update()){history.textContent='اول همه عددها را درست وارد کنید.';return;}if(snapshots.length===3)snapshots.shift();snapshots.push({values:valid(),result:output.textContent});showHistory();});
 csv.addEventListener('click',()=>{if(!update()){history.textContent='برای دریافت خروجی، عددها را تکمیل کنید.';return;}const entries=snapshots.length?rows():[{name:'حالت فعلی',...Object.fromEntries(inputs.map((input,i)=>[input.getAttribute('aria-label')||('ورودی '+(i+1)),valid()[i]])),result:output.textContent}];const headers=Object.keys(entries[0]);const data='\uFEFF'+[headers.map(csvCell).join(','),...entries.map(item=>headers.map(h=>csvCell(item[h]??'')).join(','))].join('\r\n');const url=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='nimasdiner-'+key+'.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 print.addEventListener('click',()=>{if(!update()){history.textContent='برای ذخیره PDF، عددها را تکمیل کنید.';return;}window.print();});
});
const filter=document.getElementById('tool-filter');
if(filter){const cards=[...document.querySelectorAll('[data-tool-card]')],count=document.getElementById('tool-count');filter.addEventListener('input',()=>{const q=filter.value.trim().normalize('NFKC').replace(/[يى]/g,'ی').replace(/ك/g,'ک').toLowerCase();let n=0;cards.forEach(card=>{const content=card.textContent.normalize('NFKC').replace(/[يى]/g,'ی').replace(/ك/g,'ک').toLowerCase();card.hidden=!!q&&!content.includes(q);if(!card.hidden)n++});count.textContent=n+' ابزار پیدا شد';});}
})();