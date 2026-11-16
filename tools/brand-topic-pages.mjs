// Archive taxonomy for the "Lessons from major brands" series.
// These are cross-linked indexes, not duplicate article copies.
export function renderBrandTopicPages({editorial,add,section,crumbs,editorialCards,link,esc}) {
  const data=editorial.brandTaxonomy||{brands:[],topics:[],articleTags:{}};
  const published=(editorial.articles||[]).filter(a=>a.status==="published");
  const brands=new Map((data.brands||[]).map(b=>[b.slug,b]));
  const topics=new Map((data.topics||[]).map(t=>[t.slug,t]));
  const tagged=a=>(data.articleTags||{})[a.slug]||{};
  const brandOf=a=>{
    const raw=a.brand||tagged(a).brand||(a._brand&&a._brand.en);
    if(!raw)return null;
    if(typeof raw==="object")return [...brands.values()].find(b=>b.en===raw.en||b.fa===raw.fa)||null;
    return brands.get(raw)||[...brands.values()].find(b=>b.en===raw||b.fa===raw)||null;
  };
  const topicsOf=a=>{
    const raw=Array.isArray(a.topics)?a.topics:(tagged(a).topics||[]);
    return [...new Set(raw)].map(slug=>topics.get(slug)).filter(Boolean);
  };
  const brandPath=b=>"reading/brands/"+b.slug+"/";
  const topicPath=t=>"reading/topics/"+t.slug+"/";
  const intro=(heading,kicker,description,trail)=>
    '<section class="pagehead wrap">'+crumbs([["خواندنی‌ها","reading/"],["درس‌هایی از برندهای بزرگ","reading/brand-lessons/"],[trail,null]])+
    '<p class="eyebrow">'+esc(kicker)+'</p><h1>'+esc(heading)+'</h1><p class="lead">'+esc(description)+'</p></section>';
  const brandGroups=[...brands.values()].map(b=>({...b,articles:published.filter(a=>brandOf(a)?.slug===b.slug)})).filter(b=>b.articles.length);
  const topicGroups=[...topics.values()].map(t=>({...t,articles:published.filter(a=>topicsOf(a).some(x=>x.slug===t.slug))})).filter(t=>t.articles.length);
  const listLinks=(xs,makePath,makeLabel)=>
    xs.length?'<div class="cards three">'+xs.map(x=>
      '<article class="card"><h3><a href="'+link(makePath(x))+'">'+esc(makeLabel(x))+'</a></h3>'+
      '<p>'+esc(String(x.articles.length))+' پروندهٔ منتشرشده</p></article>').join("")+'</div>':
      '<p class="muted">پرونده‌های این مجموعه پس از بررسی منابع به‌تدریج منتشر می‌شوند.</p>';
  // Use ordinary <a href> image links so crawlers can see destinations without JavaScript.
  // Images identify the covered brand editorially, never as a visual endorsement.
  const brandLogo=b=>b.logo?.src?
    '<img src="'+esc(b.logo.src)+'" alt="'+esc("لوگوی "+b.fa+" ("+b.en+")")+'" loading="lazy" decoding="async" width="'+Number(b.logo.width)+'" height="'+Number(b.logo.height)+'">':
    '<span class="brand-fallback-mark" dir="ltr">'+esc(b.en)+'</span>';
  const brandCards=arr=>arr.length?'<div class="brand-logo-grid">'+arr.map(b=>
    '<a class="brand-logo-link" href="'+link(brandPath(b))+'" aria-label="'+esc("مطالعه خبرها، تجربه‌ها و درس‌های مدیریتی "+b.fa)+'">'+
      '<span class="brand-logo-frame">'+brandLogo(b)+'</span>'+
      '<strong class="brand-logo-fa">'+esc(b.fa)+'</strong>'+
      '<span class="brand-logo-en" dir="ltr">'+esc(b.en)+'</span>'+
      '<span class="brand-logo-count">'+esc(String(b.articles.length))+' مطلب منتشرشده</span>'+
    '</a>').join("")+'</div>':
    '<p class="muted">با انتشار نخستین پروندهٔ تأییدشده، لوگو و صفحهٔ اختصاصی برند در این بخش فعال می‌شود.</p>';
  const hub=intro("درس‌هایی از برندهای بزرگ","تجربه برندها؛ راهکار رستوران‌داری",
    "از تصمیم‌های واقعی برندهای شناخته‌شدهٔ صنعت غذا تا راه‌حل‌های قابل اجرا برای کافه و رستوران. از دو مسیر برند یا مسئله مدیریتی وارد شوید.","درس‌هایی از برندهای بزرگ")+
    section("بر اساس برند","برندها و تجربه‌هایشان",brandCards(brandGroups))+
    section("بر اساس موضوع","مسئله‌ای که می‌خواهید حل کنید",listLinks(topicGroups,topicPath,t=>t.title))+
    section("تحلیل و آموزش","یک پرونده، دو مسیر",'<p class="rich">هر تحلیل نشانی اصلی خودش را دارد و در صفحهٔ برند و صفحهٔ موضوع فقط معرفی و پیوند آن می‌آید. ادعاها با منابع مشخص بررسی می‌شوند؛ مثال‌های مدیریتی از واقعیت تاریخی جدا هستند.</p>');
  add("reading/brand-lessons/","درس‌هایی از برندهای بزرگ برای رستوران‌داران | نیما داینر",
    "درس‌های مدیریتی برندهای مشهور غذایی برای رستوران‌داران؛ مرور پرونده‌ها بر اساس برند و موضوع، با تحلیل و راهکار اجرایی.",hub,{noindex:brandGroups.length===0});
  for(const b of brandGroups){
    const title=b.fa+" ("+b.en+")؛ تجربه‌ها، اخبار و درس‌های مدیریتی";
    const desc="مرکز مستقل پرونده‌های "+b.fa+" ("+b.en+") در نیما داینر: تصمیم‌های قابل بررسی، خبرها و تحلیل‌های مرتبط با مدیریت رستوران و کافه.";
    const themes=[...new Set(b.articles.flatMap(a=>topicsOf(a).map(t=>t.slug)))].map(s=>topics.get(s));
    const links=themes.map(t=>'<a class="chip" href="'+link(topicPath(t))+'">'+esc(t.title)+'</a>').join(" ");
    const brandLogoBlock=b.logo?.src?
      '<div class="brand-profile-logo">'+brandLogo(b)+
      '<p class="brand-logo-credit">نشان تجاری '+esc(b.fa)+' صرفاً برای شناسایی موضوع این تحلیل مستقل نمایش داده شده است. '+
      '<a href="'+esc(b.logo.sourceUrl)+'" target="_blank" rel="noopener noreferrer">منبع نشان</a></p></div>':"";
    const html=intro(title,"پرونده برند",desc,b.fa)+brandLogoBlock+
      section("پرونده‌های "+b.fa,"مقالات و خبرهای مرتبط",editorialCards(b.articles))+
      (links?section("موضوعات مدیریتی","این برند چه درس‌هایی دارد؟",'<div class="chips">'+links+'</div>'):"")+
      section("درباره این صفحه","تحلیل مستقل",'<p class="rich">این صفحه متعلق به '+esc(b.fa)+' نیست و وابستگی یا تأیید رسمی این برند را نشان نمی‌دهد. خبرها و تحلیل‌های منتشرشده در داینر از منظر آموزش مدیریت کسب‌وکار غذا گردآوری می‌شوند.</p>');
    // Pages with a single listed story are available to users, but not pushed into the index
    // until they have substantial original editorial context.
    add(brandPath(b),title,desc,html,{noindex:b.articles.length<2});
  }
  // Link subject clusters to the site's established guides, calculators and books.
  const topicResources={
    "menu-engineering":[["راهنمای مهندسی منو","guides/menu-engineering/"],["ابزار تحلیل منو","tools/menu/"],["کتاب مدیریت جامع ۱۰۱","library/01/"]],
    "pricing-profit":[["راهنمای قیمت‌گذاری منو","guides/menu-pricing/"],["محاسبه‌گر قیمت‌گذاری","tools/pricing/"],["کتاب مدیریت جامع ۱۰۱","library/01/"]],
    "staff-leadership":[["مدیریت کارکنان رستوران","guides/restaurant-staff/"],["محاسبه‌گر هزینهٔ نیروی کار","tools/labor/"],["کتاب مدیریت جامع ۱۰۱","library/01/"]],
    "operations-quality":[["استانداردسازی عملیات آشپزخانه","guides/kitchen-sop/"],["استانداردهای سرویس","guides/restaurant-service-standards/"]],
    "food-safety":[["استانداردسازی آشپزخانه","guides/kitchen-sop/"],["کتاب مدیریت جامع ۱۰۱","library/01/"]],
    "customer-experience":[["راهنمای استانداردهای سرویس","guides/restaurant-service-standards/"],["کتاب مدیریت جامع ۱۰۱","library/01/"]],
    "marketing-branding":[["راهنمای مدیریت رستوران","guides/restaurant-management/"],["کتاب مدیریت جامع ۱۰۱","library/01/"]],
    "growth-strategy":[["راهنمای راه‌اندازی","guides/restaurant-permits/"],["محاسبه‌گر سرمایه و دوام","tools/startup-runway/"],["کتاب کوچک شروع کن","library/02/"]],
    "supply-chain":[["راهنمای فودکاست","guides/food-cost/"],["محاسبه‌گر بهای مواد اولیه","tools/foodcost/"]],
    "crisis-management":[["راهنمای مدیریت رستوران","guides/restaurant-management/"],["کتاب دوام بیاور","library/03/"]],
    "finance-controls":[["راهنمای سود رستوران","guides/restaurant-profit/"],["محاسبه‌گر نقطه سربه‌سر","tools/breakeven/"],["کتاب دوام بیاور","library/03/"]]
  };
  for(const t of topicGroups){
    const title=t.title+"؛ تجربه برندها و راهکار رستوران‌داری";
    const desc=t.description+". پرونده‌های مستند از برندهای غذا همراه با روش‌های قابل اجرا برای مدیران.";
    const relatedBrands=[...new Set(t.articles.map(a=>brandOf(a)?.slug).filter(Boolean))].map(s=>brands.get(s));
    const brandLinks=relatedBrands.map(b=>'<a class="chip" href="'+link(brandPath(b))+'">'+esc(b.fa)+'</a>').join(" ");
    const resources=(topicResources[t.slug]||[]).map(([name,path])=>'<a href="'+link(path)+'">'+esc(name)+'</a>').join(" ");
    const html=intro(title,"راهنمای موضوعی",desc,t.title)+
      section("تجربه‌های واقعی","مطالعات موردی مرتبط با "+t.title,editorialCards(t.articles))+
      (brandLinks?section("برندهای مرتبط","این مسئله در چه برندهایی دیده شده است؟",'<div class="chips">'+brandLinks+'</div>'):"")+
      (resources?section("از تحلیل به اجرا","راهنما، ابزار و کتاب مرتبط",'<div class="related">'+resources+'</div>'):"");
    add(topicPath(t),title,desc,html,{noindex:t.articles.length<2});
  }
  return {
    articleLinks(a) {
      const b=brandOf(a), ts=topicsOf(a);
      if(!b&&!ts.length)return "";
      return '<div class="brand-topic-links"><h3>مسیرهای مرتبط با این پرونده</h3>'+
        '<a href="'+link("reading/brand-lessons/")+'">همهٔ درس‌های برندها</a>'+
        (b?'<a href="'+link(brandPath(b))+'">همه مطالب '+esc(b.fa)+'</a>':"")+
        ts.map(t=>'<a href="'+link(topicPath(t))+'">موضوع: '+esc(t.title)+'</a>').join("")+"</div>";
    },
    about(a) {
      const b=brandOf(a);
      const result=[];
      if(b)result.push({"@type":"Organization",name:b.fa,alternateName:b.en});
      for(const t of topicsOf(a))result.push({"@type":"Thing",name:t.title});
      return result;
    }
  };
}
