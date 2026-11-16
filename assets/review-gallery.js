(() => {
  "use strict";
  // The WordPress.com media API and the public CDN expose different valid
  // addresses. Retry a different media host before showing a broken image.
  const wpMediaCandidates=src=>{
    try{
      const u=new URL(src,location.href);
      let name='';
      if(u.hostname==='nimania.files.wordpress.com' && u.pathname.startsWith('/2026/11/'))
        name=u.pathname.slice('/2026/11/'.length);
      else if(u.hostname==='nimania.wordpress.com' && u.pathname.startsWith('/wp-content/uploads/2026/11/'))
        name=u.pathname.slice('/wp-content/uploads/2026/11/'.length);
      if(!name)return [];
      const urls=[
        'https://nimania.files.wordpress.com/2026/11/'+name,
        'https://nimania.wordpress.com/wp-content/uploads/2026/11/'+name,
        'https://i0.wp.com/nimania.files.wordpress.com/2026/11/'+name,
        'https://i0.wp.com/nimania.wordpress.com/wp-content/uploads/2026/11/'+name
      ];
      return [...new Set(urls)].filter(x=>x!==src);
    }catch{return []}
  };
  for(const img of document.querySelectorAll('img')){
    const start=img.getAttribute('src')||'';
    const candidates=[...wpMediaCandidates(start)];
    const local=img.dataset.localFallback;
    if(local)candidates.push(local);
    if(!candidates.length)continue;
    let index=0;
    const link=img.closest('a[data-photo-index]');
    img.addEventListener('error',()=>{
      if(index<candidates.length){
        img.src=candidates[index++];
      }else{
        img.classList.add('review-image-unavailable');
        const parent=img.closest('.review-gallery-item,.review-photo,.review-emblem-art,.review-cover');
        if(parent)parent.classList.add('review-image-unavailable-card');
        const alert=document.createElement('span');
        alert.className='review-image-error-text';
        alert.textContent='تصویر فعلاً قابل نمایش نیست';
        img.insertAdjacentElement('afterend',alert);
        img.hidden=true;
        if(link){link.removeAttribute('href');link.setAttribute('aria-disabled','true')}
      }
    });
    img.addEventListener('load',()=>{
      if(link && img.currentSrc)link.href=img.currentSrc;
    });
  }
  const gallery=document.querySelector(".review-dossier-gallery");
  const dialog=document.getElementById("review-photo-modal");
  if(!gallery||!dialog||typeof dialog.showModal!=="function")return;
  const links=[...gallery.querySelectorAll("a[data-photo-index]")];
  const preview=dialog.querySelector(".review-modal-content img");
  const caption=dialog.querySelector(".review-modal-content p");
  const close=dialog.querySelector(".review-modal-close");
  let current=0,returnFocus=null;
  const show=i=>{
    current=(i+links.length)%links.length;
    const link=links[current],image=link.querySelector("img");
    preview.src=image?.currentSrc||link.href;
    preview.alt=image?.alt||"تصویر رستوران";
    caption.textContent=(link.querySelector("figcaption")?.textContent||"")+" · "+(current+1)+" از "+links.length;
  };
  links.forEach((link,index)=>link.addEventListener("click",event=>{
    event.preventDefault();if(!link.hasAttribute("href"))return;returnFocus=link;show(index);
    dialog.showModal();close.focus();
  }));
  close.addEventListener("click",()=>dialog.close());
  dialog.querySelector(".review-modal-prev").addEventListener("click",()=>show(current-1));
  dialog.querySelector(".review-modal-next").addEventListener("click",()=>show(current+1));
  dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
  dialog.addEventListener("keydown",event=>{
    if(event.key==="ArrowLeft"){event.preventDefault();show(current+1)}
    if(event.key==="ArrowRight"){event.preventDefault();show(current-1)}
  });
  dialog.addEventListener("close",()=>{preview.removeAttribute("src");returnFocus?.focus()});
})();
