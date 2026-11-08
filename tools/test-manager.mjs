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
assert.equal(source.length,20);assert.equal(reviews.length,20);assert.equal(reviews.filter(r=>r.category==='city').length,1);
assert.equal(new Set(reviews.map(r=>r.sourceId)).size,20);
let photos=0;
const squish=s=>s.replace(/\s+/g,' ').trim();
for(const r of reviews){
 const original=source.find(x=>x.id===r.sourceId);assert.ok(original);
 assert.equal(squish(r.body.map(s=>s.p.join('\n')).join('\n')),squish(original.blocks.join('\n')),'Archive text changed: '+r.slug);
 assert.equal(r.photos.length,original.images.length);
 const html=fs.readFileSync('site-dist/reviews/'+r.slug+'/index.html','utf8');
 assert.ok(html.includes(r.sourceUrl));assert.ok(html.includes(r.publishedAt));assert.ok(html.includes('قیمت‌های متن تاریخی'));
 for(const p of r.photos){assert.ok(fs.existsSync('site-dist/'+p.src.replace('/nimasdiner/','')));photos++;}
}
assert.equal(photos,51);
assert.ok(reviews.find(r=>r.slug==='peleh-qazvin').photos.every(p=>p.credit==='مهدی رشیدی فرد'));
assert.ok(!fs.readFileSync('site-dist/sitemap.xml','utf8').includes('/membership/'));
for(const p of ['journal/index.html','kits/index.html','kits/shift-handover/index.html','kits/waste-log/index.html','kits/weekly-review/index.html'])assert.ok(fs.existsSync('site-dist/'+p));
console.log('Manager checks passed: Persian numbers, cashflow, backup validation, CSV safety; 20 complete texts and 51 photos.');
