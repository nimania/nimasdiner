(() => {
  "use strict";
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
    preview.src=link.href;
    preview.alt=image?.alt||"تصویر رستوران";
    caption.textContent=(link.querySelector("figcaption")?.textContent||"")+" · "+(current+1)+" از "+links.length;
  };
  links.forEach((link,index)=>link.addEventListener("click",event=>{
    event.preventDefault();returnFocus=link;show(index);
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
