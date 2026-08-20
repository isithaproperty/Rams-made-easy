"use client";
import { useState } from "react";

type Status = "Draft" | "In review" | "Approved";
const jobs = [
  {title:"Roof plant replacement", site:"Northgate House, Manchester", ref:"RME-0042", status:"In review" as Status, date:"20 Aug 2026"},
  {title:"Ground-floor strip out", site:"Albion Court, Leeds", ref:"RME-0041", status:"Approved" as Status, date:"18 Aug 2026"},
  {title:"External lighting repairs", site:"Quayside Apartments, Liverpool", ref:"RME-0040", status:"Draft" as Status, date:"17 Aug 2026"},
];
const steps=["Project details","People & work","Hazards","Method","Review"];

export default function Home(){
 const [view,setView]=useState<"dashboard"|"create">("dashboard");
 const [step,setStep]=useState(0);
 const [selected,setSelected]=useState(["Work at height","Manual handling"]);
 const toggle=(v:string)=>setSelected(s=>s.includes(v)?s.filter(x=>x!==v):[...s,v]);
 return <div className="shell">
  <aside><div className="brand"><span>R</span><b>RAMS<br/><small>MADE EASY</small></b></div><nav>
   <button className={view==="dashboard"?"active":""} onClick={()=>setView("dashboard")}>⌂ <span>Dashboard</span></button>
   <button className={view==="create"?"active":""} onClick={()=>setView("create")}>＋ <span>Create RAMS</span></button>
   <button>▤ <span>RAMS library</span></button><button>▦ <span>Projects & sites</span></button><button>♙ <span>People</span></button>
  </nav><div className="asideBottom"><button>⚙ <span>Settings</span></button><div className="user"><i>AM</i><div><strong>Alex Morgan</strong><small>Company admin</small></div></div></div></aside>
  <main><header><div><p>RAMS MADE EASY</p><h1>{view==="dashboard"?"Good afternoon, Alex":"Create a new RAMS"}</h1></div><div className="headActions"><button className="icon">?</button><button className="icon">♢<em>3</em></button>{view==="dashboard"&&<button className="primary" onClick={()=>setView("create")}>＋ Create RAMS</button>}</div></header>
  {view==="dashboard"?<Dashboard onCreate={()=>setView("create")}/>:<Creator step={step} setStep={setStep} selected={selected} toggle={toggle}/>}</main>
 </div>
}

function Dashboard({onCreate}:{onCreate:()=>void}){return <>
 <section className="notice"><div className="shield">✓</div><div><strong>Your safety documents, under control.</strong><p>Draft with guided assistance. Review by a competent person. Issue with a complete audit trail.</p></div><button>View workflow →</button></section>
 <section className="stats"><article><label>ACTIVE RAMS</label><b>12</b><small><i className="green">↑ 3</i> this month</small></article><article><label>AWAITING REVIEW</label><b>3</b><small>Action required</small></article><article><label>EXPIRING SOON</label><b>2</b><small>Within 14 days</small></article><article><label>WORKER SIGN-OFF</label><b>86%</b><small>43 of 50 briefed</small></article></section>
 <div className="grid"><section className="panel recent"><div className="panelHead"><div><h2>Recent RAMS</h2><p>Your latest safety documents</p></div><button>View all →</button></div>
 {jobs.map(j=><div className="job" key={j.ref}><div className="doc">▤</div><div className="jobMain"><strong>{j.title}</strong><small>{j.site}</small></div><code>{j.ref}</code><span className={'status '+j.status.replace(' ','').toLowerCase()}>{j.status}</span><time>{j.date}</time><button className="dots">•••</button></div>)}</section>
 <section className="panel actions"><div className="panelHead"><div><h2>Needs your attention</h2><p>Outstanding actions</p></div></div><div className="action"><i>!</i><div><strong>3 RAMS awaiting review</strong><small>Oldest submitted 2 days ago</small></div><button>Review</button></div><div className="action amber"><i>◷</i><div><strong>2 RAMS expire soon</strong><small>Review before they lapse</small></div><button>View</button></div><div className="action blue"><i>♙</i><div><strong>7 briefings outstanding</strong><small>Workers not yet acknowledged</small></div><button>Chase</button></div></section></div>
 <section className="start"><div><span>＋</span><div><h2>Start a new risk assessment & method statement</h2><p>Our guided builder takes you from site details to a review-ready RAMS.</p></div></div><button className="primary" onClick={onCreate}>Create RAMS →</button></section>
 </>}

function Creator({step,setStep,selected,toggle}:{step:number,setStep:(n:number)=>void,selected:string[],toggle:(v:string)=>void}){const hazards=["Work at height","Manual handling","Electricity","Power tools","Slips & trips","Asbestos","Lifting operations","Hot works"];
 return <div className="creator"><div className="steps">{steps.map((s,i)=><div key={s} className={i===step?"now":i<step?"done":""}><i>{i<step?"✓":i+1}</i><span>{s}</span></div>)}</div>
 <section className="formcard"><div className="formtitle"><label>STEP {step+1} OF 5</label><h2>{step===0?"Tell us about the project":step===2?"Identify the hazards":"Build your RAMS"}</h2><p>{step===0?"These details will appear on the issued document.":step===2?"Select every hazard relevant to this activity. Controls will be reviewed before issue.":"Complete this section for competent-person review."}</p></div>
 {step===0?<div className="fields"><label>RAMS title<input defaultValue="Roof plant replacement"/></label><div><label>Client<input placeholder="Client or principal contractor"/></label><label>Project / site<input defaultValue="Northgate House"/></label></div><label>Site address<textarea defaultValue="24 Deansgate, Manchester, M3 1AZ"/></label><div><label>Planned start<input type="date"/></label><label>Review date<input type="date"/></label></div></div>:step===2?<div className="hazards">{hazards.map(h=><button className={selected.includes(h)?"picked":""} onClick={()=>toggle(h)} key={h}><i>{selected.includes(h)?"✓":"＋"}</i>{h}</button>)}</div>:<div className="placeholder"><div>✦</div><h3>{step===1?"Who is doing what?":step===3?"Describe the safe sequence of work":"Final checks before review"}</h3><p>{step===4?"AI checks can flag gaps, but a competent person must review and approve the RAMS.":"The guided questions for this section are ready for the next build stage."}</p></div>}
 <footer><button className="secondary" disabled={step===0} onClick={()=>setStep(Math.max(0,step-1))}>← Back</button><span>Saved as draft</span><button className="primary" onClick={()=>setStep(Math.min(4,step+1))}>{step===4?"Submit for review":"Continue →"}</button></footer></section></div>}
