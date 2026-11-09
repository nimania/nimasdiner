(()=>{'use strict';
const KEY='nimasdiner_investment_v1';
const questions=[
['معامله','قیمت کل و شرایط پرداخت خرید چیست؟'],
['معامله','سهام شرکت، دارایی‌ها، سرقفلی یا قرارداد اجاره دقیقاً کدام منتقل می‌شود؟'],
['معامله','قرارداد بیعانه چه شرایطی برای استرداد و فسخ دارد؟'],
['معامله','علت واقعی فروش و سوابق مالکیت چیست؟'],
['معامله','آیا رضایت کتبی مالک ملک برای انتقال وجود دارد؟'],
['معامله','بدهی مالیاتی، قراردادی و تعهد کارکنان بررسی شده است؟'],
['مالی','گزارش فروش ماهانه ۱۲ ماه گذشته دریافت شده است؟'],
['مالی','صورت سود و زیان و مدارک صندوق تأیید شده‌اند؟'],
['مالی','اجاره، هزینه خدمات، برق و گرمایش ماهانه چقدر است؟'],
['مالی','سرمایه کل قابل استفاده و منبع تأمین آن چیست؟'],
['مالی','بودجه بازسازی و راه‌اندازی چه مقدار است؟'],
['مالی','چه ذخیره نقدی برای ۶ تا ۱۲ ماه اول وجود دارد؟'],
['مالی','آیا حقوق واقعی کار مالکان در هزینه‌ها ثبت شده است؟'],
['عملیات','ظرفیت سالن، آشپزخانه و فضای بیرونی چقدر است؟'],
['عملیات','تجهیزات، عمر مفید، تعمیرات و ظرفیت تولید بررسی شده است؟'],
['عملیات','آیا نیروی انسانی فعلی منتقل می‌شود و تعهداتش چیست؟'],
['عملیات','مجوزهای بهداشت، فعالیت و الکل برای شرکت جدید قابل دریافت‌اند؟'],
['عملیات','ساعات فعالیت و محدودیت‌های ملک چیست؟'],
['بازار','مشتریان کنونی چه کسانی هستند و چه سهمی از فروش دارند؟'],
['بازار','رقبای مستقیم و قیمت منوی آن‌ها ثبت شده است؟'],
['بازار','تردد و تقاضای ناهار و شام میدانی بررسی شده است؟'],
['بازار','چه مزیت قابل سنجشی در برابر رقبا خواهیم داشت؟'],
['برنامه','منو و کارت رسپی و هزینه تمام‌شده هر محصول آماده است؟'],
['برنامه','مسئولیت مدیر مالی، مدیر اجرایی و سرآشپز تفکیک شده است؟'],
['برنامه','سناریوی افتتاح با کمترین بازسازی تعریف شده است؟'],
['برنامه','معیار تصمیم خرید/عدم خرید و ضرب‌الاجل مشخص است؟']
];
const risks=[
['نوع انتقال و بدهی پنهان','بازبینی حقوقی ساختار معامله و تعهدات شرکت فروشنده'],
['اجاره و حقوق بهره‌برداری','بررسی قرارداد اجاره و رضایت کتبی مالک'],
['بیعانه و بازپرداخت','کنترل توافق‌نامه، شرط فسخ و نحوه نگهداری مبلغ'],
['کیفیت درآمد فعلی','انطباق گزارش صندوق با صورت‌های مالی و حساب بانکی'],
['سرمایه در گردش','محاسبه هزینه ماهانه و ماه‌های تحمل زیان'],
['مجوزها','استعلام مستقل از مراجع سوئدی، از جمله مجوز الکل'],
['ظرفیت عملیات','بازدید فنی تجهیزات، سالن، تهویه و آشپزخانه'],
['تغییر برند و مشتریان','آزمون احتمال ریزش مشتریان قبلی و هزینه جذب مشتری']
];
let state={fields:{},answers:{},risks:{},finance:{}};
try{const loaded=JSON.parse(localStorage.getItem(KEY)||'null');if(loaded&&typeof loaded==='object'&&!Array.isArray(loaded))state={...state,...loaded}}catch{}
const $=id=>document.getElementById(id);
const n=(id)=>Number($(id).value); const money=v=>Number.isFinite(v)?Math.round(v).toLocaleString('fa-IR')+' '+$('currency').value:'—';
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{$('feedback').textContent='ذخیره محلی در مرورگر ممکن نیست؛ خروجی بگیرید.'}}
document.querySelectorAll('[data-field]').forEach(el=>{el.value=state.fields[el.dataset.field]||'';el.addEventListener('input',()=>{state.fields[el.dataset.field]=el.value;save();report()})});
questions.forEach(([section,q],i)=>{const box=document.createElement('article');box.className='question';const head=document.createElement('header'),label=document.createElement('h3'),small=document.createElement('small');label.textContent=(i+1)+' — '+q;small.textContent=section;head.append(label,small);const controls=document.createElement('div');controls.className='question-controls';const select=document.createElement('select');[['','بررسی‌نشده'],['known','پاسخ داریم'],['verified','با سند تأیید شده'],['pending','نیازمند پیگیری']].forEach(([v,t])=>{const op=document.createElement('option');op.value=v;op.textContent=t;select.append(op)});select.value=state.answers[i]?.status||'';const note=document.createElement('textarea');note.placeholder='پاسخ، منبع، یادداشت یا سند موردنیاز (اطلاعات حساس وارد نکنید)';note.value=state.answers[i]?.note||'';const update=()=>{state.answers[i]={status:select.value,note:note.value};save();progress();report()};select.addEventListener('change',update);note.addEventListener('input',update);controls.append(select);box.append(head,controls,note);$('question-list').append(box)});
function progress(){const done=questions.filter((_,i)=>['known','verified'].includes(state.answers[i]?.status)).length;$('progress').textContent=done.toLocaleString('fa-IR')+' از '+questions.length.toLocaleString('fa-IR')+' پاسخ‌داده‌شده / تأییدشده'}
risks.forEach(([name,desc],i)=>{const box=document.createElement('article');box.className='risk';const h=document.createElement('h3');h.textContent=name;const p=document.createElement('p');p.textContent=desc;const select=document.createElement('select');[['','بررسی‌نشده'],['high','ریسک بالا / اقدام فوری'],['medium','نیازمند بررسی'],['low','بررسی و مستندسازی شده']].forEach(([v,t])=>{const op=document.createElement('option');op.value=v;op.textContent=t;select.append(op)});select.value=state.risks[i]||'';select.addEventListener('change',()=>{state.risks[i]=select.value;save();report()});box.append(h,p,select);$('risk-list').append(box)});
const financeIds=['currency','guests','ticket','days','variable','fixed','purchase','setup','cash'];
financeIds.forEach(id=>{const el=$(id);if(state.finance[id]!==undefined)el.value=state.finance[id];el.addEventListener('input',()=>{state.finance[id]=el.value;save();calculate()})});
let results={};
function calculate(){
const guests=n('guests'),ticket=n('ticket'),days=n('days'),variable=n('variable'),fixed=n('fixed');
const valid=[guests,ticket,days,variable,fixed].every(Number.isFinite)&&guests>=0&&ticket>0&&days>0&&days<=31&&variable>=0&&variable<100&&fixed>=0;
if(!valid){['revenue','contribution','profit','break-even','investment','runway'].forEach(id=>$(id).textContent='مقدار نامعتبر');return}
const revenue=guests*ticket*days,contribution=revenue*(1-variable/100),profit=contribution-fixed,be=Math.ceil(fixed/(ticket*(1-variable/100)*days));results={revenue,contribution,profit,be};
$('revenue').textContent=money(revenue);$('contribution').textContent=money(contribution);$('profit').textContent=money(profit);$('break-even').textContent=be.toLocaleString('fa-IR')+' مشتری';
const has=p=>$(p).value.trim()!=='';$('investment').textContent=has('purchase')&&has('setup')?money(n('purchase')+n('setup')):'نامشخص';
$('runway').textContent=has('cash')?(profit<0?(n('cash')/(-profit)).toFixed(1)+' ماه':'در این سناریو کسری عملیاتی ندارد'):'نامشخص';
const cases=[.6,1,1.4].map(f=>{const r=revenue*f;return {label:Math.round(guests*f).toLocaleString('fa-IR')+' مشتری',sales:r,cost:fixed+r*variable/100}});
const max=Math.max(1,...cases.flatMap(x=>[x.sales,x.cost]));const chart=$('scenario-chart');chart.replaceChildren();
for(const c of cases){const row=document.createElement('div');row.className='chart-row';const label=document.createElement('b');label.textContent=c.label;const tracks=document.createElement('div');tracks.className='tracks';for(const [value,cls] of [[c.sales,'sales'],[c.cost,'cost']]){const track=document.createElement('div');track.className='track '+cls;track.style.width=(value/max*100)+'%';track.title=money(value);tracks.append(track)}row.append(label,tracks);chart.append(row)}report()}
function report(){const f=state.fields;const lines=['اتاق ارزیابی سرمایه‌گذاری — نیما داینر','پیش‌نویس مقدماتی؛ اطلاعات تأییدنشده با اسناد جایگزین شوند.','',...Object.entries({project:'عنوان',location:'موقعیت',concept:'مدل',stage:'مرحله',deal:'نوع معامله',audience:'مشتری هدف',notes:'یادداشت'}).map(([k,v])=>v+': '+(f[k]||'نامشخص')),'','پرسش‌ها:'];
questions.forEach(([cat,q],i)=>{const a=state.answers[i]||{};lines.push((i+1)+'. ['+cat+'] '+q+' — '+({known:'پاسخ داریم',verified:'تأیید مستند',pending:'نیازمند پیگیری'}[a.status]||'نامشخص')+(a.note?' | '+a.note:''))});
lines.push('','ریسک‌ها:');risks.forEach(([name],i)=>lines.push(name+': '+({high:'بالا',medium:'در حال بررسی',low:'مستند شده'}[state.risks[i]]||'نامشخص')));
lines.push('','مدل مالی (مقادیر فرضی تا زمان تأیید مدارک):','فروش ماهانه: '+(results.revenue===undefined?'—':money(results.revenue)),'نتیجه عملیاتی ساده: '+(results.profit===undefined?'—':money(results.profit)),'نقطه سربه‌سر روزانه: '+(results.be??'—'),'','این ابزار جایگزین بررسی حقوقی، مالیاتی یا حسابرسی محلی نیست.');$('report-text').value=lines.join('\n')}
function download(filename,body,type){const blob=new Blob([body],{type});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}
$('export-json').onclick=()=>{if(confirm('خروجی شامل داده‌های واردشده و بدون رمزگذاری است. ادامه می‌دهید؟'))download('diner-investment-case.json',JSON.stringify({version:1,...state},null,2),'application/json')};
$('copy-report').onclick=async()=>{try{await navigator.clipboard.writeText($('report-text').value);$('feedback').textContent='متن گزارش کپی شد.'}catch{$('feedback').textContent='کپی ممکن نبود؛ متن را دستی انتخاب کنید.'}};
$('download-report').onclick=()=>download('diner-investment-report.txt',$('report-text').value,'text/plain;charset=utf-8');
$('reset-data').onclick=()=>{if(confirm('تمام داده‌های محلی این ابزار پاک شود؟')){localStorage.removeItem(KEY);location.reload()}};
progress();calculate();
})();