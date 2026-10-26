// Native POST: download is shown only after the form provider redirects.
// Never save visitors' contact details in localStorage, URLs, or the public repo.
const form=document.querySelector('#book-form');
if(form){form.addEventListener('submit',()=>{const button=form.querySelector('[type=submit]');button.disabled=true;button.textContent='در حال ارسال…'});window.addEventListener('pageshow',()=>{const button=form.querySelector('[type=submit]');button.disabled=false;button.innerHTML='ثبت اطلاعات و دریافت کتاب <span aria-hidden="true">←</span>'})}
