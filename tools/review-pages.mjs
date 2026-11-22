export function renderReviews({reviews, add, section, crumbs, link, esc, comment}) {
  const items=reviews.reviews.filter(r=>r.status==='published').sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  // A video publication timestamp must be precise and timezone-aware.
  // Do not reuse article date-only metadata: Google VideoObject expects DateTime.
  const videoDatePattern=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
  for(const review of items){
    for(const video of review.videoGallery||[]){
      if(!videoDatePattern.test(video.uploadDate||"")||Number.isNaN(Date.parse(video.uploadDate))){
        throw new Error("Invalid timezone-aware video uploadDate for review: "+review.slug);
      }
    }
  }

  const faDate=s=>new Intl.DateTimeFormat('fa-IR',{dateStyle:'long',timeZone:'UTC'}).format(new Date(s+'T12:00:00Z'));
  const url=r=>'reviews/'+r.slug+'/';
  const absImageUrl=src=>/^https?:\/\//i.test(src)?src:'https://nimania.github.io'+src;
  const emblemImage=(r,loading='lazy')=>r.emblem?`<img class="review-emblem-img" src="${esc(r.emblem.src)}" data-local-fallback="${esc(r.emblem.fallback||'')}" alt="${esc(r.emblem.alt||'نشان پرونده')}" width="140" height="140" loading="${loading}" decoding="async" referrerpolicy="no-referrer">`:'';
  const emblemBox=(r,kind='sidebar')=>r.emblem?`<section class="review-emblem review-emblem--${kind}" aria-label="نشان این پرونده"><div class="review-emblem-art">${emblemImage(r,kind==='mobile'?'eager':'lazy')}</div><div class="review-emblem-details"><span class="review-emblem-kicker">نشان این پرونده</span><p>${esc(r.emblem.caption||r.venue.name)}</p><small>${r.emblem.kind==='illustration'?'تصویر اختصاصی الهام‌گرفته از فضا':'نشان معرفی رستوران'}</small></div></section>`:'';
  const card=r=>{
    const cover=r.archiveImage||r.photos?.[0]?.src||'';
    const alt=r.archiveImageAlt||r.photos?.[0]?.alt?.replace(" در نوشتهٔ آرشیوی","")||r.venue.name;
    const fallback=r.archiveFallback||'';
    return `<article class="card review-card" data-review-category="${esc(r.category)}" data-review-city="${esc(r.venue.city)}" data-review-type="${esc(r.venue.type)}"><a class="review-cover" href="${link(url(r))}">${cover?`<img src="${esc(cover)}" data-image-fallback="${esc(fallback)}" alt="${esc(alt)}" loading="lazy" width="640" height="420" referrerpolicy="no-referrer">`:`<span class="review-cover-text">${esc(r.venue.name)}</span>`}</a><div class="review-card-body"><span class="kicker">${esc(r.venue.city)} · ${esc(r.venue.type)}</span><h3><a href="${link(url(r))}">${esc(r.title)}</a></h3><p>${esc(r.summary)}</p><div class="card-meta"><time datetime="${r.publishedAt}">${faDate(r.publishedAt)}</time><a class="textlink" href="${link(url(r))}">خواندن نقد ←</a></div></div></article>`;
  };
  const cities=[...new Set(items.map(r=>r.venue.city))],types=[...new Set(items.map(r=>r.venue.type))];
  const options=arr=>arr.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
  const filter=`<form class="archive-filters" id="review-filters" hidden><label>نوع نوشته<select id="review-category"><option value="food">رستوران و کافه</option><option value="all">همهٔ نوشته‌ها</option><option value="city">گشت‌وگذار شهری</option></select></label><label>شهر و مسیر<select id="review-city"><option value="">همهٔ شهرها</option>${options(cities)}</select></label><label>نوع مجموعه<select id="review-type"><option value="">همهٔ مجموعه‌ها</option>${options(types)}</select></label><label class="filter-query">جست‌وجو در عنوان و معرفی<input id="review-query" type="search" placeholder="نام رستوران، محله یا موضوع"></label></form><p id="review-filter-count" role="status" aria-live="polite">${items.length} نوشته</p>`;
  add('reviews/','نقدهای نیما؛ رستوران‌ها و کافه‌ها','نقدهای نیما افشارنادری از سال ۱۳۸۵ تا امروز؛ راهنمای رستوران‌ها، کافه‌ها و تجربهٔ شهر، با متن کامل و تحلیل‌های تازه.',
    `<section class="pagehead wrap">${crumbs([['نقدهای نیما',null]])}<p class="eyebrow">نوشته‌های نیما افشارنادری</p><h1>از پشت میز مهمان، با چشم مدیر</h1><p class="lead">غذا، آدم‌ها و خاطرهٔ شهر؛ نوشته‌های من دربارهٔ رستوران‌ها، کافه‌ها و پاتوق‌ها.</p></section>`
    +section('نقدهای نیما','رستوران، کافه و پاتوق',`${filter}<div class="cards three" id="review-grid">${items.map(card).join('')}</div><p id="review-empty" class="muted" hidden>نوشته‌ای با این ترکیب پیدا نشد؛ یکی از فیلترها را تغییر بده.</p>`)
    ,{script:'site-v2.js'});
  const renderInline=s=>esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,(_m,l,u)=>`<a href="${u}" rel="noopener noreferrer">${l}</a>`).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');

  // A factual sidebar for the new generation of reviews; archived stories remain unchanged.
  const renderSidebar=(review)=>{
    const d=review.sidebar;
    if(!d)return '';
    const priceFormat=n=>new Intl.NumberFormat('fa-IR').format(n);
    const prices=d.menuPrices||[];
    const maxPrice=Math.max(1,...prices.map(p=>p.price));
    const facts=[
      ['نشانی',d.address],
      ['ساعت فعالیت',d.hours],
      ['نوع مجموعه',review.venue.type], ...(d.manager?[['مدیریت',d.manager]]:[]), ...(d.phone?[['تلفن',d.phone]]:[])
    ].map(([label,value])=>`<div class="review-fact"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('');
    const links=(d.links||[]).map(item=>`<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.label)}</a>`).join('');
    const priceRows=prices.map(p=>`<div class="review-price-row"><div class="review-price-label"><span>${esc(p.name)}</span><b>${priceFormat(p.price)}</b></div><div class="review-price-track"><span style="width:${Math.max(9,Math.round(p.price/maxPrice*100))}%"></span></div></div>`).join('');
    return `<aside class="review-sidebar" aria-label="اطلاعات و راهنمای رستوران">
      ${emblemBox(review)}
      <section class="review-side-panel review-side-main"><h2>${esc(review.venue.name)} در یک نگاه</h2><dl class="review-facts">${facts}</dl>${d.amenities?.length?`<div class="review-side-amenities">${d.amenities.map(v=>`<div>${esc(v)}</div>`).join('')}</div>`:''}<p class="review-sidebar-note">${esc(d.hoursNote||'')}</p><div class="review-side-links">${links}</div></section>
      <section class="review-side-panel review-side-menu"><h2>منو در یک نگاه</h2>${d.menuCategories?.length?`<ul class="review-menu-categories">${d.menuCategories.map(v=>`<li>${esc(v)}</li>`).join('')}</ul>`:''}${Number.isFinite(d.menuSections)&&Number.isFinite(d.menuRows)?`<div class="review-mini-stats"><div><strong>${priceFormat(d.menuSections)}</strong><span>گروه منو</span></div><div><strong>${priceFormat(d.menuRows)}</strong><span>ردیف قیمت‌دار</span></div></div>`:'' }${prices.length?`<h3>چند قیمت شاخص <small>تومان</small></h3><div class="review-price-list">${priceRows}</div>`:'' }<p class="review-sidebar-note">${prices.length?`این‌ها نمونه قیمت‌اند، نه میانگین هر گروه. قیمت‌ها از منوی ${esc(d.menuDate||'ثبت‌شده')} ثبت شده‌اند.`:esc(d.menuNote||'برای دریافت قیمت‌های روز، منوی رستوران را بررسی کنید.')}</p>${d.menuUrl||d.links?.find(item=>item.label.includes('منو'))?.url?`<a class="review-sidebar-textlink" href="${esc(d.menuUrl||d.links.find(item=>item.label.includes('منو')).url)}" target="_blank" rel="noopener noreferrer">${esc(d.menuLinkLabel||`دیدن منوی روز ${review.venue.name} ←`)}</a>`:''}</section>
      <section class="review-side-panel review-side-hours"><h2>چه ساعتی می‌توان رفت؟</h2><p class="review-hours-lead">${esc(d.hoursLead||'ساعت فعالیت ثبت‌شده: '+d.hours)}</p>${d.hideHoursChart?'':`<div class="review-hours-graphic" role="img" aria-label="ساعت بازبودن ${esc(review.venue.name)}، نه میزان شلوغی"><div class="review-hours-chart"><span style="left:${Math.max(0,Math.min(100,((d.timeline?.start??8)-8)/18*100))}%;width:${Math.max(0,Math.min(100,((d.timeline?.end??25)-(d.timeline?.start??8))/18*100))}%"></span></div><div class="review-hours-markers"><span>۰۸</span><span>۱۲</span><span>۱۶</span><span>۲۰</span><span>۰۰</span><span>۰۲</span></div></div>`}<p class="review-sidebar-note">${d.hideHoursChart?esc(d.timelineNote||'ساعت دقیق هر شعبه را پیش از مراجعه بررسی کنید؛ ساعت‌ها در همه شعب لزوماً یکسان نیستند.'):(d.timelineNote?esc(d.timelineNote)+' ':'')+'نوار فقط ساعات بازبودن را نشان می‌دهد. داده قابل‌اتکایی از ساعت‌های شلوغی این مجموعه و همسایه‌ها برای مقایسه نداریم؛ بنابراین نمودار ازدحام منتشر نشده است.'}</p></section>
      <section class="review-side-panel review-side-editorial"><h2>نگاه مدیر</h2><p>برای فهمیدن سود واقعی منو، قیمت تنها کافی نیست؛ باید تعداد فروش و هزینه مواد هر غذا را هم دید.</p><a class="review-sidebar-textlink" href="${link('guides/menu-engineering/')}">مهندسی منو چیست؟ ←</a><a class="review-sidebar-textlink" href="${link('services/')}">خدمات بررسی و اصلاح منو ←</a></section>
    </aside>`;
  };
  const inlinePhotos=(review,photos,sectionIndex,image)=>{
    if(!review.sidebar)return '';
    const positions=({0:[1,6],2:[2,4],3:[3,5]})[sectionIndex]||[];
    const selected=positions.map(i=>photos[i]).filter(Boolean);
    if(!selected.length)return '';
    return `<div class="review-inline-photos" aria-label="تصاویر مربوط به این بخش">${selected.map((p,j)=>`<a href="${esc(p.src)}" target="_blank" rel="noopener noreferrer" aria-label="دیدن اندازه بزرگ: ${esc(p.alt)}">${image(p,j+1)}</a>`).join('')}</div>`;
  };

  const renderDossierGallery=(r)=>{
    const images=r.photoGallery||[];
    const videos=r.videoGallery||[];
    if(!images.length&&!videos.length)return '';
    const categories=[...new Set(images.map(p=>p.group||'تصاویر'))];
    const galleryId='review-gallery-'+r.slug;
    return `<section class="review-dossier-gallery" id="${esc(galleryId)}" aria-labelledby="review-gallery-heading">
      <div class="review-gallery-heading"><span class="kicker">${esc(r.galleryTitle?"اسناد تصویری":"گزارش تصویری")}</span><h2 id="review-gallery-heading">${esc(r.galleryTitle||`گالری عکس و ویدئوی ${r.venue.name}`)}</h2>
      <p>${esc(r.galleryIntro||"تصاویر و ویدئوهای ثبت‌شده از محیط مجموعه و غذاهای سرو‌شده. عکس‌ها را برای نمایش بزرگ‌تر انتخاب کنید و ویدئوها را با کنترل پخش خودتان ببینید.")}</p></div>
      ${categories.map(group=>`<div class="review-gallery-group"><h3>${esc(group)}</h3><div class="review-gallery-grid">
      ${images.map((p,i)=>({p,i})).filter(x=>(x.p.group||'تصاویر')===group).map(({p,i})=>`<a class="review-gallery-item" data-photo-index="${i}" href="${esc(p.src)}" aria-label="نمایش تصویر بزرگ: ${esc(p.alt)}">
      <figure><img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
      <figcaption>${esc(p.caption)}</figcaption></figure></a>`).join('')}</div></div>`).join('')}
      ${videos.length?`<div class="review-gallery-group"><h3>ویدئوهای مجموعه</h3><div class="review-video-grid">
      ${videos.map(v=>`<figure class="review-video-item"><video controls playsinline preload="metadata" ${v.poster?`poster="${esc(v.poster)}"`:''} aria-label="${esc(v.alt||v.caption||'ویدئوی رستوران')}"><source src="${esc(v.src)}" type="${esc(v.type||'video/mp4')}">مرورگر شما امکان پخش این ویدئو را ندارد.</video>
      <figcaption>${esc(v.caption||'نمایی از مجموعه')}</figcaption></figure>`).join('')}</div></div>`:''}
      <p class="review-gallery-note">${esc(r.galleryNote||(r.galleryTitle?"این تصویر یک سند آرشیوی با تاریخ و پدیدآورنده نامشخص است و به‌تنهایی مالکیت حقوقی یا کیفیت امروز رستوران را اثبات نمی‌کند.":"عکس‌ها و ویدئوها ثبت تصویری محیط و غذاها هستند؛ برای نتیجه‌گیری قطعی دربارهٔ کیفیت خدمات، قیمت یا طعم کافی نیستند."))}</p>
      ${images.length?`<dialog class="review-photo-modal" id="review-photo-modal" aria-label="نمایش بزرگ تصاویر">
        <button type="button" class="review-modal-close" aria-label="بستن تصویر">×</button>
        <button type="button" class="review-modal-prev" aria-label="تصویر قبلی">‹</button>
        <div class="review-modal-content"><img alt=""><p aria-live="polite"></p></div>
        <button type="button" class="review-modal-next" aria-label="تصویر بعدی">›</button>
      </dialog>`:''}
    </section>`;
  };
  for(let i=0;i<items.length;i++){
    const r=items[i];
    if(!r.body?.length||!r.publishedAt||(r.historical&&!r.sourceUrl))throw Error('Incomplete review: '+r.slug);
    const image=(p,j)=>`<figure class="review-photo"><img src="${esc(p.src)}" alt="${esc(p.alt.replace(" در نوشتهٔ آرشیوی",""))}" referrerpolicy="no-referrer" ${j?'loading="lazy"':''}>${p.caption||p.credit?`<figcaption>${p.caption?esc(p.caption):''}${p.caption&&p.credit?' · ':''}${p.credit?'عکس: '+esc(p.credit):''}</figcaption>`:''}</figure>`;
    const photos=r.photos||[];
    const body=`<section class="pagehead wrap">${crumbs([['نقدهای نیما','reviews/'],[r.venue.name,null]])}<p class="eyebrow">${esc(r.venue.city)} · ${esc(r.venue.type)}</p><h1>${esc(r.title)}</h1><p class="lead">${esc(r.summary)}</p>${r.searchAliases?.length?`<p class="muted" aria-label="نام‌های دیگر این رستوران">نام‌های دیگر: ${r.searchAliases.map(esc).join(' · ')}</p>`:''}<p class="muted"><time datetime="${r.publishedAt}">${faDate(r.publishedAt)}</time></p></section><article class="article wrap${r.sidebar?' review-article':''}">${emblemBox(r,'mobile')}${renderSidebar(r)}<div class="article-body">${photos[0]?image(photos[0],0):(r.sidebar?`<div class="review-text-hero" aria-label="${esc(r.venue.name)}؛ تصویر واقعی این رستوران هنوز به این پرونده افزوده نشده"><strong>${esc(r.venue.name)}</strong><span>${esc(r.venue.city)} · ${esc(r.venue.type)}</span></div>`:'')}${r.body.map((s,sectionIndex)=>`<section>${!r.historical&&s.h?`<h2>${esc(s.h)}</h2>`:''}${s.p.map(p=>`<p>${r.historical?esc(p):renderInline(p)}</p>`).join('')}${inlinePhotos(r,photos,sectionIndex,image)}${sectionIndex===(r.galleryAfterSection??3)?renderDossierGallery(r):''}</section>`).join('')}${photos.length>1&&!r.sidebar?`<section><h2>عکس‌های همراه نوشته</h2><div class="review-photo-grid">${photos.slice(1).map((p,j)=>image(p,j+1)).join('')}</div></section>`:''}${r.sourceUrl?`<p><a class="textlink" href="${esc(r.sourceUrl)}" target="_blank" rel="noopener noreferrer">نسخهٔ منتشرشده در ایکس ←</a></p>`:''}${["shooka-cafe","shooka-cafe-1405","gandhi-shopping-center"].includes(r.slug)?`<section class="review-related-section" aria-label="تحلیل مدیریتی کافه شوکا"><h2>تحلیل مدیریتی مرتبط</h2><p>بررسی مستند روش‌های یارعلی پورمقدم در شناخت مشتری، قصه‌گویی، ساختن حس تعلق و وفاداری به کافه شوکا.</p><p><a class="textlink" href="${link("reading/yarali-pourmoghadam-shooka-cafe-management/")}">یارعلی پورمقدم و کافه شوکا؛ ۱۰ درس مدیریت و وفاداری مشتری ←</a></p></section>`:""}${r.relatedSlugs?.length?`<section class="review-related-section"><h2>مطالب مرتبط</h2><div class="cards three">${r.relatedSlugs.map(slug=>items.find(x=>x.slug===slug)).filter(Boolean).map(card).join('')}</div><p><a class="textlink" href="${link('guides/menu-engineering/')}">راهنمای مهندسی منوی رستوران ←</a></p></section>`:''}<nav class="related" aria-label="نوشته‌های دیگر"><h2>نوشته‌های دیگر</h2>${[items[i-1],items[i+1]].filter(Boolean).map(x=>`<a href="${link(url(x))}">${esc(x.title)} ←</a>`).join('')}<a href="${link('reviews/')}">همهٔ نقدها</a></nav>${comment(r.title,{kind:"review",venue:r.venue.name})}</div></article>`;
    add(url(r),r.seoTitle||r.title,r.seoDescription||r.summary,body,{image:r.photos?.[0]?.src||"",lastmod:r.updatedAt||r.publishedAt,script:(r.photoGallery?.length||r.videoGallery?.length)?'assets/review-gallery.js':'',structured:[
      {'@context':'https://schema.org','@type':'Article',headline:r.title,description:r.seoDescription||r.summary,datePublished:r.publishedAt,...(r.updatedAt?{dateModified:r.updatedAt}:{}),inLanguage:'fa',
        mainEntityOfPage:'https://nimania.net/'+url(r),
        ...(r.category==='food'?{about:{'@type':'Restaurant',name:r.venue.name,
          ...(r.searchAliases?.length?{alternateName:r.searchAliases}:{}),
          address:{'@type':'PostalAddress',addressLocality:r.venue.city,addressCountry:'IR'}}}:{}),
        image:[...(r.photos?.[0]?[r.photos[0]]:[]),...(r.photoGallery||[]).slice(0,5)].map(p=>absImageUrl(p.src)),
        author:{'@type':'Person',name:'نیما افشارنادری'},...(r.sourceUrl?{isBasedOn:r.sourceUrl}:{}),
        publisher:{'@type':'Organization',name:'نیما داینر',logo:{'@type':'ImageObject',url:'https://nimania.github.io/nimasdiner/assets/logo-512.png'}}},
      ...(r.photoGallery?.length?[{'@context':'https://schema.org','@type':'ImageGallery',name:'گالری عکس‌های '+r.venue.name,
        url:'https://nimania.github.io/nimasdiner/'+url(r)+'#review-gallery-'+r.slug,inLanguage:'fa',
        associatedMedia:r.photoGallery.map(p=>({'@type':'ImageObject',contentUrl:absImageUrl(p.src),
           name:p.caption,description:p.alt,caption:p.caption}))}]:[]),
      ...(r.videoGallery||[]).map(v=>({'@context':'https://schema.org','@type':'VideoObject',
        name:v.caption||'ویدئوی '+r.venue.name,description:v.alt||v.caption||r.summary,
        contentUrl:absImageUrl(v.src),thumbnailUrl:absImageUrl(v.poster||r.photos?.[0]?.src),
        uploadDate:v.uploadDate,inLanguage:'fa',duration:'PT2S'}))
    ]});
  }
  return {cards:items.filter(r=>r.category!=='city').slice(0,3).map(card).join('')};
}
