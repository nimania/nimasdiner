document.addEventListener("DOMContentLoaded",function(){
  const query=document.getElementById("prompt-query");
  const cards=[...document.querySelectorAll("#prompt-results .prompt-card")];
  if(query&&cards.length){
    let category="all";
    const type=document.getElementById("prompt-type");
    const count=document.getElementById("prompt-count");
    const empty=document.getElementById("prompt-empty");
    const faNumber=n=>new Intl.NumberFormat("fa-IR").format(n);
    function normalize(s){return String(s||"").toLocaleLowerCase("fa").replace(/[يى]/g,"ی").replace(/ك/g,"ک").replace(/\u200c/g," ").trim();}
    function update(){
      const needle=normalize(query.value);
      let shown=0;
      for(const card of cards){
        const ok=(category==="all"||card.dataset.category===category)
          &&(!type||type.value==="all"||card.dataset.type===type.value)
          &&(!needle||normalize(card.dataset.search).includes(needle));
        card.hidden=!ok;
        if(ok)shown++;
      }
      if(count)count.textContent=faNumber(shown)+" نتیجه";
      if(empty)empty.hidden=shown>0;
    }
    query.addEventListener("input",update);
    if(type)type.addEventListener("change",update);
    document.querySelectorAll("[data-prompt-category]").forEach(btn=>btn.addEventListener("click",function(){
      category=btn.dataset.promptCategory;
      document.querySelectorAll("[data-prompt-category]").forEach(b=>{
        const active=b===btn;
        b.classList.toggle("selected",active);
        b.setAttribute("aria-pressed",String(active));
      });
      update();
    }));
    update();
  }
  document.querySelectorAll("[data-copy-prompt]").forEach(btn=>btn.addEventListener("click",async function(){
    const target=document.querySelector(btn.dataset.copyPrompt);
    const status=document.getElementById("prompt-copy-status");
    if(!target)return;
    try{
      if(!navigator.clipboard||!navigator.clipboard.writeText)throw Error("clipboard unavailable");
      await navigator.clipboard.writeText(target.textContent.trim());
      if(status)status.textContent="پرامپت کپی شد. حالا می‌توانید آن را شخصی‌سازی کنید.";
      btn.textContent="کپی شد ✓";
    }catch(e){
      if(status)status.textContent="کپی خودکار ممکن نبود؛ متن را انتخاب و دستی کپی کنید.";
      target.focus();
      const selection=window.getSelection(),range=document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();selection.addRange(range);
    }
  }));
});
