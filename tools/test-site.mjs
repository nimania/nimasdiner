import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const dist=path.join(process.cwd(),"site-dist");
const read=p=>fs.readFileSync(path.join(dist,p),"utf8");
const mustExist=["index.html","get-book/index.html","library/index.html","library/01/index.html","library/02/index.html","library/03/index.html","magazine/index.html","magazine/01/index.html","guides/index.html","guides/food-cost/index.html","guides/menu-engineering/index.html","guides/restaurant-permits/index.html","tools/index.html","services/index.html","consulting/index.html","app/index.html","robots.txt","sitemap.xml","search-index.json"];
for(const p of mustExist){assert.ok(fs.existsSync(path.join(dist,p)),p+" missing");}
const form=read("get-book/index.html");
assert.match(form,/id="book-form"/);
assert.match(form,/https:\/\/nimasdiner-delivery\.iran\.chatgpt\.site\/register/);
for(const name of ["name","email","phone","marketing_consent","_honey"])assert.ok(form.includes('name="'+name+'"'),"missing form field "+name);
assert.match(form,/name="marketing_consent"/);
assert.match(form,/optional|اختیاری/);
const home=read("index.html");
assert.match(home,/id="get-book"/,"old hash deep link broken");
assert.match(home,/href="\/nimasdiner\/get-book\/"/);
assert.match(home,/<h1>/);
const sitemap=read("sitemap.xml");
assert.match(sitemap,/\/nimasdiner\/get-book\//);
assert.match(sitemap,/\/nimasdiner\/magazine\/01\//);
assert.doesNotMatch(sitemap,/\/nimasdiner\/library\/04\//,"unpublished books must not be indexed");
assert.doesNotMatch(sitemap,/\/nimasdiner\/search\//,"search should not be indexed");
assert.match(read("search/index.html"),/noindex,follow/);
const items=JSON.parse(read("search-index.json"));
assert.ok(items.length>=10,"search pages too few");
assert.ok(items.every(item=>item.url.startsWith("/nimasdiner/")),"search URLs incorrect");
assert.ok(!items.some(item=>item.url.includes("/library/04/")),"planned content in search index");
assert.equal((read("library/index.html").match(/timeline-item/g)||[]).length,10,"missing roadmap volumes");
for(const p of mustExist.filter(x=>x.endsWith("index.html")&&!x.startsWith("app/")&&!x.startsWith("consulting/"))){
 const txt=read(p);
 assert.match(txt,/<html lang="fa" dir="rtl">/,"RTL missing "+p);
 assert.match(txt,/<meta name="description"/,"meta description missing "+p);
 assert.match(txt,/rel="canonical"/,"canonical missing "+p);
}
console.log("Site tests passed:",mustExist.length,"required files,",items.length,"searchable pages");
