import fs from "node:fs";
import path from "node:path";

// Publish independently served review cover photos at nimania.net.
// WordPress media hosts sometimes reject direct requests from the card grid,
// even though the same photo loads after a retry on individual reviews.
const root=path.resolve(import.meta.dirname,"..");
const reviews=JSON.parse(fs.readFileSync(path.join(root,"content/reviews.json"),"utf8")).reviews;
const publicDir=path.join(root,"site-dist");
const cacheDir=path.join(root,".cache","review-covers");
const outDir=path.join(publicDir,"assets","reviews","covers");
fs.mkdirSync(cacheDir,{recursive:true});
fs.mkdirSync(outDir,{recursive:true});
const maxBytes=10*1024*1024;
const list=reviews.filter(r=>r.archiveImage && r.archiveFallback && ["tehran-fried-chicken-tfc","kabooky-tehran"].includes(r.slug));
function candidates(url){
 const out=[url];
 try{
  const u=new URL(url);
  let filename="";
  if(u.hostname==="nimania.wordpress.com" && u.pathname.startsWith("/wp-content/uploads/2026/11/"))
   filename=u.pathname.slice("/wp-content/uploads/2026/11/".length);
  else if(u.hostname==="nimania.files.wordpress.com" && u.pathname.startsWith("/2026/11/"))
   filename=u.pathname.slice("/2026/11/".length);
  if(filename)out.push(
   "https://nimania.wordpress.com/wp-content/uploads/2026/11/"+filename,
   "https://nimania.files.wordpress.com/2026/11/"+filename,
   "https://i0.wp.com/nimania.files.wordpress.com/2026/11/"+filename
  );
 }catch{}
 return [...new Set(out)];
}
async function fetchImage(url){
 const resp=await fetch(url,{signal:AbortSignal.timeout(10000),headers:{"Accept":"image/jpeg,image/png,image/webp,image/*;q=0.7","User-Agent":"Mozilla/5.0 NimasDinerSiteBuilder/1.0"}});
 if(!resp.ok)throw Error("HTTP "+resp.status);
 const type=resp.headers.get("content-type")||"";
 if(!/^image\/(jpeg|png|webp)/.test(type))throw Error("Unexpected MIME "+type);
 const b=Buffer.from(await resp.arrayBuffer());
 if(b.length<500||b.length>maxBytes)throw Error("Invalid image length "+b.length);
 return b;
}
for(const r of list){
 const name=r.slug+".jpg";
 const cache=path.join(cacheDir,name);
 const output=path.join(outDir,name);
 let good=fs.existsSync(cache)&&fs.statSync(cache).size>500;
 if(!good){
  for(const url of candidates(r.archiveImage)){
   try{fs.writeFileSync(cache,await fetchImage(url));good=true;break;}
   catch(err){console.warn("Cover source unavailable:",r.slug,new URL(url).hostname,err.message);}
  }
 }
 if(!good){console.warn("Cover retained external source; local illustration fallback remains:",r.slug);continue;}
 fs.copyFileSync(cache,output);
 const publicPath="/assets/reviews/covers/"+name;
 // Patch rendered HTML, including homepage and archive cards; never mutate the review data.
 function updateHTML(dir){
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
   const p=path.join(dir,ent.name);
   if(ent.isDirectory()){updateHTML(p);continue}
   if(!ent.name.endsWith(".html"))continue;
   const before=fs.readFileSync(p,"utf8");
   if(before.includes(r.archiveImage))fs.writeFileSync(p,before.replaceAll(r.archiveImage,publicPath),"utf8");
  }
 }
 updateHTML(publicDir);
 console.log("Mirrored restaurant cover:",r.slug,"bytes:",fs.statSync(output).size);
}
