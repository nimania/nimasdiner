#!/usr/bin/env python3
"""Render editorial Persian PDF companions for the public World Food Library.

Each document is an independent analysis based on cited public bibliographic
sources. It is NOT a copy, translation, or chapter-by-chapter book digest.
Requires: weasyprint==66.0 (installed by the Pages workflow).
"""
from __future__ import annotations

import html
import json
import pathlib
import sys

from weasyprint import HTML

ROOT = pathlib.Path(__file__).resolve().parents[1]
CATALOG = ROOT / "content" / "world-books.json"
REVIEWS = ROOT / "content" / "world-book-reviews.json"
OUT = ROOT / "site-dist"

def esc(value: object) -> str:
    return html.escape(str(value), quote=True)

def paragraphs(text: str) -> str:
    return "".join("<p>" + esc(part.strip()) + "</p>"
                   for part in text.split("\\n") if part.strip())

def build_html(book: dict, review: dict, policy: str) -> str:
    regular = (ROOT / "assets" / "Vazirmatn-Regular.ttf").resolve().as_uri()
    bold = (ROOT / "assets" / "Vazirmatn-Bold.ttf").resolve().as_uri()
    title = esc(book["title"])
    original = esc(book["original"])
    sections = "".join(
        "<section class='analysis-section'><h2>" + esc(item["heading"]) +
        "</h2>" + paragraphs(item["body"]) + "</section>"
        for item in review["sections"]
    )
    insights = "".join("<li>" + esc(item) + "</li>" for item in review["insights"])
    exercises = "".join(
        "<li><b>" + esc(item["label"]) + ":</b> " + esc(item["task"]) + "</li>"
        for item in review["plan"]
    )
    refs = "".join(
        "<li>" + esc(item["label"]) + "<a href='" + esc(item["url"]) +
        "' dir='ltr'>" + esc(item["url"]) + "</a></li>"
        for item in review["sources"]
    )
    isbn = ('<div><span>شابک نسخه:</span> <strong dir="ltr">' +
            esc(book["isbn"]) + '</strong></div>') if book.get("isbn") else ""
    return f"""<!doctype html>
<html lang="fa" dir="rtl"><head><meta charset="utf-8">
<title>{title} | مرور تحلیلی فارسی | نیما داینر</title>
<style>
@font-face{{font-family:Vazirmatn;src:url('{regular}') format('truetype');font-weight:400}}
@font-face{{font-family:Vazirmatn;src:url('{bold}') format('truetype');font-weight:700}}
@page{{size:A4;margin:19mm 18mm 19mm 18mm;
  @bottom-left{{content:"nimania.net  |  کتابخانه جهان غذا";color:#777;font-size:9px}}
  @bottom-right{{content:"صفحه " counter(page) " از " counter(pages);color:#777;font-size:9px}}
}}
*{{box-sizing:border-box}}
body{{font-family:Vazirmatn,sans-serif;color:#242527;direction:rtl;text-align:right;font-size:10.4pt;line-height:1.84;margin:0}}
p{{margin:0 0 10px;widows:2;orphans:2}}
h1,h2,h3{{margin:0;line-height:1.65;break-after:avoid}}
h1{{font-size:25pt;font-weight:700;margin:12px 0 8px}}
h2{{font-size:13pt;border-bottom:2px solid #f7cc25;padding-bottom:4px;margin:20px 0 10px}}
ul,ol{{padding-right:21px;margin:10px 0 15px}}
li{{padding-right:2px;margin-bottom:7px}}
a{{color:#9c2a23;overflow-wrap:anywhere;text-decoration:none}}
.topband{{height:11px;background:#ffcf22;border-radius:7px;margin-bottom:28px}}
.kicker{{display:inline-block;background:#ffcf22;padding:4px 12px;border-radius:16px;font-weight:700;font-size:9pt}}
.original{{color:#777;font-family:sans-serif;direction:ltr;text-align:right;font-size:12pt;margin:4px 0 20px}}
.meta{{background:#f7f5f0;border:1px solid #eee8dd;border-radius:10px;padding:13px 16px;margin:20px 0;display:grid;grid-template-columns:1fr 1fr;gap:5px 15px;font-size:9.5pt}}
.meta span{{color:#717171}}
.lead{{font-size:12pt;line-height:1.9;margin:20px 0}}
.scope{{border-right:4px solid #f4c52a;background:#fff8db;padding:11px 14px;margin:18px 0 23px;font-size:9pt;line-height:1.8}}
.coverpage{{page-break-after:always}}
.section-label{{color:#a32e27;font-size:10pt;font-weight:700;letter-spacing:0.2px;margin-bottom:7px}}
.analysis-section{{break-inside:avoid-page;margin-bottom:8px}}
.analysis-section p{{line-height:1.88}}
.panel{{background:#f8f7f3;border-radius:9px;padding:12px 16px;break-inside:avoid-page}}
.note{{border-right:3px solid #bc332a;padding-right:12px}}
.small{{font-size:9pt;color:#666}}
.reference a{{display:block;font-family:sans-serif;font-size:7.3pt;line-height:1.4;text-align:left;margin-top:4px}}
</style></head>
<body>
<div class="coverpage">
  <div class="topband"></div>
  <span class="kicker">نیما داینر | کتابخانه جهان غذا</span>
  <h1>{title}</h1>
  <p class="original">{original}</p>
  <p class="section-label">مرور تحلیلی مستقل و کاربردی</p>
  <div class="meta">
    <div><span>نویسنده:</span> <strong>{esc(book["author"])}</strong></div>
    <div><span>ناشر یا چاپ:</span> <strong>{esc(book["publisher"])}</strong></div>
    <div><span>موضوع:</span> <strong>{esc(book["topic"])}</strong></div>
    <div><span>زبان اثر:</span> <strong>{"انگلیسی" if book["group"] == "foreign" else "فارسی"}</strong></div>
    {isbn}
    <div><span>تاریخ مرور:</span> <strong>آذر ۱۴۰۵ / نوامبر ۲۰۲۶</strong></div>
  </div>
  <h2>جان کلام کتاب و اهمیت آن</h2>
  <p class="lead">{esc(review["thesis"])}</p>
  <p>{esc(book["description"])}</p>
  <div class="scope"><b>درباره اعتبار این مرور:</b> {esc(policy)}</div>
  <p class="small">این فایل رایگان برای آشنایی، نقد و تصمیم‌گیری درباره مطالعه نسخه اصلی تهیه شده است؛ متن کامل کتاب و رسپی‌های دارای حق نشر را دربر ندارد.</p>
</div>

<div>
  <p class="section-label">تحلیل و تفسیر</p>
  {sections}
  <h2>چهار نکته برای به‌خاطر سپردن</h2>
  <ul>{insights}</ul>
  <h2>چه کسی از این کتاب بیشتر استفاده می‌کند؟</h2>
  <p>{esc(review["audience"])}</p>
  <h2>محدودیت‌ها و احتیاط در استفاده</h2>
  <p class="note">{esc(review["limitations"])}</p>
  <h2>تمرین کوتاه برای رستوران و کافه</h2>
  <div class="panel"><ol>{exercises}</ol></div>
  <h2>شناسنامه و منابع بررسی</h2>
  <ul class="reference">{refs}</ul>
  <p class="small">برای مطالعه کامل، تأیید شابک چاپ موردنظر، اطلاع از موجودی و خرید، به ناشر یا فروشنده معرفی‌شده مراجعه کنید. نمایه‌های تجاری ممکن است تغییر کنند.</p>
</div>
</body></html>"""

def main() -> None:
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    reviews = json.loads(REVIEWS.read_text(encoding="utf-8"))
    if catalog.get("schemaVersion") != 1 or reviews.get("schemaVersion") != 1:
        raise ValueError("Unexpected world-book schema version")
    bmap = {b["slug"]:b for b in catalog["books"]}
    rmap = {r["slug"]:r for r in reviews["reviews"]}
    if set(bmap) != set(rmap) or len(bmap) != 10:
        raise ValueError("Book/review slugs do not match")
    for slug, book in bmap.items():
        review = rmap[slug]
        if not review["sources"] or len(review["sections"]) < 3:
            raise ValueError("Incomplete sourced review: " + slug)
        path = OUT / "books" / book["group"] / slug / "summary.pdf"
        path.parent.mkdir(parents=True, exist_ok=True)
        page = build_html(book, review, reviews["editorialPolicy"])
        HTML(string=page, base_url=ROOT.as_uri()).write_pdf(str(path))
        if path.stat().st_size < 5000:
            raise RuntimeError("PDF unexpectedly small: " + str(path))
        print("PDF", path.relative_to(OUT), path.stat().st_size, "bytes")

if __name__ == "__main__":
    main()
