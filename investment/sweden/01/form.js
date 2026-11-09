(() => {
'use strict';
const KEY='nimasdiner_sweden_01_draft_v1';
const recipient='nimania@gmail.com';
const sections=[
{title:'۱. تأیید اطلاعات اولیه',description:'این اطلاعات از گفت‌وگوهای قبلی ثبت شده‌اند. لطفاً آن‌ها را تأیید یا اصلاح کنید.',items:[
['نام و نام خانوادگی دو متقاضی چیست؟','برای معرفی و نام پرونده بنویسید.',''],
['نشانی ایمیلی که برای پیگیری استفاده می‌کنید چیست؟','ترجیحاً نشانی‌ای که به آن دسترسی دائم دارید.',''],
['محل رستوران موردنظر کجاست؟','نشانی اعلام‌شده پیشین را تأیید کنید.','Kyrkogatan 13, 172 32 Sundbyberg, Sweden'],
['نام و وضعیت رستوران فعلی چیست؟','آیا همان موردی است که در حال خرید آن هستید؟','Restaurang Rosina AB؛ هنوز مالکیت به ما منتقل نشده است.'],
['چه کسانی قرار است مالک و تصمیم‌گیرنده باشند؟','شراکت، سهم مالکیت و نقش هر نفر را نیز توضیح دهید.','ما یک زوج ساکن سوئد هستیم؛ خانم مدیر اجرایی و مالی و همسر مسئول آشپزخانه خواهد بود.'],
['تجربه حرفه‌ای فعلی شما چیست؟','در صورت نیاز سابقه مدیریتی را هم اضافه کنید.','همسر حدود ۱۶ سال تجربه آشپزی دارد و اکنون آشپز یک رستوران ایتالیایی در اطراف استکهلم است؛ خانم در مهدکودک کار می‌کند. سابقه مستقیم مدیریت رستوران نداریم.'],
['مفهوم و منوی اولیه رستوران جدید چیست؟','نوع سرویس و مخاطب را نیز ذکر کنید.','رستوران ایتالیایی با محور پیتزا و پاستا؛ حدود ۱۰ تا ۱۲ غذای اصلی به همراه سالاد و دسر؛ مشتری محلی و خانوادگی.'],
['نام، دکور و نوشیدنی‌ها چگونه خواهد بود؟','آنچه قطعی است از آنچه فقط برنامه است جدا کنید.','نام و دکور احتمالاً تغییر می‌کند و به بودجه بستگی دارد؛ قصد سرو نوشیدنی الکلی داریم.'],
['نگرانی و نیاز اصلی شما از مشاوره چیست؟','آیا اولویت‌ها تغییر کرده‌اند؟','نگرانی اصلی هزینه‌ها و نقدینگی ۶ تا ۱۲ ماه نخست است؛ برای آموزش مدیریت رستوران از پایه، امور مالی و برنامه عملیاتی کمک می‌خواهیم.']
]},
{title:'۲. معامله و شرکت',description:'پیش از تصمیم نهایی، تفاوت خرید شرکت و خرید دارایی‌های رستوران بسیار مهم است.',items:[
['قیمت کل معامله و برنامه پرداخت چیست؟','کرون سوئد؛ مبلغ قطعی یا پیشنهادی را مشخص کنید.',''],
['دقیقاً چه چیزی از فروشنده می‌خرید؟','سهام شرکت، تجهیزات، برند، قرارداد اجاره، موجودی یا مجموعه‌ای از این موارد؟',''],
['وضعیت بیعانه چیست؟','مبلغ، تاریخ پرداخت، گیرنده، رسید، قرارداد و شرط استرداد را بنویسید.','طبق گفت‌وگوی قبلی ۱۰۰٬۰۰۰ کرون سوئد بیعانه پرداخت شده است؛ لطفاً جزئیات و شروط را تکمیل کنید.'],
['وضعیت ثبت شرکت و افتتاح حساب بانکی چیست؟','آیا شماره سازمانی گرفته‌اید؟ بانک چه پاسخی داده است؟','طبق گفت‌وگوی قبلی در انتظار مراحل ثبت/بانک هستید و انجام معامله به نتیجه آن وابسته است.'],
['چرا فروشنده قصد واگذاری دارد و چه مدارکی ارائه کرده است؟','مدت مالکیت و دلایل مستند را درج کنید.',''],
['آیا مالک ملک با انتقال اجاره یا تغییر فعالیت موافقت کرده است؟','وضعیت نامه یا موافقت کتبی را بنویسید.',''],
['آیا بدهی‌های شرکت، کارکنان یا پرونده‌های مالیاتی بررسی شده‌اند؟','نام حسابدار یا وکیل محلی، در صورت همکاری.','']
]},
{title:'۳. ملک و عملکرد رستوران فعلی',description:'برای ارزیابی ارزش معامله، عملکرد تاریخی باید از ادعاهای فروشنده تفکیک شود.',items:[
['اجاره ماهانه و شرایط قرارداد چیست؟','اجاره پایه، هزینه‌های مشترک، افزایش سالانه و مدت اجاره.',''],
['فروش ماهانه ۱۲ ماه گذشته چقدر بوده است؟','ترجیحاً با گزارش صندوق یا حسابداری؛ فصل‌های شلوغ و خلوت.',''],
['سود یا زیان عملیاتی رستوران فعلی چقدر بوده است؟','رقم مستند پس از هزینه‌ها؛ اگر ندارید صریحاً بنویسید.',''],
['هزینه برق، گرمایش، آب، زباله و سایر هزینه‌های ملک چیست؟','هزینه ماهانه یا سالانه و دوره محاسبه را ذکر کنید.',''],
['متراژ و ظرفیت سالن، آشپزخانه و فضای بیرونی چقدر است؟','تعداد صندلی و نقشه یا تصاویر، در صورت وجود.',''],
['چه تجهیزاتی در معامله می‌مانند و چه نقص‌هایی دارند؟','فر پیتزا، یخچال‌ها، تهویه، تجهیزات آماده‌سازی و نیاز تعمیر.',''],
['مشتری رستوران فعلی و ساعت‌های پرفروش چه ویژگی‌هایی دارند؟','ناهار/شام، روزهای هفته، محلی/گذری و میزان تردد.','']
]},
{title:'۴. بودجه، سرمایه و ریسک نقدینگی',description:'مقادیر را به کرون سوئد وارد کنید؛ پاسخ تخمینی را مشخص کنید.',items:[
['کل سرمایه در دسترس شما برای این پروژه چقدر است؟','مجموع خرید، تغییرات و سرمایه در گردش؛ با وام احتمالی تفکیک کنید.',''],
['پس از خرید چقدر پول نقد برای پروژه باقی می‌ماند؟','پول واقعاً در دسترس، نه ارزش سایر دارایی‌ها.',''],
['بودجه بازسازی، تجهیزات تکمیلی و افتتاح چقدر است؟','تغییرات ضروری را از تغییرات تزئینی جدا کنید.',''],
['هزینه ثابت ماهانه و هزینه نیروی انسانی را چقدر برآورد می‌کنید؟','حقوق ناخالص، هزینه کارفرما، اجاره و سایر هزینه‌ها.',''],
['برای هزینه‌های زندگی خانواده از رستوران برداشت لازم دارید؟','مبلغ ماهانه؛ و اینکه چه مدت می‌توانید شغل فعلی را حفظ کنید.',''],
['اگر در ۶ ماه نخست رستوران زیان کند برنامه تأمین پول چیست؟','ذخیره، وام یا درآمد شغل فعلی و حد تحمل زیان.','']
]},
{title:'۵. منو و عملیات',description:'هدف، تبدیل ایده آشپزی به مدل اجرایی قابل‌اندازه‌گیری است.',items:[
['قیمت پیشنهادی پیتزا، پاستا، سالاد، دسر و نوشیدنی چیست؟','در صورت امکان قیمت هر گروه یا منوی اولیه را بنویسید.',''],
['آیا کارت رسپی و قیمت تمام‌شده هر غذا تهیه شده است؟','قیمت مواد اولیه، وزن، ضایعات و حاشیه مشارکت.',''],
['چه چیزهایی در آشپزخانه تولید و چه چیزهایی خریداری می‌شوند؟','خمیر، پاستای تازه، سس و دسر.',''],
['تأمین‌کنندگان، مجوزهای لازم و مجوز الکل در چه وضعیتی هستند؟','استعلام انجام‌شده و وضعیت درخواست مجوز را ذکر کنید.',''],
['چند نفر در آشپزخانه و سالن کار خواهند کرد؟','کارکنان قبلی، استخدام جدید، ساعات و شرح وظیفه.',''],
['هر کدام از شما روزانه چند ساعت در رستوران حضور خواهید داشت؟','زمان ترک یا ادامه شغل فعلی را نیز توضیح دهید.','']
]},
{title:'۶. بازار، افتتاح و انتظارات',description:'در این مرحله کافی است فرضیاتتان روشن باشند؛ لازم نیست همه بررسی‌ها انجام شده باشند.',items:[
['سه رقیب اصلی شما کدام رستوران‌ها هستند؟','نام، نشانی، قیمت و برداشت از مزیت هر رقیب.',''],
['چرا مشتری باید رستوران جدید را انتخاب کند؟','ویژگی مشخص محصول، قیمت، تجربه یا دسترسی.',''],
['آیا رفت‌وآمد محله و تقاضای ناهار/شام را بررسی کرده‌اید؟','ساعت، روز و نتیجه بازدید یا بررسی میدانی.','رستوران نزدیک خیابان اصلی است، اما در بر اصلی آن قرار ندارد؛ انتظار مشتریان محلی و خانوادگی داریم.'],
['آیا فروش بیرون‌بر، دلیوری و تبلیغات را برنامه‌ریزی کرده‌اید؟','کانال‌ها، هزینه‌ها و نوع فروش موردنظر.',''],
['مهلت تصمیم‌گیری خرید و تاریخ افتتاح چه زمانی است؟','ضرب‌الاجل فروشنده و وضعیت گزینه جایگزین.',''],
['انتظار شما از جلسه اول و مشاوره سه ماه نخست چیست؟','سه اولویت اصلی و نتیجه مطلوب در پایان سال اول.','']
]}];
const $=s=>document.querySelector(s);
let state={answers:{},consent:false,createdAt:new Date().toISOString()};
try{const previous=JSON.parse(localStorage.getItem(KEY)||'null');if(previous&&typeof previous==='object'&&previous.answers)state={...state,...previous}}catch{}
const total=sections.reduce((n,s)=>n+s.items.length,0);
function store(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{$('#status').textContent='ذخیره محلی امکان‌پذیر نیست؛ خروجی فایل بگیرید.'}}
function progress(){const done=Object.values(state.answers).filter(x=>x.status==='confirmed'||x.status==='corrected'||x.status==='unknown').length;$('#progress-text').textContent='وضعیت '+done.toLocaleString('fa-IR')+' از '+total.toLocaleString('fa-IR')+' پاسخ مشخص شده';$('#progress-fill').style.width=(done/total*100)+'%'}
let idx=0;
sections.forEach((section,si)=>{
 const wrap=document.createElement('section');wrap.className='section';
 const heading=document.createElement('h2');heading.textContent=section.title;
 const description=document.createElement('p');description.textContent=section.description;
 wrap.append(heading,description);
 section.items.forEach(([question,hint,seed])=>{
  idx++;const id='q'+idx;const current=state.answers[id]||{};
  const card=document.createElement('article');card.className='card question';
  const h=document.createElement('h3');const no=document.createElement('span');no.className='number';no.textContent=idx.toLocaleString('fa-IR');h.append(no,document.createTextNode(question));
  const p=document.createElement('p');p.className='hint';p.textContent=hint;card.append(h,p);
  if(seed){const pre=document.createElement('div');pre.className='preanswer';const title=document.createElement('strong');title.textContent='اطلاعات اعلام‌شده قبلی (نیازمند تأیید):';pre.append(title,document.createTextNode(seed));card.append(pre)}
  const textarea=document.createElement('textarea');textarea.setAttribute('aria-label','پاسخ: '+question);textarea.placeholder=seed?'برای اصلاح یا توضیح، اینجا بنویسید.':'پاسخ یا توضیح شما (در صورت نامشخص بودن می‌توانید خالی بگذارید)';
  textarea.value=current.answer??'';
  const choices=document.createElement('div');choices.className='choice';
  const opts=seed?[['confirmed','اطلاعات قبلی درست است'],['corrected','اصلاح / تکمیل کردم'],['unknown','هنوز مشخص نیست']]:[['corrected','پاسخ دادم'],['unknown','هنوز مشخص نیست']];
  opts.forEach(([value,label])=>{const el=document.createElement('label');const input=document.createElement('input');input.type='radio';input.name=id;input.value=value;input.checked=current.status===value;input.addEventListener('change',()=>{const a=state.answers[id]||{};state.answers[id]={...a,status:value,answer:textarea.value};store();progress()});el.append(input,document.createTextNode(label));choices.append(el)});
  textarea.addEventListener('input',()=>{const a=state.answers[id]||{};state.answers[id]={...a,answer:textarea.value};store()});
  card.append(choices,textarea);wrap.append(card);
 });$('#form-sections').append(wrap);
});
$('#consent').checked=!!state.consent;$('#consent').addEventListener('change',e=>{state.consent=e.target.checked;store()});
function payload(){
let n=0;const answers=[];
sections.forEach(s=>s.items.forEach(([question,hint,seed])=>{const id='q'+(++n),a=state.answers[id]||{};answers.push({number:n,section:s.title,question,previous_statement:seed||null,status:a.status||'unreviewed',answer:a.answer||'',effective_answer:a.status==='confirmed'?seed:(a.answer||'')})}));
return {form_id:'investment/sweden/01',form_version:1,created_at:state.createdAt,exported_at:new Date().toISOString(),consent:!!state.consent,answers};
}
function report(){
const p=payload(),labels={confirmed:'تأیید اطلاعات قبلی',corrected:'پاسخ داده / اصلاح شده',unknown:'هنوز مشخص نیست',unreviewed:'بررسی نشده'};
const lines=['فرم اولیه ارزیابی سرمایه‌گذاری | نیما داینر','پرونده: سوئد / ۰۱','تاریخ خروجی: '+p.exported_at,'وضعیت: پاسخ‌های مشتری؛ بدون بررسی مستقل اسناد',''];
p.answers.forEach(a=>{lines.push(a.number+'. '+a.question,'بخش: '+a.section,'وضعیت: '+(labels[a.status]||a.status),'پاسخ: '+(a.effective_answer||'—'));if(a.previous_statement&&a.status!=='confirmed')lines.push('اطلاعات قبلی جهت مقایسه: '+a.previous_statement);lines.push('')});
return lines.join('\n');
}
function download(name,body,type){const url=URL.createObjectURL(new Blob([body],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000)}
$('#txt').onclick=()=>download('NimasDiner-Sweden-01-Answers.txt',report(),'text/plain;charset=utf-8');
$('#json').onclick=()=>download('NimasDiner-Sweden-01-Answers.json',JSON.stringify(payload(),null,2),'application/json;charset=utf-8');
$('#print').onclick=()=>window.print();
$('#submit').onclick=()=>{
 if(!$('#consent').checked){$('#status').textContent='برای آماده‌سازی ارسال ابتدا گزینه تأیید اطلاعات را انتخاب کنید.';$('#consent').focus();return}
 const p=payload(),unreviewed=p.answers.filter(a=>a.status==='unreviewed').length;
 if(unreviewed&&!confirm(unreviewed.toLocaleString('fa-IR')+' سؤال هنوز وضعیت ندارد. فرم با همین اطلاعات تهیه شود؟'))return;
 const first=p.answers[0].effective_answer||'متقاضی رستوران';
 download('NimasDiner-Sweden-01-Answers.txt',report(),'text/plain;charset=utf-8');
 download('NimasDiner-Sweden-01-Answers.json',JSON.stringify(p,null,2),'application/json;charset=utf-8');
 const subject='پرسش‌نامه مشاوره سوئد / ۰۱ — '+first.slice(0,45);
 const body='سلام،\n\nفرم مقدماتی مشاوره را تکمیل کرده‌ایم. فایل پاسخ‌ها را از صفحه دانلود کرده‌ایم و به این ایمیل پیوست می‌کنیم.\n\nنام متقاضی: '+first+'\nتعداد پرسش‌ها: '+p.answers.length+'\nسؤالات بدون وضعیت: '+unreviewed+'\n\nبا احترام';
 $('#status').textContent='نسخه‌ها دانلود شدند. اکنون در برنامه ایمیل، فایل دانلودشده TXT یا JSON را پیوست کنید و دکمه ارسال را بزنید. تا پیش از ارسال ایمیل، پاسخی به مشاور نمی‌رسد.';
 window.location.href='mailto:'+recipient+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
};
progress();
})();