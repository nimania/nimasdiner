import fs from "node:fs";
import path from "node:path";

const read = file => JSON.parse(fs.readFileSync(path.join(process.cwd(),"content",file),"utf8"));
const safeJSON = value => JSON.stringify(value).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026");

export function promptStudio({prompts,selected=null,esc,link}) {
  const available=selected?[selected]:prompts;
  const controls='<div class="studio-fields">'+
   '<label>نوع کسب‌وکار<select id="studio-business"><option>رستوران</option><option>کافه</option><option>برگرشاپ</option><option>فست‌فود</option><option>نانوایی</option><option>قنادی</option></select></label>'+
   '<label>نام غذا یا محصول<input id="studio-product" placeholder="مثلاً برگر کلاسیک یا آیس‌لاته" maxlength="160"></label>'+
   '<label>رنگ‌های برند<input id="studio-brand" placeholder="مثلاً زرد و مشکی" maxlength="100"></label>'+
   '<label>سبک عکاسی یا لحن<select id="studio-style"><option value="natural">طبیعی و واقعی</option><option value="cinematic">تیره و سینمایی</option><option value="bright">روشن و مینیمال</option><option value="cozy">گرم و صمیمی</option><option value="bold">پررنگ و تبلیغاتی</option></select></label>'+
   '<label>نسبت تصویر / خروجی<select id="studio-ratio"><option value="4:5">پست عمودی ۴:۵</option><option value="9:16">استوری ۹:۱۶</option><option value="1:1">مربع ۱:۱</option><option value="16:9">بنر افقی ۱۶:۹</option><option value="original">همان خروجی پرامپت اصلی</option></select></label>'+
   '<label>مخاطب هدف<input id="studio-audience" placeholder="مثلاً دانشجویان یا خانواده‌ها" maxlength="160"></label>'+
   '<label>شهر یا بازار<input id="studio-city" placeholder="مثلاً نوشهر" maxlength="100"></label>'+
   '<label>هدف محتوا<input id="studio-goal" placeholder="مثلاً معرفی محصول تازه" maxlength="160"></label>'+
   '<label class="studio-wide">اطلاعات واقعی و محدودیت‌ها<textarea id="studio-details" rows="3" maxlength="1600" placeholder="مواد اولیه، تعداد نفرات، ویژگی‌های واقعی، ضوابط، قیمت‌های تأییدشده..."></textarea></label></div>';
  const select=selected?'<input id="studio-template" type="hidden" value="'+esc(selected.slug)+'"><p class="studio-selected-name">پرامپت مبنا: <strong>'+esc(selected.title)+'</strong></p>':
    '<label class="studio-main-select">انتخاب پرامپت پایه<select id="studio-template">'+available.map(p=>'<option value="'+esc(p.slug)+'">'+esc(p.title)+' — '+esc(p.type)+'</option>').join("")+'</select></label>';
  return '<section class="prompt-studio" id="prompt-studio" aria-labelledby="studio-heading">'+
    '<div class="studio-intro"><p class="prompt-overline">DINER PROMPT STUDIO</p><h2 id="studio-heading">پرامپت‌ساز اختصاصی</h2><p>پرامپت را برای کسب‌وکار خود شخصی‌سازی کنید. ساخت متن در همین مرورگر انجام می‌شود؛ این فرم عکس یا ویدئو تولید نمی‌کند و داده‌ای ارسال نمی‌کند.</p></div>'+
    select+controls+
    '<div class="studio-output"><div class="studio-output-head"><h3>پرامپت شخصی‌سازی‌شده</h3><button class="prompt-copy-btn" type="button" id="studio-copy">کپی متن</button></div>'+
    '<textarea id="studio-result" readonly dir="ltr" rows="10" aria-label="پرامپت آماده کپی"></textarea><p id="studio-status" role="status" aria-live="polite">پس از تغییر تنظیمات، متن به‌صورت خودکار به‌روز می‌شود.</p></div>'+
    '<p class="studio-note">برای عکس محصول واقعی، تصویر مرجع همان محصول را همراه این متن به ابزار منتخبتان بدهید. مشخصات محصول، اعداد و مقررات را پیش از انتشار مستقل بررسی کنید.</p>'+
    '<script id="studio-templates" type="application/json">'+safeJSON(available.map(p=>({slug:p.slug,prompt:p.prompt,title:p.title,ratio:p.ratio,type:p.type,reference:p.reference})))+'</script></section>';
}

export function promptComparisonData() {
 const data=read("prompt-comparisons.json");
 if(data.version!==1||!Array.isArray(data.comparisons))throw Error("Invalid comparisons data");
 return data;
}

export function promptQualityData(prompts) {
 const data=read("prompt-quality.json");
 if(data.version!==1||!data.general||!data.profiles)throw Error("Invalid prompt quality data");
 const slugs=new Set(prompts.map(p=>p.slug));
 for(const slug of Object.keys(data.profiles))if(!slugs.has(slug))throw Error("Unknown quality profile: "+slug);
 return data;
}

export function qualityCard({prompt,quality,esc}) {
 const profile=quality.profiles[prompt.slug];
 const review=profile?.editorial||"دستور آماده، نیازمند بازبینی تکمیلی";
 const version=profile?.version||"۱.۰";
 const comment=profile?.notes||"اجرای تکرارپذیر این دستور با ورودی و ابزار مشخص هنوز مستند نشده است.";
 return '<section class="prompt-quality wrap" aria-label="شناسنامه کیفیت پرامپت"><div class="prompt-quality-head"><div><p class="prompt-overline">QUALITY & TRANSPARENCY</p><h2>شناسنامه پرامپت</h2></div><span class="quality-status">آزمون مستقل مستند نشده</span></div>'+
  '<dl class="quality-grid"><div><dt>نسخه دستور</dt><dd>'+esc(version)+'</dd></div>'+
  '<div><dt>وضعیت بررسی</dt><dd>'+esc(review)+'</dd></div>'+
  '<div><dt>تاریخ آخرین بازبینی داده‌ها</dt><dd>'+esc(quality.updated)+'</dd></div>'+
  '<div><dt>نوع خروجی</dt><dd>'+esc(prompt.type)+'</dd></div>'+
  '<div><dt>عکس مرجع</dt><dd>'+(prompt.reference?"برای اجرای دقیق لازم یا توصیه‌شده":"الزامی نیست")+'</dd></div>'+
  '<div><dt>پیشنهاد نسبت</dt><dd>'+esc(prompt.ratio)+'</dd></div></dl>'+
  '<p class="quality-disclosure">'+esc(comment)+' '+esc(quality.general.executionStatus)+'</p></section>';
}

export function comparisonCard(item,{esc,link}) {
 const src=p=>link(p);
 return '<article class="compare-card" data-compare-card><div class="compare-title"><div><p class="prompt-overline">PROCESS DEMONSTRATION</p><h3>'+esc(item.title)+'</h3></div><span>تصاویر فرضی</span></div>'+
  '<div class="compare-stage" style="--reveal:50%"><img src="'+src(item.before)+'" alt="تصویر اولیه نمونه ساختگی '+esc(item.title)+'" loading="lazy" width="600" height="800" class="compare-before">'+
  '<img src="'+src(item.after)+'" alt="تصویر ویرایش‌شده نمونه ساختگی '+esc(item.title)+'" loading="lazy" width="600" height="800" class="compare-after">'+
  '<div class="compare-label before-label">قبل، نمونه ساختگی</div><div class="compare-label after-label">بعد، ویرایش نمونه</div><div class="compare-divider" aria-hidden="true"></div>'+
  '<input type="range" class="compare-range" min="0" max="100" value="50" step="1" aria-label="مقایسه تصویر اولیه و ویرایش‌شده برای '+esc(item.title)+'"></div>'+
  '<p class="compare-provenance">'+esc(item.method)+'</p>'+
  '<details class="compare-details"><summary>روش و مشخصات نمونه</summary><p>'+esc(item.source)+'</p><p>ابزار: '+esc(item.tool)+'</p><p>زمان تولید نمونه: '+esc(item.checked)+'</p><p>'+esc(item.checkedAs)+'</p></details></article>';
}

export function comparisonSection({items,esc,link,full=false}) {
 if(!items.length)return "";
 const cards=items.map(item=>comparisonCard(item,{esc,link})).join("");
 const title=full?"گالری مقایسه قبل و بعد":"مقایسه قبل و بعد";
 const disclaimer='<p class="compare-notice">این نمونه‌ها مراحل تولید و ویرایش روی تصاویر <strong>ساختگی</strong> را نشان می‌دهند. عکس محصول یا مکان واقعی مشتری نیستند و به معنای تضمین اجرای پرامپت یا حفظ خودکار جزئیات نیستند.</p>';
 return '<section class="wrap prompt-comparison-section" id="prompt-comparisons" aria-label="گالری مقایسه"><div class="prompt-section-head"><div><p class="prompt-overline">BEFORE / AFTER</p><h2>'+title+'</h2></div><p>دستگیره روی تصویر را جابه‌جا کنید تا تفاوت نور و پس‌زمینه را ببینید.</p></div>'+disclaimer+'<div class="compare-grid">'+cards+'</div>'+(full?"":'<p class="compare-more"><a href="'+link("prompts/showcase/")+'">دیدن گالری کامل ←</a></p>')+'</section>';
}
