/* Job Hunt - shared file: styles, menu, footer, platform list, job loaders */
const P=`Upwork|upwork.com|General
Fiverr|fiverr.com|General
Freelancer.com|freelancer.com|General
PeoplePerHour|peopleperhour.com|General
Guru|guru.com|General
Toptal|toptal.com|General
Truelancer|truelancer.com|General
Workana|workana.com|General
Hubstaff Talent|talent.hubstaff.com|General
Freelancermap|freelancermap.com|General
Malt|malt.com|General
Contra|contra.com|General
Braintrust|usebraintrust.com|General
Outsourcely|outsourcely.com|General
Bark|bark.com|General
Airtasker|airtasker.com|General
Legiit|legiit.com|General
Twine|twine.net|General
YunoJuno|yunojuno.com|General
SolidGigs|solidgigs.com|General
Freelance.de|freelance.de|General
Codeur|codeur.com|General
Remotive|remotive.com|Remote
RemoteOK|remoteok.com|Remote
We Work Remotely|weworkremotely.com|Remote
Remote.co|remote.co|Remote
FlexJobs|flexjobs.com|Remote
Working Nomads|workingnomads.com|Remote
Jobspresso|jobspresso.co|Remote
JustRemote|justremote.co|Remote
Himalayas|himalayas.app|Remote
NoDesk|nodesk.co|Remote
Pangian|pangian.com|Remote
Jobicy|jobicy.com|Remote
Arbeitnow|arbeitnow.com|Remote
Virtual Vocations|virtualvocations.com|Remote
Wellfound|wellfound.com|Startup
Welcome to the Jungle|welcometothejungle.com|Startup
Landing.jobs|landing.jobs|Startup
Indeed|indeed.com|Job Boards
LinkedIn Jobs|linkedin.com/jobs|Job Boards
Glassdoor|glassdoor.com|Job Boards
SimplyHired|simplyhired.com|Job Boards
ZipRecruiter|ziprecruiter.com|Job Boards
Monster|monster.com|Job Boards
CareerBuilder|careerbuilder.com|Job Boards
Jooble|jooble.org|Job Boards
Adzuna|adzuna.com|Job Boards
Talent.com|talent.com|Job Boards
Naukri|naukri.com|Job Boards
BDJobs|bdjobs.com|Job Boards
Behance Jobs|behance.net/joblist|Design
Dribbble Jobs|dribbble.com/jobs|Design
99designs|99designs.com|Design
DesignCrowd|designcrowd.com|Design
crowdSPRING|crowdspring.com|Design
Working Not Working|workingnotworking.com|Design
Coroflot|coroflot.com|Design
Creativepool|creativepool.com|Design
Krop|krop.com|Design
Awwwards Jobs|awwwards.com/jobs|Design
Mandy|mandy.com|Video & Audio
ProductionHub|productionhub.com|Video & Audio
Voices|voices.com|Video & Audio
Voice123|voice123.com|Video & Audio
Bodalgo|bodalgo.com|Video & Audio
Backstage|backstage.com|Video & Audio
Mediabistro|mediabistro.com|Writing
ProBlogger Jobs|problogger.com/jobs|Writing
Contently|contently.com|Writing
Textbroker|textbroker.com|Writing
ClearVoice|clearvoice.com|Writing
Kolabtree|kolabtree.com|Writing
ProZ|proz.com|Translation
TranslatorsCafe|translatorscafe.com|Translation
Gengo|gengo.com|Translation
Dice|dice.com|Tech
Codementor|codementor.io|Tech
Turing|turing.com|Tech
Andela|andela.com|Tech
Crossover|crossover.com|Tech
X-Team|x-team.com|Tech
Topcoder|topcoder.com|Tech
Codeable|codeable.io|Tech
Arc|arc.dev|Tech
Lemon.io|lemon.io|Tech
Gun.io|gun.io|Tech
Flexiple|flexiple.com|Tech
Torre|torre.ai|Tech
MarketerHire|marketerhire.com|Marketing
Clickworker|clickworker.com|Micro Tasks
Amazon MTurk|mturk.com|Micro Tasks
Prolific|prolific.com|Micro Tasks
UserTesting|usertesting.com|Micro Tasks
Respondent|respondent.io|Micro Tasks
Appen|appen.com|Micro Tasks
Remotasks|remotasks.com|Micro Tasks
Microworkers|microworkers.com|Micro Tasks
Rev|rev.com/freelancers|Micro Tasks
TranscribeMe|transcribeme.com|Micro Tasks
Preply|preply.com|Teaching
italki|italki.com|Teaching
Cambly|cambly.com|Teaching
Wyzant|wyzant.com|Teaching
Belay|belaysolutions.com|Assistant
Time Etc|timeetc.com|Assistant
Fancy Hands|fancyhands.com|Assistant
ReliefWeb|reliefweb.int|NGO
Devex|devex.com|NGO`.split('\n').map(l=>{const[a,b,c]=l.split('|');return{n:a,d:b,c:c}});
const CATS=[...new Set(P.map(p=>p.c))];
const SP={'Upwork':'https://www.upwork.com/nx/search/jobs/?q={q}','Fiverr':'https://www.fiverr.com/search/gigs?query={q}','Freelancer.com':'https://www.freelancer.com/jobs/?keyword={q}','PeoplePerHour':'https://www.peopleperhour.com/freelance-jobs?q={q}','Indeed':'https://www.indeed.com/jobs?q={q}','LinkedIn Jobs':'https://www.linkedin.com/jobs/search/?keywords={q}','We Work Remotely':'https://weworkremotely.com/remote-jobs/search?term={q}'};
function searchUrl(p,q){q=(q||'').trim();if(!q)return'https://'+p.d;const e=encodeURIComponent(q);return SP[p.n]?SP[p.n].replace('{q}',e):'https://www.google.com/search?q=site:'+p.d+'+'+e;}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const $=s=>document.querySelector(s);
let _J=null;
const resetJobs=()=>{_J=null};
async function jobsData(){
 if(_J)return _J;
 try{const r=await fetch('jobs.json?t='+Math.floor(Date.now()/6e5));if(r.ok){const d=await r.json();if(d&&d.updated){d.direct=d.direct||[];d.posts=d.posts||[];d.pool=d.pool||[];const u=new Set(d.direct.concat(d.posts).map(j=>j.u));d.pool=d.pool.filter(j=>!u.has(j.u));return _J=d}}}catch(e){}
 return _J={updated:0,direct:[],posts:[],pool:[]};
}
function filterQ(L,q){const w=(q||'').toLowerCase().split(/\s+/).filter(Boolean);return w.length?L.filter(j=>{const h=(j.t+' '+j.c+' '+j.cat+' '+j.l).toLowerCase();return w.every(x=>h.includes(x))}):L}
function ago(t){if(!t)return'waiting for the first hourly update';const m=Math.round((Date.now()/1000-t)/60);return m<2?'updated just now':m<90?'updated '+m+' minutes ago':'updated '+Math.round(m/60)+' hours ago'}
function cp(b){const t=b.dataset.txt,o=b.textContent,d=()=>{b.textContent='Copied';setTimeout(()=>b.textContent=o,1500)};
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(d,()=>fb())}else fb();
 function fb(){const x=document.createElement('textarea');x.value=t;document.body.appendChild(x);x.select();try{document.execCommand('copy');d()}catch(e){alert('Copy failed. Please copy manually.')}x.remove()}}
const JM={};
const getSaved=()=>{try{return JSON.parse(localStorage.getItem('jh_saved')||'{}')}catch(e){return{}}};
function sv(b,st){const u=b.dataset.u,S=getSaved(),j=JM[u];if(!j)return;
 if(S[u]&&S[u].st==st)delete S[u];else S[u]={j:j,st:st,t:Date.now()};
 try{localStorage.setItem('jh_saved',JSON.stringify(S))}catch(e){alert('Could not save in this browser.');return}
 const c=b.closest('.card'),s2=S[u]?S[u].st:'';
 if(c){c.querySelector('[data-k=saved]').textContent=s2=='saved'?'★ Saved':'☆ Save';c.querySelector('[data-k=applied]').textContent=s2=='applied'?'✓ Applied':'Mark applied'}
 if(typeof onSaved=='function')onSaved();}
function shr(b){if(navigator.share)navigator.share({title:b.dataset.t,url:b.dataset.u}).catch(()=>{});else{b.dataset.txt=b.dataset.u;cp(b)}}
const isNew=j=>{const t=Date.parse(String(j.dt||'').replace(' ','T'));return t&&Date.now()-t<864e5&&Date.now()>=t-36e5};
function jobCard(j,m){
 JM[j.u]=j;const S0=getSaved()[j.u],st=S0?S0.st:'';
 const p='Write a short, professional job application for the "'+j.t+'" role at '+j.c+'. Use my skills and experience: [paste your skills here]. Keep it under 150 words, friendly and clear, and end by asking for a short call or chat.';
 const cl='Hello '+j.c+' team,\n\nI am excited to apply for the '+j.t+' role. I have experience in [your main skill] and have completed [number] similar projects. I can start [date] and will share relevant samples on request.\n\nThank you for your time.\n[Your name]';
 const lab=m=='p'?'View post on ':'Apply on ',q=encodeURIComponent(j.c||'');
 const co=m=='c'?`<p class="s"><a href="https://www.google.com/search?q=${q}+official+website" target="_blank" rel="noopener noreferrer">Company website</a> · <a href="https://www.linkedin.com/search/results/companies/?keywords=${q}" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>`:'';
 return `<article class="card"><h3>${isNew(j)?'<span class="tag nw">New</span> ':''}${esc(j.t)}</h3><p class="m">${esc(j.c)}${j.l?' · '+esc(j.l):''}</p><p>${j.cat?`<span class="tag">${esc(j.cat)}</span>`:''}${j.y?`<span class="tag">${esc(j.y)}</span>`:''}${j.s?`<span class="tag pay">${esc(j.s)}</span>`:''}${j.dt?`<span class="tag">${esc(String(j.dt).slice(0,10))}</span>`:''}</p>${j.d?`<p class="pv">${esc(j.d)}</p>`:''}${co}<p class="m s">Source: ${esc(j.src)}</p><a class="btn" href="${esc(j.u)}" target="_blank" rel="noopener noreferrer">${lab}${esc(j.src)}</a><button class="btn o" data-txt="${esc(p)}" onclick="cp(this)">Copy apply prompt</button><button class="btn o" data-txt="${esc(cl)}" onclick="cp(this)">Copy cover letter</button><div class="ac"><button class="btn o" data-k="saved" data-u="${esc(j.u)}" onclick="sv(this,'saved')">${st=='saved'?'★ Saved':'☆ Save'}</button><button class="btn o" data-k="applied" data-u="${esc(j.u)}" onclick="sv(this,'applied')">${st=='applied'?'✓ Applied':'Mark applied'}</button><button class="btn o" data-u="${esc(j.u)}" data-t="${esc(j.t)}" onclick="shr(this)">Share</button></div></article>`;}
function topPay(s){const n=(String(s).replace(/(\d)k\b/gi,'$1000').match(/\d[\d,]*/g)||[]).map(x=>+x.replace(/,/g,''));return n.length?Math.max(...n):0;}
const CONTACT='ferdusalommahadi@gmail.com';
const PUB='ca-pub-4306254455862264';
function adHtml(k){const b='data-ad-client="'+PUB+'"';
 if(k=='banner')return'<ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" '+b+' data-ad-slot="6140919742"></ins>';
 if(k=='feed')return'<ins class="adsbygoogle" style="display:block" data-ad-format="fluid" data-ad-layout-key="-ef+6k-30-ac+ty" '+b+' data-ad-slot="4658261774"></ins>';
 if(k=='article')return'<ins class="adsbygoogle" style="display:block;text-align:center" data-ad-layout="in-article" data-ad-format="fluid" '+b+' data-ad-slot="2354038773"></ins>';
 return'<ins class="adsbygoogle" style="display:inline-block;width:360px;height:800px" '+b+' data-ad-slot="3678407934"></ins>';}
function runAds(){document.querySelectorAll('[data-ad]').forEach(h=>{const k=h.dataset.ad;if((k=='banner'&&innerWidth<760)||(k=='tall'&&innerWidth<1000)){h.remove();return}
 h.className='ad';h.innerHTML=adHtml(k);try{window.adsbygoogle=window.adsbygoogle||[];window.adsbygoogle.push({})}catch(e){}})}
const FAQ={'Getting started':[
['What is Job Hunt?','A free website that shows live remote and freelance jobs, links to '+P.length+' job platforms, and helps you search for clients.'],
['Is Job Hunt free?','Yes. You do not need an account or payment. The site is supported by Google ads.'],
['Which devices work?','Any modern browser on a phone, tablet or computer.']],
'Finding jobs':[
['Where do the jobs come from?','Live listings come from Jobicy, Remote OK and Arbeitnow. Every card names its source and links to the original job page.'],
['What is Direct Apply?','Jobs from Remote OK and Arbeitnow. The Apply button opens the job page where you apply.'],
['What is Job Posts?','Previews of posts from Jobicy (and posts made on this device). Press View post to read the full post on its own website.'],
['What does Post a Job do?','You write your job once and tick the sites. You get a ready text to copy and a button that opens each site. Other websites do not let us fill their forms, so you paste the text there.'],
['How often do jobs update?','An automatic update runs every hour and the page reloads the list every hour while it is open. Sources can delay their own listings by a few hours.'],
['Why do I see no jobs?','Check your internet, try a shorter keyword such as "video", or reload the page. The job sources can also be down for a short time.'],
['Can I filter by pay?','Yes, on the Client Hunter page. It only works for jobs that list a salary or budget.']],
'Applying':[
['How do I apply?','Press the Apply button on a job card. It opens the original website where you finish the application.'],
['What does Copy apply prompt do?','It copies a ready instruction for an AI chat tool. Paste it there, add your skills where marked, and get a draft application.'],
['What does Copy cover letter do?','It copies a short cover letter with the job title and company filled in. Replace the parts in [brackets] before sending.'],
['How do I write a good proposal?','Keep it short. Show you read the job, mention two or three relevant samples, give a clear price and time, and ask one question.']],
'Client Hunter':[
['What does Client Hunter do?','It shows up to 100 more jobs that are not on the Jobs page. Tick the kind of work you want, add filters, and open company search links. It also opens the same search on many platforms.'],
['Can it show client emails or social profiles?','No. Platforms do not publish private contact details, and collecting them would break their rules and privacy laws. Use the messaging tools of each platform.'],
['Why does a platform open a Google search?','Some platforms have no reliable public search link, so Job Hunt searches that website through Google.']],
'Tools and Dashboard':[
['What is on the Tools page?','A rate calculator, platform fee calculator, currency converter with your own rate, invoice maker, time tracker and proposal builder.'],
['What is on the Dashboard?','A place to track projects, payments, clients, a monthly income goal and your job applications.'],
['Where is my Dashboard data stored?','Only in your own browser. Use Download backup on the Dashboard page to keep a copy.'],
['What is on the Learn page?','A getting started checklist, a scam checker, skill roadmaps, message templates, guides and a glossary.']],
'Safety':[
['How do I avoid scams?','Never pay to get a job. Keep chat and payment inside the platform. Be careful with gift cards, requests for bank details, and offers that seem too good.'],
['Does Job Hunt collect my details?','No sign-up is needed. Jobs you post are saved only in your own browser.'],
['Who can see the jobs I post?','Only you, on this device. A shared database is needed to show posts to other visitors.']],
'Ads and privacy':[
['Why are there ads?','Google ads keep the site free.'],
['Do ads use cookies?','Google and its partners may use cookies for ads. Read the Privacy Policy for details.']],
'Platforms':P.map(p=>['How do I search '+p.n+'?','Open the Platforms page, type your skill, then press the button on the '+p.n+' card. It opens '+(SP[p.n]?p.n+' job search':'a Google search limited to '+p.d)+' in a new tab.'])};
function bot(){
 const N=Object.values(FAQ).reduce((a,b)=>a+b.length,0);
 document.body.insertAdjacentHTML('beforeend',`<button id="bb" aria-label="Open help bot" class="bb"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 7V3M9 13h.01M15 13h.01M9 16h6"/></svg></button><section id="bp" class="bp" hidden aria-label="Help bot"><div class="bh"><b>Job Hunt Help</b><span class="s">${N} questions</span><button id="bx" aria-label="Close">×</button></div><div id="bc" class="bc"></div><div id="bl" class="bl"></div></section>`);
 let cur='Getting started';
 const list=()=>{$('#bc').innerHTML=Object.keys(FAQ).map(k=>`<button class="${k==cur?'on':''}" data-k="${esc(k)}">${esc(k)}</button>`).join('');
  $('#bl').innerHTML=FAQ[cur].map((x,i)=>`<button class="q" data-i="${i}">${esc(x[0])}</button>`).join('');};
 $('#bb').onclick=()=>{$('#bp').hidden=false;list()};$('#bx').onclick=()=>$('#bp').hidden=true;
 $('#bc').onclick=e=>{if(e.target.dataset.k){cur=e.target.dataset.k;list()}};
 $('#bl').onclick=e=>{const b=e.target.closest('.q');if(b){const x=FAQ[cur][b.dataset.i];$('#bl').innerHTML=`<p class="qq">${esc(x[0])}</p><p class="aa">${esc(x[1])}</p><button class="q" id="bk">Back to questions</button>`;$('#bk').onclick=list}};
}
const CSS=`:root{--g:#16a34a;--gd:#14532d;--gl:#f0fdf4;--t:#0f172a;--m:#475569;--l:#dbe4dd}
*{box-sizing:border-box;margin:0}body{font:16px/1.6 system-ui,"Segoe UI",Arial,sans-serif;color:var(--t);background:#fff}
.wrap{max-width:1100px;margin:auto;padding:0 16px}h1{font-size:clamp(1.9rem,5vw,3rem);line-height:1.15;color:var(--gd)}h2{font-size:1.5rem;margin:28px 0 12px;color:var(--gd)}h3{font-size:1.05rem}
header{position:sticky;top:0;background:#fff;border-bottom:1px solid var(--l);z-index:5}header .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:58px;flex-wrap:wrap}
.logo{font-weight:800;color:var(--gd);text-decoration:none;font-size:1.2rem}.logo b{color:var(--g)}nav a{margin-left:14px;color:var(--m);text-decoration:none;font-weight:600;padding:6px 2px;border-bottom:2px solid transparent}nav a.on,nav a:hover{color:var(--gd);border-color:var(--g)}
.hero{background:var(--gl);padding:36px 0}.hero .wrap{display:grid;grid-template-columns:1.2fr 1fr;gap:24px;align-items:center}.hero svg{width:100%;height:auto}
@media(max-width:760px){.hero .wrap{grid-template-columns:1fr}nav a{margin-left:10px}}
.m{color:var(--m)}.s{font-size:.85rem}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px}
.card{border:1px solid var(--l);border-radius:12px;padding:14px;background:#fff;display:flex;flex-direction:column;gap:6px}.card .btn{margin-top:auto;text-align:center}
.btn{background:var(--g);color:#fff;border:0;border-radius:8px;padding:9px 14px;cursor:pointer;text-decoration:none;display:inline-block;font:inherit;font-weight:600}.btn:hover{background:var(--gd)}.btn.o{background:#fff;color:var(--gd);border:1px solid var(--g)}.btn.o:hover{background:var(--gl)}
input,select,textarea{font:inherit;padding:9px 10px;border:1px solid #b8c7bd;border-radius:8px;width:100%;background:#fff}label{font-weight:600;font-size:.9rem;display:block;margin-bottom:3px}
.row{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0}.row>*{flex:1 1 170px}
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.tabs button{border:1px solid var(--g);background:#fff;color:var(--gd);border-radius:999px;padding:8px 16px;font:inherit;font-weight:600;cursor:pointer}.tabs button.on{background:var(--g);color:#fff}
.tag{display:inline-block;background:var(--gl);color:var(--gd);border-radius:6px;padding:1px 8px;font-size:.8rem;margin:0 6px 4px 0}.tag.pay{background:#fef9c3;color:#713f12}
.note{background:var(--gl);border-left:4px solid var(--g);padding:10px 14px;border-radius:6px;margin:12px 0}
:focus-visible{outline:3px solid #86efac;outline-offset:2px}footer{margin-top:48px;border-top:1px solid var(--l);padding:22px 0;color:var(--m);font-size:.9rem}
.ad{margin:18px auto;text-align:center;overflow:hidden;max-width:100%}
.card .btn{margin-top:0}.card a.btn{margin-top:auto}
.bb{position:fixed;right:16px;bottom:16px;width:56px;height:56px;border-radius:50%;border:0;background:var(--g);cursor:pointer;z-index:20;box-shadow:0 4px 14px rgba(0,0,0,.25)}
.bp{position:fixed;right:16px;bottom:84px;width:min(360px,calc(100vw - 32px));max-height:70vh;background:#fff;border:1px solid var(--l);border-radius:14px;box-shadow:0 8px 28px rgba(0,0,0,.25);z-index:21;display:flex;flex-direction:column;overflow:hidden}.bp[hidden]{display:none}
.bh{background:var(--g);color:#fff;padding:10px 14px;display:flex;gap:8px;align-items:center}.bh b{flex:1}.bh .s{color:#dcfce7}.bh button{background:none;border:0;color:#fff;font-size:1.5rem;cursor:pointer}
.bc{display:flex;flex-wrap:wrap;gap:6px;padding:8px;border-bottom:1px solid var(--l)}.bc button{border:1px solid var(--g);background:#fff;color:var(--gd);border-radius:999px;padding:3px 10px;font:inherit;font-size:.8rem;cursor:pointer}.bc button.on{background:var(--g);color:#fff}
.bl{overflow:auto;padding:8px;display:flex;flex-direction:column;gap:6px}.q{text-align:left;border:1px solid var(--l);background:var(--gl);border-radius:8px;padding:8px 10px;font:inherit;cursor:pointer}.q:hover{border-color:var(--g)}.qq{font-weight:700}.aa{background:var(--gl);padding:10px;border-radius:8px}
.mq{overflow:hidden;border-block:1px solid var(--l);background:var(--gl);padding:10px 0;margin:16px 0}.mq div{display:flex;gap:28px;width:max-content;animation:mq 60s linear infinite}.mq:hover div{animation-play-state:paused}.mq span{font-weight:700;color:var(--gd);white-space:nowrap}
@keyframes mq{to{transform:translateX(-50%)}}@media(prefers-reduced-motion:reduce){.mq div{animation:none}.mq{overflow:auto}}
:root{--g:#10b981;--gd:#059669;--gl:#ecfdf5;--t:#0f172a;--m:#475569;--l:#e2e8f0}
body{background:#f8fafc;overflow-x:hidden}
header{background:rgba(255,255,255,.95);backdrop-filter:blur(10px);box-shadow:0 1px 8px rgba(0,0,0,.04)}
.logo{display:flex;align-items:center;gap:12px;font-size:1.45rem;font-weight:800;letter-spacing:-.5px;color:var(--t)}.logo img{width:38px;height:38px;border-radius:10px;object-fit:cover;background:#0f172a}.logo b{color:var(--gd)}
.badge{background:var(--gl);color:var(--gd);font-size:.82rem;font-weight:700;padding:6px 14px;border-radius:20px;border:1px solid #a7f3d0;white-space:nowrap}
.hero{background-image:linear-gradient(135deg,rgba(6,24,18,.82),rgba(15,23,42,.76)),url('hero-bg.jpg'),url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80');background-size:cover;background-position:center;padding:85px 0 75px;text-align:center;color:#fff;border-bottom:4px solid var(--g)}
.hero .wrap{display:block}.hero h1{color:#fff;max-width:820px;margin:0 auto 14px;text-shadow:0 2px 12px rgba(0,0,0,.4)}.hero h1 span{color:#34d399}.hero p{color:#e2e8f0;max-width:650px;margin:0 auto 30px;font-size:1.1rem}
.hero.sm{padding:42px 0 36px}.hero.sm h1{font-size:2rem;margin-bottom:8px}.hero.sm p{margin:0 auto;font-size:1rem}
.pt{display:inline-block;background:rgba(16,185,129,.22);border:1px solid rgba(52,211,153,.5);color:#a7f3d0;padding:5px 16px;border-radius:30px;font-size:.85rem;font-weight:600;margin-bottom:16px}
.gs{max-width:920px;margin:0 auto;background:rgba(255,255,255,.16);backdrop-filter:blur(16px);border:1.5px solid rgba(255,255,255,.45);border-radius:60px;padding:8px 8px 8px 22px;display:flex;align-items:center;gap:10px;box-shadow:0 18px 40px rgba(0,0,0,.35)}
.gs input,.gs select{background:transparent;border:0;color:#fff;font-size:1rem;padding:10px 8px;outline:none;min-width:0;width:auto;border-radius:0}.gs input{flex:1.6}.gs select{flex:1;font-weight:600;cursor:pointer}.gs input::placeholder{color:rgba(255,255,255,.82)}.gs select option{background:#0f172a;color:#fff}
.gs .dv{width:1px;height:28px;background:rgba(255,255,255,.35)}.gs .btn{background:var(--g);color:#022c22;border-radius:50px;padding:14px 28px;font-weight:800;white-space:nowrap;box-shadow:0 4px 15px rgba(16,185,129,.4)}.gs .btn:hover{background:#34d399}
.tr{margin-top:20px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;color:#cbd5e1;font-size:.88rem}.tr button{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.28);color:#fff;padding:5px 14px;border-radius:20px;cursor:pointer;font:inherit;font-size:.84rem}.tr button:hover{background:var(--g);border-color:var(--g);color:#022c22;font-weight:600}
h2{display:flex;align-items:center;gap:10px}h2::before{content:"";width:5px;height:24px;background:var(--g);border-radius:4px}
.card{border-radius:14px;padding:20px;box-shadow:0 4px 20px rgba(15,23,42,.06);transition:.25s}.card:hover{border-color:var(--g);transform:translateY(-3px)}
.tabs button{border-radius:8px;border:1px solid var(--l);color:var(--m)}.tabs button.on,.tabs button:hover{background:var(--gd);color:#fff;border-color:var(--gd)}
.btn.o{border:1.5px solid var(--gd);color:var(--gd)}.btn.o:hover{background:var(--gd);color:#fff}
@media(max-width:820px){.hero{padding:55px 0}.gs{flex-direction:column;border-radius:20px;padding:16px;align-items:stretch}.gs .dv{display:none}.gs input,.gs select{background:rgba(15,23,42,.55);border-radius:10px;padding:12px 14px}.gs .btn{border-radius:10px;width:100%}.badge{display:none}}
.ac{display:flex;gap:6px;flex-wrap:wrap}.ac .btn{flex:1;padding:7px 8px;font-size:.85rem}.tag.nw{background:#16a34a;color:#fff;font-weight:700}
.tt{position:fixed;left:16px;bottom:16px;width:44px;height:44px;border-radius:50%;border:0;background:var(--gd);color:#fff;font-size:1.3rem;cursor:pointer;z-index:20;display:none}
.pv{color:var(--m);font-size:.9rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.sp{display:inline-block;width:22px;height:22px;border:3px solid #bbf7d0;border-top-color:var(--g);border-radius:50%;animation:rot .8s linear infinite;vertical-align:middle;margin-right:8px}@keyframes rot{to{transform:rotate(360deg)}}
.ld{padding:22px;text-align:center;color:var(--gd);font-weight:600}.ld[hidden]{display:none}
.sites{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:6px;margin:8px 0}.sites label,.chk label{font-weight:400;display:flex;gap:6px;align-items:center;margin:0}.sites input,.chk input{width:auto}.chk{display:flex;flex-wrap:wrap;gap:6px 16px;margin:8px 0}
.res{border:1px solid var(--l);border-radius:10px;padding:10px;margin:6px 0;display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:#fff}.res b{flex:1 1 140px}.res .btn{padding:6px 12px}
#intro{position:fixed;inset:0;z-index:99;background:radial-gradient(circle at 50% 38%,#ecfdf5 0%,#ffffff 62%);display:flex;align-items:center;justify-content:center;transition:opacity .6s ease,transform .6s ease}
#intro.out{opacity:0;transform:translateY(-14px);pointer-events:none}
#intro .ib{text-align:center;padding:0 20px}
#intro .lg{position:relative;width:96px;height:96px;margin:0 auto 20px;border-radius:26px;background:#fff;box-shadow:0 12px 32px rgba(16,185,129,.28);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:2rem;color:#059669;animation:pop .7s cubic-bezier(.2,.9,.3,1.2) both}
#intro .lg::before,#intro .lg::after{content:"";position:absolute;inset:-8px;border-radius:32px;border:2px solid rgba(16,185,129,.4);animation:ring 1.8s ease-out infinite}
#intro .lg::after{animation-delay:.9s}
#intro .lg img{width:74px;height:74px;border-radius:18px;object-fit:cover}
#intro h2{display:block;margin:0 0 6px;color:#0f172a;font-size:2.5rem;letter-spacing:-1px;animation:fup .7s .25s both}#intro h2::before{display:none}#intro h2 b{color:#059669}
#intro p{color:#475569;font-size:1.05rem;animation:fup .7s .45s both}
#intro .pb{width:200px;height:4px;background:#d1fae5;border-radius:4px;margin:24px auto 0;overflow:hidden}
#intro .pb i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#10b981,#34d399);transform:translateX(-100%);animation:ldb 1.7s .2s ease forwards}
@keyframes pop{from{opacity:0;transform:scale(.8)}}@keyframes fup{from{opacity:0;transform:translateY(12px)}}@keyframes ring{from{opacity:.8;transform:scale(.92)}to{opacity:0;transform:scale(1.3)}}@keyframes ldb{to{transform:none}}`;
(function(){
 const st=document.createElement('style');st.textContent=CSS+'html.jh-i{background:#fff}html.jh-i body>*:not(#intro){visibility:hidden}';(document.head||document.documentElement).appendChild(st);
 let want=false;try{want=!sessionStorage.getItem('jh_i')&&!matchMedia('(prefers-reduced-motion:reduce)').matches}catch(e){}
 if(!want)return;
 try{sessionStorage.setItem('jh_i','1')}catch(e){}
 const H='<div id="intro"><div class="ib"><div class="lg"><img src="logo.png" alt="" onerror="this.parentNode.textContent=\'JH\'"></div><h2>Job <b>Hunt</b></h2><p>Find your next freelance job</p><div class="pb"><i></i></div></div></div>',R=document.documentElement;
 R.classList.add('jh-i');setTimeout(()=>R.classList.remove('jh-i'),4500);
 let done=false;
 const mk=()=>{if(done||!document.body)return;done=true;document.body.insertAdjacentHTML('afterbegin',H);setTimeout(()=>{const e=document.getElementById('intro');R.classList.remove('jh-i');if(!e)return;e.classList.add('out');setTimeout(()=>e.remove(),600)},2100)};
 mk();if(!done){const mo=new MutationObserver(()=>{mk();if(done)mo.disconnect()});mo.observe(R,{childList:true,subtree:true})}
})();
document.addEventListener('DOMContentLoaded',()=>{
  
  const ic=document.createElement('link');ic.rel='icon';ic.href='logo.png';document.head.appendChild(ic);
  const fc=document.createElement('script');fc.async=true;fc.src='https://fundingchoicesmessages.google.com/i/pub-4306254455862264?ers=1';document.head.appendChild(fc);
  (function sg(){if(!window.frames['googlefcPresent']){if(document.body){const f=document.createElement('iframe');f.style='width:0;height:0;border:none;z-index:-1000;left:-1000px;top:-1000px;display:none';f.name='googlefcPresent';document.body.appendChild(f)}else setTimeout(sg,0)}})();
  const pg=document.body.dataset.page,L=[['home','index.html','Jobs'],['plat','platforms.html','Platforms'],['hunt','client-hunter.html','Client Hunter'],['tools','tools.html','Tools'],['dash','dashboard.html','Dashboard'],['learn','learn.html','Learn']];
  document.body.insertAdjacentHTML('afterbegin',`<header><div class="wrap"><a class="logo" href="index.html"><img src="logo.png" alt="" onerror="this.style.display='none'">Job <b>Hunt</b></a><nav>${L.map(x=>`<a href="${x[1]}" class="${pg==x[0]?'on':''}">${x[2]}</a>`).join('')}</nav><span class="badge">${P.length} Platforms</span></div></header>`);
  if(document.body.dataset.t)document.querySelector('header').insertAdjacentHTML('afterend',`<section class="hero sm"><div class="wrap"><h1>${esc(document.body.dataset.t)}</h1><p>${esc(document.body.dataset.d||'')}</p></div></section>`);
  document.body.insertAdjacentHTML('beforeend',`<footer><div class="wrap"><p>Job Hunt shows live listings from <a href="https://jobicy.com" target="_blank" rel="noopener noreferrer">Jobicy</a>, <a href="https://remoteok.com" target="_blank" rel="noopener noreferrer">Remote OK</a> and <a href="https://www.arbeitnow.com" target="_blank" rel="noopener noreferrer">Arbeitnow</a>, refreshed every hour, and links to ${P.length} freelance and job platforms. Every button opens the original job page. Job Hunt is not affiliated with these websites.</p><p><a href="privacy.html">Privacy Policy</a>${CONTACT?` · <a href="mailto:${CONTACT}">Contact</a>`:''}</p></div></footer>`);
  bot();runAds();
  document.body.insertAdjacentHTML('beforeend','<button class="tt" id="tt" aria-label="Back to top">↑</button>');addEventListener('scroll',()=>{$('#tt').style.display=scrollY>700?'block':'none'});$('#tt').onclick=()=>scrollTo({top:0,behavior:'smooth'});
});
