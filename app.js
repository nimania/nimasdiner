// Native HTML form submission is intentionally used for reliable PDF delivery.
// The delivery service returns a PDF attachment after saving the visitor to the private Sheet.
// No localStorage, client-side contact-data caching, CORS request, or intermediate page.
const form=document.querySelector('#book-form');
if(form){
  const button=form.querySelector('[type="submit"]');
  const initial=button.innerHTML;
  let resetHandle;
  function reset(){button.disabled=false;button.innerHTML=initial;clearTimeout(resetHandle);}
  form.addEventListener('submit',event=>{
    if(!form.reportValidity()){event.preventDefault();return;}
    button.disabled=true;
    button.textContent='در حال ثبت اطلاعات و دریافت کتاب…';
    // A successful attachment download does not navigate away; restore the submit control.
    clearTimeout(resetHandle);
    resetHandle=setTimeout(reset,12000);
  });
  window.addEventListener('pageshow',reset);
}
