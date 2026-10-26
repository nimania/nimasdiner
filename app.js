const dialog=document.querySelector('#preview');
if(dialog){for(const button of document.querySelectorAll('[data-image]'))button.addEventListener('click',()=>{const image=dialog.querySelector('img');image.src=button.dataset.image;image.alt=button.dataset.title;dialog.querySelector('p').textContent=button.dataset.title;dialog.showModal()});dialog.querySelector('.close-preview').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}})}
// Native POST: download is shown only after the form provider redirects.
// Never save visitors' contact details in localStorage, URLs, or the public repo.
const form=document.querySelector('#book-form');
if(form){form.addEventListener('submit',()=>{const button=form.querySelector('[type=submit]');button.disabled=true;button.textContent='در حال ارسال…'});window.addEventListener('pageshow',()=>{const button=form.querySelector('[type=submit]');button.disabled=false;button.innerHTML='ثبت اطلاعات و دریافت کتاب <span aria-hidden="true">←</span>'})}
