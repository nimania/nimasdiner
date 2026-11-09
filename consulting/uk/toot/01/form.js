(()=>{'use strict';
const KEY='nimasdiner_toot_uk_01_v1';
const groups=[
{title:'۱. شناخت توت و اهداف شهاب',description:'برای شناخت کسب‌وکار و نتیجه‌ای که از مشاوره انتظار داری',q:[
'نام کامل و راه ارتباطی مناسب چیست؟',
'توت از چه سالی فعالیت دارد و مسیر شکل‌گیری آن چگونه بوده است؟',
'مالکیت و ساختار حقوقی فعلی کسب‌وکار چگونه است؟ آیا شریک دیگری وجود دارد؟',
'خودت امروز در توت چه مسئولیت‌های اجرایی و مدیریتی داری؟',
'سه مسئله مهمی که همین حالا بیشترین فشار را ایجاد کرده‌اند کدام‌اند؟',
'اگر شش ماه بعد از همکاری راضی باشی، چه سه نتیجه مشخصی باید دیده باشی؟'
]},
{title:'۲. فروش، بازار و مشتری',description:'عدد دقیق بهتر است؛ اما تخمین را هم با قید «تقریبی» بنویس',q:[
'فروش ناخالص ماهانه توت در ۶ تا ۱۲ ماه اخیر چقدر بوده است؟ آیا گزارش سیستم صندوق در دسترس است؟',
'میانگین تعداد سفارش یا مشتری روزانه و مبلغ هر فاکتور چقدر است؟',
'کدام روزها، ساعت‌ها و فصل‌ها شلوغ‌تر یا خلوت‌ترند؟',
'چه سهمی از فروش مربوط به سالن، بیرون‌بر، دلیوری و سفارش‌های گروهی است؟',
'مشتری‌های اصلی چه کسانی هستند و بیشتر از چه راهی توت را پیدا می‌کنند؟',
'بازخورد و شکایت پرتکرار مشتریان چیست؟ به نظرت توت در مقایسه با رقبا چه مزیتی دارد؟'
]},
{title:'۳. هزینه، نقدینگی و سودآوری',description:'اگر جزئیات مالی محرمانه است، می‌توانیم در مرحله بعد فقط اسناد لازم را جداگانه بررسی کنیم',q:[
'اجاره ماهانه، Business Rates و هزینه‌های ثابت اصلی (انرژی، بیمه، خدمات) چقدر است؟',
'هزینه خرید مواد اولیه و نوشیدنی در ماه حدوداً چقدر و چند درصد فروش است؟',
'کل هزینه کارکنان شامل حقوق، مالیات و سهم کارفرما حدوداً چقدر است؟',
'در پایان ماه با احتساب حقوق مدیریت، مالیات و هزینه‌های واقعی چقدر سود یا زیان باقی می‌ماند؟',
'آیا بدهی، معوقه، وام یا فشار نقدینگی وجود دارد که باید در برنامه لحاظ شود؟',
'از چه گزارش حسابداری یا نرم‌افزاری استفاده می‌کنید و چه اعدادی را هر هفته مرور می‌کنی؟'
]},
{title:'۴. منو، آشپزخانه، خرید و کنترل',description:'هدف شناخت روند فعلی است، نه قضاوت درباره کیفیت آشپزی',q:[
'پرفروش‌ترین و کم‌فروش‌ترین غذاها کدام‌اند؟ کدام‌ها به‌نظرت سود بیشتری دارند؟',
'برای هر غذا رسپی استاندارد، وزن مواد، اندازه پرس و بهای تمام‌شده ثبت شده است؟',
'تأمین‌کنندگان اصلی، روش خرید و کنترل تغییر قیمت مواد اولیه چگونه است؟',
'موجودی انبار، ضایعات، غذای کارکنان و برگشتی‌ها چگونه ثبت و کنترل می‌شود؟',
'در سرویس‌های شلوغ بیشترین گلوگاه آشپزخانه یا سالن چیست؟',
'وقتی خودت حضور نداری، کیفیت غذا و سرعت سرویس چطور کنترل می‌شود؟'
]},
{title:'۵. کارکنان، مدیریت و استانداردهای انگلستان',description:'درباره وضعیت واقعی تیم و الزامات اجرایی',q:[
'چند نفر در آشپزخانه و سالن کار می‌کنند و نقش هر کدام چیست؟',
'برنامه شیفت‌ها، ثبت ساعات کار و محاسبه حقوق با چه روشی انجام می‌شود؟',
'آیا شرح وظایف، آموزش اولیه، چک‌لیست باز و بسته کردن و مسئول هر شیفت مشخص است؟',
'در دو هفته غیبت تو، چه کسی می‌تواند رستوران را اداره کند و چه کارهایی متوقف می‌شود؟',
'آخرین نتیجه رسمی بازرسی Food Hygiene و اقدامات اصلاحی مربوط به آن چه بوده است؟',
'وضعیت ثبت حساسیت‌های غذایی (Allergens)، ایمنی مواد غذایی، بیمه و الزامات اشتغال چگونه کنترل می‌شود؟'
]},
{title:'۶. توسعه، Xerus و همکاری مشاوره',description:'پاسخ به این بخش، محدوده پیشنهادی همکاری را مشخص می‌کند',q:[
'رابطه عملیاتی و مالی توت با Xerus یا فعالیت‌های فستیوال و کترینگ چیست؟',
'آیا درآمد، کارکنان، خرید و تجهیزات هر فعالیت به‌صورت جداگانه حساب می‌شوند؟',
'در حال حاضر کدام کانال بازاریابی یا فروش بیشترین بازده را دارد و کدام هزینه بی‌نتیجه است؟',
'اولویت شش‌ماهه چیست: سودآوری، فروش بیشتر، آزاد شدن وقت تو، رشد کترینگ یا توسعه شعبه؟',
'برای اجرای تغییرات چه میزان زمان، اختیار تصمیم‌گیری و بودجه در دسترس است؟'
]}];
const root=document.getElementById('form-sections');
let answers={};try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');if(v&&typeof v==='object'&&v.answers&&typeof v.answers==='object')answers=v.answers}catch{}
const all=[];let n=0;for(const g of groups){const section=document.createElement('section');section.className='section';const h=document.createElement('h2');h.textContent=g.title;const desc=document.createElement('p');desc.className='desc';desc.textContent=g.description;section.append(h,desc);for(const q of g.q){n++;const id='q'+n;all.push({id,section:g.title,q});const card=document.createElement('article');card.className='card';const label=document.createElement('label');label.className='question';label.setAttribute('for',id);const num=document.createElement('span');num.className='num';num.textContent=n.toLocaleString('fa-IR');label.append(num,document.createTextNode(q));const area=document.createElement('textarea');area.id=id;area.rows=2;area.maxLength=3000;area.value=answers[id]||'';area.placeholder='پاسخ را اینجا بنویس؛ اگر نمی‌دانی خالی بگذار.';area.addEventListener('input',()=>{answers[id]=area.value;try{localStorage.setItem(KEY,JSON.stringify({answers,updatedAt:new Date().toISOString()}))}catch{}progress()});card.append(label,area);section.append(card)}root.append(section)}
function progress(){const c=all.filter(q=>String(answers[q.id]||'').trim()).length;document.getElementById('progress-text').textContent=c.toLocaleString('fa-IR')+' پاسخ از '+all.length.toLocaleString('fa-IR')+' سؤال';document.getElementById('progress-fill').style.width=(100*c/all.length)+'%'}
function report(){const out=['نیما داینر | پرونده مشاوره رستوران توت','TOOT Restaurant - Plymouth, United Kingdom','پرونده: UK / TOOT / 01','تاریخ دانلود: '+new Date().toLocaleDateString('fa-IR'),'','پاسخ‌ها توسط تکمیل‌کننده وارد شده و هنوز راستی‌آزمایی نشده‌اند.',''];let last='';for(let i=0;i<all.length;i++){const item=all[i];if(item.section!==last){last=item.section;out.push('--------------------------------',last,'--------------------------------')}out.push((i+1)+'. '+item.q,'پاسخ: '+(String(answers[item.id]||'').trim()||'پاسخ داده نشده'),'')}return out.join('\n')}
document.getElementById('download').addEventListener('click',()=>{const blob=new Blob(['\ufeff'+report()],{type:'text/plain;charset=utf-8'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='NimasDiner-TOOT-UK-01-Answers.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000);document.getElementById('status').textContent='فایل پاسخ‌ها آماده دانلود شد. حالا آن را در تلگرام یا ایمیل پیوست و ارسال کن.';document.getElementById('send-options').hidden=false;document.getElementById('download').textContent='دانلود دوباره فایل ↓'});
progress();
})();