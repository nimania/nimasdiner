(()=>{
'use strict';
const KEY='nimasdiner_sweden_01_simple_v2',EMAIL='nimania@gmail.com';
const groups=[
{title:'۱. اطلاعاتی که از قبل داریم',description:'این جواب‌ها را از صحبت‌های قبلی گذاشتیم. فقط اگر اشتباهی هست اصلاح کنید.',q:[
['نام و نام خانوادگی شما و همسرتان چیست؟',''],
['برای ارتباط، ایمیل و شماره تماس مناسب چیست؟',''],
['نشانی رستورانی که می‌خواهید بخرید کجاست؟','Kyrkogatan 13, 172 32 Sundbyberg, Sweden'],
['رستوران فعلی چه نامی دارد و آیا خریدش قطعی شده؟','Restaurang Rosina AB؛ خرید هنوز نهایی نشده است.'],
['تقسیم کار بین شما دو نفر چگونه خواهد بود؟','خانم مدیر اجرایی و مسئول امور مالی؛ همسر مسئول آشپزخانه.'],
['سابقه کاری شما دو نفر چیست؟','همسر ۱۶ سال تجربه آشپزی و کار فعلی در یک رستوران ایتالیایی اطراف استکهلم دارد. خانم در مهدکودک کار می‌کند. تجربه مستقیم مدیریت رستوران نداریم.'],
['چه نوع رستورانی می‌خواهید باز کنید؟','ایتالیایی، پیتزا و پاستا با ۱۰ تا ۱۲ غذای اصلی، سالاد و دسر، مناسب مشتریان محلی و خانواده‌ها.'],
['برای نام، دکور و نوشیدنی چه تصمیمی دارید؟','نام و احتمالاً دکور تغییر می‌کند؛ بستگی به بودجه دارد. سرو نوشیدنی الکلی نیز مدنظر است.']
]},
{title:'۲. خرید رستوران و قرارداد',description:'هرچه می‌دانید بنویسید؛ اگر سند یا عدد ندارید، خالی بگذارید.',q:[
['قیمت کل خرید چقدر است؟ فروشنده چه چیزی را تحویل می‌دهد؟',''],
['بیعانه چقدر بوده، به چه کسی داده‌اید و در چه شرایطی پس می‌گیرید؟','طبق صحبت قبلی، ۱۰۰ هزار کرون پرداخت شده است؛ شرایط قرارداد و بازگشت وجه هنوز بررسی نشده.'],
['کار ثبت شرکت و حساب بانکی به کجا رسیده است؟','طبق صحبت قبلی، معامله در انتظار کارهای شرکت و حساب بانکی بوده است.'],
['چرا مالک فعلی رستوران را می‌فروشد؟',''],
['آیا صاحب ملک با واگذاری قرارداد اجاره موافقت کرده است؟',''],
['آیا حسابدار یا وکیل سوئدی قرارداد و بدهی‌های احتمالی را بررسی کرده است؟','']
]},
{title:'۳. فروش، اجاره و هزینه‌ها',description:'اگر عددی تقریبی است، کنار آن بنویسید «تخمینی».',q:[
['اجاره ماهانه رستوران چقدر است و قرارداد تا چه زمانی اعتبار دارد؟',''],
['فروش رستوران فعلی در ماه چقدر است؟ آیا سند فروش ۱۲ ماه اخیر را دیده‌اید؟',''],
['آیا فروشنده گفته رستوران چقدر سود یا زیان می‌کند؟ مدرکش را دیده‌اید؟',''],
['هزینه ماهانه برق، گرمایش، آب و سایر هزینه‌های ملک چقدر است؟',''],
['چند صندلی و چه مقدار فضای سالن و آشپزخانه دارد؟',''],
['کدام تجهیزات موجودند و کدام نیاز به تعمیر یا خرید دارند؟',''],
['کل پولی که برای خرید، بازسازی و شروع کار کنار گذاشته‌اید چقدر است؟',''],
['پس از خرید چقدر پول نقد برای هزینه‌های چند ماه اول باقی می‌ماند؟',''],
['آیا برای هزینه زندگی خودتان هم باید از رستوران پول برداشت کنید؟','']
]},
{title:'۴. غذا، کارکنان و مشتری',description:'جواب‌های کوتاه هم کافی است.',q:[
['حدود قیمت پیتزا، پاستا، سالاد و دسر را چقدر در نظر دارید؟',''],
['منوی آماده یا هزینه مواد اولیه هر غذا را حساب کرده‌اید؟',''],
['چه کسانی قرار است در سالن و آشپزخانه کار کنند؟',''],
['آیا وضعیت مجوز فعالیت و سرو نوشیدنی الکلی را پرسیده‌اید؟',''],
['فکر می‌کنید مشتری‌های اصلی از کجا می‌آیند؟ چه رقیب‌هایی را می‌شناسید؟','رستوران نزدیک خیابان اصلی است اما در خود خیابان اصلی قرار ندارد؛ انتظار مشتری محلی و خانوادگی داریم.'],
['آیا سفارش بیرون‌بر یا ارسال آنلاین هم خواهید داشت؟','']
]},
{title:'۵. زمان‌بندی و درخواست از مشاور',description:'این سه سؤال کمک می‌کنند جلسه اول دقیقاً درباره موضوعات مهم شما باشد.',q:[
['چه زمانی باید درباره خرید تصمیم بگیرید و چه زمانی می‌خواهید افتتاح کنید؟',''],
['بیشتر از چه چیزی نگرانید؟','نگرانی اصلی پرداخت هزینه‌ها و دوام کسب‌وکار در شش ماه تا یک سال اول است.'],
['در جلسه نخست دوست دارید کدام سه موضوع را با هم حل کنیم؟','راهنمایی درباره مدیریت رستوران از پایه، امور مالی، کارکنان و برنامه‌ریزی راه‌اندازی.']
]}];
const $=s=>document.querySelector(s);
let state={answers:{},createdAt:new Date().toISOString(),consent:false};
try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw&&typeof raw==='object'&&raw.answers)state={...state,...raw}}catch{}
const questions=groups.flatMap(g=>g.q.map(a=>({section:g.title,question:a[0],default:a[1]})));
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{$('#status').textContent='ذخیره موقت ممکن نشد؛ لطفاً در پایان نسخه‌ای بگیرید.'}}
function progress(){const count=Object.values(state.answers).filter(x=>String(x).trim()).length;$('#progress-text').textContent=count.toLocaleString('fa-IR')+' پاسخ از '+questions.length.toLocaleString('fa-IR')+' سؤال';$('#progress-fill').style.width=(count/questions.length*100)+'%'}
let number=0;
for(const group of groups){
 const section=document.createElement('section');section.className='section';
 const title=document.createElement('h2');title.textContent=group.title;const info=document.createElement('p');info.textContent=group.description;section.append(title,info);
 for(const [q,old] of group.q){
  number++;const id='q'+number;const box=document.createElement('article');box.className='card question';
  const heading=document.createElement('h3');const numberEl=document.createElement('span');numberEl.className='number';numberEl.textContent=number.toLocaleString('fa-IR');heading.append(numberEl,document.createTextNode(q));box.append(heading);
  const answer=document.createElement('textarea');answer.rows=old?3:2;answer.maxLength=1200;answer.setAttribute('aria-label',q);answer.value=state.answers[id]!==undefined?state.answers[id]:old;answer.placeholder='اگر نمی‌دانید، این قسمت را خالی بگذارید.';
  answer.addEventListener('input',()=>{state.answers[id]=answer.value;save();progress()});
  box.append(answer);section.append(box);
 }
 $('#form-sections').append(section);
}
$('#consent').checked=!!state.consent;$('#consent').addEventListener('change',e=>{state.consent=e.target.checked;save()});
function getAnswers(){return questions.map((q,i)=>({number:i+1,section:q.section,question:q.question,answer:state.answers['q'+(i+1)]??q.default??''}))}
function textReport(){let lines=['فرم پیش از جلسه مشاوره رستوران — نیما داینر','پرونده سوئد / ۰۱','تاریخ تهیه: '+new Date().toLocaleDateString('fa-IR'),'','پاسخ‌ها از طرف متقاضی و نیازمند تأیید اسناد هستند.',''];for(const a of getAnswers())lines.push(a.number+'. '+a.question,'پاسخ: '+(a.answer.trim()||'هنوز مشخص نیست'),'');return lines.join('\n')}
function download(){const url=URL.createObjectURL(new Blob([textReport()],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='NimasDiner-Sweden-01-Answers.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}
$('#txt').addEventListener('click',()=>{download();$('#status').textContent='نسخه پاسخ‌ها روی دستگاه شما ذخیره شد.'});
$('#submit').addEventListener('click',()=>{
 if(!$('#consent').checked){$('#status').textContent='لطفاً ابتدا تیک موافقت با ارسال پاسخ‌ها را بزنید.';$('#consent').focus();return}
 const filled=getAnswers().filter(a=>a.answer.trim()).length;
 if(filled<5){$('#status').textContent='لطفاً ابتدا حداقل چند سؤال را پاسخ دهید.';return}
 download();
 const full=textReport();
 // On short forms, place full answers in the email so no attachment is needed.
 // For long forms, avoid unreliable mailto URL limits and request the downloaded attachment.
 const subject='پرسش‌نامه رستوران سوئد ۰۱ — نیما داینر';
 const base='سلام نیما،\n\nپرسش‌نامه قبل از جلسه را تکمیل کرده‌ایم.\n';
 const body=encodeURIComponent(base+'\n'+full);
 const sendInline=body.length<6000;
 const mailBody=sendInline?base+'\n'+full:base+'فایل پاسخ‌ها را که هم‌اکنون دانلود شده است به این ایمیل پیوست می‌کنیم.\n\nبا تشکر';
 $('#status').textContent=sendInline?'نسخه شما ذخیره شد. ایمیل آماده باز می‌شود؛ فقط دکمه ارسال را بزنید.':'نسخه شما ذخیره شد. لطفاً فایل «NimasDiner-Sweden-01-Answers.txt» را به ایمیل آماده پیوست کنید و ارسال را بزنید.';
 window.location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(mailBody);
});
progress();
})();