// One server-rendered navigation component for long-form articles and guides.
// Desktop: right rail. Mobile: horizontal, keyboard-accessible quick links.
// The same <a href> destinations are present in HTML for both layouts.
export function renderKnowledgeSidebar({headings=[],related=[],link,esc}) {
  const toc=headings.slice(0,7).map((heading,i)=>({
    href:"#section-"+(i+1),label:String(heading||"بخش "+(i+1))
  }));
  const seen=new Set();
  const resources=related.filter(item=>{
    if(!item?.path||!item?.label||seen.has(item.path))return false;
    seen.add(item.path);
    return true;
  }).slice(0,5);
  if(!toc.length&&!resources.length)return "";
  const anchor=(href,label)=>'<a href="'+esc(href)+'">'+esc(label)+'</a>';
  return '<aside class="knowledge-sidebar" aria-label="دسترسی سریع به بخش‌ها و منابع مرتبط">'+
      '<p class="knowledge-side-heading">دسترسی سریع</p>'+
      '<nav class="knowledge-side-nav" aria-label="فهرست بخش‌های این مطلب و منابع مرتبط">'+
        (toc.length?'<div class="knowledge-side-group"><span class="knowledge-side-label">در این مطلب</span>'+
          toc.map(item=>anchor(item.href,item.label)).join("")+'</div>':"")+
        (resources.length?'<div class="knowledge-side-group knowledge-side-resources"><span class="knowledge-side-label">بخش‌های مرتبط</span>'+
          resources.map(item=>anchor(link(item.path),item.label)).join("")+'</div>':"")+
      '</nav>'+
    '</aside>';
}
