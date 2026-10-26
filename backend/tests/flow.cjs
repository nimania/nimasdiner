const vm=require('node:vm'),fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const tables={Subscribers:[],Queue:[],Events:[]},sent=[];let quota=100;
const sheet=name=>({getLastRow:()=>tables[name].length+1,appendRow:r=>tables[name].push([...r]),getRange:(row,col,n,w)=>({getValues:()=>tables[name].slice(row-2,row-2+n).map(r=>[...r]),setValues:rs=>rs.forEach((r,i)=>tables[name][row-2+i]=[...r])})});
const ctx={console,ContentService:{MimeType:{JSON:'application/json'},createTextOutput:value=>({value,setMimeType(){return this}})},PropertiesService:{getScriptProperties:()=>({getProperty:k=>k})},SpreadsheetApp:{openById:()=>({getSheetByName:sheet,getUrl:()=> 'https://private.example/sheet'})},LockService:{getScriptLock:()=>({waitLock(){},tryLock:()=>true,releaseLock(){}})},Utilities:{getUuid:()=>crypto.randomUUID(),DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(_,s)=>[...crypto.createHash('sha256').update(s).digest()],base64Encode:b=>Buffer.from(b).toString('base64')},HtmlService:{createHtmlOutput:html=>({html,setTitle(){return this},getContent(){return this.html}})},ScriptApp:{getService:()=>({getUrl:()=> 'https://script.example/exec'})},MailApp:{getRemainingDailyQuota:()=>quota,sendEmail:m=>{sent.push(m);quota--}},DriveApp:{getFileById:()=>({getBlob:()=>({getBytes:()=>[37,80,68,70]})})}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/../Code.gs','utf8'),ctx);
ctx.register_({name:'نیما',email:'reader@example.com',marketing_consent:'yes',location_region:'iran'});
assert.equal(sent.length,2);assert.equal(tables.Subscribers[0][12],'pending');
const token=sent[0].htmlBody.match(/action=confirm&amp;token=([a-f0-9]+)/)[1];
ctx.doGet({parameter:{action:'confirm',token}});assert.equal(tables.Subscribers[0][12],'pending');
assert.throws(()=>ctx.requestFile(token));
ctx.confirm_(token);assert.equal(tables.Subscribers[0][12],'confirmed');assert.equal(sent.length,3);
const download=sent[2].htmlBody.match(/action=download&amp;token=([a-f0-9]+)/)[1];
assert.ok(sent[2].body.includes(download));assert.equal(ctx.requestFile(download).base64,'JVBERg==');assert.equal(tables.Subscribers[0][19],'1');
ctx.confirm_(token);assert.equal(sent.length,3);ctx.register_({name:'Duplicate',email:'reader@example.com'});assert.equal(tables.Subscribers.length,1);
assert.throws(()=>ctx.requestFile('a'.repeat(64)));assert.equal(ctx.cell_('=IMPORTXML()'),"'=IMPORTXML()");
quota=15;ctx.register_({name:'Queued',email:'queued@example.com'});assert.equal(sent.length,3);assert.equal(tables.Queue.at(-1)[5],'pending');quota=100;ctx.processQueue();assert.equal(sent.length,5);
console.log('PASS: confirmation requires POST, private download, counts, duplicate protection, plain email links, injection escaping, quota queue.');

assert.equal(JSON.parse(ctx.api_({action:'api_download',token:download}).value).ok,true);assert.equal(JSON.parse(ctx.api_({action:'api_confirm',token:'b'.repeat(64)}).value).ok,false);console.log('PASS: server API rejects invalid confirmation and returns private download.');
