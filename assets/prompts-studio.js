document.addEventListener("DOMContentLoaded", () => {
  const target=document.getElementById("studio-templates");
  if(target) {
    let templates=[];
    try{templates=JSON.parse(target.textContent)}catch(e){console.warn("Prompt templates unavailable");}
    const lookup=new Map(templates.map(t=>[t.slug,t]));
    const formIds=["studio-template","studio-business","studio-product","studio-brand","studio-style","studio-ratio","studio-audience","studio-city","studio-goal","studio-details"];
    const values=()=>Object.fromEntries(formIds.map(id=>[id.replace("studio-",""),document.getElementById(id)?.value?.trim()||""]));
    const result=document.getElementById("studio-result");
    const status=document.getElementById("studio-status");
    const styleMap={natural:"natural photorealistic lighting and accurate textures",cinematic:"dramatic charcoal-toned cinematic side lighting",bright:"bright minimal studio lighting",cozy:"warm and intimate hospitality ambience",bold:"high-contrast commercial advertising art direction"};
    const proportionMap={"4:5":"vertical 4:5","9:16":"vertical 9:16","1:1":"square 1:1","16:9":"horizontal 16:9",original:"original format specified in the base prompt"};
    function fill(value) {
      if(!value)return "";
      return value.replace(/[\[\]<>]/g,"").slice(0,1600);
    }
    function render() {
      if(!result)return;
      const v=values(), base=lookup.get(v.template)||templates[0];
      if(!base){result.value="";return;}
      const name=fill(v.product)||"the actual menu item";
      const substitutions={
        "DISH NAME":name,"BURGER NAME":name,"REAL DETAILS":fill(v.details)||"[VERIFIED REAL DETAILS]",
        "RECIPE NOTES":fill(v.details)||"[REAL RECIPE NOTES]",
        "COMPLAINT":fill(v.details)||"[CUSTOMER COMPLAINT]",
        "CONTACT METHOD":"the restaurant's official direct message channel",
        "BRAND COLORS":fill(v.brand)||"the restaurant's existing brand palette",
        "BUSINESS TYPE":fill(v.business)||"restaurant","RESTAURANT TYPE":fill(v.business)||"restaurant",
        "RESTAURANT CONCEPT":fill(v.business)||"restaurant","NUMBER OF STAFF":"[ACTUAL STAFF COUNT]",
        "ROLE":"[STAFF ROLE]","CITY":fill(v.city)||"[CITY]",
        "TARGET AUDIENCE":fill(v.audience)||"[TARGET AUDIENCE]",
        "AUDIENCE":fill(v.audience)||"[TARGET AUDIENCE]",
        "TARGET CUSTOMER":fill(v.audience)||"[TARGET CUSTOMER]",
        "GOAL":fill(v.goal)||"[SPECIFIC GOAL]",
        "CURRENT RESOURCES":fill(v.details)||"[CURRENT RESOURCES]",
        "DAY / TIME":"[DAY AND TIME]"
      };
      let prompt=base.prompt.replace(/\[([^\]]+)\]/g,(whole,key)=>Object.hasOwn(substitutions,key)?substitutions[key]:whole);
      const notes=[
        "PERSONALIZATION BRIEF:",
        "Business: "+(fill(v.business)||"restaurant"),
        "Real product or subject: "+name,
        "Brand palette: "+(fill(v.brand)||"not specified"),
        "Audience: "+(fill(v.audience)||"not specified"),
        "Market/city: "+(fill(v.city)||"not specified"),
        "Goal: "+(fill(v.goal)||"not specified"),
        "Preferred style: "+(styleMap[v.style]||styleMap.natural),
        "Preferred output format: "+(proportionMap[v.ratio]||proportionMap["4:5"]),
        "Verified facts and constraints: "+(fill(v.details)||"not supplied; ask for missing factual details rather than inventing them"),
        base.reference?"Use the uploaded actual product/location reference; preserve its genuine details.":"Do not invent specific business facts.",
        base.type==="متن"?"Write the final user-facing output in Persian (Farsi), with actionable detail and no unverified promises.":"No text, logo, watermark, fabricated ingredients or misleading changes.",
        "If a direction conflicts with the base prompt's ratio or style, prioritize the personalization brief while preserving real product identity."
      ];
      result.value=prompt+"\n\n"+notes.join("\n");
      if(status)status.textContent="متن به‌روز شد؛ برای استفاده کپی کنید.";
    }
    for(const id of formIds) {
      const el=document.getElementById(id);
      if(el){el.addEventListener("input",render);el.addEventListener("change",render);}
    }
    const select=document.getElementById("studio-template");
    if(select?.tagName==="SELECT"&&new URLSearchParams(location.search).has("template")) {
      const requested=new URLSearchParams(location.search).get("template");
      if(lookup.has(requested))select.value=requested;
    }
    const copy=document.getElementById("studio-copy");
    if(copy)copy.addEventListener("click",async()=>{
      try{await navigator.clipboard.writeText(result.value);status.textContent="پرامپت اختصاصی کپی شد.";}
      catch(e){result.focus();result.select();status.textContent="کپی خودکار ممکن نشد؛ متن انتخاب شد. دستی کپی کنید.";}
    });
    render();
  }
  document.querySelectorAll("[data-compare-card]").forEach(card=>{
    const slider=card.querySelector(".compare-range");
    const stage=card.querySelector(".compare-stage");
    if(!slider||!stage)return;
    function update(){stage.style.setProperty("--reveal",slider.value+"%");}
    slider.addEventListener("input",update);
    slider.addEventListener("change",update);
    update();
  });
});
