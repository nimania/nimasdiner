'use strict';
(() => {
  const QUESTIONS = [
    {section:'شناخت کسب‌وکار',q:'اگر بخواهید فقط یک مشکل اصلی کسب‌وکارتان را نام ببرید، آن مشکل چیست؟',hint:'ابتدا اجازه دهید آزادانه توضیح دهد؛ صحبت را به قیمت غذا محدود نکنید.',probe:'این مشکل از چه زمانی شروع شده و چه اثر مشخصی بر کسب‌وکارتان داشته است؟'},
    {section:'شناخت کسب‌وکار',q:'از زمان شروع فعالیت، بهترین و بدترین ماه فروش شما کدام بوده؟ چرا؟',hint:'ماه‌ها، ارقام فروش و اتفاقات تأثیرگذار را ثبت کنید.',probe:'تفاوت فروش این دو ماه چقدر بوده است؟'},
    {section:'شناخت کسب‌وکار',q:'مشتریان شما بیشتر چه کسانی هستند؟',hint:'محلی، گذری، سفارش آنلاین، تلفنی، قراردادهای سازمانی و برگزاری مراسم.',probe:'سهم تقریبی هر گروه از مبلغ فروش کل چقدر است؟'},
    {section:'شناخت کسب‌وکار',q:'در یک روز معمولی چند پرس غذا می‌فروشید؟ روزهای شلوغ و خلوت چطور؟',hint:'تعداد پرس، تعداد سفارش و روزهای فعالیت ماهانه را از هم جدا کنید.',probe:'این تعداد را از سیستم فروش می‌خوانید یا تخمین می‌زنید؟'},
    {section:'درآمد و هزینه‌ها',q:'فروش کل ماه گذشته دقیقاً چقدر بوده است؟',hint:'رقم فروش ناخالص، تخفیف‌ها، برگشتی‌ها و فروش خالص را جدا کنید.',probe:'آیا گزارش صندوق یا نرم‌افزار فروش ماه گذشته را دارید؟'},
    {section:'درآمد و هزینه‌ها',q:'از هر ۱۰۰ پرس غذا، چند پرس مربوط به مشتری عادی و چند پرس مربوط به قراردادهای سازمانی است؟',hint:'برای هر کانال تعداد، قیمت متوسط و نوع قرارداد را ثبت کنید.',probe:'کدام گروه پرداخت سریع‌تری دارد و کدام یک سودآورتر است؟'},
    {section:'درآمد و هزینه‌ها',q:'هزینه‌های ماهانهٔ رستوران دقیقاً چه مواردی هستند و مبلغ هرکدام چقدر است؟',hint:'اجاره، قبوض، حقوق، بیمه، متفرقه و دورهٔ هر رقم را بررسی کنید؛ هزینه‌های ثابت را از متغیر جدا کنید.',probe:'مبلغ قبوض دقیقاً شامل چه مواردی و مربوط به چند ماه است؟'},
    {section:'درآمد و هزینه‌ها',q:'آیا شما و همسرتان بابت کار در رستوران حقوق مشخصی دریافت می‌کنید؟',hint:'ساعت کار هفتگی، برداشت شخصی و حقوق واقعی یا فرضی مالکان را ثبت کنید.',probe:'اگر به جای شما دو نفر نیروی استخدامی کار می‌کردند، هزینه‌اش چقدر می‌شد؟'},
    {section:'درآمد و هزینه‌ها',q:'پول خرید مواد اولیه را چطور تأمین می‌کنید؟',hint:'پرداخت نقدی، چکی، اعتباری، بدهی تأمین‌کنندگان و سرمایه در گردش.',probe:'در پایان ماه معمولاً چه میزان بدهی پرداخت‌نشده دارید؟'},
    {section:'فودکاست و منو',q:'وقتی هزینهٔ تمام‌شدهٔ یک پرس غذا را اعلام می‌کنید، دقیقاً چه اقلامی را حساب کرده‌اید؟',hint:'مواد اولیه، وزن خام و پخته، بسته‌بندی، ضایعات، انرژی، حقوق و سربار را تفکیک کنید.',probe:'می‌توانید هزینهٔ یک پرس را با وزن و قیمت خرید تک‌تک مواد بازسازی کنید؟'},
    {section:'فودکاست و منو',q:'پنج غذای پرفروش شما کدام‌اند و از هرکدام ماه گذشته چند پرس فروختید؟',hint:'نام، تعداد فروش، قیمت روز و هزینهٔ متغیر هر غذا را ثبت کنید.',probe:'کدام غذا بیشترین سود ریالی را به ازای هر پرس ایجاد می‌کند؟'},
    {section:'فودکاست و منو',q:'مواد اولیه را چطور وزن و سهم‌بندی می‌کنید؟',hint:'وزن خام، افت پخت، وزن استاندارد هر پرس و کنترل اندازهٔ سهم.',probe:'دو آشپز مختلف، از یک غذا پرس‌هایی با وزن یکسان تولید می‌کنند؟'},
    {section:'فودکاست و منو',q:'چه میزان مواد اولیه یا غذای پخته‌شده دورریز می‌شود؟',hint:'ضایعات آماده‌سازی، فساد، اضافه‌تولید، مرجوعی و غذای پرسنل.',probe:'آیا میزان دورریز را روزانه ثبت می‌کنید؟'},
    {section:'فودکاست و منو',q:'آخرین بار قیمت غذاها را چه زمانی و بر چه اساسی تغییر دادید؟',hint:'قیمت قبل و بعد، تاریخ تغییر و تعداد فروش در دو بازهٔ قابل مقایسه.',probe:'آیا هم‌زمان وزن پرس یا کیفیت مواد اولیه نیز تغییر کرده است؟'},
    {section:'بازاریابی و عملیات',q:'مشتری‌ها معمولاً از چه طریقی با شما آشنا می‌شوند؟',hint:'تابلو، معرفی دیگران، گوگل‌مپ، اینستاگرام، پلتفرم سفارش غذا یا قرارداد سازمانی.',probe:'آیا مشتریان تکراری را می‌شناسید یا اطلاعات سفارش‌های گذشته را نگه می‌دارید؟'},
    {section:'بازاریابی و عملیات',q:'از زمان افزایش قیمت اخیر، تعداد سفارش‌ها واقعاً کاهش یافته است؟',hint:'فروش و تعداد سفارش‌ها قبل و بعد از تغییر قیمت؛ با توجه به روز هفته و تغییرات فصلی.',probe:'چند مشتری مشخص درباره قیمت اعتراض کرده یا خرید را متوقف کرده‌اند؟'},
    {section:'بازاریابی و عملیات',q:'رقیب ارزان‌تر چه تفاوتی با شما دارد؟',hint:'وزن پرس، مواد اولیه، کیفیت، قدمت، ظرفیت تولید، محل و نوع مشتری.',probe:'یک سفارش کاملاً مشابه از هر دو رستوران چه اختلاف قیمت و وزنی دارد؟'},
    {section:'بازاریابی و عملیات',q:'اگر فردا تعداد سفارش‌ها دو برابر شود، ظرفیت آشپزخانه و پرسنل کافی است؟',hint:'بیشترین تعداد پرس در هر ساعت، تجهیزات، نیروی کار و زمان تحویل.',probe:'اولین محدودیتی که باعث تأخیر می‌شود کدام است؟'},
    {section:'بازاریابی و عملیات',q:'قراردادهای سازمانی و مراسم با چه قیمت، حجم و شرایط تسویه انجام می‌شوند؟',hint:'قیمت هر پرس، حداقل سفارش، هزینه تحویل، بسته‌بندی، موعد پرداخت و روزهای فعالیت.',probe:'هزینه واقعی هر پرس این قراردادها و مبلغ باقی‌مانده بعد از هزینه‌های متغیر چقدر است؟'},
    {section:'اهداف و تصمیم‌گیری',q:'اگر در سه ماه آینده فقط یک چیز بهتر شود، چه نتیجه‌ای برایتان ارزشمندتر است؟',hint:'سود، جریان نقدی، ثبات سفارش، جذب مشتری یا کاهش فشار کاری. هدف را عددی کنید.',probe:'چه عددی را معیار موفقیت مشاوره می‌دانید؟'},
    {section:'اهداف و تصمیم‌گیری',q:'برای اجرای تغییرات چه محدودیت‌هایی دارید؟',hint:'بودجه، سرمایه در گردش، پرسنل، تجهیزات، مهارت، زمان و تعهدات قراردادی.',probe:'کدام تغییر را می‌توانید همین هفته بدون سرمایه‌گذاری قابل‌توجه اجرا کنید؟'}
  ];
  const STORE_KEY = 'nimasdiner_consulting_encrypted_v1';
  const ITERATIONS = 250000;
  const $ = id => document.getElementById(id);
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();
  const format = new Intl.NumberFormat('fa-IR', {maximumFractionDigits:1});
  let vault = null, cryptoKey = null, salt = null, questionIndex = 0, view = 'question';
  let dirtyVersion = 0, saveTimer = null;

  function today() {
    const d = new Date();
    return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
  }
  function makeCase(name='پروندهٔ جدید') {
    return {id:crypto.randomUUID(), name, location:'', date:today(), summary:'', answers:QUESTIONS.map(()=>''), metrics:{fixed:'',margin:'',ticket:'',days:'30'}, createdAt:new Date().toISOString()};
  }
  function activeCase() {
    return vault.cases.find(c=>c.id===vault.activeId) || vault.cases[0];
  }
  function bytesToBase64(bytes) {
    let out='';
    for(let i=0;i<bytes.length;i+=8192) out+=String.fromCharCode(...bytes.subarray(i,i+8192));
    return btoa(out);
  }
  function base64ToBytes(str) {
    const binary=atob(str);
    const out=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)out[i]=binary.charCodeAt(i);
    return out;
  }
  async function deriveKey(pass,bytes) {
    const material=await crypto.subtle.importKey('raw',textEncoder.encode(pass),'PBKDF2',false,['deriveKey']);
    return crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes,iterations:ITERATIONS,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  }
  function status(message,error=false) {
    $('save-status').textContent=message;
    $('save-status').style.color=error?'#b42c22':'#247250';
  }
  function markDirty() {
    dirtyVersion++;
    status('در حال ذخیره…');
    clearTimeout(saveTimer);
    saveTimer=setTimeout(()=>{void persist();},550);
  }
  async function persist() {
    if(!vault||!cryptoKey)return;
    const current=dirtyVersion;
    const plaintext=JSON.stringify(vault);
    clearTimeout(saveTimer);
    try {
      const iv=crypto.getRandomValues(new Uint8Array(12));
      const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},cryptoKey,textEncoder.encode(plaintext)));
      if(current!==dirtyVersion) { clearTimeout(saveTimer); saveTimer=setTimeout(()=>{void persist();},300); return; }
      const envelope={v:1,salt:bytesToBase64(salt),iv:bytesToBase64(iv),data:bytesToBase64(encrypted)};
      localStorage.setItem(STORE_KEY,JSON.stringify(envelope));
      status('ذخیره شد · '+new Date().toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'}));
    } catch(err) {
      status('خطا در ذخیره؛ لطفاً پشتیبان بگیرید',true);
    }
  }
  function ensureCompatible() {
    try {
      if(!crypto||!crypto.subtle||!crypto.randomUUID||!window.isSecureContext)return false;
      const key='__nd_storage_test__';
      localStorage.setItem(key,'1');
      localStorage.removeItem(key);
      return true;
    } catch(err) {return false;}
  }
  function showGate(message='') {
    $('gate').hidden=false;
    $('workspace').hidden=true;
    $('gate-message').textContent=message;
    let exists=false;
    try {exists=Boolean(localStorage.getItem(STORE_KEY));}catch(err){}
    $('create-form').hidden=exists;
    $('unlock-form').hidden=!exists;
    $('new-pass').value='';
    $('confirm-pass').value='';
    $('unlock-pass').value='';
  }
  async function createVault(event) {
    event.preventDefault();
    const pass=$('new-pass').value;
    if(pass.length<8){$('gate-message').textContent='گذرواژه باید حداقل ۸ نویسه باشد.';return;}
    if(pass!==$('confirm-pass').value){$('gate-message').textContent='تکرار گذرواژه یکسان نیست.';return;}
    try {
      salt=crypto.getRandomValues(new Uint8Array(16));
      cryptoKey=await deriveKey(pass,salt);
      const first=makeCase('پروندهٔ ۱');
      vault={version:1,activeId:first.id,cases:[first]};
      dirtyVersion++;
      await persist();
      if(!localStorage.getItem(STORE_KEY))throw new Error('storage unavailable');
      enterWorkspace();
    } catch(err) {
      cryptoKey=null; vault=null;
      $('gate-message').textContent='ساخت پرونده ممکن نشد؛ فضای ذخیرهٔ مرورگر را بررسی کنید.';
    }
  }
  async function unlockVault(event) {
    event.preventDefault();
    $('gate-message').textContent='در حال بازکردن صندوق…';
    try {
      const envelope=JSON.parse(localStorage.getItem(STORE_KEY));
      if(!envelope||envelope.v!==1)throw new Error('Unsupported backup');
      const nextSalt=base64ToBytes(envelope.salt);
      const nextKey=await deriveKey($('unlock-pass').value,nextSalt);
      const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:base64ToBytes(envelope.iv)},nextKey,base64ToBytes(envelope.data));
      const parsed=JSON.parse(textDecoder.decode(plain));
      if(!parsed||!Array.isArray(parsed.cases)||parsed.cases.length===0||!parsed.activeId)throw new Error('Invalid vault');
      salt=nextSalt;cryptoKey=nextKey;vault=parsed;
      for(const c of vault.cases)normalizeCase(c);
      enterWorkspace();
    } catch(err) {
      $('gate-message').textContent='گذرواژه نادرست است یا فایل صندوق آسیب دیده است.';
    }
  }
  function normalizeCase(c) {
    c.name=String(c.name||'پروندهٔ بدون نام').slice(0,120);
    c.location=String(c.location||'').slice(0,160);
    c.date=String(c.date||today());
    c.summary=String(c.summary||'');
    c.answers=QUESTIONS.map((_,i)=>String(Array.isArray(c.answers)?(c.answers[i]||''):''));
    c.metrics={fixed:String(c.metrics?.fixed||''),margin:String(c.metrics?.margin||''),ticket:String(c.metrics?.ticket||''),days:String(c.metrics?.days||'30')};
  }
  function enterWorkspace() {
    $('gate').hidden=true;
    $('workspace').hidden=false;
    questionIndex=0;view='question';
    status('صندوق باز است');
    renderAll();
  }
  function lock() {
    clearTimeout(saveTimer);
    void persist().finally(()=>{
      vault=null;cryptoKey=null;salt=null;questionIndex=0;
      $('answer').value=''; $('case-summary').value='';
      showGate();
    });
  }
  function renderAll() {
    renderCasePicker();
    renderMeta();
    renderQuestion();
    renderNav();
    renderProgress();
    renderMetrics();
    if(view==='review') renderReview();
    $('question-panel').hidden=view!=='question';
    $('review-panel').hidden=view!=='review';
  }
  function renderCasePicker() {
    const picker=$('case-picker');
    picker.replaceChildren();
    for(const c of vault.cases) {
      const opt=document.createElement('option');
      opt.value=c.id;opt.textContent=c.name;picker.append(opt);
    }
    picker.value=activeCase().id;
  }
  function renderMeta() {
    const c=activeCase();
    $('case-name').value=c.name;
    $('case-location').value=c.location;
    $('meeting-date').value=c.date;
    $('case-summary').value=c.summary;
  }
  function renderQuestion() {
    const q=QUESTIONS[questionIndex];
    $('phase-name').textContent=q.section;
    $('question-count').textContent='سؤال '+format.format(questionIndex+1)+' از '+format.format(QUESTIONS.length);
    $('question-title').textContent=q.q;
    $('question-hint').textContent=q.hint;
    $('question-probe').textContent=q.probe;
    $('answer').value=activeCase().answers[questionIndex]||'';
    $('prev-btn').disabled=questionIndex===0;
    $('next-btn').textContent=questionIndex===QUESTIONS.length-1?'مرور پاسخ‌ها ←':'ثبت و سؤال بعد ←';
    $('skip-btn').hidden=questionIndex===QUESTIONS.length-1;
    const probe=document.querySelector('.probe');
    if(probe)probe.open=false;
  }
  function renderNav() {
    const c=activeCase();
    const nav=$('question-nav');
    nav.replaceChildren();
    const sections=[...new Set(QUESTIONS.map(q=>q.section))];
    for(const section of sections) {
      const group=document.createElement('div');group.className='nav-group';
      const heading=document.createElement('div');heading.className='nav-group-title';heading.textContent=section;group.append(heading);
      QUESTIONS.forEach((q,i)=>{
        if(q.section!==section)return;
        const button=document.createElement('button');
        button.type='button';button.className='q-nav';
        if(i===questionIndex&&view==='question')button.classList.add('active');
        if(c.answers[i].trim())button.classList.add('done');
        const number=document.createElement('span');number.className='number';number.textContent=c.answers[i].trim()?'✓':format.format(i+1);
        const title=document.createElement('span');title.className='nav-title';title.textContent=q.q;
        button.append(number,title);button.title=q.q;
        button.addEventListener('click',()=>goTo(i));
        group.append(button);
      });
      nav.append(group);
    }
  }
  function renderProgress() {
    const completed=activeCase().answers.filter(a=>a.trim()).length;
    $('progress-counter').textContent=format.format(completed)+' / '+format.format(QUESTIONS.length);
    $('progress-fill').style.width=(completed/QUESTIONS.length*100)+'%';
  }
  function goTo(n) {
    questionIndex=Math.max(0,Math.min(QUESTIONS.length-1,n));
    view='question';renderAll();
    if(window.innerWidth<731)window.scrollTo({top:document.getElementById('question-panel').getBoundingClientRect().top+window.scrollY-15,behavior:'smooth'});
  }
  function review() {view='review';renderAll();}
  function renderReview() {
    const parent=$('review-list');
    parent.replaceChildren();
    const c=activeCase();
    QUESTIONS.forEach((q,i)=>{
      const button=document.createElement('button');button.type='button';button.className='review-item';
      const name=document.createElement('b');name.textContent=(i+1)+'. '+q.q;
      const sub=document.createElement('small');sub.textContent=q.section+(c.answers[i].trim()?' · پاسخ‌داده‌شده':' · بی‌پاسخ');
      const answer=document.createElement('p');answer.textContent=c.answers[i].trim()||'—';
      button.append(name,sub,answer);
      button.addEventListener('click',()=>goTo(i));
      parent.append(button);
    });
  }
  function addCase() {
    const c=makeCase('پروندهٔ '+format.format(vault.cases.length+1));
    vault.cases.push(c);vault.activeId=c.id;questionIndex=0;view='question';
    markDirty();renderAll();
    $('case-name').focus();$('case-name').select();
  }
  function removeCase() {
    const c=activeCase();
    if(!confirm('پروندهٔ «'+c.name+'» و همهٔ پاسخ‌های آن حذف شود؟ این کار قابل برگشت نیست مگر از فایل پشتیبان.'))return;
    vault.cases=vault.cases.filter(item=>item.id!==c.id);
    if(vault.cases.length===0)vault.cases.push(makeCase('پروندهٔ ۱'));
    vault.activeId=vault.cases[0].id;questionIndex=0;view='question';
    markDirty();renderAll();
  }
  function getCaseText(c) {
    const lines=['پرونده مشاوره رستوران — نیما داینر','مشتری: '+c.name,'حوزه فعالیت / محل: '+(c.location||'نامشخص'),'تاریخ جلسه: '+(c.date||'نامشخص'),'یادداشت‌های مقدماتی: '+(c.summary||'—'),''];
    QUESTIONS.forEach((q,i)=>lines.push('سؤال '+(i+1)+' — '+q.section+'\n'+q.q+'\nپاسخ: '+(c.answers[i]||'ثبت نشده')+'\n'));
    lines.push('محاسبات مقدماتی:');
    lines.push('هزینه ثابت ماهانه (میلیون تومان): '+(c.metrics.fixed||'—'));
    lines.push('حاشیه مشارکت (%): '+(c.metrics.margin||'—'));
    lines.push('میانگین فاکتور (هزار تومان): '+(c.metrics.ticket||'—'));
    lines.push('روز فعالیت ماهانه: '+(c.metrics.days||'—'));
    return lines.join('\n');
  }
  function downloadFile(filename,body,mime) {
    const url=URL.createObjectURL(new Blob([body],{type:mime}));
    const link=document.createElement('a');link.href=url;link.download=filename;
    document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),2000);
  }
  function safeFilename(s) {return String(s).replace(/[\\/:*?"<>|]/g,'-').replace(/\s+/g,'-').slice(0,70)||'case';}
  function downloadText() {
    const c=activeCase();
    if(!confirm('این فایل شامل پاسخ‌ها و اطلاعات محرمانهٔ مشتری به صورت متن خوانا خواهد بود. ادامه می‌دهید؟'))return;
    downloadFile('nimasdiner-'+safeFilename(c.name)+'.txt',getCaseText(c),'text/plain;charset=utf-8');
  }
  function downloadJSON() {
    if(!confirm('نسخهٔ JSON بدون رمزگذاری است و اطلاعات مشتری را به‌صورت خوانا دارد. ادامه می‌دهید؟'))return;
    const c=activeCase();
    downloadFile('nimasdiner-'+safeFilename(c.name)+'.json',JSON.stringify({type:'nimasdiner-case',version:1,case:c},null,2),'application/json;charset=utf-8');
  }
  async function exportBackup() {
    await persist();
    const raw=localStorage.getItem(STORE_KEY);
    if(!raw){alert('نسخهٔ ذخیره‌شده‌ای وجود ندارد؛ دوباره تلاش کنید.');return;}
    downloadFile('nimasdiner-private-backup-'+today()+'.json',raw,'application/json;charset=utf-8');
  }
  async function importFile(file) {
    if(!file)return;
    if(file.size>5*1024*1024){alert('اندازهٔ فایل بیشتر از ۵ مگابایت است.');return;}
    try {
      const parsed=JSON.parse(await file.text());
      if(parsed.v===1&&typeof parsed.salt==='string'&&typeof parsed.iv==='string'&&typeof parsed.data==='string') {
        if(!confirm('بازیابی پشتیبان رمزگذاری‌شده همهٔ پرونده‌های کنونی این مرورگر را جایگزین می‌کند. آیا از پرونده‌های موجود پشتیبان گرفته‌اید و ادامه می‌دهید؟'))return;
        localStorage.setItem(STORE_KEY,JSON.stringify(parsed));
        vault=null;cryptoKey=null;salt=null;
        showGate('پشتیبان وارد شد. با گذرواژهٔ فایل پشتیبان آن را باز کنید.');
      } else if(parsed.type==='nimasdiner-case'&&parsed.case&&vault) {
        if(!confirm('این پرونده بدون رمزگذاری وارد صندوق فعلی شما می‌شود. ادامه می‌دهید؟'))return;
        const imported=parsed.case;
        normalizeCase(imported);
        imported.id=crypto.randomUUID();
        vault.cases.push(imported);vault.activeId=imported.id;
        questionIndex=0;view='question';markDirty();renderAll();
        alert('پرونده وارد شد و به صندوق شما اضافه شد.');
      } else {
        throw new Error('unknown format');
      }
    } catch(err) {alert('فرمت فایل پشتیبان/پرونده معتبر نیست یا امکان خواندن آن وجود ندارد.');}
  }
  function renderMetrics() {
    const m=activeCase().metrics;
    $('fixed-cost').value=m.fixed;
    $('margin').value=m.margin;
    $('ticket').value=m.ticket;
    $('days').value=m.days;
    calculate();
  }
  function calculate() {
    const m=activeCase().metrics;
    const fixed=Number(m.fixed),margin=Number(m.margin),ticket=Number(m.ticket),days=Number(m.days);
    const valid=String(m.fixed).trim()!==''&&String(m.margin).trim()!==''&&fixed>=0&&margin>0&&margin<=100&&days>0&&days<=31;
    const monthly=valid?fixed/(margin/100):null;
    const daily=valid?monthly/days:null;
    const count=valid&&ticket>0?Math.ceil(daily*1000/ticket):null;
    $('break-even-month').textContent=monthly===null?'—':format.format(monthly)+' میلیون تومان';
    $('break-even-day').textContent=daily===null?'—':format.format(daily)+' میلیون تومان';
    $('break-even-orders').textContent=count===null?'—':format.format(count)+' فاکتور';
  }
  function bind() {
    $('create-form').addEventListener('submit',event=>{void createVault(event);});
    $('unlock-form').addEventListener('submit',event=>{void unlockVault(event);});
    $('new-case').addEventListener('click',addCase);
    $('delete-case').addEventListener('click',removeCase);
    $('lock-btn').addEventListener('click',lock);
    $('save-btn').addEventListener('click',()=>{void persist();});
    $('case-picker').addEventListener('change',event=>{vault.activeId=event.target.value;questionIndex=0;view='question';markDirty();renderAll();});
    for(const [id,key] of [['case-name','name'],['case-location','location'],['meeting-date','date'],['case-summary','summary']]) {
      $(id).addEventListener('input',event=>{
        activeCase()[key]=event.target.value;
        markDirty();
        if(key==='name')renderCasePicker();
      });
    }
    $('answer').addEventListener('input',event=>{
      activeCase().answers[questionIndex]=event.target.value;
      markDirty();renderProgress();
    });
    $('prev-btn').addEventListener('click',()=>goTo(questionIndex-1));
    $('skip-btn').addEventListener('click',()=>goTo(questionIndex+1));
    $('next-btn').addEventListener('click',()=>questionIndex===QUESTIONS.length-1?review():goTo(questionIndex+1));
    $('review-btn').addEventListener('click',review);
    $('back-questions').addEventListener('click',()=>goTo(questionIndex));
    $('copy-btn').addEventListener('click',async()=>{
      try {await navigator.clipboard.writeText(getCaseText(activeCase()));status('متن پرونده کپی شد');}
      catch(err) {alert('کپی خودکار ممکن نشد. از دریافت فایل متن استفاده کنید.');}
    });
    $('text-btn').addEventListener('click',downloadText);
    $('json-btn').addEventListener('click',downloadJSON);
    $('backup-btn').addEventListener('click',()=>{void exportBackup();});
    for(const id of ['import-file','gate-file']) {
      $(id).addEventListener('change',event=>{void importFile(event.target.files[0]);event.target.value='';});
    }
    for(const [id,key] of [['fixed-cost','fixed'],['margin','margin'],['ticket','ticket'],['days','days']]) {
      $(id).addEventListener('input',event=>{
        activeCase().metrics[key]=event.target.value;
        markDirty();calculate();
      });
    }
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&vault&&cryptoKey)void persist();});
    window.addEventListener('pagehide',()=>{if(vault&&cryptoKey)void persist();});
  }
  bind();
  if(!ensureCompatible()) {
    $('crypto-warning').hidden=false;$('create-form').hidden=true;$('unlock-form').hidden=true;
    $('gate-file').disabled=true;return;
  }
  showGate();
})();
