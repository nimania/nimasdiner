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
 const update=()=>{const values=inputs.map(x=>parse(x.value));if(values.some(x=>x===null)){output.textContent='همه ورودی‌ها را تکمیل کنید؛ برای هزینه‌های صفر، عدد ۰ بگذارید.';return;}output.textContent=fn(values);};
 inputs.forEach(x=>x.addEventListener('input',update));update();
});
})();