#!/usr/bin/env python3
"""Build ten reflowable, RTL Persian EPUB 3 editorial companions.
Public original commentary only: no copyrighted book text is reproduced.
"""
import json
import html
import pathlib
import zipfile
from xml.etree import ElementTree as ET

ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/"site-dist"
books=json.loads((ROOT/"content/world-books.json").read_text(encoding="utf-8"))["books"]
reviews_data=json.loads((ROOT/"content/world-book-reviews.json").read_text(encoding="utf-8"))
reviews={r["slug"]:r for r in reviews_data["reviews"]}
E=lambda x:html.escape(str(x),quote=True)
def xml_doc(title,body):
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fa" lang="fa" dir="rtl">
<head><meta charset="utf-8"/><title>{E(title)}</title><link rel="stylesheet" type="text/css" href="styles.css"/></head>
<body>{body}</body></html>'''
def build(book):
    slug=book["slug"];r=reviews[slug]
    chapters=[("معرفی و شناسنامه",f'<h1>{E(book["title"])}</h1><p class="subtitle" dir="ltr">{E(book["original"])}</p><p>نویسنده: {E(book["author"])} | ناشر: {E(book["publisher"])}</p><h2>جان کلام</h2><p>{E(r["thesis"])}</p><p class="notice">{E(reviews_data["editorialPolicy"])}</p>')]
    for x in r["sections"]:
        chapters.append((x["heading"],f'<h1>{E(x["heading"])}</h1><p>{E(x["body"])}</p>'))
    chapters.append(("درس‌ها و تمرین‌ها",'<h1>نکات کاربردی</h1><ul>'+''.join('<li>'+E(x)+'</li>' for x in r["insights"])+'</ul><h2>تمرین اجرایی</h2><ol>'+''.join('<li><strong>'+E(x["label"])+'</strong>: '+E(x["task"])+'</li>' for x in r["plan"])+'</ol><h2>مخاطب مناسب</h2><p>'+E(r["audience"])+'</p><h2>محدودیت‌ها</h2><p>'+E(r["limitations"])+'</p>'))
    chapters.append(("منابع و حقوق نشر",'<h1>منابع بررسی</h1><ul>'+''.join('<li><a href="'+E(x["url"])+'">'+E(x["label"])+'</a></li>' for x in r["sources"])+'</ul><p>این اثر، تحلیل مستقل نیما داینر است و جایگزین کتاب اصلی یا ترجمه آن نیست.</p>'))
    nav='<nav epub:type="toc" id="toc"><h1>فهرست مطالب</h1><ol>'+''.join(f'<li><a href="chapter{i}.xhtml">{E(title)}</a></li>' for i,(title,_) in enumerate(chapters,1))+'</ol></nav>'
    nav=nav.replace('<nav epub:type','<nav xmlns:epub="http://www.idpf.org/2007/ops" epub:type')
    manifest=''.join(f'<item id="c{i}" href="chapter{i}.xhtml" media-type="application/xhtml+xml"/>' for i in range(1,len(chapters)+1))
    spine=''.join(f'<itemref idref="c{i}"/>' for i in range(1,len(chapters)+1))
    opf=f'''<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="fa" prefix="dcterms: http://purl.org/dc/terms/">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="uid">urn:nimania:world-food-review:{E(slug)}</dc:identifier>
<dc:title>{E(book["title"])} — مرور مستقل نیما داینر</dc:title>
<dc:language>fa</dc:language>
<dc:creator>تحریریه نیما داینر</dc:creator>
<dc:description>{E(r["thesis"])}</dc:description>
<dc:publisher>نیما داینر</dc:publisher>
<meta property="dcterms:modified">2026-11-22T00:00:00Z</meta>
</metadata>
<manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="styles.css" media-type="text/css"/>{manifest}</manifest>
<spine page-progression-direction="rtl">{spine}</spine>
</package>'''
    css='''html{direction:rtl}body{direction:rtl;text-align:right;font-family:"Vazirmatn","Noto Naskh Arabic",sans-serif;line-height:1.95;margin:1em}h1{font-size:1.6em;line-height:1.6}h2{font-size:1.2em}p,li{line-height:1.95}li{margin-bottom:.65em}.notice{border-right:4px solid #e7b400;background:#fff8d7;padding:1em}.subtitle{font-size:.85em;color:#555;direction:ltr;text-align:right}a{color:#825010}'''
    path=OUT/"books"/book["group"]/slug/"summary.epub"
    path.parent.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(path,"w") as z:
        z.writestr("mimetype","application/epub+zip",compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml",'<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>')
        z.writestr("OEBPS/content.opf",opf)
        z.writestr("OEBPS/styles.css",css)
        z.writestr("OEBPS/nav.xhtml",xml_doc("فهرست",nav))
        for i,(title,body) in enumerate(chapters,1):
            z.writestr(f"OEBPS/chapter{i}.xhtml",xml_doc(title,body))
    with zipfile.ZipFile(path) as z:
        assert z.namelist()[0]=="mimetype"
        assert z.read("mimetype")==b"application/epub+zip"
        assert z.testzip() is None
        for name in z.namelist():
            if name.endswith((".xhtml",".opf",".xml")):
                ET.fromstring(z.read(name))
    print("EPUB",path.relative_to(OUT),path.stat().st_size)

def build_reader():
    entries=[{"slug":b["slug"],"group":b["group"],"title":b["title"],"author":b["author"]} for b in books]
    catalog=json.dumps(entries,ensure_ascii=False).replace("<","\\u003c")
    page=r'''<!doctype html>
<html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>کتابخوان EPUB فارسی | نیما داینر</title>
<meta name="description" content="مطالعه آنلاین و رایگان مرورهای تحلیلی کتابخانه جهان غذا">
<style>
:root{color-scheme:light}*{box-sizing:border-box}body{font-family:Vazirmatn,Tahoma,sans-serif;margin:0;background:#f4f1e8;color:#242424}
header{background:#ffce28;padding:12px 20px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
header a{color:inherit;font-weight:700}header strong{margin-left:auto}
button,select{font:inherit;padding:8px 12px;border:1px solid #aaa;border-radius:9px;background:white;color:#222}
button{cursor:pointer}button:disabled{opacity:.45;cursor:not-allowed}
#book{background:white;max-width:850px;height:calc(100dvh - 135px);min-height:320px;margin:15px auto;border-radius:12px;box-shadow:0 3px 18px #0001;overflow:hidden}
#message{text-align:center;padding:18px}.tools{display:flex;align-items:center;gap:8px;justify-content:center;flex-wrap:wrap}
footer{text-align:center;padding:4px 12px;font-size:12px;color:#666}
@media(max-width:650px){#book{height:calc(100dvh - 175px);margin:6px;border-radius:4px}header{padding:8px}header strong{width:100%}}
</style>
<script defer src="https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js"></script>
</head><body>
<header><a href="/books/">کتابخانه جهان غذا</a><strong>کتابخوان فارسی نیما داینر</strong>
<label for="books">کتاب</label><select id="books" aria-label="انتخاب کتاب"></select>
<button id="smaller" aria-label="کوچک کردن قلم">الف −</button><button id="larger" aria-label="بزرگ کردن قلم">الف +</button>
<button id="night">حالت شب</button></header>
<div id="message" role="status">در حال آماده‌سازی کتابخوان...</div>
<main id="book" aria-label="متن کتاب"></main>
<div class="tools"><button id="prev">صفحه قبل</button><span id="progress">—</span><button id="next">صفحه بعد</button><a id="download" download>دریافت EPUB</a></div>
<footer>مرور مستقل تحریریه نیما داینر؛ برای خواندن کتاب اصلی به ناشر مراجعه کنید. پیشرفت مطالعه در همین مرورگر ذخیره می‌شود.</footer>
<script>
const catalog=__CATALOG__;
const select=document.getElementById('books');
for(const item of catalog){const opt=document.createElement('option');opt.value=item.slug;opt.textContent=item.title+' — '+item.author;select.append(opt)}
const params=new URLSearchParams(location.search);
let chosen=catalog.find(x=>x.slug===params.get('book'))||catalog[0];
select.value=chosen.slug;
let book=null,rendition=null,size=100,night=false,saveKey='';
const message=document.getElementById('message');
async function openBook(slug){
  const item=catalog.find(x=>x.slug===slug);if(!item)return;
  chosen=item;select.value=slug;saveKey='diner-epub-'+slug;
  history.replaceState(null,'','?book='+encodeURIComponent(slug));
  if(book){try{book.destroy()}catch(e){}book=null}
  document.getElementById('book').replaceChildren();
  message.textContent='در حال باز کردن مرور «'+item.title+'»...';
  const url='/books/'+item.group+'/'+item.slug+'/summary.epub';
  document.getElementById('download').href=url;
  try{
    if(typeof ePub!=='function')throw new Error('کتابخوان بارگذاری نشد؛ فایل EPUB را دریافت کنید.');
    book=ePub(url);
    rendition=book.renderTo('book',{width:'100%',height:'100%',flow:'paginated',spread:'none'});
    rendition.themes.fontSize(size+'%');
    rendition.themes.default({'body':{'direction':'rtl','text-align':'right'}});
    await rendition.display();
    rendition.on('relocated',loc=>{
      document.getElementById('progress').textContent='در حال مطالعه';
      if(loc?.start?.cfi){try{localStorage.setItem(saveKey,loc.start.cfi)}catch(e){}}
    });
    let previous=null;try{previous=localStorage.getItem(saveKey)}catch(e){}
    if(previous){try{await rendition.display(previous)}catch(e){}}
    message.textContent='';
  }catch(err){message.textContent=err.message||'خطا در باز کردن کتاب؛ از لینک دریافت EPUB استفاده کنید.'}
}
select.addEventListener('change',()=>openBook(select.value));
document.getElementById('next').onclick=()=>rendition?.next();
document.getElementById('prev').onclick=()=>rendition?.prev();
document.getElementById('larger').onclick=()=>{size=Math.min(180,size+10);rendition?.themes.fontSize(size+'%')};
document.getElementById('smaller').onclick=()=>{size=Math.max(70,size-10);rendition?.themes.fontSize(size+'%')};
document.getElementById('night').onclick=()=>{night=!night;document.getElementById('book').style.background=night?'#191919':'white';rendition?.themes.override('color',night?'#f0e8d6':'#242424');rendition?.themes.override('background',night?'#191919':'white')};
window.addEventListener('load',()=>openBook(chosen.slug));
</script></body></html>'''
    path=OUT/"books"/"reader"/"index.html"
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(page.replace("__CATALOG__",catalog),encoding="utf-8")
    print("Reader",path.relative_to(OUT))

if __name__=="__main__":
    assert len(books)==10 and len(reviews)==10
    assert set(b["slug"] for b in books)==set(reviews)
    for book in books:build(book)
    build_reader()
