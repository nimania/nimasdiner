/** Nima's Diner — Gmail / private Sheets / private Drive. */
const ND = {site:'https://nimania.github.io/nimasdiner/', owner:'nimania@gmail.com', delivery:'https://nimasdiner-delivery.iran.chatgpt.site/', maxDailyRegistrations:60};
const COL=['id','created_at','name','email','phone','role','location_region','country','city','restaurant_type','instagram','marketing_consent','status','confirmed_at','confirm_hash','confirm_expires','download_hash','download_expires','download_requested_at','download_request_count','last_confirmation_queued_at'];
const JOB=['id','created_at','recipient','subject','html','status','attempts','last_error','sent_at'];
function setup(){
 const p=PropertiesService.getScriptProperties();
 if(!p.getProperty('SHEET_ID')){const ss=SpreadsheetApp.create('نیما داینر | فهرست خصوصی مخاطبان');p.setProperty('SHEET_ID',ss.getId());ss.getSheets()[0].setName('Subscribers');ss.getSheets()[0].appendRow(COL);ss.insertSheet('Queue').appendRow(JOB);ss.insertSheet('Events').appendRow(['created_at','subscriber_id','event']);ss.insertSheet('راهنما').appendRow(['راهنما','معنی']);ss.getSheetByName('راهنما').getRange(2,1,7,2).setValues([['pending','در انتظار تأیید ایمیل'],['confirmed','ایمیل تأیید شده'],['download_requested_at','اولین درخواست دریافت فایل؛ به معنی ذخیره قطعی نیست'],['download_request_count','تعداد درخواست دریافت فایل'],['marketing_consent','فقط yes مجوز دریافت خبرهاست'],['Queue','صف خصوصی ارسال؛ pending / sent / failed'],['خروجی','File → Download → Excel یا CSV']]);for(const sh of ss.getSheets()){sh.setFrozenRows(1);sh.getRange(1,1,1,sh.getLastColumn()).setBackground('#1b2529').setFontColor('#ffcf22').setFontWeight('bold');}ss.getSheetByName('Subscribers').getRange(1,1,ss.getSheetByName('Subscribers').getMaxRows(),COL.length).createFilter();}
 // The PDF remains private; no sharing change is performed.
 if(!p.getProperty('BOOK_FILE_ID'))p.setProperty('BOOK_FILE_ID','1nTzYharmO0kKgICMuaUUiyknwFidoWJh');
 DriveApp.getFileById(p.getProperty('BOOK_FILE_ID')).getName();
 if(!ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()==='processQueue'))ScriptApp.newTrigger('processQueue').timeBased().everyMinutes(15).create();
 console.log('Private subscriber sheet: '+db_().getUrl());
 console.log('Remaining recipient quota: '+MailApp.getRemainingDailyQuota());
}
function db_(){const id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');if(!id)throw Error('SETUP_REQUIRED');return SpreadsheetApp.openById(id);}
function now_(){return new Date().toISOString();}
function esc_(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function text_(v,n){return String(v||'').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,n||200);}
function cell_(v){const s=String(v||'');return /^[=+\-@]/.test(s)?"'"+s:s;}
function random_(){return Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');}
function hash_(s){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s).map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');}
function rows_(){const sh=db_().getSheetByName('Subscribers');return sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,COL.length).getValues().map((r,i)=>({row:i+2,data:Object.fromEntries(COL.map((c,j)=>[c,r[j]]))})):[];}
function save_(record){db_().getSheetByName('Subscribers').getRange(record.row,1,1,COL.length).setValues([COL.map(c=>cell_(record.data[c]))]);}
function event_(id,type){db_().getSheetByName('Events').appendRow([now_(),id,type]);}
function enqueue_(to,subject,html){db_().getSheetByName('Queue').appendRow([random_(),now_(),to,subject,html,'pending',0,'','']);}
function url_(action,token){return ND.delivery+'#action='+action+'&token='+encodeURIComponent(token);}
function mail_(title,body){return '<div dir="rtl" style="font-family:Tahoma,Arial;background:#faf8f1;color:#1b2529;padding:28px;line-height:2"><div style="border-top:8px solid #ffcf22;padding-top:20px"><b>نیما داینر</b><h2>'+esc_(title)+'</h2>'+body+'<p style="font-size:12px">نیما افشارنادری · <a href="'+ND.site+'">نیما داینر</a></p></div></div>';}
function button_(label,url){return '<p><a style="display:inline-block;background:#1b2529;color:#ffcf22;padding:12px 22px;text-decoration:none;border-radius:4px" href="'+esc_(url)+'">'+esc_(label)+'</a></p>';}
function page_(title,body,script){return HtmlService.createHtmlOutput('<!doctype html><html lang="fa" dir="rtl"><head><base target="_top"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><link rel="stylesheet" href="'+ND.site+'style.css"><title>'+esc_(title)+' | نیما داینر</title></head><body><header class="header wrap"><a class="brand" href="'+ND.site+'"><span class="brand-fa">نیما داینر<span class="red-dot">.</span></span></a></header><main class="simple-page wrap"><h1>'+esc_(title)+'</h1>'+body+'</main><div class="checker"></div>'+(script?'<script>'+script+'</script>':'')+'</body></html>').setTitle(title+' | نیما داینر');}
function doGet(e){
 const p=e&&e.parameter||{};const token=String(p.token||'');
 if(p.action==='confirm'){
  if(!/^[a-f0-9]{64}$/.test(token))return page_('لینک معتبر نیست','<p>لینک تأیید ایمیل را دوباره از داخل ایمیل باز کنید.</p>');
  return page_('ایمیلتان را تأیید کنید','<p>برای تأیید نشانی ایمیل و دریافت کتاب، روی دکمهٔ زیر بزنید.</p><form style="box-shadow:none" method="POST" action="'+esc_(ScriptApp.getService().getUrl())+'"><input type="hidden" name="action" value="confirm"><input type="hidden" name="token" value="'+token+'"><button class="button dark" type="submit">تأیید ایمیل و دریافت کتاب</button></form>');
 }
 if(p.action==='download')return downloadPage_(token);
 return page_('دریافت کتاب مدیریت رستوران','<p>برای ثبت درخواست کتاب از سایت نیما داینر شروع کنید.</p><a class="button dark" href="'+ND.site+'#get-book">رفتن به فرم دریافت کتاب</a>');
}
function doPost(e){
 try{const p=e&&e.parameter||{};if(e&&e.contentLength>15000)return page_('درخواست نامعتبر','<p>لطفاً دوباره از فرم سایت اقدام کنید.</p>');
  if(/^api_/.test(p.action||''))return api_(p);
  if(p.action==='confirm')return confirm_(String(p.token||''));
  return register_(p);
 }catch(err){console.error(String(err));return page_('ارسال انجام نشد','<p>مشکلی در ثبت درخواست پیش آمد. کمی بعد دوباره تلاش کنید. اطلاعاتی به عنوان تأییدشده ثبت نشده است.</p><a href="'+ND.site+'#get-book">بازگشت به فرم</a>');}
}
function registerDirect_(p){
 if(text_(p._honey))return {ok:true,spam:true};
 const email=text_(p.email,254).toLowerCase(),name=text_(p.name,100),phone=text_(p.phone,30);
 if(!name||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return {ok:false,code:'INVALID_INPUT'};
 const lock=LockService.getScriptLock();lock.waitLock(20000);let result,notify=null;
 try{
  const all=rows_();let record=all.find(r=>r.data.email===email);
  if(!record){
   const today=now_().slice(0,10);
   if(all.filter(r=>String(r.data.created_at).slice(0,10)===today).length>=ND.maxDailyRegistrations)return {ok:false,code:'DAILY_LIMIT'};
   const data={id:random_(),created_at:now_(),name,email,phone,role:'',location_region:'',country:'',city:'',restaurant_type:'',instagram:'',marketing_consent:p.marketing_consent==='yes'?'yes':'no',status:'registered',confirmed_at:'',confirm_hash:'',confirm_expires:'',download_hash:'',download_expires:'',download_requested_at:'',download_request_count:0,last_confirmation_queued_at:''};
   const sh=db_().getSheetByName('Subscribers');sh.appendRow(COL.map(c=>cell_(data[c])));record={row:sh.getLastRow(),data};notify=data;event_(data.id,'registration');
  }else{
   record.data.name=name;if(phone)record.data.phone=phone;
   if(p.marketing_consent==='yes')record.data.marketing_consent='yes';
  }
  const token=random_();
  if(record.data.status!=='confirmed'){record.data.status='registered';record.data.confirmed_at='';}
  record.data.confirm_hash='';record.data.confirm_expires='';
  record.data.download_hash=hash_(token);record.data.download_expires=new Date(Date.now()+90*86400000).toISOString();
  save_(record);event_(record.data.id,'download_link_issued');
  if(notify)enqueue_(ND.owner,'نیما داینر | ثبت‌نام و دریافت کتاب',mail_('مخاطب تازه در فهرست نیما داینر','<p>'+['name','email','phone','marketing_consent'].map(k=>esc_(k)+': '+esc_(notify[k])).join('<br>')+'</p><p><a href="'+db_().getUrl()+'">فهرست خصوصی مخاطبان</a></p>'));
  result={ok:true,download_token:token};
 }finally{lock.releaseLock();}
 processQueue();return result;
}
function register_(p){
 const d=registerDirect_(p);
 if(!d.ok)return page_(d.code==='DAILY_LIMIT'?'ظرفیت امروز تکمیل شده':'اطلاعات را کامل کنید',d.code==='DAILY_LIMIT'?'<p>لطفاً فردا دوباره برای دریافت کتاب اقدام کنید.</p>':'<p>نام و ایمیل معتبر لازم است.</p><a href="'+ND.site+'#get-book">بازگشت به فرم</a>');
 if(d.spam)return page_('درخواست دریافت شد','<p>اگر درخواست شما واقعی است، از فرم سایت اقدام کنید.</p>');
 return page_('کتابتان آماده است','<p>درخواست شما ثبت شد. برای دریافت نسخهٔ کامل روی دکمهٔ زیر بزنید.</p>'+button_('دانلود کتاب ↓',url_('download',d.download_token)));
}
function confirm_(token){
 if(!/^[a-f0-9]{64}$/.test(token))return page_('لینک نامعتبر','<p>لینک ایمیل را دوباره باز کنید.</p>');
 const lock=LockService.getScriptLock();lock.waitLock(20000);let downloadToken;
 try{const r=rows_().find(x=>x.data.confirm_hash===hash_(token));if(!r||Date.parse(r.data.confirm_expires)<Date.now())return page_('لینک منقضی شده','<p>برای دریافت کمک به '+ND.owner+' پیام بدهید.</p>');
  if(r.data.status==='confirmed')return page_('ایمیل شما تأیید شده است','<p>لینک دریافت کتاب قبلاً برایتان ارسال شده است. صندوق ورودی و پوشهٔ هرزنامه را بررسی کنید.</p>');
  downloadToken=random_();r.data.status='confirmed';r.data.confirmed_at=now_();r.data.download_hash=hash_(downloadToken);r.data.download_expires=new Date(Date.now()+90*86400000).toISOString();save_(r);event_(r.data.id,'email_confirmed');
  enqueue_(r.data.email,'کتاب شما آماده است | نیما داینر',mail_('مرجع جامع مدیریت رستوران','<p>سلام '+esc_(r.data.name)+'، ایمیلتان تأیید شد. این لینک اختصاصی دریافت کتاب شماست و ۹۰ روز اعتبار دارد.</p>'+button_('دریافت کتاب',url_('download',downloadToken))+'<p>نیما افشارنادری</p>'));
 }finally{lock.releaseLock();}
 processQueue();return page_('ایمیل شما تأیید شد','<p>لینک اختصاصی کتاب برایتان در صف ارسال قرار گرفت. از همین‌جا هم می‌توانید کتاب را دریافت کنید.</p><a class="button dark" href="'+esc_(url_('download',downloadToken))+'">دریافت کتاب ↓</a>');
}
function validDownload_(token){if(!/^[a-f0-9]{64}$/.test(token))throw Error('INVALID_LINK');const r=rows_().find(x=>x.data.download_hash===hash_(token));if(!r||!['registered','confirmed'].includes(r.data.status)||Date.parse(r.data.download_expires)<Date.now())throw Error('INVALID_LINK');return r;}
function downloadPage_(token){try{validDownload_(token);}catch(e){return page_('لینک دریافت معتبر نیست','<p>لینک اختصاصی داخل ایمیل را باز کنید. اگر لینک منقضی شده است، با '+ND.owner+' تماس بگیرید.</p>');}
 return page_('کتاب شما اینجاست','<p>مرجع جامع مدیریت رستوران · ۱۰۱ قانون طلایی · نیما افشارنادری</p><button class="button dark" id="get-file">دانلود نسخهٔ کامل ↓</button><p id="status" role="status"></p><p><a href="'+ND.site+'">بازگشت به نیما داینر</a></p>',`document.getElementById('get-file').addEventListener('click',function(){const b=this,s=document.getElementById('status');b.disabled=true;s.textContent='در حال آماده‌سازی فایل…';google.script.run.withSuccessHandler(function(r){const bytes=Uint8Array.from(atob(r.base64),c=>c.charCodeAt(0));const u=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));const a=document.createElement('a');a.href=u;a.download='NimasDiner-Restaurant-Handbook.pdf';a.textContent='اگر دانلود شروع نشد، اینجا بزنید';a.target='_blank';s.textContent='';s.appendChild(a);a.click();b.disabled=false;}).withFailureHandler(function(){s.textContent='دریافت انجام نشد؛ کمی بعد دوباره تلاش کنید.';b.disabled=false;}).requestFile('${token}');});`);
}
function requestFile(token){
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{const r=validDownload_(String(token||''));if(Number(r.data.download_request_count)>=30)throw Error('DOWNLOAD_LIMIT');const file=DriveApp.getFileById(PropertiesService.getScriptProperties().getProperty('BOOK_FILE_ID'));const base64=Utilities.base64Encode(file.getBlob().getBytes());r.data.download_requested_at=r.data.download_requested_at||now_();r.data.download_request_count=Number(r.data.download_request_count||0)+1;save_(r);event_(r.data.id,'file_requested');return {base64};}finally{lock.releaseLock();}
}
function processQueue(){
 const lock=LockService.getScriptLock();if(!lock.tryLock(1000))return;
 try{const sh=db_().getSheetByName('Queue');if(sh.getLastRow()<2)return;const rows=sh.getRange(2,1,sh.getLastRow()-1,JOB.length).getValues();let budget=Math.min(10,Math.max(0,MailApp.getRemainingDailyQuota()-15));
  for(let i=0;i<rows.length&&budget>0;i++){const r=rows[i];if(r[5]!=='pending')continue;try{MailApp.sendEmail({to:r[2],subject:r[3],body:plainMail_(r[4]),htmlBody:r[4],name:'نیما داینر | نیما افشارنادری',replyTo:ND.owner});r[5]='sent';r[8]=now_();r[7]='';budget--;}catch(e){r[6]=Number(r[6]||0)+1;r[7]=String(e).slice(0,300);if(r[6]>=5)r[5]='failed';}sh.getRange(i+2,1,1,JOB.length).setValues([r]);}
 }finally{lock.releaseLock();}
}

function plainMail_(html){return html.replace(/<a[^>]*href="([^"\n]+)"[^>]*>([\s\S]*?)<\/a>/gi,'$2 ($1)').replace(/<[^>]+>/g,' ' ).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/ +/g,' ');}

function json_(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);}
function api_(p){
 try{
  if(p.action==='api_download')return json_({ok:true,...requestFile(String(p.token||''))});
  if(p.action==='api_confirm'){
   const result=confirm_(String(p.token||'')).getContent();
   const token=(result.match(/action=download(?:&amp;|&)token=([a-f0-9]{64})/)||[])[1];
   if(token)return json_({ok:true,token});
   if(result.includes('ایمیل شما تأیید شده است'))return json_({ok:true,message:'ایمیل قبلاً تأیید شده است؛ لینک دریافت کتاب در ایمیل شماست.'});
   return json_({ok:false,code:'INVALID_LINK'});
  }
  if(p.action==='api_register')return json_(registerDirect_(p));
  return json_({ok:false,code:'INVALID_ACTION'});
 }catch(e){console.error(String(e));return json_({ok:false,code:'REQUEST_FAILED'});}
}
