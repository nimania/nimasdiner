// The book is downloaded on the same page; contact details are never stored client-side.
const form=document.querySelector('#book-form');
if(form){
  const button=form.querySelector('[type="submit"]');
  const initial=button.innerHTML;
  const status=document.createElement('p');
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  status.className='form-footnote';
  button.insertAdjacentElement('afterend',status);
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!form.reportValidity()||button.disabled)return;
    button.disabled=true;
    button.textContent='در حال ثبت و آماده‌سازی کتاب…';
    status.textContent='اطلاعات شما به‌صورت خصوصی ثبت می‌شود و دانلود کتاب پس از آن آغاز خواهد شد.';
    try{
      const payload=new URLSearchParams(new FormData(form));
      const api=form.action.replace(/\/register\/?$/,'/api/register');
      const response=await fetch(api,{method:'POST',body:payload,mode:'cors',cache:'no-store'});
      if(!response.ok||!(response.headers.get('content-type')||'').includes('application/pdf'))throw new Error('DOWNLOAD_FAILED');
      const blob=await response.blob();
      if(blob.size<1000||blob.type!=='application/pdf')throw new Error('INVALID_PDF');
      const url=URL.createObjectURL(blob);
      const link=document.createElement('a');
      link.href=url;
      link.download='NimasDiner-Restaurant-Handbook.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      status.textContent='ثبت انجام شد و دانلود کتاب آغاز شده است.';
      setTimeout(()=>URL.revokeObjectURL(url),60000);
    }catch(error){
      // Retain the existing form flow as a compatibility fallback.
      status.textContent='در حال انتقال به مسیر جایگزین دانلود…';
      form.submit();
      return;
    }finally{
      button.disabled=false;
      button.innerHTML=initial;
    }
  });
  window.addEventListener('pageshow',()=>{button.disabled=false;button.innerHTML=initial;});
}
