import fs from "node:fs";
import path from "node:path";

export function loadPromptExamples(prompts) {
  const file=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content/prompt-examples.json"),"utf8"));
  if(file.version!==1||!Array.isArray(file.entries))throw Error("Prompt examples schema mismatch");
  const validSlugs=new Set(prompts.map(p=>p.slug));
  const examples=new Map();
  for(const ex of file.entries) {
    if(!validSlugs.has(ex.slug)||examples.has(ex.slug))throw Error("Unknown or duplicate example: "+ex.slug);
    if(!["photo","design","text"].includes(ex.kind)||!ex.title||!ex.note)throw Error("Invalid example: "+ex.slug);
    if(ex.kind==="text") {
      if(!ex.output||!ex.input)throw Error("Incomplete text example: "+ex.slug);
    }else if(!Number.isInteger(ex.slot)||ex.slot<0||ex.slot>5||!ex.alt||!ex.caption){
      throw Error("Invalid photo contact-sheet slot: "+ex.slug);
    }
    examples.set(ex.slug,ex);
  }
  return {examples,updated:file.updated,artwork:file.artwork};
}

export function promptExampleThumbnail(ex,esc) {
  if(!ex)return "";
  if(ex.kind==="text")return '<span class="prompt-example-flag prompt-example-flag--text">نمونه پاسخ</span>';
  return '<span class="prompt-example-flag">نمونه تصویری</span><span class="prompt-card-photo" data-slot="'+ex.slot+'"></span>';
}

export function renderPromptExample(ex,{esc,link}) {
  if(!ex)return "";
  const headline='<div class="prompt-example-head"><div><p class="prompt-overline">SAMPLE OUTPUT</p><h2 id="prompt-example-heading">نمونه خروجی</h2><p>'+esc(ex.title)+'</p></div><span class="prompt-example-kind">'+(ex.kind==="text"?"متن نمونه":ex.kind==="design"?"ماکت تبلیغاتی":"تصویر مفهومی")+'</span></div>';
  let content;
  if(ex.kind==="text"){
    content='<div class="prompt-example-text-grid"><div class="prompt-example-input"><strong>اطلاعات فرضیِ ورودی</strong><p>'+esc(ex.input)+'</p></div>'+
      '<div class="prompt-example-output"><strong>یک نمونه پاسخ</strong><pre dir="rtl">'+esc(ex.output)+'</pre><button type="button" class="prompt-copy-btn prompt-copy-example-btn" data-copy-prompt="#sample-output-text">کپی این نمونه</button><span id="sample-output-text" hidden>'+esc(ex.output)+'</span></div></div>';
  }else{
    const overlay=ex.kind==="design"?'<div class="prompt-design-overlay"><small>'+esc(ex.subline)+'</small><strong>'+esc(ex.headline)+'</strong></div>':"";
    content='<figure class="prompt-example-figure"><div class="prompt-example-picture '+(ex.kind==="design"?"prompt-example-picture--design":"")+'"><div class="prompt-sample-image" data-slot="'+ex.slot+'" role="img" aria-label="'+esc(ex.alt)+'"></div>'+overlay+'</div><figcaption>'+esc(ex.caption)+'</figcaption></figure>';
  }
  return '<section class="wrap prompt-example-section" aria-labelledby="prompt-example-heading">'+headline+content+
    '<p class="prompt-example-disclosure"><strong>توجه:</strong> '+esc(ex.note)+
    (ex.kind==="text"?" نمونه خروجی براساس اطلاعات فرضی تهیه شده است.":" تصویر، نمونه مفهومی برای آشنایی با سبک خروجی است، نه نتیجه تضمینی اجرای دقیق این پرامپت یا عکسی از کسب‌وکار واقعی.")+
    '</p></section>';
}
