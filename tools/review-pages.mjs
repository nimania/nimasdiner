export function renderReviews({reviews, add, section, crumbs, link, esc, comment}) {
  const items=reviews.reviews.filter(r=>r.status==='published').sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  const faDate=s=>new Intl.DateTimeFormat('fa-IR',{dateStyle:'long',timeZone:'UTC'}).format(new Date(s+'T12:00:00Z'));
  const url=r=>'reviews/'+r.slug+'/';
  const card=r=>`<article class="card review-card" data-review-category="${esc(r.category)}" data-review-city="${esc(r.venue.city)}" data-review-type="${esc(r.venue.type)}"><a class="review-cover" href="${link(url(r))}">${r.photos?.length?`<img src="${esc(r.photos[0].src)}" alt="${esc(r.photos[0].alt.replace(" در نوشتهٔ آرشیوی",""))}" loading="lazy" width="640" height="420">`:`<span class="review-cover-text">${esc(r.venue.name)}</span>`}</a><div class="review-card-body"><span class="kicker">${esc(r.venue.city)} · ${esc(r.venue.type)}</span><h3><a href="${link(url(r))}">${esc(r.title)}</a></h3><p>${esc(r.summary)}</p><div class="card-meta"><time datetime="${r.publishedAt}">${faDate(r.publishedAt)}</time><a class="textlink" href="${link(url(r))}">خواندن نقد ←</a></div></div></article>`;
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
      ['نوع مجموعه',review.venue.type]
    ].map(([label,value])=>`<div class="review-fact"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('');
    const links=(d.links||[]).map(item=>`<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.label)}</a>`).join('');
    const priceRows=prices.map(p=>`<div class="review-price-row"><div class="review-price-label"><span>${esc(p.name)}</span><b>${priceFormat(p.price)}</b></div><div class="review-price-track"><span style="width:${Math.max(9,Math.round(p.price/maxPrice*100))}%"></span></div></div>`).join('');
    return `<aside class="review-sidebar" aria-label="اطلاعات و راهنمای رستوران">
      <section class="review-side-panel review-side-main"><h2>آفساید در یک نگاه</h2><dl class="review-facts">${facts}</dl><p class="review-sidebar-note">${esc(d.hoursNote||'')}</p><div class="review-side-links">${links}</div></section>
      <section class="review-side-panel review-side-menu"><h2>منو در یک نگاه</h2><div class="review-mini-stats"><div><strong>${priceFormat(d.menuSections)}</strong><span>گروه منو</span></div><div><strong>${priceFormat(d.menuRows)}</strong><span>ردیف قیمت‌دار</span></div></div><h3>چند قیمت شاخص <small>تومان</small></h3><div class="review-price-list">${priceRows}</div><p class="review-sidebar-note">این‌ها نمونه قیمت‌اند، نه میانگین هر گروه. قیمت‌ها از منوی ${esc(d.menuDate)} ثبت شده‌اند.</p><a class="review-sidebar-textlink" href="https://sepidz.menu/caferestaurant/offside" target="_blank" rel="noopener noreferrer">دیدن منوی روز آفساید ←</a></section>
      <section class="review-side-panel review-side-hours"><h2>چه ساعتی می‌توان رفت؟</h2><p class="review-hours-lead">از صبحانه تا آخر شب؛ حدود <strong>۱۷ ساعت</strong> فعالیت روزانه.</p><div class="review-hours-graphic" role="img" aria-label="فعالیت آفساید از ساعت ۸ صبح تا حدود ۱ بامداد؛ این نمودار شلوغی نیست"><div class="review-hours-chart"><span></span></div><div class="review-hours-markers"><span>۰۸</span><span>۱۲</span><span>۱۶</span><span>۲۰</span><span>۰۰</span><span>۰۲</span></div></div><p class="review-sidebar-note">نوار فقط ساعات بازبودن را نشان می‌دهد. داده قابل‌اتکایی از ساعت‌های شلوغی آفساید و همسایه‌ها برای مقایسه نداریم؛ بنابراین نمودار ازدحام منتشر نشده است.</p></section>
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

  for(let i=0;i<items.length;i++){
    const r=items[i];
    if(!r.body?.length||!r.publishedAt||(r.historical&&!r.sourceUrl))throw Error('Incomplete review: '+r.slug);
    const image=(p,j)=>`<figure class="review-photo"><img src="${esc(p.src)}" alt="${esc(p.alt.replace(" در نوشتهٔ آرشیوی",""))}" ${j?'loading="lazy"':''}>${p.caption||p.credit?`<figcaption>${p.caption?esc(p.caption):''}${p.caption&&p.credit?' · ':''}${p.credit?'عکس: '+esc(p.credit):''}</figcaption>`:''}</figure>`;
    const photos=r.photos||[];
    const body=`<section class="pagehead wrap">${crumbs([['نقدهای نیما','reviews/'],[r.venue.name,null]])}<p class="eyebrow">${esc(r.venue.city)} · ${esc(r.venue.type)}</p><h1>${esc(r.title)}</h1><p class="lead">${esc(r.summary)}</p><p class="muted"><time datetime="${r.publishedAt}">${faDate(r.publishedAt)}</time></p></section><article class="article wrap${r.sidebar?' review-article':''}">${renderSidebar(r)}<div class="article-body">${photos[0]?image(photos[0],0):''}${r.body.map((s,sectionIndex)=>`<section>${!r.historical&&s.h?`<h2>${esc(s.h)}</h2>`:''}${s.p.map(p=>`<p>${r.historical?esc(p):renderInline(p)}</p>`).join('')}${inlinePhotos(r,photos,sectionIndex,image)}</section>`).join('')}${photos.length>1&&!r.sidebar?`<section><h2>عکس‌های همراه نوشته</h2><div class="review-photo-grid">${photos.slice(1).map((p,j)=>image(p,j+1)).join('')}</div></section>`:''}${r.sourceUrl?`<p><a class="textlink" href="${esc(r.sourceUrl)}" target="_blank" rel="noopener noreferrer">نسخهٔ منتشرشده در ایکس ←</a></p>`:''}${r.relatedSlugs?.length?`<section class="review-related-section"><h2>مطالب مرتبط</h2><div class="cards three">${r.relatedSlugs.map(slug=>items.find(x=>x.slug===slug)).filter(Boolean).map(card).join('')}</div><p><a class="textlink" href="${link('guides/menu-engineering/')}">راهنمای مهندسی منوی رستوران ←</a></p></section>`:''}<nav class="related" aria-label="نوشته‌های دیگر"><h2>نوشته‌های دیگر</h2>${[items[i-1],items[i+1]].filter(Boolean).map(x=>`<a href="${link(url(x))}">${esc(x.title)} ←</a>`).join('')}<a href="${link('reviews/')}">همهٔ نقدها</a></nav>${comment(r.title)}</div></article>`;
    add(url(r),r.title,r.summary,body,{image:r.photos?.[0]?.src||"",lastmod:r.publishedAt,structured:{'@context':'https://schema.org','@type':'Article',headline:r.title,description:r.summary,datePublished:r.publishedAt,inLanguage:'fa',image:r.photos?.[0]?.src?('https://nimania.github.io'+r.photos[0].src):undefined,author:{'@type':'Person',name:'نیما افشارنادری'},...(r.sourceUrl?{isBasedOn:r.sourceUrl}:{}),publisher:{'@type':'Organization',name:'نیما داینر',logo:{'@type':'ImageObject',url:'https://nimania.github.io/nimasdiner/assets/logo-512.png'}}}});
  }
  return {cards:items.filter(r=>r.category!=='city').slice(0,3).map(card).join('')};
}
