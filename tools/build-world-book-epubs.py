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

if __name__=="__main__":
    assert len(books)==10 and len(reviews)==10
    assert set(b["slug"] for b in books)==set(reviews)
    for book in books:build(book)
