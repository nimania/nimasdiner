// Native POST: download is shown only after the form provider redirects.
// Never save visitors' contact details in localStorage, URLs, or the public repo.
const form=document.querySelector('#book-form');
if(form){form.addEventListener('submit',()=>{const button=form.querySelector('[type=submit]');button.disabled=true;button.textContent='در حال ارسال…'});window.addEventListener('pageshow',()=>{const button=form.querySelector('[type=submit]');button.disabled=false;button.innerHTML='ثبت اطلاعات و دریافت کتاب <span aria-hidden="true">←</span>'})}

const region=document.querySelector('#location-region');
if(region){const countryField=document.querySelector('#country-field');const country=document.querySelector('#country');function updateCountry(){const outside=region.value==='outside_iran';countryField.hidden=!outside;country.disabled=!outside;if(!outside)country.value='';}region.addEventListener('change',updateCountry);window.addEventListener('pageshow',updateCountry);updateCountry();}
