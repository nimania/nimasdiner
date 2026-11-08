export const VERSION=1;
export const STORAGE_KEY='nimasdiner_daily_journal_v1';
export const moneyFields=['sales','received','purchases','expenses','waste'];
export function numberValue(value){
 const str=String(value??'').trim().replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[٬,\s]/g,'').replace(/٫/g,'.');
 if(!/^\d+(?:\.\d+)?$/.test(str))return null;
 const n=Number(str);return Number.isFinite(n)&&n>=0&&n<=1e15?n:null;
}
export function validDay(s){return /^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;}
export function cleanRecord(input){
 if(!input||!validDay(input.day))throw Error('روز ثبت معتبر نیست.');
 const result={day:input.day};
 const orders=numberValue(input.orders);if(orders===null||!Number.isSafeInteger(orders))throw Error('تعداد سفارش باید عدد صحیح و نامنفی باشد.');result.orders=orders;
 for(const key of moneyFields){const n=numberValue(input[key]);if(n===null)throw Error('مبلغ‌ها باید عدد نامنفی باشند.');result[key]=n;}
 for(const key of ['note','action']){if(typeof input[key]!=='string'||input[key].length>(key==='note'?1200:600))throw Error('متن یادداشت یا اقدام معتبر نیست.');result[key]=input[key];}
 return result;
}
export function parseBackup(text){
 const obj=JSON.parse(text);if(obj?.version!==VERSION||!Array.isArray(obj.records)||obj.records.length>20000)throw Error('فایل پشتیبان ژورنال معتبر نیست.');
 const records=obj.records.map(cleanRecord);if(new Set(records.map(r=>r.day)).size!==records.length)throw Error('روز تکراری در پشتیبان وجود دارد.');return records;
}
export function totalRecords(records){const totals={orders:0,...Object.fromEntries(moneyFields.map(k=>[k,0]))};for(const r of records)for(const k of Object.keys(totals))totals[k]+=r[k];return {...totals,days:records.length,average:totals.orders?totals.sales/totals.orders:null,cashflow:totals.received-totals.purchases-totals.expenses};}
export function csvRecords(records){
 const cell=x=>'"'+String(x).replace(/^[=+@\-\t\r]/,"'$&").replace(/"/g,'""')+'"';
 const headings=['روز میلادی','تعداد سفارش','فروش خالص (تومان)','دریافتی (تومان)','خرید مواد (تومان)','سایر پرداخت‌ها (تومان)','ضایعات برآوردی (تومان)','یادداشت','اقدام'];
 return '\uFEFF'+[headings,...records.map(r=>[r.day,r.orders,...moneyFields.map(k=>r[k]),r.note,r.action])].map(row=>row.map(cell).join(',')).join('\r\n');
}
