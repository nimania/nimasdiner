import assert from 'node:assert/strict';
import fs from 'node:fs';
import {numberValue,cleanRecord,parseBackup,totalRecords,csvRecords} from '../journal-model.mjs';

assert.equal(numberValue('۱۲٬۰۰۰٬۰۰۰'),12000000);
assert.equal(numberValue('١٢٫٥'),12.5);
for(const v of ['', '۱-۲','-3','Infinity','1e5','12oops'])assert.equal(numberValue(v),null);
const a=cleanRecord({day:'2026-11-08',orders:'۴۰',sales:'۱۲۰۰۰۰۰۰',received:'۱۱۰۰۰۰۰۰',purchases:'۳۰۰۰۰۰۰',expenses:'۱۰۰۰۰۰۰',waste:'۲۰۰۰۰۰',note:'دادهٔ آموزشی',action:'مرور ضایعات'});
const totals=totalRecords([a]);assert.equal(totals.average,300000);assert.equal(totals.cashflow,7000000);assert.equal(totals.waste,200000);
assert.equal(totalRecords([]).average,null);
assert.deepEqual(parseBackup(JSON.stringify({version:1,records:[a]})),[a]);
assert.throws(()=>parseBackup(JSON.stringify({version:1,records:[a,a]})));
assert.throws(()=>cleanRecord({...a,day:'2026-02-31'}));
assert.throws(()=>cleanRecord({...a,orders:1.2}));
assert.throws(()=>cleanRecord({...a,sales:-1}));
assert.throws(()=>parseBackup('{"version":2,"records":[]}'));
assert.ok(csvRecords([{...a,note:'=SUM(A1:A3)'}]).includes("'=SUM(A1:A3)"),'CSV must neutralize a formula in a note');

const source=JSON.parse(fs.readFileSync('content/reviews-source.json','utf8'));
const reviews=JSON.parse(fs.readFileSync('content/reviews.json','utf8')).reviews;
const archive=reviews.filter(r=>r.historical===true);
assert.equal(source.length,20);assert.equal(archive.length,20);assert.ok(reviews.length>=22,'Historic and modern reviews must remain available');assert.equal(reviews.filter(r=>r.category==='city').length,1);
assert.equal(new Set(archive.map(r=>r.sourceId)).size,20);
let photos=0;
const squish=s=>s.replace(/\s+/g,' ').trim();
for(const r of archive){
 const original=source.find(x=>x.id===r.sourceId);assert.ok(original);
 assert.equal(squish(r.body.map(s=>s.p.join('\n')).join('\n')),squish(original.blocks.join('\n')),'Archive text changed: '+r.slug);
 assert.equal(r.photos.length,original.images.length);
 const html=fs.readFileSync('site-dist/reviews/'+r.slug+'/index.html','utf8');
 assert.ok(html.includes(r.sourceUrl));assert.ok(html.includes(r.publishedAt));assert.ok(!html.includes('آرشیوی'));assert.ok(!html.includes('شناسنامهٔ آرشیو'));
 for(const p of r.photos){assert.ok(fs.existsSync('site-dist/'+p.src.replace('/nimasdiner/','')));photos++;}
}
assert.equal(photos,51);
assert.ok(reviews.find(r=>r.slug==='peleh-qazvin').photos.every(p=>p.credit==='مهدی رشیدی فرد'));
const offside=reviews.find(r=>r.slug==='offside-nowshahr');
assert.ok(offside&&offside.status==='published'&&!offside.historical&&offside.body.length>=5);
const offsideHtml=fs.readFileSync('site-dist/reviews/offside-nowshahr/index.html','utf8');
for(const value of ['آفساید نوشهر','sepidz.menu/caferestaurant/offside','nimania.net/services/','مهندسی منو'])assert.ok(offsideHtml.includes(value),'Offside review missing '+value);
assert.ok(fs.readFileSync('site-dist/reviews/index.html','utf8').includes('offside-nowshahr'));
assert.ok(fs.readFileSync('site-dist/sitemap.xml','utf8').includes('/reviews/offside-nowshahr/'));

const barok=reviews.find(r=>r.slug==='barok-nowshahr');
assert.ok(barok&&barok.status==='published'&&!barok.historical&&barok.body.length>=5);
assert.equal(barok.photos.length,1,'Use the actual user-supplied Barok facade image, not fabricated photography');
assert.equal(barok.photoGallery?.length,4,'Preserve all four user-supplied Barok photographs');
for(const p of [...barok.photos,...barok.photoGallery]) {
 assert.ok(p.src.startsWith('/nimasdiner/assets/reviews/barok-'),'Barok media must come from its own photo archive');
 assert.ok(fs.existsSync('site-dist/'+p.src.replace('/nimasdiner/','')),'Missing published Barok image '+p.src);
}
assert.equal(barok.videoGallery?.length,1,'Preserve uploaded Barok video');
for(const v of barok.videoGallery) {
 assert.ok(v.src.endsWith('.mp4')&&fs.existsSync('site-dist/'+v.src.replace('/nimasdiner/','')),'Missing published Barok MP4');
 assert.ok(fs.existsSync('site-dist/'+v.poster.replace('/nimasdiner/','')),'Missing Barok video poster');
}
const barokHtml=fs.readFileSync('site-dist/reviews/barok-nowshahr/index.html','utf8');
for(const value of ['باروک','barokorder.ir','مهندسی منو','مسیریابی'])assert.ok(barokHtml.includes(value),'Barok guide missing '+value);
assert.ok(barokHtml.includes('review-sidebar'),'Barok needs the dossier sidebar');
assert.ok(barokHtml.includes('review-gallery-barok-nowshahr'),'Barok gallery must be integrated inside the article');
assert.ok(barokHtml.includes('barok-exterior-night.mp4'),'Barok video must be embedded locally');
assert.ok(fs.readFileSync('site-dist/sitemap.xml','utf8').includes('/reviews/barok-nowshahr/'),'Barok needs sitemap entry');
assert.ok(!fs.readFileSync('site-dist/sitemap.xml','utf8').includes('/membership/'));
for(const p of ['journal/index.html','kits/index.html','kits/shift-handover/index.html','kits/waste-log/index.html','kits/weekly-review/index.html'])assert.ok(fs.existsSync('site-dist/'+p));
console.log('Manager checks passed: Persian numbers, cashflow, backup validation, CSV safety; 20 complete texts, 51 historical archive photos plus user-supplied Barok gallery + video.');

// Books are available for direct ordering only; free digital downloads must remain absent.
for(const n of ['01','02','03']){
 const html=fs.readFileSync('site-dist/library/'+n+'/index.html','utf8');
 assert.ok(html.includes('href="https://t.me/nimaafsharnaderi"'));
 assert.ok(!html.includes('دریافت دیجیتال رایگان ۱۰۱ قانون'));
}
const articleBooks=[['good-cook-or-restaurant-owner',1],['opening-budget-versus-survival-cash',2],['smaller-customer-bills-in-a-downturn',3]];
for(const [slug,n] of articleBooks){
 const html=fs.readFileSync('site-dist/reading/'+slug+'/index.html','utf8');
 assert.ok(html.includes('برگرفته از کتاب'));
 assert.ok(html.includes('href="https://t.me/nimaafsharnaderi"'));
 assert.ok(!html.includes('دریافت دیجیتال رایگان ۱۰۱ قانون'));
 assert.ok(html.includes('فصل اول'));
}
console.log('Book attribution and order-only CTA checks passed.');
