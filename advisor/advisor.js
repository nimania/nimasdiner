(() => {
"use strict";
const byId = id => document.getElementById(id);
const normalize = s => String(s || "").normalize("NFKC").replace(/[يى]/g,"ی").replace(/ك/g,"ک").replace(/[\u064B-\u065F]/g,"").replace(/\u200c/g," ").replace(/\s+/g," ").toLowerCase().trim();
const topics = [
 {id:"finance", name:"هزینه و سودآوری", needles:["سود","زیان","ضرر","هزینه","گرون","گران","فودکاست","فود کاست","قیمت","حاشیه","سر به سر","سربه سر","حسابداری","درآمد","اجاره","پول","ضایعات"], book:"مرجع جامع مدیریت رستوران", why:"برای فهم قیمت تمام‌شده، کنترل هزینه، فودکاست و تحلیل سود واقعی هر آیتم.", action:"فروش خالص، خرید مواد اولیه و هزینه‌های ثابت ماه گذشته را جدا بنویس؛ سپس کارت رسپی سه غذای پرفروش را تکمیل کن."},
 {id:"recipe", name:"رسپی و کیفیت", needles:["رسپی","رسیپی","دستور پخت","آشپز","سرآشپز","طعم","کیفیت","پرس","وزن غذا","استاندارد","مواد اولیه","ثبات"], book:"مرجع جامع مدیریت رستوران", why:"برای استانداردسازی رسپی، وزن هر پرس، کنترل کیفیت و کاهش وابستگی به افراد.", action:"از یک آیتم پرفروش شروع کن: مواد دقیق، وزن، مراحل پخت، خروجی و عکس سرو را در کارت رسپی ثبت کن."},
 {id:"sales", name:"فروش و مشتری", needles:["فروش","مشتری","خلوت","تبلیغ","بازاریابی","مشتریام","ریزش","برنمیگرد","برنمی گرد","اینستاگرام","رقیب","سفارش"], book:"مرجع جامع مدیریت رستوران", why:"برای تحلیل تجربه مشتری، کانال‌های فروش، منو و اقدام‌های بازاریابی.", action:"فروش و تعداد فاکتورهای چهار هفته گذشته را بر اساس روز و کانال فروش مقایسه کن."},
 {id:"people", name:"نیروی انسانی", needles:["کارمند","کارگر","پرسنل","نیرو","شیفت","حقوق","اخراج","استخدام","مدیر","اختلاف","رفتار کارکنان","ترک کار"], book:"مرجع جامع مدیریت رستوران", why:"برای شرح وظایف، فرآیندهای شیفت، آموزش و کاهش ریسک وابستگی به کارکنان.", action:"برای دو نقش کلیدی، شرح وظایف و روش تحویل شیفت مکتوب تعریف کن."},
 {id:"startup", name:"راه‌اندازی و سرمایه محدود", needles:["راه اندازی","راه‌اندازی","افتتاح","سرمایه","شروع","تاسیس","تأسیس","تجهیزات","ملک","اجاره مغازه","کیوسک","فست فود کوچک","کافه بزنم"], book:"کوچک شروع کن", why:"برای انتخاب مدل کم‌هزینه، بودجه‌بندی، محاسبه نقطه سربه‌سر و برنامه ۹۰ روز نخست.", action:"قبل از خرید تجهیزات، بودجه کل، هزینه ثابت ماهانه، حداقل فروش لازم و سه سناریوی تقاضا را بنویس."},
 {id:"crisis", name:"رکود و شرایط بحرانی", needles:["رکود","بحران","قطعی","اینترنت","برق","تورم","تعطیلی","کمبود","اضطراری","بقا","بحرانی","کم فروش"], book:"دوام بیاور", why:"برای تاب‌آوری کسب‌وکار در رکود، تغییر قیمت مواد و اختلال در سیستم فروش.", action:"فهرست هزینه‌های ضروری ۳۰ روز آینده و برنامه فروش و دریافت وجه در روزهای اختلال را آماده کن."},
 {id:"delivery", name:"دلیوری و سفارش آنلاین", needles:["دلیوری","ارسال","پیک","بسته بندی","بسته‌بندی","اسنپ فود","اسنپ‌فود","کمیسیون","آنلاین","بیرون بر","بیرون‌بر"], book:"مرجع جامع مدیریت رستوران", why:"برای ارزیابی هزینه بسته‌بندی، کارمزد فروش، تجربه تحویل و سود واقعی سفارش آنلاین.", action:"برای یک سفارش آنلاین، مبلغ فروش منهای تخفیف، مواد، بسته‌بندی و کارمزد را حساب کن."}
];
const books = {
 "مرجع جامع مدیریت رستوران":{desc:"۱۰۱ قانون طلایی؛ از مالی و منو تا آشپزخانه، کارکنان و تجربه مشتری.",href:"../#get-book",cta:"دریافت نسخه دیجیتال رایگان"},
 "کوچک شروع کن":{desc:"راهنمای راه‌اندازی کسب‌وکار غذای کوچک با سرمایه محدود و برنامه ۹۰ روز نخست.",href:"https://t.me/nimaafsharnaderi",cta:"پرسش درباره تهیه کتاب"},
 "دوام بیاور":{desc:"راهنمای دوام‌آوردن در رکود، تورم و شرایط اضطراری.",href:"https://t.me/nimaafsharnaderi",cta:"پرسش درباره تهیه کتاب"}
};
function addCard(container, title, desc, href, cta) {
 const card=document.createElement("article");card.className="card";
 const h=document.createElement("strong");h.textContent=title;
 const p=document.createElement("p");p.textContent=desc;
 const a=document.createElement("a");a.className="small-btn";a.href=href;a.textContent=cta;
 if(href.startsWith("https://")){a.target="_blank";a.rel="noopener noreferrer";}
 card.append(h,p,a);container.append(card);
}
function run(value) {
 const input=normalize(value);
 const scores=topics.map((topic,index)=>{
   const matches=topic.needles.filter(n=>input.includes(normalize(n)));
   return {topic,index,score:matches.length};
 }).filter(t=>t.score>0).sort((a,b)=>b.score-a.score||a.index-b.index);
 const selected=scores.slice(0,3).map(x=>x.topic);
 const tagBox=byId("result-tags"), cards=byId("result-cards");
 tagBox.replaceChildren();cards.replaceChildren();
 for(const topic of selected){const tag=document.createElement("span");tag.className="result-tag";tag.textContent=topic.name;tagBox.append(tag);}
 const seen = new Set();
 for(const topic of selected){
  if(seen.has(topic.book))continue;
  seen.add(topic.book);const book=books[topic.book];
  addCard(cards,topic.book,book.desc+" "+topic.why,book.href,book.cta);
 }
 if(!selected.length){
  addCard(cards,"مرجع جامع مدیریت رستوران",books["مرجع جامع مدیریت رستوران"].desc,books["مرجع جامع مدیریت رستوران"].href,books["مرجع جامع مدیریت رستوران"].cta);
  byId("result-intro").textContent="برای این توضیح هنوز تطبیق مشخصی پیدا نکردیم. بهتر است مسئله را با عددها، نشانه‌ها و زمان شروع آن دقیق‌تر بنویسی.";
  byId("first-action").textContent="پیشنهاد اولیه: مهم‌ترین نشانه مشکل، زمان شروع و اثر آن بر فروش یا هزینه را ثبت کن.";
 } else {
  byId("result-intro").textContent="با توجه به متن تو، این حوزه‌ها محتمل‌ترند. منابع زیر برای شروع بررسی مناسب‌اند؛ این نتیجه تشخیص قطعی نیست.";
  byId("first-action").textContent="اولین کار پیشنهادی: "+selected[0].action;
 }
 addCard(cards,"میز مشاوره و خودارزیابی","با پرسش‌های ساختاریافته، مسئله را دقیق‌تر ثبت و بررسی کن. اطلاعات این ابزار در مرورگر خودت نگهداری می‌شود.","../consulting/","ورود به میز مشاوره");
 const results=byId("results");results.hidden=false;results.scrollIntoView({behavior:"smooth",block:"start"});
}
document.querySelectorAll("[data-example]").forEach(b=>b.addEventListener("click",()=>{byId("problem-text").value=b.dataset.example;byId("problem-text").focus();}));
byId("problem-form").addEventListener("submit",e=>{
 e.preventDefault();
 const value=byId("problem-text").value.trim();
 if(value.length<12){byId("form-status").textContent="لطفاً مسئله‌ات را کمی بیشتر توضیح بده (حداقل ۱۲ حرف).";return;}
 byId("form-status").textContent="پیشنهاد اولیه آماده شد؛ متن به سرور ارسال نشده است.";
 run(value);
});
})();