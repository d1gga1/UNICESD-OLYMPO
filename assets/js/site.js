
(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

/* ---------- PRELOADER ---------- */
var pl=$('#preloader'),ring=$('.pl-bar i'),pct=$('.pl-pct'),p=0;
if(pl){
var plTimer=setInterval(function(){
  p+=Math.random()*13+5; if(p>100)p=100;
  ring.style.width=p+'%';
  pct.textContent=Math.floor(p)+'%';
  if(p>=100){clearInterval(plTimer);setTimeout(function(){pl.classList.add('done');document.body.style.overflow='';setTimeout(function(){showCookie()},1600)},420)}
},130);
document.body.style.overflow='hidden';
}else{ setTimeout(function(){showCookie()},2200); }

/* ---------- CANVAS PARTICLES ---------- */
var cv=$('#fx-canvas'),ctx=cv.getContext('2d'),parts=[],W,H,mouse={x:-999,y:-999};
function sizeCv(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;build()}
function build(){
  parts=[]; var n=Math.min(90,Math.floor(W*H/16000));
  for(var i=0;i<n;i++)parts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.32,vy:(Math.random()-.5)*.32,r:Math.random()*1.7+.5,h:Math.random()>.55?'46,79,212':'35,56,126'});
}
function draw(){
  ctx.clearRect(0,0,W,H);
  for(var i=0;i<parts.length;i++){
    var a=parts[i];
    a.x+=a.vx;a.y+=a.vy;
    if(a.x<0||a.x>W)a.vx*=-1; if(a.y<0||a.y>H)a.vy*=-1;
    var dm=Math.hypot(a.x-mouse.x,a.y-mouse.y);
    if(dm<130){var f=(130-dm)/130;a.x+=(a.x-mouse.x)/dm*f*1.4;a.y+=(a.y-mouse.y)/dm*f*1.4}
    ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,6.284);
    ctx.fillStyle='rgba('+a.h+',.7)';ctx.fill();
    for(var j=i+1;j<parts.length;j++){
      var b=parts[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<118){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle='rgba(46,79,212,'+(.16*(1-d/118))+')';ctx.lineWidth=.7;ctx.stroke()}
    }
  }
  requestAnimationFrame(draw);
}
sizeCv();draw();
window.addEventListener('resize',sizeCv);
window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY});

/* ---------- GLOBO VIDEO ---------- */
(function(){
  var v=document.getElementById('globeVid'); if(!v)return;
  var red=window.matchMedia('(prefers-reduced-motion:reduce)');
  function play(){var p=v.play(); if(p&&p.catch)p.catch(function(){});}
  function apply(){ if(red.matches){ try{v.pause()}catch(e){} v.style.display='none'; } else { v.style.display=''; play(); } }
  apply();
  if(red.addEventListener)red.addEventListener('change',apply);
  document.addEventListener('visibilitychange',function(){ if(red.matches)return; if(document.hidden){try{v.pause()}catch(e){}}else{play()} });
})();

/* ---------- CURSOR ---------- */
var cur=$('#cursor'),dot=$('#cursor-dot'),cx=0,cy=0,tx=0,ty=0;
window.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;dot.style.left=tx+'px';dot.style.top=ty+'px'});
(function loop(){cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;cur.style.left=cx+'px';cur.style.top=cy+'px';requestAnimationFrame(loop)})();
document.addEventListener('mouseover',function(e){
  var t=e.target.closest('a,button,.card,.tab,.faq-q,.srv-i,.partner');
  if(t)cur.classList.add('grow');
});
document.addEventListener('mouseout',function(e){
  var t=e.target.closest('a,button,.card,.tab,.faq-q,.srv-i,.partner');
  if(t)cur.classList.remove('grow');
});

/* ---------- HEADER + PROGRESS + TOTOP ---------- */
var hdr=$('#hdr'),bar=$('#scrollbar-top'),tt=$('#totop');
function onScroll(){
  var y=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;
  // isteresi: niente rimbalzo fra 'stuck' e 'non stuck' vicino alla soglia (causava lo sfarfallio)
  if(y>80) hdr.classList.add('stuck'); else if(y<8) hdr.classList.remove('stuck');
  bar.style.width=(h>0?(y/h*100):0)+'%';
  tt.classList.toggle('on',y>620);
}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
tt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

/* ---------- REVEAL ---------- */
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){ if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)} });
},{threshold:.12,rootMargin:'0px 0px -60px 0px'});
$$('.rv,.rv-l,.rv-r,.rv-s').forEach(function(el){io.observe(el)});

/* ---------- COUNTERS ---------- */
var cio=new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(!e.isIntersecting)return; cio.unobserve(e.target);
    var el=e.target,end=parseFloat(el.getAttribute('data-count')),suf=el.getAttribute('data-suffix')||'',t0=null,dur=1700;
    var raw=el.hasAttribute('data-raw');
    function fmt(v){return raw?String(v):v.toLocaleString('it-IT')}
    function step(t){
      if(!t0)t0=t; var pr=Math.min((t-t0)/dur,1), e2=1-Math.pow(1-pr,3);
      el.innerHTML=fmt(Math.floor(end*e2))+suf;
      if(pr<1)requestAnimationFrame(step); else el.innerHTML=fmt(end)+suf;
    }
    requestAnimationFrame(step);
  });
},{threshold:.5});
$$('[data-count]').forEach(function(el){cio.observe(el)});

/* ---------- NAV DROPDOWN ---------- */
$$('[data-drop]').forEach(function(li){
  var btn=li.querySelector('button'),to;
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    var was=li.classList.contains('open');
    $$('[data-drop]').forEach(function(x){x.classList.remove('open')});
    if(!was)li.classList.add('open');
  });
  li.addEventListener('mouseenter',function(){clearTimeout(to);$$('[data-drop]').forEach(function(x){x.classList.remove('open')});li.classList.add('open')});
  li.addEventListener('mouseleave',function(){to=setTimeout(function(){li.classList.remove('open')},180)});
});
document.addEventListener('click',function(){$$('[data-drop]').forEach(function(x){x.classList.remove('open')})});

/* ---------- MOBILE MENU ---------- */
var bg=$('#burger'),mob=$('#mob');
bg.addEventListener('click',function(){
  var on=mob.classList.toggle('on'); bg.classList.toggle('on',on);
  document.body.style.overflow=on?'hidden':'';
});
$$('.mob-group>button').forEach(function(b){
  b.addEventListener('click',function(){
    var g=b.parentElement,sub=g.querySelector('.mob-sub');
    if(!sub){mob.classList.remove('on');bg.classList.remove('on');document.body.style.overflow='';return}
    var on=g.classList.toggle('on');
    sub.style.maxHeight=on?sub.scrollHeight+'px':'0';
  });
});
$$('.mob-sub a').forEach(function(a){a.addEventListener('click',function(){mob.classList.remove('on');bg.classList.remove('on');document.body.style.overflow=''})});

/* ---------- TABS ---------- */
function setTab(i){
  $$('#tabs .tab').forEach(function(t,k){t.classList.toggle('on',k===i)});
  $$('.panel').forEach(function(p,k){p.classList.toggle('on',k===i)});
  $$('.panel.on .rv,.panel.on .rv-s').forEach(function(el){el.classList.add('in')});
}
$$('#tabs .tab').forEach(function(t,i){t.addEventListener('click',function(){setTab(i)})});
$$('[data-tab]').forEach(function(a){a.addEventListener('click',function(){setTimeout(function(){setTab(parseInt(a.getAttribute('data-tab'),10))},260)})});
(function(){ var m=/[?&]tab=(\d)/.exec(location.search); if(m&&$('#tabs'))setTab(parseInt(m[1],10)) })();

/* ---------- CARD SPOTLIGHT + TILT ---------- */
$$('.card').forEach(function(c){
  c.addEventListener('mousemove',function(e){
    var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
    c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
    if(c.classList.contains('tilt')&&window.innerWidth>900){
      var rx=((y-r.height/2)/r.height)*-6, ry=((x-r.width/2)/r.width)*6;
      c.style.transform='translateY(-9px) perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg)';
    }
  });
  c.addEventListener('mouseleave',function(){c.style.transform=''});
});

/* ---------- MAGNETIC BUTTONS ---------- */
$$('[data-cursor]').forEach(function(b){
  b.addEventListener('mousemove',function(e){
    if(window.innerWidth<900)return;
    var r=b.getBoundingClientRect();
    b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.16)+'px,'+((e.clientY-r.top-r.height/2)*.22-3)+'px)';
  });
  b.addEventListener('mouseleave',function(){b.style.transform=''});
});

/* ---------- FAQ ---------- */
$$('.faq-i').forEach(function(it){
  var q=it.querySelector('.faq-q'),a=it.querySelector('.faq-a');
  q.addEventListener('click',function(){
    var on=it.classList.contains('on');
    $$('.faq-i').forEach(function(x){x.classList.remove('on');x.querySelector('.faq-a').style.maxHeight='0'});
    if(!on){it.classList.add('on');a.style.maxHeight=a.scrollHeight+'px'}
  });
});

/* ---------- MARQUEE CLONE ---------- */
var mqt=$('#mqt'); if(mqt)mqt.innerHTML+=mqt.innerHTML;

/* ---------- TOAST ---------- */
var toast=$('#toast'),toastTxt=$('#toast-txt'),tTo;
function showToast(m){toastTxt.textContent=m;toast.classList.add('on');clearTimeout(tTo);tTo=setTimeout(function(){toast.classList.remove('on')},3600)}

/* ---------- COOKIE ---------- */
var ck=$('#cookie');
/* la scelta resta memorizzata per 12 mesi: localStorage + cookie tecnico di riserva */
function ckSeen(){try{if(localStorage.getItem('uo_ck'))return true}catch(e){}return /(^|;\s*)uo_ck=/.test(document.cookie||'')}
function showCookie(){if(ckSeen())return;if(document.body.classList.contains('vo-open')){setTimeout(showCookie,1500);return}ck.classList.add('on')}
function hideCookie(){ck.classList.remove('on');try{localStorage.setItem('uo_ck','1')}catch(e){}try{document.cookie='uo_ck=1; max-age=31536000; path=/; SameSite=Lax'}catch(e){}}
$('#ckOk').addEventListener('click',function(){hideCookie();showToast('Preferenze salvate. Grazie!')});
$('#ckNo').addEventListener('click',function(){hideCookie();showToast('Attivi solo i cookie tecnici.')});

/* ---------- MODAL ---------- */
var ico='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
function li(t){return '<li>'+ico+'<span>'+t+'</span></li>'}
function stats(a){return '<div class="m-stats">'+a.map(function(s){return '<div class="m-stat"><b>'+s[0]+'</b><span>'+s[1]+'</span></div>'}).join('')+'</div>'}

var DATA={
 c1:{e:'Corso di Laurea',t:'Giurisprudenza &mdash; LMG-01',b:stats([['5','anni'],['300','CFU'],['LMG-01','classe']])+'<p>Percorso magistrale a ciclo unico che forma giuristi capaci di operare nella professione forense, nella magistratura, nel notariato, nella pubblica amministrazione e negli uffici legali d\'impresa.</p><h5>Materie principali</h5><ul class="m-list">'+li('Diritto privato e diritto costituzionale')+li('Diritto penale e procedura penale')+li('Diritto amministrativo e diritto del lavoro')+li('Diritto commerciale e diritto internazionale')+'</ul><h5>Sbocchi professionali</h5><ul class="m-list">'+li('Avvocatura, magistratura, notariato (previo esame di Stato)')+li('Uffici legali di imprese e istituzioni')+li('Concorsi pubblici e carriera amministrativa')+'</ul>'},
 c2:{e:'Corso di Laurea',t:'Economia Aziendale &mdash; L-18',b:stats([['3','anni'],['180','CFU'],['L-18','classe']])+'<p>Un percorso completo su gestione d\'impresa, contabilit&agrave;, finanza e marketing, con taglio applicativo e casi aziendali reali.</p><h5>Materie principali</h5><ul class="m-list">'+li('Economia aziendale e ragioneria')+li('Controllo di gestione e bilancio')+li('Marketing e organizzazione aziendale')+li('Diritto commerciale e diritto tributario')+'</ul><h5>Sbocchi professionali</h5><ul class="m-list">'+li('Amministrazione, finanza e controllo')+li('Consulenza aziendale e revisione')+li('Accesso alle magistrali LM-77 / LM-56')+'</ul>'},
 c3:{e:'Corso di Laurea',t:'Scienze e Tecniche Psicologiche &mdash; L-24',b:stats([['3','anni'],['180','CFU'],['L-24','classe']])+'<p>Fondamenti teorici e metodologici della psicologia, con laboratori su strumenti di osservazione e valutazione.</p><h5>Materie principali</h5><ul class="m-list">'+li('Psicologia generale e dello sviluppo')+li('Psicologia sociale e del lavoro')+li('Psicometria e metodologia della ricerca')+li('Neuroscienze cognitive')+'</ul><h5>Sbocchi professionali</h5><ul class="m-list">'+li('Accesso alla magistrale LM-51 e alla professione di psicologo')+li('Servizi socio-educativi e risorse umane')+'</ul>'},
 c4:{e:'Corso di Laurea',t:'Scienze dell\'Educazione &mdash; L-19',b:stats([['3','anni'],['180','CFU'],['L-19','classe']])+'<p>Forma educatori professionali per i servizi all\'infanzia, il contrasto al disagio e i contesti formativi extrascolastici.</p><h5>Materie principali</h5><ul class="m-list">'+li('Pedagogia generale e sociale')+li('Didattica e progettazione educativa')+li('Psicologia dello sviluppo e dell\'educazione')+li('Sociologia dei processi culturali')+'</ul><h5>Sbocchi professionali</h5><ul class="m-list">'+li('Educatore nei servizi per l\'infanzia (0-3)')+li('Educatore nei servizi socio-educativi e territoriali')+li('Accesso alla magistrale LM-50 / LM-85')+'</ul>'},
 c5:{e:'Corso di Laurea',t:'Ingegneria Informatica &mdash; L-8',b:stats([['3','anni'],['180','CFU'],['L-8','classe']])+'<p>Competenze su programmazione, architetture, reti, basi di dati e intelligenza artificiale applicata.</p><h5>Materie principali</h5><ul class="m-list">'+li('Analisi matematica e fisica')+li('Programmazione e algoritmi')+li('Basi di dati e reti di calcolatori')+li('Intelligenza artificiale e machine learning')+'</ul><h5>Sbocchi professionali</h5><ul class="m-list">'+li('Sviluppatore software e data engineer')+li('Sistemista e specialista di reti')+li('Consulenza IT e trasformazione digitale')+'</ul>'},
 c6:{e:'Corso di Laurea',t:'Scienze Motorie &mdash; L-22',b:stats([['3','anni'],['180','CFU'],['L-22','classe']])+'<p>Formazione su attivit&agrave; motoria preventiva, sportiva e adattata, con basi solide di anatomia e fisiologia.</p><h5>Materie principali</h5><ul class="m-list">'+li('Anatomia e fisiologia umana')+li('Teoria e metodologia dell\'allenamento')+li('Attivit&agrave; motoria preventiva e adattata')+li('Management dello sport')+'</ul><h5>Sbocchi professionali</h5><ul class="m-list">'+li('Preparatore atletico e tecnico sportivo')+li('Operatore in palestre, centri fitness e societ&agrave; sportive')+li('Accesso alle magistrali LM-47 / LM-67 / LM-68')+'</ul>'},
 c7:{e:'Corso di Laurea &middot; Novit&agrave;',t:'Servizi Giuridici, Amministratori di Condominio &mdash; L-14',b:stats([['3','anni'],['180','CFU'],['L-14','classe']])+'<p>Il curriculum <b>Amministratori di condominio</b> della laurea triennale in Servizi Giuridici (classe L-14): una base giuridica completa, dal diritto privato al processuale, e insegnamenti costruiti sul lavoro di chi gestisce gli edifici, dalla governance del condominio alla contabilit&agrave; e fiscalit&agrave; condominiale.</p><h5>Materie caratterizzanti</h5><ul class="m-list">'+li('Diritto immobiliare e governance del condominio')+li('Contabilit&agrave;, controllo e fiscalit&agrave; del condominio')+li('Diritto penale dell\'edilizia e dell\'ambiente')+li('Diritto amministrativo e urbanistico')+li('Diritto privato, commerciale e del lavoro')+li('Diritto processuale civile e penale')+'</ul><h5>Sbocchi professionali</h5><ul class="m-list">'+li('Amministratore di condominio e property manager')+li('Gestione di patrimoni immobiliari, agenzie e studi tecnici')+li('Uffici legali e amministrativi di imprese edili e immobiliari')+li('Concorsi pubblici che richiedono la laurea triennale')+'</ul><p style="font-size:13px;color:var(--txt-mute)">Per esercitare come amministratore la legge richiede anche il corso di formazione iniziale e l\'aggiornamento periodico (art. 71-bis disp. att. c.c.): ti orientiamo anche su quelli.</p>'},
 m1:{e:'Master I livello &middot; Novit&agrave; 2026',t:'Made in Italy Global Leadership',b:stats([['60','CFU'],['1500','ore'],['I','livello']])+'<p><b>Executive Master in Export, Geopolitics &amp; International Business.</b> Un percorso di alta formazione nato dalla collaborazione tra atenei online partner, Orienta Campus, Forum Italiano dell\'Export e UNICESD Olympo, con protocollo d\'intesa sottoscritto a Villa Niscemi, Palermo, nell\'agosto 2026.</p><h5>Aree didattiche</h5><ul class="m-list">'+li('Strategie di export e accesso ai mercati esteri')+li('Geopolitica ed economia internazionale')+li('Contrattualistica e fiscalit&agrave; internazionale')+li('Brand Italia, storytelling e valorizzazione del Made in Italy')+li('Logistica, dogane e supply chain globale')+li('Leadership e negoziazione interculturale')+'</ul><h5>A chi si rivolge</h5><ul class="m-list">'+li('Imprenditori e manager di PMI orientate all\'export')+li('Export manager, temporary manager e consulenti')+li('Laureati che vogliono specializzarsi nel business internazionale')+'</ul><h5>Requisiti</h5><ul class="m-list">'+li('Laurea triennale o titolo equipollente')+li('Selezione tramite colloquio motivazionale')+'</ul>'},
 m2:{e:'Master I livello',t:'Management delle Imprese Turistiche',b:stats([['60','CFU'],['1500','ore'],['I','livello']])+'<p>Un master dedicato alla gestione strategica di strutture ricettive, destinazioni e prodotti turistici esperienziali, con particolare attenzione al patrimonio culturale e naturalistico italiano.</p><h5>Contenuti</h5><ul class="m-list">'+li('Destination management e marketing territoriale')+li('Revenue management e hospitality')+li('Turismo esperienziale e sostenibile')+li('Digital marketing per il turismo')+'</ul>'},
 m3:{e:'Master I livello',t:'Didattica e Innovazione Digitale',b:stats([['60','CFU'],['1500','ore'],['I','livello']])+'<p>Percorso rivolto a docenti ed educatori che vogliono aggiornare metodologie e strumenti, con valore ai fini della valutazione nelle graduatorie del comparto scuola.</p><h5>Contenuti</h5><ul class="m-list">'+li('Metodologie didattiche attive e cooperative')+li('Tecnologie per l\'apprendimento e AI in classe')+li('Didattica inclusiva, DSA e BES')+li('Valutazione e progettazione per competenze')+'</ul>'},
 m4:{e:'Master II livello',t:'Diritto dell\'Impresa Internazionale',b:stats([['60','CFU'],['1500','ore'],['II','livello']])+'<p>Alta specializzazione giuridica per chi opera in contesti transnazionali: contratti, compliance, risoluzione delle controversie e fiscalit&agrave;.</p><h5>Contenuti</h5><ul class="m-list">'+li('Contrattualistica internazionale e Incoterms')+li('Arbitrato e risoluzione delle controversie')+li('Compliance, antiriciclaggio e modelli 231')+li('Fiscalit&agrave; transfrontaliera e transfer pricing')+'</ul>'},
 m5:{e:'Alta formazione',t:'Data Analytics per il Business',b:stats([['30','CFU'],['750','ore'],['Alta','formaz.']])+'<p>Percorso pratico per trasformare i dati aziendali in decisioni: dalla raccolta alla visualizzazione, fino ai modelli predittivi.</p><h5>Contenuti</h5><ul class="m-list">'+li('Excel avanzato, SQL e fondamenti di Python')+li('Business intelligence e dashboarding')+li('Statistica applicata e modelli predittivi')+li('AI generativa nei processi aziendali')+'</ul>'},
 m6:{e:'Master I livello',t:'Management Sanitario',b:stats([['60','CFU'],['1500','ore'],['I','livello']])+'<p>Per professionisti sanitari e amministrativi che assumono responsabilit&agrave; organizzative in strutture pubbliche e private.</p><h5>Contenuti</h5><ul class="m-list">'+li('Organizzazione dei servizi sanitari')+li('Economia e programmazione sanitaria')+li('Risk management e qualit&agrave; delle cure')+li('Leadership e gestione dei team clinici')+'</ul>'},
 k1:{e:'Certificazioni',t:'Certificazioni Informatiche',b:'<p>Percorsi di formazione e certificazione delle competenze digitali, spendibili nei concorsi pubblici, nelle graduatorie scolastiche e nel mercato del lavoro.</p><h5>Ambiti</h5><ul class="m-list">'+li('Alfabetizzazione digitale e uso del pacchetto office')+li('Sicurezza informatica e privacy')+li('Web editing e comunicazione digitale')+li('Coding e pensiero computazionale')+'</ul><p style="font-size:13px;color:var(--txt-mute)">Il valore e la spendibilit&agrave; di ciascuna certificazione dipendono dall\'ente certificatore e dalla normativa vigente al momento della richiesta.</p>'},
 k2:{e:'Certificazioni',t:'Certificazioni Linguistiche',b:'<p>Preparazione ed esame per la certificazione delle competenze linguistiche secondo il Quadro Comune Europeo di Riferimento.</p><h5>Livelli disponibili</h5><ul class="m-list">'+li('B1 &mdash; Intermedio')+li('B2 &mdash; Intermedio superiore')+li('C1 &mdash; Avanzato')+li('C2 &mdash; Padronanza')+'</ul><h5>Lingue</h5><ul class="m-list">'+li('Inglese, francese, spagnolo, tedesco')+li('Italiano L2 per studenti stranieri')+'</ul>'},
 k3:{e:'Certificazioni',t:'Percorsi per Graduatorie',b:'<p>Un pacchetto di corsi e certificazioni pensato per chi partecipa alle procedure di aggiornamento delle graduatorie del comparto scuola.</p><h5>Cosa comprende</h5><ul class="m-list">'+li('Corsi di perfezionamento annuali')+li('Master di I e II livello')+li('Certificazioni informatiche e linguistiche')+li('Assistenza alla compilazione della domanda')+'</ul><p style="font-size:13px;color:var(--txt-mute)">I punteggi attribuibili sono definiti dalle tabelle ministeriali vigenti. Verifica sempre il bando di riferimento.</p>'},
 s1:{e:'Corsi singoli',t:'Corsi Singoli e CFU',b:'<p>Se ti mancano alcuni crediti per accedere a un concorso, a una classe di concorso o a una laurea magistrale, puoi iscriverti a singoli insegnamenti senza immatricolarti a un intero corso di laurea.</p><h5>Come funziona</h5><ul class="m-list">'+li('Individuiamo insieme gli insegnamenti che ti servono')+li('Ti iscrivi solo a quelli, con costi proporzionali')+li('Sostieni gli esami nelle sedi convenzionate')+li('Ricevi la certificazione dei crediti acquisiti')+'</ul>'},
 s2:{e:'Servizi',t:'Riconoscimento della Carriera',b:stats([['48h','risposta'],['0&euro;','costo'],['100%','online']])+'<p>Analizziamo gratuitamente il tuo percorso di studi e la tua esperienza professionale per stimare quanti crediti possono essere riconosciuti e quanto si accorcia il tuo percorso.</p><h5>Cosa ci serve</h5><ul class="m-list">'+li('Autocertificazione degli esami sostenuti')+li('Eventuali attestati di formazione e certificazioni')+li('Curriculum professionale aggiornato')+'</ul><p style="font-size:13px;color:var(--txt-mute)">La valutazione ha carattere orientativo. La delibera formale dei CFU riconosciuti compete all\'ateneo che eroga il corso.</p>'},
 s3:{e:'Business',t:'Formazione Aziendale',b:'<p>Progettiamo percorsi formativi su misura per imprese, studi professionali ed enti, anche in modalit&agrave; blended e finanziabili attraverso i fondi interprofessionali.</p><h5>Ambiti pi&ugrave; richiesti</h5><ul class="m-list">'+li('Internazionalizzazione ed export')+li('Digitalizzazione dei processi e AI applicata')+li('Soft skill, leadership e team management')+li('Compliance e sicurezza sul lavoro')+'</ul>'},
 qualita:{e:'Trasparenza',t:'Qualit&agrave; e Trasparenza',b:'<p>UNICESD OLYMPO SRL opera come centro di servizi di supporto all\'istruzione (ATECO 85.60.09). Le attivit&agrave; didattiche e i titoli di studio sono erogati e rilasciati dagli atenei con cui vengono attivati i singoli percorsi, secondo i rispettivi ordinamenti.</p><h5>I nostri impegni</h5><ul class="m-list">'+li('Informazione chiara su costi, durata e valore dei titoli')+li('Nessuna promessa su punteggi o esiti concorsuali non garantibili')+li('Contratti trasparenti e diritto di recesso')+li('Tutela dei dati personali ai sensi del Reg. UE 2016/679')+'</ul><h5>Dati societari</h5><ul class="m-list">'+li('UNICESD OLYMPO SRL &mdash; P.IVA 06398000825')+li('REA PA-318277 &mdash; Iscrizione 1 settembre 2015')+li('Sede legale: Via Trabia 1, 90133 Palermo')+'</ul>'},
 territorio:{e:'Terza missione',t:'Radicamento sul Territorio',b:'<p>La vocazione territoriale &egrave; parte dell\'identit&agrave; di UNICESD Olympo: una presenza capillare estesa in tutta Italia, e oltre i confini. Accanto all\'attivit&agrave; formativa, la societ&agrave; ha partecipato a progetti di valorizzazione turistica e culturale del territorio.</p><h5>Progetti</h5><ul class="m-list">'+li('Rete di poli didattici e sedi d\'esame in tutta Italia, dalla Sicilia al Nord')+li('Progetto di rilancio turistico nell\'area delle Madonie (2019)')+li('Collaborazioni con enti locali e associazioni di categoria')+li('La sede portoghese di Lisbona, primo presidio oltre confine')+'</ul>'},
 eventi:{e:'Eventi',t:'Eventi e Iniziative Culturali',b:'<p>Organizziamo convegni, seminari e incontri di orientamento aperti a studenti, professionisti e imprese.</p><h5>Prossimi appuntamenti</h5><ul class="m-list">'+li('Presentazione del Master Made in Italy Global Leadership &mdash; Palermo')+li('Open day di orientamento universitario &mdash; mensili, online')+li('Incontri sull\'internazionalizzazione delle PMI siciliane')+'</ul><p style="font-size:13px;color:var(--txt-mute)">Il calendario &egrave; indicativo. Lascia i tuoi contatti per ricevere gli inviti.</p>'},
 sedi:{e:'Sedi',t:'Sedi e Poli Didattici',b:'<p>La sede legale e direzionale &egrave; a Palermo. Gli esami si sostengono presso le sedi convenzionate con l\'ateneo di riferimento.</p><h5>Sede centrale</h5><ul class="m-list">'+li('Sede legale: Via Trabia 1, 90133 Palermo (PA)')+li('Sede operativa: Largo Lituania 11 (ex Via Danimarca), 90141 Palermo (PA)')+li('Lun &ndash; Ven 9:00 &ndash; 18:00, sabato su appuntamento')+li('Calogero Di Carlo &mdash; +39 350 965 1711 &middot; Calogero60@yahoo.it')+li('Jose Palazzolo &mdash; +39 388 113 3550 &middot; Palazzolo.jose@gmail.com')+'</ul><h5>Rete territoriale</h5><ul class="m-list">'+li('Poli didattici coordinati in Sicilia')+li('Sedi d\'esame convenzionate sul territorio nazionale')+li('Assistenza online per studenti fuori sede')+'</ul>'},
 area:{e:'Area riservata',t:'Accesso Area Studenti',b:'<p>L\'area riservata &egrave; il tuo spazio personale: piattaforma e-learning, materiali, calendario esami e stato della carriera.</p><h5>Come accedere</h5><ul class="m-list">'+li('Le credenziali vengono inviate via email al perfezionamento dell\'iscrizione')+li('L\'accesso alla piattaforma didattica avviene tramite il portale dell\'ateneo')+li('Per problemi di accesso contatta la segreteria didattica')+'</ul><p style="font-size:13px;color:var(--txt-mute)">Questa &egrave; una pagina dimostrativa: il portale di login non &egrave; attivo.</p>'},
 press1:{e:'Hashtag Magazine',t:'&laquo;UNICESD Olympo riparte&raquo;',b:'<p>Il magazine della formazione e del lavoro dedica la copertina al rilancio di UNICESD Olympo, definita <b>&laquo;la rete che ha fatto la storia della formazione&raquo;</b> che &laquo;torna a guardare al futuro&raquo;.</p><h5>Le aree del rilancio</h5><ul class="m-list">'+li('Fondi interprofessionali e Fondimpresa')+li('Formazione continua e obbligatoria')+li('E-learning e gamification')+li('Formazione professionale e manageriale')+li('Training on-the-job e catalogo corsi')+'</ul><p style="font-size:13px;color:var(--txt-mute)">Nell\'immagine: Dott. Calogero Di Carlo, UNICESD Olympo Srl.</p>'},
 press2:{e:'Comunicato stampa &middot; 8 agosto 2026',t:'Nasce il Master Made in Italy Global Leadership',b:stats([['8 ago','2026'],['Villa','Niscemi'],['4','firmatari']])+'<p>Firmato a Palermo, nella Sala degli Specchi di <b>Villa Niscemi</b>, il protocollo d\'intesa tra Forum Italiano dell\'Export, Orienta Campus, Universit&agrave; eCampus e UNICESD Olympo.</p><p>Il comunicato parla di &laquo;un\'alleanza strategica tra imprese, universit&agrave; e alta formazione per costruire la nuova classe dirigente dell\'export italiano&raquo;.</p><h5>Cosa prevede</h5><ul class="m-list">'+li('Avvio di una collaborazione strategica sulla formazione della classe dirigente dell\'export')+li('Attivit&agrave; sull\'internazionalizzazione d\'impresa')+li('Coronamento nel Master Universitario &laquo;Made in Italy Global Leadership&raquo;')+'</ul>'},
 press3:{e:'Rete universitaria',t:'Una vita dentro la formazione telematica',b:'<p>Prima di UNICESD Olympo c\'&egrave; un lungo percorso dentro l\'universit&agrave; telematica italiana: il coordinamento delle sedi nazionali, la costruzione di reti territoriali, il lavoro quotidiano con studenti che tornano a studiare da adulti.</p><h5>I numeri di quel percorso</h5><ul class="m-list">'+li('100 sedi d\'esame coordinate in Italia, di cui 15 in Sicilia')+li('Circa 60 persone nel team di coordinamento')+li('Circa 20.000 marescialli dell\'Arma accompagnati alla laurea')+'</ul><p style="font-size:13px;color:var(--txt-mute)">Immagine d\'archivio da un incontro nella rete della formazione universitaria telematica.</p>'},
 press4:{e:'Il Corriere di Firenze &middot; 16 settembre 2026',t:'Formazione, tra tecnologie emergenti e presidi locali',b:stats([['18 set','2026'],['ore','15:00'],['Roma','Via Aurelia 481']])+'<p>Il quotidiano online dedica un servizio alla convention <b>&laquo;Incontrarsi, confrontarsi, crescere&raquo;</b> organizzata da <b>UNICESD Olympo Srl</b> e promossa da <b>Calogero Di Carlo</b>, in programma venerd&igrave; 18 settembre 2026 dalle ore 15:00 al <b>TH Roma Carpegna Palace</b>, in Via Aurelia 481.</p><p>La lettura di fondo &egrave; che il comparto dell\'alta formazione, dell\'orientamento e del recupero degli studi stia attraversando una trasformazione strutturale, spinta dalla transizione digitale e dalla distanza che ancora separa i percorsi didattici dal mercato del lavoro. La risposta indicata dall\'articolo &egrave; l\'incrocio fra metodologie innovative e presidi fisici sul territorio, come argine alla dispersione scolastica.</p><h5>I temi della giornata</h5><ul class="m-list">'+li('L\'intera filiera: formazione universitaria e manageriale, orientamento, aggiornamento professionale continuo')+li('I fondi interprofessionali per lo sviluppo delle competenze aziendali')+li('Gamification, piattaforme e-learning e sistemi di intelligenza artificiale nei processi di apprendimento')+li('Il valore strategico delle certificazioni linguistiche e informatiche riconosciute')+li('La costruzione di reti nazionali e internazionali d\'eccellenza sull\'innovazione formativa')+'</ul><p>Nel pezzo viene citato il modello dei <b>Poli territoriali</b> dell\'Istituto Janus, che affianca piattaforme digitali e intelligenza artificiale didattica a tutoraggio personalizzato e supporto alle fragilit&agrave; degli studenti.</p><p><a href="https://ilcorrieredifirenze.it/formazione-tra-tecnologie-emergenti-e-presidi-locali/" target="_blank" rel="noopener" style="color:var(--cy);font-weight:600">Leggi l\'articolo su Il Corriere di Firenze &rarr;</a></p><p style="font-size:13px;color:var(--txt-mute)">Articolo pubblicato il 16 settembre 2026. I diritti restano alla testata.</p>'},
 press5:{e:'Adnkronos &middot; 16 settembre 2026',t:'A Roma la convention del comparto formazione',b:'<p>L\'agenzia di stampa nazionale d&agrave; conto dell\'appuntamento romano del <b>18 settembre 2026</b>: la convention organizzata da <b>UNICESD Olympo Srl</b> e promossa da <b>Calogero Di Carlo</b> al TH Roma Carpegna Palace.</p><p>Il servizio inquadra l\'incontro dentro la fase di trasformazione dell\'alta formazione italiana e indica come snodo l\'integrazione fra metodologie innovative e presidi territoriali, con un\'attenzione particolare alle tecnologie emergenti che stanno rendendo i percorsi pi&ugrave; flessibili e personalizzabili.</p><h5>Cosa mette a fuoco</h5><ul class="m-list">'+li('La convention come momento di confronto fra operatori, partner ed esperti del settore')+li('Universit&agrave;, orientamento, aggiornamento professionale e fondi interprofessionali')+li('Gamification, e-learning e intelligenza artificiale applicati alla didattica')+li('Il modello dei Poli territoriali come risposta alla dispersione scolastica')+'</ul><p><a href="https://www.adnkronos.com/tecnologia/formazione-a-roma-convention-del-comparto-su-tecnologie-emergenti-e-scenari-futuri_1qf3WCVx0aHghNblExq3PK" target="_blank" rel="noopener" style="color:var(--cy);font-weight:600">Leggi il lancio su Adnkronos &rarr;</a></p><p style="font-size:13px;color:var(--txt-mute)">Lancio d\'agenzia del 16 settembre 2026. I diritti restano ad Adnkronos.</p>'},
 voce1:{e:'Eccellenze Italiane &middot; Prefazione',t:'&laquo;I giovani mi emozionano&raquo;',b:stats([['35','anni in divisa'],['100','sedi d\'esame'],['77','collaboratori']])+'<p>Nella prefazione firmata per <b>Eccellenze Italiane</b>, Calogero Di Carlo racconta se stesso senza filtri. &laquo;I giovani mi emozionano, perch&eacute; sono l\'unica certezza che abbiamo per costruire un paese migliore&raquo;: in tour ne ha incontrati migliaia, e li descrive intelligenti, pronti, vivaci, capaci di confrontarsi con grandi imprenditori e di rivolgere loro domande curiose e non scontate.</p><h5>Una storia particolare</h5><p>&laquo;Per pi&ugrave; di 30 anni ho fatto il Carabiniere, non avrei mai immaginato di lasciare l\'arma e diventare imprenditore prima e professore di diritto ecclesiastico dopo.&raquo; La molla scatta incontrando un giovane imprenditore, Danilo Iervolino, che a 27 anni fonda Pegaso e rivoluziona il mondo universitario italiano con circa 500 poli didattici sparsi in tutta Italia.</p><h5>Il messaggio ai ragazzi</h5><ul class=\"m-list\">'+li('&laquo;Non piangete, non cercate il posto fisso, non avete bisogno di nulla: siete dei talenti, ognuno di voi ne ha uno, deve solo ricordarselo.&raquo;')+li('&laquo;Nel mio percorso ho fatto molti sbagli ma vi dico di non aver paura del fallimento: chi fallisce &egrave; uno che ci ha provato.&raquo;')+li('&laquo;Non lasciate la vostra terra, andate all\'estero per ampliare il bagaglio delle vostre conoscenze, ma poi tornate qui e create qualcosa di bello che faccia bene a tutti.&raquo;')+li('&laquo;Iniziate a pensare in grande, a rischiare, a vedere in ogni problema l\'opportunit&agrave; di trovare delle soluzioni.&raquo;')+'</ul><h5>Assolympo</h5><p>Nello stesso testo annuncia la nascita di <b>Assolympo</b>, l\'associazione che rappresenta, tutela e sostiene gli enti di formazione e di orientamento aderenti, con l\'obiettivo di costruire una rete nazionale, europea e internazionale che rappresenti in modo unitario gli interessi del settore della Formazione e dell\'Istruzione presso Universit&agrave;, Istituzioni, organizzazioni economiche, politiche, sindacali e sociali.</p><p style=\"font-size:13px;color:var(--txt-mute)\">Testo pubblicato da Eccellenze Italiane. I diritti restano all\'editore.</p>'},
 voce2:{e:'Sport &amp; Formazione &middot; luglio 2026',t:'La vision di Calogero Di Carlo',b:'<p>Un articolo dedicato al rapporto fra <b>sport e formazione</b> come &laquo;opportunit&agrave; e palestra di vita&raquo;. Il ritratto parte dall\'esperienza nell\'Arma &mdash; e dagli organi di rappresentanza militare Cocer, Coir e Cobar, dove impara a tutelare interessi collettivi &mdash; e arriva al lavoro quotidiano dentro l\'universit&agrave; telematica.</p><h5>La formazione</h5><ul class=\"m-list\">'+li('Da quindici anni docente di Diritto Ecclesiastico all\'Universit&agrave; Telematica Pegaso, con il coordinamento di una rete di seicento poli didattici sul territorio nazionale')+li('Un percorso partito dagli atenei di Palermo ed Enna, che in un decennio ha contribuito a cambiare il panorama dell\'istruzione grazie alla metodologia e-learning')+li('La didattica online come strumento per abbattere le barriere geografiche e promuovere l\'inclusione')+li('La collaborazione con gli istituti Janus: aule virtuali e percorsi di studio online per recuperare anni scolastici e conseguire il diploma di maturit&agrave;')+'</ul><h5>Lo sport</h5><ul class=\"m-list\">'+li('Presidente dell\'A.S.D.P. Pegaso, che promuove e coordina attivit&agrave; legate all\'atletica leggera, dal livello dilettantistico a quello agonistico')+li('Organizza ogni anno il &laquo;Memorial Salvo D\'Acquisto&raquo;, gara podistica che celebra la memoria del giovane vicebrigadiere dei Carabinieri ucciso nel settembre 1943')+li('Al suo ricordo ha dedicato il libro &laquo;Salvo D\'Acquisto: uomo ed eroe&raquo;, il cui ricavato &egrave; stato utilizzato per finanziare un progetto in Congo')+li('Sotto la sua gestione il Real Cefal&ugrave; di calcio a 5 ha raggiunto la Serie A; dall\'estate 2025 &egrave; direttore generale della Vibonese')+'</ul><h5>Il liceo sportivo</h5><p>L\'obiettivo dichiarato &egrave; offrire un\'istruzione digitale di qualit&agrave; coprendo i principali indirizzi della scuola secondaria di secondo grado. In particolare il <b>Liceo Sportivo</b> unisce una solida base scientifica e umanistica all\'attenzione per il corpo umano: ideale per chi ha una grande passione per lo sport, include nei piani di studio discipline come anatomia e fisiologia, formando una rigorosa preparazione per accedere alle facolt&agrave; di Scienze Motorie, Medicina e Fisioterapia.</p><h5>Tokenizzazione e nuove propriet&agrave;</h5><p>In una recente intervista aveva raccontato la <b>tokenizzazione</b> come una delle applicazioni pi&ugrave; concrete rese possibili dalla tecnologia blockchain: nel momento in cui i beni reali, tradizionalmente riservati a singoli individui, diventano digitali assumono una dimensione relazionale e si traducono in opportunit&agrave; per molti.</p><p style=\"font-size:13px;color:var(--txt-mute)\">Articolo pubblicato nel luglio 2026 e ripreso sui canali del fondatore. I diritti restano alla testata.</p>'},
 voce3:{e:'Effettotre &middot; dal 2009',t:'Il giornale che deve ripartire',b:stats([['2009','fondazione'],['XVI','annate'],['164','numeri']])+'<p><b>Effettotre</b> &egrave; un periodico mensile autonomo d\'informazione fondato da Calogero Di Carlo, che ne &egrave; direttore responsabile dal 2009. Redazione a Roma, in via Panisperna 207. Si occupa di <b>formazione, politica, economia e turismo</b>: gli stessi mondi che si intrecciano dentro la rete UNICESD Olympo.</p><h5>Che cosa c\'era dentro</h5><p>Il numero 164, giugno 2022, d&agrave; la misura del taglio: la presentazione a Roma del <b>Manuale di Diritto Ecclesiastico</b> scritto dallo stesso Di Carlo con don Antonino Treppiedi, il passaggio dai 24 CFU ai 60 CFU per l\'insegnamento, un\'intervista alla professoressa Ida Angela Nicotra su universit&agrave; e giovani, l\'importanza delle competenze trasversali, la nascita di un nuovo quotidiano, la Giornata mondiale contro la desertificazione, il Palermo che vola in Serie B e le rubriche di storia, cultura e cucina.</p><h5>La ripartenza</h5><ul class=\"m-list\">'+li('Riprendere la pubblicazione mensile, in formato digitale')+li('Tenere insieme le due anime della testata: informazione sulla formazione e sguardo sul territorio')+li('Dare voce alle realt&agrave; della rete, agli studenti e agli enti che ne fanno parte')+li('Recuperare e rendere consultabile l\'archivio delle annate precedenti')+'</ul><p style=\"font-size:13px;color:var(--txt-mute)\">Nell\'immagine: la copertina del numero 164, giugno 2022, anno XVI.</p>'},
 voce4:{e:'Giapeto editore &middot; gennaio 2018',t:'Le sedi, raccontate come un viaggio',b:stats([['209','pagine'],['2018','edizione'],['60+','sedi']])+'<p><b>&laquo;Le sedi dell\'Universit&agrave; Telematica Pegaso &mdash; percorsi d\'Arte e di Stile&raquo;</b>, Giapeto editore, collana <em>Arte e dintorni</em>, prima edizione gennaio 2018. Un volume che attraversa le sedi dell\'ateneo distribuite su tutto il territorio nazionale, da Nord a Sud, raccontandole insieme alle citt&agrave; che le ospitano.</p><h5>Perch&eacute; sta qui</h5><p>Quella rete di sedi &egrave; esattamente il lavoro che Calogero Di Carlo ha coordinato per anni prima di fondare UNICESD Olympo: <b>100 sedi d\'esame in Italia, di cui 15 in Sicilia</b>. Il libro &egrave; il modo pi&ugrave; diretto per capire che cosa significhi, concretamente, &laquo;essere vicini allo studente&raquo;.</p><h5>L\'indice del viaggio</h5><ul class=\"m-list\">'+li('Nord-est &mdash; Emilia Romagna, Trentino Alto Adige, Veneto')+li('Nord-ovest &mdash; Liguria, Lombardia, Piemonte')+li('Centro &mdash; Lazio, Marche, Toscana, Umbria')+li('Sud &mdash; Abruzzo, Basilicata, Calabria, Campania, Molise, Puglia')+li('Isole &mdash; Sardegna, Sicilia')+'</ul><p>La prefazione &egrave; firmata da <b>Danilo Iervolino</b>: il volume nasce dal desiderio dell\'ateneo telematico di stare vicino ai suoi studenti, riducendo disagi e spese degli spostamenti ed evitando viaggi lunghi e faticosi per raggiungere la sede d\'esame.</p><p style=\"font-size:13px;color:var(--txt-mute)\">Volume di Giapeto editore, testi di Eloisa Crocco. I diritti restano all\'editore.</p>'},
 privacy:{e:'Note legali',t:'Privacy e Note Legali',b:'<p>I dati personali raccolti tramite il modulo di contatto sono trattati da UNICESD OLYMPO SRL, con sede in Via Trabia 1, 90133 Palermo, in qualit&agrave; di titolare del trattamento, ai sensi del Regolamento UE 2016/679.</p><h5>Finalit&agrave; del trattamento</h5><ul class="m-list">'+li('Rispondere alla richiesta di informazioni e orientamento')+li('Gestire l\'eventuale iscrizione ai percorsi formativi')+li('Previo consenso, inviare comunicazioni su corsi e iniziative')+'</ul><h5>I tuoi diritti</h5><ul class="m-list">'+li('Accesso, rettifica, cancellazione e portabilit&agrave; dei dati')+li('Opposizione al trattamento e revoca del consenso')+li('Reclamo al Garante per la protezione dei dati personali')+'</ul><p style="font-size:13px;color:var(--txt-mute)">Testo dimostrativo. L\'informativa definitiva deve essere redatta e validata prima della pubblicazione del sito.</p>'}
};

/* PIANI-START: generato da _tmpimg/piani/gen_piani3.py, non modificare a mano */
var PIANI={"c1": "<div class=\"cdl-pds\" id=\"piano-di-studi\"><details class=\"cdl-pds-d\"><summary><span class=\"cdl-pds-ic\" aria-hidden=\"true\">&#128203;</span><span class=\"cdl-pds-t\"><b>Piano di studi A.A. 2026/2027</b><small>Esame per esame, anno per anno, con i CFU di ogni insegnamento</small></span><span class=\"cdl-pds-b\"><span class=\"o\">Vedi il piano di studi</span><span class=\"c\">Chiudi</span></span></summary><div class=\"cdl-pds-in\"><div class=\"pds-yrbar\"><h4>[LMG-01] Giurisprudenza</h4><span class=\"pds-aa\">2026/2027</span></div><div class=\"pds-perc\"><label>Percorso</label><div class=\"pds-perc-v\">Piano dell&#x27;A.A. 2026/2027</div></div>\n<details class=\"pds-yr\" open><summary><h5>1° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto privato</span><span class=\"pr-c\">15 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Filosofia del diritto</span><span class=\"pr-c\">15 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto romano</span><span class=\"pr-c\">15 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto costituzionale</span><span class=\"pr-c\">15 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<details class=\"pds-yr\"><summary><h5>2° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Storia del diritto medievale e moderno</span><span class=\"pr-c\">15 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto ecclesiastico</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto commerciale</span><span class=\"pr-c\">15 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto tributario</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto dell&#x27;Unione europea</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Lingua inglese</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<details class=\"pds-yr\"><summary><h5>3° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Economia politica</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto del lavoro</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto amministrativo I</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto penale I</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto penale II</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto privato comparato o Diritto pubblico comparato</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<h6 class=\"pds-gh\">Esami a scelta &middot; 3° anno (6 CFU)</h6>\n<p class=\"pds-gnote\">Esame a scelta: 6 CFU da scegliere tra questi insegnamenti</p>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Criminologia</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto di famiglia</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto dello sport</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto dei servizi pubblici</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto della privacy</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto dell&#x27;informazione e della comunicazione</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto tributario internazionale</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto punitivo e processuale tributario</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto tributario avanzato</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto della navigazione</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto della crisi d&#x27;impresa</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto societario e corporate governance</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto parlamentare</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto internazionale umanitario</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Violenza di genere e contesti migratori</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Legislazione scolastica dell&#x27;integrazione e della disabilità</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<details class=\"pds-yr\"><summary><h5>4° anno</h5><span class=\"py-tot\">59 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto civile</span><span class=\"pr-c\">15 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto internazionale</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto dell&#x27;economia</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Economia degli intermediari finanziari</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Abilità informatiche</span><span class=\"pr-c\">2 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<h6 class=\"pds-gh\">Esami a scelta &middot; 4° anno (6 CFU)</h6>\n<p class=\"pds-gnote\">Esame a scelta: 6 CFU da scegliere tra questi insegnamenti</p>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Criminologia</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto di famiglia</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto dello sport</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto dei servizi pubblici</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto della privacy</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto dell&#x27;informazione e della comunicazione</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto tributario internazionale</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto punitivo e processuale tributario</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto tributario avanzato</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto della navigazione</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto della crisi d&#x27;impresa</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto societario e corporate governance</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto parlamentare</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto internazionale umanitario</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Violenza di genere e contesti migratori</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Legislazione scolastica dell&#x27;integrazione e della disabilità</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">4° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<p class=\"pds-note\">Il piano del 5° anno, con la prova finale, si completa con la pubblicazione della coorte: te lo consegna l&#x27;orientatore insieme al piano personalizzato.</p><p class=\"pds-note\">Gli insegnamenti sono quelli pubblicati dall'ateneo per l'anno accademico 2026/2027 e possono essere aggiornati: fa fede il piano consegnato al momento dell'iscrizione.</p></div></details></div>", "c3": "<div class=\"cdl-pds\" id=\"piano-di-studi\"><details class=\"cdl-pds-d\"><summary><span class=\"cdl-pds-ic\" aria-hidden=\"true\">&#128203;</span><span class=\"cdl-pds-t\"><b>Piano di studi A.A. 2026/2027</b><small>Esame per esame, anno per anno, con i CFU di ogni insegnamento</small></span><span class=\"cdl-pds-b\"><span class=\"o\">Vedi il piano di studi</span><span class=\"c\">Chiudi</span></span></summary><div class=\"cdl-pds-in\"><div class=\"pds-yrbar\"><h4>[L-24] Scienze e tecniche psicologiche</h4><span class=\"pds-aa\">2026/2027</span></div><div class=\"pds-perc\"><label>Percorso</label><div class=\"pds-perc-v\">Curriculum: Psicologia applicata ai contesti sociali e clinici</div></div>\n<details class=\"pds-yr\" open><summary><h5>1° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia generale</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia dello sviluppo e psicologia dell&#x27;educazione</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Metodologia della ricerca</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Biologia applicata</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Neurofisiologia</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Pedagogia generale e sociale</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Discipline demoetnoantropologiche</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Lingua inglese</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Fondamenti di informatica</span><span class=\"pr-c\">3 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<details class=\"pds-yr\"><summary><h5>2° anno</h5><span class=\"py-tot\">65 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicometria</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia clinica</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia dello sviluppo tipico e atipico</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia fisiologica e delle emozioni</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psichiatria</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Filosofia della mente</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Neuropsicologia</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Tirocinio pratico valutativo</span><span class=\"pr-c\">5 CFU</span><span class=\"pr-t\">Tirocinio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<details class=\"pds-yr\"><summary><h5>3° anno</h5><span class=\"py-tot\">55 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia dinamica</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia sociale</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia della comunicazione</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia del lavoro</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia delle organizzazioni</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Deontologia ed etica professionale</span><span class=\"pr-c\">2 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Tirocinio pratico valutativo</span><span class=\"pr-c\">5 CFU</span><span class=\"pr-t\">Tirocinio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Prova finale</span><span class=\"pr-c\">3 CFU</span><span class=\"pr-t\">Prova finale</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<h6 class=\"pds-gh\">Esami a scelta &middot; 3° anno (12 CFU)</h6>\n<p class=\"pds-gnote\">Esami a scelta: 12 CFU da scegliere tra questi insegnamenti</p>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Criminologia clinica e psicopatologia forense</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia della salute</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia scolastica</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia clinica della disabilità</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Neuropsicomotricità</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">La violenza di genere</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Motivazione e crescita personale</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Etica della comunicazione</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Metodologia della ricerca sociale</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia generale II</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<p class=\"pds-note\">Laurea abilitante: il tirocinio pratico valutativo è già nel piano, come previsto dalla riforma della classe L-24.</p><p class=\"pds-note\">Gli insegnamenti sono quelli pubblicati dall'ateneo per l'anno accademico 2026/2027 e possono essere aggiornati: fa fede il piano consegnato al momento dell'iscrizione.</p></div></details></div>", "c4": "<div class=\"cdl-pds\" id=\"piano-di-studi\"><details class=\"cdl-pds-d\"><summary><span class=\"cdl-pds-ic\" aria-hidden=\"true\">&#128203;</span><span class=\"cdl-pds-t\"><b>Piano di studi A.A. 2026/2027</b><small>Esame per esame, anno per anno, con i CFU di ogni insegnamento</small></span><span class=\"cdl-pds-b\"><span class=\"o\">Vedi il piano di studi</span><span class=\"c\">Chiudi</span></span></summary><div class=\"cdl-pds-in\"><div class=\"pds-yrbar\"><h4>[L-19] Scienze dell&#x27;educazione e della formazione</h4><span class=\"pds-aa\">2026/2027</span></div><div class=\"pds-perc\"><label>Percorso</label><div class=\"pds-perc-v\">Curriculum base · disponibile anche il curriculum Infanzia (0-3)</div></div>\n<details class=\"pds-yr\" open><summary><h5>1° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Pedagogia generale e sociale</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Storia della pedagogia</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia dell&#x27;apprendimento</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia dello sviluppo e psicologia dell&#x27;educazione</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Antropologia</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Discipline demoetnoantropologiche</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Geografia</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<details class=\"pds-yr\"><summary><h5>2° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Didattica e pedagogia speciale</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Linguistica italiana</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Pedagogia sperimentale</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Istituzioni di diritto pubblico</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Lingua inglese</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Linguaggi espressivi nei processi di apprendimento e crescita personale</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Abilità informatiche e telematiche</span><span class=\"pr-c\">3 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<h6 class=\"pds-gh\">Esami a scelta &middot; 2° anno (9 CFU)</h6>\n<p class=\"pds-gnote\">Esame a scelta: 9 CFU da scegliere tra questi insegnamenti</p>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Didattica dei nuovi media</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Didattica delle emozioni e mindfulness nella scuola primaria</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Metodologie didattiche per l&#x27;inclusione</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Servizi per l&#x27;infanzia: progetti e gestione</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia dello sviluppo e delle relazioni interpersonali</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia dello sviluppo tipico e atipico</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Sociologia della comunicazione e dell&#x27;informazione</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">La violenza di genere: aspetti giuridici, psicologici e sociologici</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<details class=\"pds-yr\"><summary><h5>3° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Interventi psicologici per l&#x27;educazione e la formazione</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia dinamica</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Storia contemporanea</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Storia della filosofia</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Didattica della pedagogia interculturale</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Tirocinio</span><span class=\"pr-c\">5 CFU</span><span class=\"pr-t\">Tirocinio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Prova finale</span><span class=\"pr-c\">4 CFU</span><span class=\"pr-t\">Prova finale</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<h6 class=\"pds-gh\">Esami a scelta &middot; 3° anno (9 CFU)</h6>\n<p class=\"pds-gnote\">Esame a scelta: 9 CFU da scegliere tra questi insegnamenti</p>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Didattica dei nuovi media</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Didattica delle emozioni e mindfulness nella scuola primaria</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Metodologie didattiche per l&#x27;inclusione</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Servizi per l&#x27;infanzia: progetti e gestione</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia dello sviluppo e delle relazioni interpersonali</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia dello sviluppo tipico e atipico</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Sociologia della comunicazione e dell&#x27;informazione</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">La violenza di genere: aspetti giuridici, psicologici e sociologici</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details><p class=\"pds-note\">Gli insegnamenti sono quelli pubblicati dall'ateneo per l'anno accademico 2026/2027 e possono essere aggiornati: fa fede il piano consegnato al momento dell'iscrizione.</p></div></details></div>", "c5": "<div class=\"cdl-pds\" id=\"piano-di-studi\"><details class=\"cdl-pds-d\"><summary><span class=\"cdl-pds-ic\" aria-hidden=\"true\">&#128203;</span><span class=\"cdl-pds-t\"><b>Piano di studi A.A. 2026/2027</b><small>Esame per esame, anno per anno, con i CFU di ogni insegnamento</small></span><span class=\"cdl-pds-b\"><span class=\"o\">Vedi il piano di studi</span><span class=\"c\">Chiudi</span></span></summary><div class=\"cdl-pds-in\"><div class=\"pds-yrbar\"><h4>[L-8] Ingegneria informatica e dell&#x27;automazione</h4><span class=\"pds-aa\">2026/2027</span></div><div class=\"pds-perc\"><label>Percorso</label><div class=\"pds-perc-v\">Curriculum: Computational Intelligence · disponibile anche Automation and Robotics</div></div>\n<details class=\"pds-yr\" open><summary><h5>1° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Calculus (Analisi matematica)</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Physics (Fisica)</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Foundations of Computer Science</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Electrical Engineering</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Linear Algebra and Analytic Geometry</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Numerical Analysis</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Advanced Technical English</span><span class=\"pr-c\">3 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<details class=\"pds-yr\"><summary><h5>2° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Electronic Computers and Operating Systems</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Introduction to Artificial Intelligence and Machine Learning</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Introduction to Control Systems</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Electronics of Digital Systems</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Algorithms and Data Structures</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Telecommunications Networks</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Decision Support Systems</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Italian Language and Culture o Career Design</span><span class=\"pr-c\">3 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<details class=\"pds-yr\"><summary><h5>3° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Internet of Things</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">AI-Driven Automation</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Explainable AI</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">AI Management</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Operations Research</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Mechanical and Thermal Measurements</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Final Test (prova finale)</span><span class=\"pr-c\">3 CFU</span><span class=\"pr-t\">Prova finale</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<h6 class=\"pds-gh\">Esami a scelta &middot; 3° anno (18 CFU)</h6>\n<p class=\"pds-gnote\">Esami a scelta: 18 CFU da scegliere tra questi insegnamenti</p>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Expert Systems and Soft Computing</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Mathematical and Statistical Models for AI</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">AI-Driven Embedded Systems</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Advanced Cybersecurity Technologies</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">User Interfaces &amp; Apps</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Business Economics and Management</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Training Internship</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Inglese</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details><p class=\"pds-note\">Gli insegnamenti sono quelli pubblicati dall'ateneo per l'anno accademico 2026/2027 e possono essere aggiornati: fa fede il piano consegnato al momento dell'iscrizione.</p></div></details></div>", "c6": "<div class=\"cdl-pds\" id=\"piano-di-studi\"><details class=\"cdl-pds-d\"><summary><span class=\"cdl-pds-ic\" aria-hidden=\"true\">&#128203;</span><span class=\"cdl-pds-t\"><b>Piano di studi A.A. 2026/2027</b><small>Esame per esame, anno per anno, con i CFU di ogni insegnamento</small></span><span class=\"cdl-pds-b\"><span class=\"o\">Vedi il piano di studi</span><span class=\"c\">Chiudi</span></span></summary><div class=\"cdl-pds-in\"><div class=\"pds-yrbar\"><h4>[L-22] Scienze delle attività motorie e sportive</h4><span class=\"pds-aa\">2026/2027</span></div><div class=\"pds-perc\"><label>Percorso</label><div class=\"pds-perc-v\">Curriculum base</div></div>\n<details class=\"pds-yr\" open><summary><h5>1° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Teoria dell&#x27;apprendimento motorio e metodologia didattica in età evolutiva</span><span class=\"pr-c\">15 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Anatomia umana</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Fisiologia umana e dello sport</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Fondamenti di biologia e chimica</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Pedagogia generale</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia generale e dell&#x27;attività fisica</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Lingua inglese</span><span class=\"pr-c\">3 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<details class=\"pds-yr\"><summary><h5>2° anno</h5><span class=\"py-tot\">63 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Didattica degli sport individuali</span><span class=\"pr-c\">18 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Didattica degli sport di squadra</span><span class=\"pr-c\">15 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Fondamenti di biomeccanica del movimento umano</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia delle emozioni e della comunicazione</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Teoria e didattica degli sport natatori</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Tirocini</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Tirocinio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<h6 class=\"pds-gh\">Esami a scelta &middot; 2° anno (6 CFU)</h6>\n<p class=\"pds-gnote\">Esame a scelta: 6 CFU da scegliere tra questi insegnamenti</p>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia dello sport e gestione mentale dell&#x27;atleta</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Gestione e marketing delle imprese sportive</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Medicina fisica e riabilitativa</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Farmaci e doping</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Pedagogia del gioco e dello sport</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Sociologia dello sport e della salute</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Neuropsicomotricità</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia della salute</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia del ciclo di vita</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<details class=\"pds-yr\"><summary><h5>3° anno</h5><span class=\"py-tot\">57 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Attività motorie preventive e adattate</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Teoria e metodologia dell&#x27;allenamento</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Didattica e pedagogia speciale</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto privato e dello sport</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto pubblico</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Endocrinologia applicata all&#x27;attività motoria</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Informatica</span><span class=\"pr-c\">2 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Prova finale</span><span class=\"pr-c\">4 CFU</span><span class=\"pr-t\">Prova finale</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<h6 class=\"pds-gh\">Esami a scelta &middot; 3° anno (6 CFU)</h6>\n<p class=\"pds-gnote\">Esame a scelta: 6 CFU da scegliere tra questi insegnamenti</p>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia dello sport e gestione mentale dell&#x27;atleta</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Gestione e marketing delle imprese sportive</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Medicina fisica e riabilitativa</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Farmaci e doping</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Pedagogia del gioco e dello sport</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Sociologia dello sport e della salute</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Neuropsicomotricità</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia della salute</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Psicologia del ciclo di vita</span><span class=\"pr-c\">&mdash;</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details><p class=\"pds-note\">Gli insegnamenti sono quelli pubblicati dall'ateneo per l'anno accademico 2026/2027 e possono essere aggiornati: fa fede il piano consegnato al momento dell'iscrizione.</p></div></details></div>", "c7": "<div class=\"cdl-pds\" id=\"piano-di-studi\"><details class=\"cdl-pds-d\"><summary><span class=\"cdl-pds-ic\" aria-hidden=\"true\">&#128203;</span><span class=\"cdl-pds-t\"><b>Piano di studi A.A. 2026/2027</b><small>Esame per esame, anno per anno, con i CFU di ogni insegnamento</small></span><span class=\"cdl-pds-b\"><span class=\"o\">Vedi il piano di studi</span><span class=\"c\">Chiudi</span></span></summary><div class=\"cdl-pds-in\"><div class=\"pds-yrbar\"><h4>[L-14] Servizi giuridici</h4><span class=\"pds-aa\">2026/2027</span></div><div class=\"pds-perc\"><label>Percorso</label><div class=\"pds-perc-v\">Curriculum: Amministratori di condominio</div></div>\n<details class=\"pds-yr\" open><summary><h5>1° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto privato</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Filosofia del diritto</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto costituzionale</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Storia del diritto italiano</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto romano</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Lingua inglese</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<h6 class=\"pds-gh\">Esami a scelta &middot; 1° anno (9 CFU)</h6>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Economia politica o Scienza delle finanze (uno a scelta)</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">1° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<details class=\"pds-yr\"><summary><h5>2° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto del lavoro</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto immobiliare e governance del condominio</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto penale dell&#x27;edilizia e dell&#x27;ambiente</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Contabilità, controllo e fiscalità del condominio</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto commerciale</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Abilità informatiche</span><span class=\"pr-c\">2 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Seminario «Comunicazione e public speaking»</span><span class=\"pr-c\">1 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<h6 class=\"pds-gh\">Esami a scelta &middot; 2° anno (9 CFU)</h6>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto dell&#x27;Unione europea o Diritto privato europeo (uno a scelta)</span><span class=\"pr-c\">9 CFU</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">2° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<details class=\"pds-yr\"><summary><h5>3° anno</h5><span class=\"py-tot\">60 CFU</span><span class=\"py-btn\"><span class=\"o\">Apri</span><span class=\"c\">Chiudi</span></span></summary>\n<h6 class=\"pds-gh\">Obbligatori</h6>\n<div class=\"pds-rh\"><span>Insegnamento</span><span>CFU</span><span>Tipo</span><span>Anno</span><span>Lingua</span><span></span></div>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto amministrativo e urbanistico</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto processuale penale</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Diritto processuale civile</span><span class=\"pr-c\">12 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Seminario «La gestione del colloquio per l&#x27;inserimento nel mondo del lavoro»</span><span class=\"pr-c\">2 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Laboratorio di scrittura</span><span class=\"pr-c\">2 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Laboratorio «Ricerca bibliografica e nuove tecnologie»</span><span class=\"pr-c\">2 CFU</span><span class=\"pr-t\">Obbligatorio</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Prova finale</span><span class=\"pr-c\">6 CFU</span><span class=\"pr-t\">Prova finale</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n<h6 class=\"pds-gh\">Esami a scelta &middot; 3° anno (18 CFU)</h6>\n<details class=\"pds-row\"><summary><span class=\"pr-n\">Esami a scelta dello studente</span><span class=\"pr-c\">18 CFU</span><span class=\"pr-t\">A scelta</span><span class=\"pr-a\">3° anno</span><span class=\"pr-l\"><i class=\"pbadge lang\">Italiano</i></span><span class=\"pr-x\" aria-hidden=\"true\"></span></summary><div class=\"pr-d\"><span>Anno di offerta <b>2026/2027</b></span><span>Erogazione: <b>Online</b></span><a href=\"#iscrizione\">Richiedi il programma</a></div></details>\n</details>\n<p class=\"pds-note\">Piano dell&#x27;A.A. 2026/2027. Al 1° e al 2° anno c&#x27;è un insegnamento da scegliere fra due; al 3° anno 18 CFU a scelta fra gli esami consigliati.</p><p class=\"pds-note\">Gli insegnamenti sono quelli pubblicati dall'ateneo per l'anno accademico 2026/2027 e possono essere aggiornati: fa fede il piano consegnato al momento dell'iscrizione.</p></div></details></div>", "c2": "<div class=\"cdl-pds\" id=\"piano-di-studi\"><details class=\"cdl-pds-d\"><summary><span class=\"cdl-pds-ic\" aria-hidden=\"true\">&#128203;</span><span class=\"cdl-pds-t\"><b>Piano di studi A.A. 2026/2027</b><small>Il piano completo te lo consegna l'orientatore</small></span><span class=\"cdl-pds-b\"><span class=\"o\">Vedi il piano di studi</span><span class=\"c\">Chiudi</span></span></summary><div class=\"cdl-pds-in\"><div class=\"pds-yrbar\"><h4>Piano di studi</h4><span class=\"pds-aa\">2026/2027</span></div><div class=\"pds-empty\"><b>Piano esame per esame su richiesta.</b> Per questo corso il piano completo dell'A.A. 2026/2027 viene consegnato dall'orientatore, insieme alla verifica dei CFU che hai gi&agrave;. <a href=\"#iscrizione\">Richiedilo ora</a></div><p class=\"pds-note\">Gli insegnamenti sono quelli pubblicati dall'ateneo per l'anno accademico 2026/2027 e possono essere aggiornati: fa fede il piano consegnato al momento dell'iscrizione.</p></div></details></div>"};
/* PIANI-END */
/* schede dedicate (versione online): la costante viene valorizzata dal build del sito */
var PAGE_URL=(typeof window.UO_PAGES==='object'&&window.UO_PAGES)||{};
var mbg=$('#mbg');
function openModal(k){
  var d=DATA[k]; if(!d)return;
  $('#m-eye').innerHTML='<em></em> <span>'+d.e+'</span>';
  $('#m-title').innerHTML=d.t;
  var pg=PAGE_URL[k];
  $('#m-body').innerHTML=d.b+((typeof PIANI==='object'&&PIANI[k])||'')+'<div style="display:flex;gap:11px;flex-wrap:wrap;margin-top:26px">'+(pg?'<a href="'+pg+'" class="btn btn-g" data-page>Scheda completa</a>':'')+'<a href="#iscrizione" class="btn btn-p" data-close><span>Richiedi informazioni</span></a><button class="btn btn-g" data-close>Chiudi</button></div>';
  mob.classList.remove('on'); bg.classList.remove('on');
  mbg.classList.add('on'); document.body.style.overflow='hidden';
}
function closeModal(){mbg.classList.remove('on');document.body.style.overflow=''}
document.addEventListener('click',function(e){
  if(e.target.closest('a[data-page]'))return;
  var t=e.target.closest('[data-modal]');
  if(t){e.preventDefault();openModal(t.getAttribute('data-modal'));return}
  if(e.target.closest('[data-close]')){closeModal();return}
});
$('#mx').addEventListener('click',closeModal);
mbg.addEventListener('click',function(e){if(e.target===mbg)closeModal()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeModal();$$('[data-drop]').forEach(function(x){x.classList.remove('open')})}});

/* ---------- FORM ---------- */
var form=$('#lead');
function setErr(f,on){f.classList.toggle('err',on)}
form.addEventListener('submit',function(e){
  e.preventDefault();
  var ok=true, g=function(n){return form.querySelector('[name="'+n+'"]')};
  [['nome',2],['cognome',2]].forEach(function(a){
    var el=g(a[0]),bad=el.value.trim().length<a[1]; setErr(el.parentElement,bad); if(bad)ok=false;
  });
  var em=g('email'),badEm=!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(em.value.trim()); setErr(em.parentElement,badEm); if(badEm)ok=false;
  var tl=g('tel'),badTl=(tl.value.replace(/\D/g,'').length<8); setErr(tl.parentElement,badTl); if(badTl)ok=false;
  var ar=g('area'),badAr=!ar.value; setErr(ar.parentElement,badAr); if(badAr)ok=false;
  if(!g('privacy').checked){ok=false;showToast('Devi accettare l\'informativa privacy per proseguire.')}
  if(!ok){var f1=form.querySelector('.field.err');if(f1)f1.scrollIntoView({behavior:'smooth',block:'center'});return}

  var btn=$('#submitBtn'),old=btn.innerHTML;
  btn.innerHTML='<span>Invio in corso&hellip;</span>'; btn.style.pointerEvents='none';
  setTimeout(function(){
    btn.innerHTML=old; btn.style.pointerEvents='';
    var nome=g('nome').value.trim();
    $('#m-eye').innerHTML='<em style="background:#2ee6a0;box-shadow:0 0 10px #2ee6a0"></em> <span>Richiesta inviata</span>';
    $('#m-title').innerHTML='Grazie, '+nome+'!';
    $('#m-body').innerHTML='<div class="ok-icon" style="position:relative"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg></div><p style="text-align:center">Abbiamo ricevuto la tua richiesta. Un orientatore UNICESD Olympo ti contatter&agrave; <b>entro 24 ore lavorative</b> per un colloquio gratuito e senza impegno.</p><h5>Cosa succede adesso</h5><ul class="m-list">'+li('Analizziamo il tuo profilo e i crediti gi&agrave; maturati')+li('Ti proponiamo il percorso pi&ugrave; adatto ai tuoi obiettivi')+li('Ricevi un preventivo chiaro con le opzioni di rateizzazione')+'</ul><div style="margin-top:24px;padding:16px;border-radius:14px;border:1px solid var(--line);background:var(--surface);font-size:13px;color:var(--txt-mute);text-align:center">Nota: questo &egrave; un sito dimostrativo. Il modulo non invia realmente i dati a un server.</div><div style="display:flex;gap:11px;flex-wrap:wrap;margin-top:22px"><button class="btn btn-p" data-close style="flex:1"><span>Perfetto, chiudi</span></button></div>';
    mbg.classList.add('on'); document.body.style.overflow='hidden';
    form.reset(); $$('.field').forEach(function(f){f.classList.remove('err')});
  },1250);
});
$$('.field input,.field select').forEach(function(el){
  el.addEventListener('input',function(){el.parentElement.classList.remove('err')});
  el.addEventListener('change',function(){el.parentElement.classList.remove('err')});
});

/* ---------- SMOOTH ANCHORS ---------- */
$$('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var id=a.getAttribute('href'); if(id.length<2)return;
    var el=document.querySelector(id); if(!el)return;
    e.preventDefault(); closeModal();
    mob.classList.remove('on'); bg.classList.remove('on'); document.body.style.overflow='';
    $$('[data-drop]').forEach(function(x){x.classList.remove('open')});
    window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-76,behavior:'smooth'});
  });
});

/* ---------- PARALLAX HERO ---------- */
var hv=$('.hero-visual');
window.addEventListener('scroll',function(){
  if(!hv||window.innerWidth<1080)return;
  var y=window.scrollY;
  if(y<900)hv.style.transform='translateY('+(y*-.08)+'px)';
},{passive:true});


/* ---------- FILTRI RETE E PARTNERSHIP ---------- */
(function(){
  var btns=$$('#pfilters .tab'), cards=$$('#pgrid .pcard');
  if(!btns.length||!cards.length)return;
  btns.forEach(function(b){
    b.addEventListener('click',function(){
      btns.forEach(function(x){x.classList.remove('on')});
      b.classList.add('on');
      var c=b.getAttribute('data-cat');
      cards.forEach(function(k){
        var ok=(c==='all'||k.getAttribute('data-cat')===c);
        k.style.display=ok?'':'none';
        if(ok)k.classList.add('in');
      });
    });
  });
})();


/* ---------- LA VOCE DELL'OLYMPO: pagina notizie + popup con la locandina ----------
   Popup (#vobg): compare da data-pub per data-giorni giorni, una volta per visita, e si chiude con la X
   (o Esc / clic fuori). Scaduto il periodo non compare piu'. Prove: ?voce=1 in fondo all'indirizzo.
   La sezione #voce-olympo non sta in home: online e' la pagina /la-voce-dell-olympo/,
   nel file unico si apre dalla voce di menu. */
(function(){
  var sec=$('#voce-olympo'), now=Date.now();

  /* notizie: badge "Nuovo" nei primi giorni e "Leggi il piano completo" */
  $$('.vo-item').forEach(function(it){
    var t=Date.parse(it.getAttribute('data-pub')||''), g=parseFloat(it.getAttribute('data-giorni')); if(isNaN(g))g=3;
    if(!isNaN(t) && now>=t && now<t+g*86400000) it.classList.add('is-new');
    var b=it.querySelector('.vo-more'), d=it.querySelector('.vo-detail'); if(!b||!d)return;
    b.addEventListener('click',function(){
      var on=d.hasAttribute('hidden');
      if(on)d.removeAttribute('hidden'); else d.setAttribute('hidden','');
      b.setAttribute('aria-expanded',on?'true':'false');
      b.querySelector('span').textContent=on?'Chiudi il piano':'Leggi il piano completo';
    });
  });

  /* sezioni che non stanno in home (La Voce, schede degli enti): online sono pagine a se',
     nel file unico si aprono al clic sul link che le richiama */
  var PAGINE={'voce-olympo':'/la-voce-dell-olympo/','janus':'/janus-diploma-online/','athena':'/medicina-senza-test-ingresso/'};
  var online=/^https?:/.test(location.protocol) && !!window.UO_PAGES;
  function showSec(el){
    el.classList.add('show');
    $$('.rv,.rv-l,.rv-r,.rv-s',el).forEach(function(e){e.classList.add('in')});
    setTimeout(function(){ window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-76,behavior:'smooth'}) },60);
  }
  function showVoce(){ if(sec)showSec(sec) }
  document.addEventListener('click',function(e){
    var a=e.target.closest && e.target.closest('a[href^="#"]'); if(!a)return;
    var id=a.getAttribute('href').slice(1), el=id&&document.getElementById(id); if(!el)return;
    var box=el.classList.contains('vo-page')||el.classList.contains('ente-page') ? el : el.closest('.vo-page,.ente-page');
    if(!box || document.body.classList.contains('sub'))return;
    if(online && PAGINE[box.id]){ e.preventDefault(); e.stopPropagation(); location.href=PAGINE[box.id]+(box===el?'':'#'+id); return }
    box.classList.add('show');
    if(box!==el) $$('.rv,.rv-l,.rv-r,.rv-s',box).forEach(function(x){x.classList.add('in')});
  },true);
  window.addEventListener('hashchange',function(){ var el=document.getElementById(location.hash.slice(1)); if(el&&(el.classList.contains('vo-page')||el.classList.contains('ente-page')))showSec(el) });
  (function(){ var el=location.hash&&document.getElementById(location.hash.slice(1)); if(el&&(el.classList.contains('vo-page')||el.classList.contains('ente-page')))showSec(el) })();

  /* rete: "Vuoi saperne di piu'?" sulle schede della home */
  if(!document.body.classList.contains('sub')){
    $$('#pgrid .pcard').forEach(function(card){
      var b=document.createElement('button'); b.type='button'; b.className='pc-more';
      b.innerHTML='<span>Vuoi saperne di pi&ugrave;?</span><svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l5 5 5-5"/></svg>';
      b.addEventListener('click',function(){ var on=card.classList.toggle('open'); b.querySelector('span').innerHTML=on?'Mostra meno':'Vuoi saperne di pi&ugrave;?' });
      card.appendChild(b);
    });
  }

  /* popup */
  var bg=$('#vobg'); if(!bg)return;
  if(document.body.classList.contains('sub') && sec) return;   // sulla pagina della Voce non serve
  var from=Date.parse(bg.getAttribute('data-pub')||''), gg=parseFloat(bg.getAttribute('data-giorni')); if(isNaN(gg))gg=3;
  var forza=/[?&]voce=1/.test(location.search);
  if(!forza && (isNaN(from) || now<from || now>=from+gg*86400000)) return;
  var KEY='uo-voce-'+(bg.getAttribute('data-id')||'news');
  try{ if(!forza && sessionStorage.getItem(KEY))return }catch(e){}

  var ck=$('#cookie'), ckWas=false;
  function open(){
    if(ck && ck.classList.contains('on')){ ckWas=true; ck.classList.remove('on') }
    bg.classList.add('on'); document.body.classList.add('vo-open'); document.body.style.overflow='hidden';
    try{ sessionStorage.setItem(KEY,'1') }catch(e){}
  }
  function close(){
    bg.classList.remove('on'); document.body.classList.remove('vo-open'); document.body.style.overflow='';
    if(ckWas && ck){ ckWas=false; setTimeout(function(){ck.classList.add('on')},400) }
  }
  $('#vox').addEventListener('click',close);
  bg.addEventListener('click',function(e){ if(e.target===bg)close() });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&bg.classList.contains('on'))close() });
  /* clic sulla locandina: online va alla pagina della Voce, nel file unico apre la sezione */
  $$('#vogo,#vogo2').forEach(function(a){ a.addEventListener('click',function(e){
    e.preventDefault(); e.stopPropagation(); close();
    var h=$('header a.nav-voce'), url=h && h.getAttribute('href');
    if(url && url.charAt(0)!=='#') location.href=url; else showVoce();
  }) });

  var pl=$('#preloader'), tries=0;
  (function wait(){
    if(pl && !pl.classList.contains('done') && tries++<60){ setTimeout(wait,250); return }
    setTimeout(open,800);
  })();
})();

/* ---------- POPUP EVENTO IN EVIDENZA ---------- */
(function(){
  var evbg=$('#evbg'); if(!evbg)return;
  var form=$('#evform'), main=$('#evpop-main'), cookieEl=$('#cookie');
  var cookieWasOpen=false, opened=false;
  var KEY='unicesd-evento-18set2026';
  /* SEMPRE=true: il popup si apre a ogni caricamento della pagina, anche dopo un aggiornamento.
     Mettilo a false per tornare alla regola "una volta ogni 24 ore per visitatore". */
  var SEMPRE=true;

  function seen(){ if(SEMPRE)return false; try{ var v=localStorage.getItem(KEY); return v && (Date.now()-parseInt(v,10))<86400000; }catch(e){ return false } }
  /* ?evento=1 (o #evento) in fondo all'indirizzo: il popup si apre sempre, senza memorizzare nulla. Serve per le prove. */
  var forza=/[?&]evento=1/.test(location.search)||location.hash==='#evento';
  function mark(){ if(SEMPRE||forza)return; try{ localStorage.setItem(KEY,String(Date.now())); }catch(e){} }

  function open(){
    if(evbg.classList.contains('on'))return;
    if(cookieEl && cookieEl.classList.contains('on')){ cookieWasOpen=true; cookieEl.classList.remove('on') }
    evbg.classList.add('on');
    document.body.style.overflow='hidden';
    opened=true; mark();
    setTimeout(function(){ var f=$('#ev-nome'); if(f && window.innerWidth>860)f.focus() },520);
  }
  function close(){
    evbg.classList.remove('on');
    document.body.style.overflow='';
    if(cookieWasOpen && cookieEl){ cookieWasOpen=false; setTimeout(function(){cookieEl.classList.add('on')},400) }
  }

  $('#evx').addEventListener('click',close);
  var later=$('#evlater'); if(later)later.addEventListener('click',function(e){e.preventDefault();close()});
  evbg.addEventListener('click',function(e){ if(e.target===evbg)close() });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&evbg.classList.contains('on'))close() });
  $$('[data-evopen]').forEach(function(b){ b.addEventListener('click',function(e){e.preventDefault();open()}) });

  /* apertura automatica DISATTIVATA su richiesta: il popup si apre solo cliccando i pulsanti [data-evopen] (es. "Richiedi informazioni") */
  // if(forza||!seen()) setTimeout(function(){ if(!opened)open() },forza?1200:6000);

  /* invio */
  function bad(el,cond){ var f=el.closest('.field'); f.classList.toggle('err',!cond); return cond }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var n=$('#ev-nome'), t=$('#ev-tel'), m=$('#ev-mail'), pv=$('#ev-priv'), ok=true;
    ok = bad(n, n.value.trim().length>2) && ok;
    ok = bad(t, t.value.replace(/[^0-9]/g,'').length>=8) && ok;
    ok = bad(m, /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(m.value.trim())) && ok;
    if(!pv.checked){ ok=false; pv.parentNode.style.color='#ff9aa4'; setTimeout(function(){pv.parentNode.style.color=''},2200) }
    if(!ok)return;
    var btn=form.querySelector('button[type=submit]');
    btn.innerHTML='<span>Invio in corso...</span>'; btn.disabled=true;
    setTimeout(function(){
      main.innerHTML='<div class="evpop-ok">'
        +'<div class="ok-icon" style="position:relative"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg></div>'
        +'<h3 style="margin-bottom:10px">Richiesta ricevuta</h3>'
        +'<p>Ti inviamo il programma completo della Convention del <b style="color:#fff">18 settembre 2026</b> e le modalit&agrave; di adesione. Per qualsiasi cosa chiama <b style="color:#fff">+39 350 965 1711</b> o scrivi a <b style="color:#fff">Calogero60@yahoo.it</b>.</p>'
        +'<div style="padding:14px 16px;border-radius:13px;border:1px solid rgba(130,180,255,.24);background:rgba(255,255,255,.05);font-size:12.6px;color:#93a6cb;margin-bottom:18px">Nota: questo &egrave; un sito dimostrativo, il modulo non invia ancora i dati a un server.</div>'
        +'<button class="btn btn-p" id="evdone" style="width:100%"><span>Chiudi</span></button></div>';
      $('#evdone').addEventListener('click',close);
    },900);
  });
})();

/* ---------- MODULO "APRI UNA SEDE" (E-LEARNING CENTER POINT) ---------- */
(function(){
  var f=$('#sedeform'); if(!f)return;
  function mark(el,bad){ var w=el.closest('.field'); if(w)w.classList.toggle('err',bad); return !bad }
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var n=$('#s-nome'), c=$('#s-cognome'), m=$('#s-mail'), t=$('#s-tel'),
        ct=$('#s-citta'), tp=$('#s-tipo'), im=$('#s-imm'), pv=$('#s-priv'), ok=true;
    ok = mark(n,  n.value.trim().length<2) && ok;
    ok = mark(c,  c.value.trim().length<2) && ok;
    ok = mark(m,  !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(m.value.trim())) && ok;
    ok = mark(t,  t.value.replace(/\D/g,'').length<8) && ok;
    ok = mark(ct, ct.value.trim().length<2) && ok;
    ok = mark(tp, !tp.value) && ok;
    ok = mark(im, !im.value) && ok;
    if(!pv.checked){ ok=false; showToast('Devi accettare l\'informativa privacy per proseguire.') }
    if(!ok){ var f1=f.querySelector('.field.err'); if(f1)f1.scrollIntoView({behavior:'smooth',block:'center'}); return }

    var btn=f.querySelector('button[type=submit]'), old=btn.innerHTML;
    btn.innerHTML='<span>Invio in corso&hellip;</span>'; btn.style.pointerEvents='none';
    setTimeout(function(){
      btn.innerHTML=old; btn.style.pointerEvents='';
      $('#m-eye').innerHTML='<em style="background:#2ee6a0;box-shadow:0 0 10px #2ee6a0"></em> <span>Richiesta inviata</span>';
      $('#m-title').innerHTML='Grazie, '+n.value.trim()+'!';
      $('#m-body').innerHTML='<div class="ok-icon" style="position:relative"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg></div>'
        +'<p style="text-align:center">Abbiamo ricevuto la tua candidatura come <b>E&#8209;Learning Center Point</b> per <b>'+ct.value.trim()+'</b>. Ti ricontattiamo per la verifica dei requisiti.</p>'
        +'<h5>Cosa succede adesso</h5><ul class="m-list">'
        +li('Verifichiamo insieme metrature e dotazione dei locali')
        +li('Controlliamo i requisiti di accreditamento della tua regione')
        +li('Definiamo convenzione, formazione dello staff e accesso alla piattaforma')
        +'</ul>'
        +'<h5>Nel frattempo puoi scriverci</h5><ul class="m-list">'
        +li('Calogero Di Carlo &mdash; +39 350 965 1711 &middot; Calogero60@yahoo.it')
        +li('Jose Palazzolo &mdash; +39 388 113 3550 &middot; Palazzolo.jose@gmail.com')
        +'</ul>'
        +'<div style="margin-top:24px;padding:16px;border-radius:14px;border:1px solid var(--line);background:var(--surface);font-size:13px;color:var(--txt-mute);text-align:center">Nota: questo &egrave; un sito dimostrativo. Il modulo non invia ancora i dati a un server.</div>'
        +'<div style="display:flex;gap:11px;flex-wrap:wrap;margin-top:22px"><button class="btn btn-p" data-close style="flex:1"><span>Perfetto, chiudi</span></button></div>';
      mbg.classList.add('on'); document.body.style.overflow='hidden';
      f.reset(); f.querySelectorAll('.field').forEach(function(x){x.classList.remove('err')});
    },1150);
  });
  f.querySelectorAll('.field input,.field select').forEach(function(el){
    el.addEventListener('input',function(){ var w=el.closest('.field'); if(w)w.classList.remove('err') });
    el.addEventListener('change',function(){ var w=el.closest('.field'); if(w)w.classList.remove('err') });
  });
})();


/* ---------- NAV: tenere tutto dentro lo schermo ---------- */
(function(){
  var hdr=$('#hdr'); if(!hdr) return;
  var nav=$('.nav',hdr), menu=$('#menu'), acts=$('.nav-actions',hdr);
  var moreLi=$('#navMore'), moreDrop=$('#navMoreDrop');
  if(!nav||!menu||!acts||!moreLi||!moreDrop) return;

  var ordered=$$('#menu > li').filter(function(li){
    return !li.hasAttribute('data-drop') && li!==moreLi && !li.classList.contains('nav-keep') && li.querySelector('a');
  });

  var brand=$('.brand',hdr);
  function menuWidth(){
    var g=parseFloat(getComputedStyle(menu).columnGap||getComputedStyle(menu).gap)||0;
    var w=0,c=0;
    $$('#menu > li').forEach(function(li){
      if(li.hidden||getComputedStyle(li).display==='none') return;
      var kid=li.firstElementChild; if(!kid) return;
      w+=kid.getBoundingClientRect().width; c++;
    });
    return w+Math.max(0,c-1)*g;
  }
  /* >0 = non ci sta */
  function overflow(){
    var cs=getComputedStyle(nav);
    var gap=parseFloat(cs.columnGap||cs.gap)||0;
    var avail=nav.clientWidth-(parseFloat(cs.paddingLeft)||0)-(parseFloat(cs.paddingRight)||0);
    return brand.getBoundingClientRect().width+menuWidth()+acts.getBoundingClientRect().width+gap*2-avail;
  }

  var running=false;
  function fit(){
    if(running) return; running=true;
    hdr.classList.remove('compact'); hdr.classList.remove('tight');
    ordered.forEach(function(li){ li.style.display=''; });
    moreDrop.innerHTML=''; moreLi.hidden=true; moreLi.classList.remove('open');
    if(getComputedStyle(menu).display==='none'){ running=false; return; }
    if(overflow()>-10) hdr.classList.add('compact');
    if(overflow()>-10) hdr.classList.add('tight');
    var i=ordered.length, guard=0;
    while(overflow()>-10 && i>0 && guard++<26){
      i--;
      var li=ordered[i], a=li.querySelector('a');
      if(!a){ continue; }
      var c=document.createElement('a');
      c.href=a.getAttribute('href');
      c.textContent=a.textContent.trim();
      moreDrop.insertBefore(c, moreDrop.firstChild);
      li.style.display='none';
      moreLi.hidden=false;
    }
    if(!moreDrop.children.length) moreLi.hidden=true;
    running=false;
  }

  var raf;
  function schedule(){ cancelAnimationFrame(raf); raf=requestAnimationFrame(fit); }
  window.addEventListener('resize',schedule);
  window.addEventListener('orientationchange',schedule);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(schedule);
  [0,120,400,1200,2600].forEach(function(d){ setTimeout(schedule,d) });

  var mbtn=moreLi.querySelector('button');
  mbtn.addEventListener('click',function(e){
    e.stopPropagation();
    $$('[data-drop]').forEach(function(x){x.classList.remove('open')});
    moreLi.classList.toggle('open');
  });
  moreLi.addEventListener('mouseenter',function(){ moreLi.classList.add('open') });
  moreLi.addEventListener('mouseleave',function(){ moreLi.classList.remove('open') });
  document.addEventListener('click',function(){ moreLi.classList.remove('open') });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') moreLi.classList.remove('open') });
  $$('[data-drop]').forEach(function(li){
    li.addEventListener('mouseenter',function(){ moreLi.classList.remove('open') });
  });
})();

/* ---------- GRUPPO OLYMPO: GRAFO A RAGNATELA ---------- */
(function(){
  var wrap=$('#grpx'); if(!wrap) return;
  var stage=$('#grpxStage'), cv=$('#grpxCv'), layer=$('#grpxLayer'), tip=$('#grpxTip');
  if(!stage||!cv||!layer||!tip) return;
  var ctx=cv.getContext&&cv.getContext('2d'); if(!ctx) return;

  var slow=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---- switch mappa / elenco ---- */
  $$('[data-gview]',wrap).forEach(function(b){
    b.addEventListener('click',function(){
      var v=b.getAttribute('data-gview');
      $$('[data-gview]',wrap).forEach(function(x){ x.classList.toggle('on',x===b) });
      wrap.setAttribute('data-view',v);
      if(v==='graph') setTimeout(resize,30);
    });
  });

  /* ---- dati letti dalla vista elenco ---- */
  var nodes=[], links=[], sects=[];
  var hubEl=$('.grp-hub',wrap);
  var hub={kind:'hub',r:48,ac:'#23387e',lbl:'Capogruppo',
    name:hubEl?$('h3',hubEl).textContent.trim():'Olympo CDC Group SRL',
    sub:hubEl?$('span',hubEl).textContent.trim():'',
    pct:'100%', ic:hubEl?$('.gh-ic',hubEl).textContent.trim():'⭐'};
  nodes.push(hub);

  $$('.grp-sect',wrap).forEach(function(sec){
    var ac=(sec.getAttribute('data-ac')||'#1f5fd0').trim();
    var full=$('.grp-lab b',sec).textContent.trim();
    var s={kind:'sect',r:29,ac:ac,lbl:'Area di attività',
      name:full.split('—')[0].trim(), sub:full, pct:'',
      ic:(sec.getAttribute('data-ic')||'◆'), kids:[]};
    nodes.push(s); sects.push(s);
    links.push({a:hub,b:s,len:0,kind:'main'});
    $$('.grp-c',sec).forEach(function(c){
      var col=(c.style.getPropertyValue('--ac')||ac).trim();
      var core=c.classList.contains('core');
      var co={kind:'co',r:core?30:25,ac:col,core:core,lbl:s.name,
        name:$('h4',c).textContent.trim(),
        sub:$('p',c).textContent.trim(),
        pct:$('.gc-pct',c).textContent.trim(),
        ic:$('.gc-ic',c).textContent.trim(), sect:s};
      nodes.push(co); s.kids.push(co);
      links.push({a:s,b:co,len:0,kind:'sub'});
    });
    var extra=full.indexOf('\u2014')>-1?full.split('\u2014')[1].trim():'';
    s.sub=(extra?extra.charAt(0).toUpperCase()+extra.slice(1)+' \u00b7 ':'')+s.kids.length+' realt\u00e0 collegate';
  });
  if(sects.length===0) return;

  links.forEach(function(l){ l.p=Math.random(); l.sp=0.0022+Math.random()*0.0022; l.bow=(Math.random()*2-1)*0.16; });

  /* ---- elementi DOM ---- */
  nodes.forEach(function(n,i){
    var b=document.createElement('button');
    b.type='button';
    b.className='gx-n k-'+n.kind+(n.core?' core':'');
    b.style.setProperty('--ac',n.ac);
    b.setAttribute('aria-label',n.name+(n.pct?' — '+n.pct:''));
    var pct=n.pct?'<span class="gx-pct">'+n.pct+'</span>':'';
    b.innerHTML='<span class="gx-ring"></span><span class="gx-dot">'+n.ic+'</span>'+pct+
                '<span class="gx-lb">'+n.name+'</span>';
    layer.appendChild(b);
    n.el=b;
    n.x=0;n.y=0;n.vx=0;n.vy=0;
    n.f1=0.00028+Math.random()*0.0004; n.f2=0.00026+Math.random()*0.0004;
    n.p1=Math.random()*6.28; n.p2=Math.random()*6.28;
    b.addEventListener('mouseenter',function(){ setHot(n) });
    b.addEventListener('mouseleave',function(){ if(!pinned) setHot(null) });
    b.addEventListener('focus',function(){ setHot(n) });
    b.addEventListener('blur',function(){ if(!pinned) setHot(null) });
    b.addEventListener('click',function(e){
      e.stopPropagation();
      pinned=(pinned===n)?null:n;
      setHot(pinned||n);
    });
    b.addEventListener('pointerdown',function(e){ startDrag(n,e) });
  });
  stage.addEventListener('click',function(){ pinned=null; setHot(null) });

  /* ---- geometria ---- */
  var W=1,H=1,dpr=1;
  function resize(){
    W=stage.clientWidth||1; H=stage.clientHeight||1;
    dpr=Math.min(window.devicePixelRatio||1,2);
    cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
    if(!placed){ place(); placed=true; }
  }
  var placed=false;
  function place(){
    var Rx=W*0.29, Ry=H*0.27, R=(Rx+Ry)/2;
    hub.x=W/2; hub.y=H/2;
    var tot=0;
    sects.forEach(function(s){ tot+=s.kids.length+1.5 });
    var acc=0, start=-Math.PI*0.5;
    sects.forEach(function(s){
      var wg=s.kids.length+1.5;
      var span=wg/tot*Math.PI*2;
      var a=start+(acc+wg/2)/tot*Math.PI*2;
      acc+=wg;
      s.x=W/2+Math.cos(a)*Rx; s.y=H/2+Math.sin(a)*Ry;
      var n=s.kids.length, sp=Math.min(span*0.92,2.1);
      s.kids.forEach(function(k,j){
        var b=a+(n>1?(j/(n-1)-0.5)*sp:0);
        k.x=s.x+Math.cos(b)*(106+Math.random()*14);
        k.y=s.y+Math.sin(b)*(106+Math.random()*14);
      });
    });
    links.forEach(function(l){
      l.len=(l.kind==='main')
        ? R*(0.86+0.05*l.b.kids.length)
        : 108+(l.a.kids.length>4?34:(l.a.kids.length>3?18:0));
    });
  }
  resize();
  if(window.ResizeObserver){ new ResizeObserver(function(){ resize(); place(); relayout(); }).observe(stage); }
  else window.addEventListener('resize',function(){ resize(); place(); relayout(); });

  /* ---- interazione ---- */
  var hot=null, pinned=null, drag=null, mx=-9999, my=-9999;
  function setHot(n){
    if(hot===n) return;
    hot=n;
    stage.classList.toggle('focusing',!!n);
    nodes.forEach(function(o){
      o.el.classList.toggle('hot',o===n);
      o.el.classList.toggle('near',!!n&&o!==n&&connected(n,o));
    });
    if(n) showTip(n); else tip.classList.remove('on');
  }
  function connected(a,b){
    for(var i=0;i<links.length;i++){
      var l=links[i];
      if((l.a===a&&l.b===b)||(l.b===a&&l.a===b)) return true;
    }
    return false;
  }
  function showTip(n){
    tip.style.setProperty('--acx',n.ac);
    tip.innerHTML='<span class="t-k">'+n.lbl+'</span><h5>'+n.name+'</h5>'+
      (n.sub?'<p>'+n.sub+'</p>':'')+
      (n.pct?'<span class="t-pct">'+(n.pct==='Rete'?'Legame di rete':'Partecipazione '+n.pct)+'</span>':'');
    tip.classList.add('on');
    placeTip(n);
  }
  function placeTip(n){
    var h=tip.offsetHeight||120, down=(n.y-n.r-h-24)<6;
    tip.classList.toggle('down',down);
    var x=Math.max(tip.offsetWidth/2+10,Math.min(W-tip.offsetWidth/2-10,n.x));
    tip.style.left=x+'px';
    tip.style.top=(down?(n.y+n.r+8):(n.y-n.r))+'px';
  }

  stage.addEventListener('pointermove',function(e){
    var r=stage.getBoundingClientRect();
    mx=e.clientX-r.left; my=e.clientY-r.top;
    if(drag){ drag.n.x=mx-drag.dx; drag.n.y=my-drag.dy; drag.n.vx=0; drag.n.vy=0; wake(); }
  });
  stage.addEventListener('pointerleave',function(){ mx=-9999; my=-9999; });
  function startDrag(n,e){
    e.preventDefault();
    var r=stage.getBoundingClientRect();
    drag={n:n,dx:(e.clientX-r.left)-n.x,dy:(e.clientY-r.top)-n.y};
    wake();
    stage.classList.add('grabbing');
    try{ stage.setPointerCapture(e.pointerId) }catch(err){}
  }
  function endDrag(){ if(drag) wake(); drag=null; stage.classList.remove('grabbing'); }
  stage.addEventListener('pointerup',endDrag);
  stage.addEventListener('pointercancel',endDrag);

  /* ---- simulazione ---- */
  function sim(t){
    var i,j,a,b,dx,dy,d,d2,f,maxV=0;
    for(i=0;i<nodes.length;i++){
      for(j=i+1;j<nodes.length;j++){
        a=nodes[i]; b=nodes[j];
        dx=b.x-a.x; dy=b.y-a.y; d2=dx*dx+dy*dy;
        if(d2<1) d2=1;
        d=Math.sqrt(d2);
        var minD=(a.r+b.r)*(a.kind==='co'&&b.kind==='co'?2.5:2.05);
        f=(1900+(d<minD?minD*70:0))/d2;
        if(f>1.9) f=1.9;
        var ux=dx/d, uy=dy/d;
        a.vx-=ux*f; a.vy-=uy*f; b.vx+=ux*f; b.vy+=uy*f;
        /* le etichette non si devono accavallare */
        if(a.kind!=='hub'&&b.kind!=='hub'){
          var ax=dx<0?-dx:dx, ay=dy<0?-dy:dy, lw=126, lh=54;
          if(ax<lw&&ay<lh){
            var ph=(lw-ax)*0.017, sh=dx>=0?1:-1;
            a.vx-=sh*ph; b.vx+=sh*ph;
            var pv=(lh-ay)*0.009, sv=dy>=0?1:-1;
            a.vy-=sv*pv; b.vy+=sv*pv;
          }
        }
      }
    }
    for(i=0;i<links.length;i++){
      var l=links[i]; a=l.a; b=l.b;
      dx=b.x-a.x; dy=b.y-a.y; d=Math.sqrt(dx*dx+dy*dy)||1;
      f=(d-l.len)*0.014;
      var ux2=dx/d, uy2=dy/d;
      a.vx+=ux2*f; a.vy+=uy2*f; b.vx-=ux2*f; b.vy-=uy2*f;
    }
    for(i=0;i<nodes.length;i++){
      var n=nodes[i];
      if(n===hub){ n.vx+=(W/2-n.x)*0.02; n.vy+=(H/2-n.y)*0.02; }
      else { n.vx+=(W/2-n.x)*0.0022; n.vy+=(H/2-n.y)*0.0022; }
      /* margini che tengono dentro anche l'etichetta sotto al nodo */
      var half=n.kind==='hub'?104:(n.kind==='sect'?82:62);
      var mL=Math.max(n.r+10,half), mR=mL, mT=n.r+16,
          mB=n.r+(n.kind==='co'?48:(n.kind==='sect'?46:44));
      if(mL>W/2-4){ mL=mR=Math.max(20,W/2-4); }
      if(n.x<mL) n.vx+=(mL-n.x)*0.075;
      if(n.x>W-mR) n.vx+=(W-mR-n.x)*0.075;
      if(n.y<mT) n.vy+=(mT-n.y)*0.075;
      if(n.y>H-mB) n.vy+=(H-mB-n.y)*0.075;
      n.vx*=0.9; n.vy*=0.9;
      var sp=Math.sqrt(n.vx*n.vx+n.vy*n.vy);
      if(sp>4.5){ n.vx=n.vx/sp*4.5; n.vy=n.vy/sp*4.5; }
      if(drag&&drag.n===n){ n.vx=0; n.vy=0; }
      else { n.x+=n.vx; n.y+=n.vy; }
      /* limite duro: niente nodi fuori dalla cornice */
      if(n.x<mL) n.x=mL; else if(n.x>W-mR) n.x=W-mR;
      if(n.y<mT) n.y=mT; else if(n.y>H-mB) n.y=H-mB;
      if(sp>maxV) maxV=sp;
      n.el.style.transform='translate3d('+n.x.toFixed(1)+'px,'+n.y.toFixed(1)+'px,0)';
    }
    return maxV;
  }

  /* ---- assestamento: la mappa si compone e poi resta ferma ---- */
  var settled=false, calm=0;
  function wake(){ settled=false; calm=0; }
  function presolve(it){
    for(var k=0;k<(it||460);k++) sim(0);
    settled=true; calm=0;
  }

  /* ---- disegno ---- */
  function rgba(hex,al){
    hex=hex.replace('#','');
    if(hex.length===3) hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    var v=parseInt(hex,16);
    return 'rgba('+((v>>16)&255)+','+((v>>8)&255)+','+(v&255)+','+al+')';
  }
  function qp(x0,y0,cx,cy,x1,y1,t){
    var u=1-t;
    return [u*u*x0+2*u*t*cx+t*t*x1, u*u*y0+2*u*t*cy+t*t*y1];
  }
  function ctrl(l){
    var mxp=(l.a.x+l.b.x)/2, myp=(l.a.y+l.b.y)/2;
    var dx=l.b.x-l.a.x, dy=l.b.y-l.a.y;
    return [mxp-dy*l.bow*0.5, myp+dx*l.bow*0.5];
  }
  function draw(t){
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,W,H);

    /* alone del centro */
    var g=ctx.createRadialGradient(hub.x,hub.y,4,hub.x,hub.y,190);
    g.addColorStop(0,'rgba(46,79,212,.16)');
    g.addColorStop(1,'rgba(46,79,212,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(hub.x,hub.y,190,0,6.2832); ctx.fill();

    /* ragnatela: anelli fra le societa' dello stesso settore */
    ctx.setLineDash([3,6]);
    sects.forEach(function(s){
      if(s.kids.length<2) return;
      var ks=s.kids.slice().sort(function(a,b){
        return Math.atan2(a.y-s.y,a.x-s.x)-Math.atan2(b.y-s.y,b.x-s.x);
      });
      var on=(hot===s)||(hot&&hot.sect===s);
      ctx.strokeStyle=rgba(s.ac,on?0.5:0.17);
      ctx.lineWidth=on?1.4:1;
      ctx.beginPath();
      for(var i=0;i<ks.length;i++){
        var a=ks[i], b=ks[(i+1)%ks.length];
        if(ks.length===2&&i===1) break;
        ctx.moveTo(a.x,a.y);
        var cxm=(a.x+b.x)/2-(b.y-a.y)*0.14, cym=(a.y+b.y)/2+(b.x-a.x)*0.14;
        ctx.quadraticCurveTo(cxm,cym,b.x,b.y);
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);

    /* rami */
    links.forEach(function(l){
      var c=ctrl(l);
      var on=(hot===l.a||hot===l.b);
      var dim=(hot&&!on);
      var col=l.kind==='main'?l.b.ac:l.b.ac;
      var grad=ctx.createLinearGradient(l.a.x,l.a.y,l.b.x,l.b.y);
      grad.addColorStop(0,rgba(l.a.ac,dim?0.06:(on?0.75:0.3)));
      grad.addColorStop(1,rgba(col,dim?0.06:(on?0.85:0.34)));
      ctx.strokeStyle=grad;
      ctx.lineWidth=on?2.6:(l.kind==='main'?1.9:1.25);
      ctx.beginPath();
      ctx.moveTo(l.a.x,l.a.y);
      ctx.quadraticCurveTo(c[0],c[1],l.b.x,l.b.y);
      ctx.stroke();
    });

    /* particelle lungo i rami */
    links.forEach(function(l){
      if(!slow) l.p+=l.sp*(hot===l.a||hot===l.b?2.6:1);
      if(l.p>1) l.p-=1;
      var c=ctrl(l);
      var pt=qp(l.a.x,l.a.y,c[0],c[1],l.b.x,l.b.y,l.p);
      var on=(hot===l.a||hot===l.b), dim=(hot&&!on);
      var rr=on?3.2:2;
      var gg=ctx.createRadialGradient(pt[0],pt[1],0,pt[0],pt[1],rr*3.4);
      gg.addColorStop(0,rgba(l.b.ac,dim?0.1:(on?0.95:0.6)));
      gg.addColorStop(1,rgba(l.b.ac,0));
      ctx.fillStyle=gg;
      ctx.beginPath(); ctx.arc(pt[0],pt[1],rr*3.4,0,6.2832); ctx.fill();
      ctx.fillStyle=rgba('#ffffff',dim?0.15:0.85);
      ctx.beginPath(); ctx.arc(pt[0],pt[1],rr*0.55,0,6.2832); ctx.fill();
    });
  }

  /* ---- loop, solo quando la sezione e' a schermo ---- */
  var ready=false;
  function relayout(){ ready=false; settled=false; calm=0; }
  var live=false;
  if(window.IntersectionObserver){
    new IntersectionObserver(function(es){ live=es[0].isIntersecting; },{threshold:0.02}).observe(stage);
  } else live=true;

  var last=0;
  function loop(t){
    requestAnimationFrame(loop);
    if(!live||wrap.getAttribute('data-view')!=='graph') return;
    if(stage.clientWidth<10) return;
    if(t-last<15) return;
    last=t;
    if(!ready){ ready=true; presolve(); }
    if(!settled){
      var e=sim(t);
      if(e<0.08){ if(++calm>24) settled=true; } else calm=0;
    }
    draw(t);
    if(hot) placeTip(hot);
  }
  requestAnimationFrame(loop);
})();

})();

/* ===== Galleria "I came back" - lightbox ===== */
(function(){
  var items=[].slice.call(document.querySelectorAll('[data-icb]'));
  var lb=document.getElementById('icbLb');
  if(!items.length||!lb) return;
  var big=lb.querySelector('.icb-big'), info=lb.querySelector('.icb-info'), cur=0, prevOv='';
  function show(n){
    cur=(n+items.length)%items.length;
    var im=items[cur].querySelector('img');
    big.src=im.getAttribute('src');
    big.alt=im.getAttribute('alt')||'';
    info.innerHTML=(items[cur].getAttribute('data-cap')||'')+' &nbsp;&middot;&nbsp; '+(cur+1)+' / '+items.length;
  }
  function open(n){ prevOv=document.body.style.overflow; show(n); lb.classList.add('on'); document.body.style.overflow='hidden'; }
  function close(){ lb.classList.remove('on'); document.body.style.overflow=prevOv; big.removeAttribute('src'); }
  items.forEach(function(el,n){ el.addEventListener('click',function(){ open(n); }); });
  lb.addEventListener('click',function(e){ if(e.target===lb||e.target===big) close(); });
  lb.querySelector('.icb-x').addEventListener('click',function(e){ e.stopPropagation(); close(); });
  lb.querySelector('.icb-prev').addEventListener('click',function(e){ e.stopPropagation(); show(cur-1); });
  lb.querySelector('.icb-next').addEventListener('click',function(e){ e.stopPropagation(); show(cur+1); });
  document.addEventListener('keydown',function(e){
    if(!lb.classList.contains('on')) return;
    if(e.key==='Escape'){ close(); }
    else if(e.key==='ArrowLeft'){ show(cur-1); }
    else if(e.key==='ArrowRight'){ show(cur+1); }
  });
  var sx=null;
  lb.addEventListener('touchstart',function(e){ sx=e.touches[0].clientX; },{passive:true});
  lb.addEventListener('touchend',function(e){
    if(sx===null) return;
    var dx=e.changedTouches[0].clientX-sx; sx=null;
    if(Math.abs(dx)>50) show(cur+(dx<0?1:-1));
  },{passive:true});
})();


/* ===== CESD - finestra foto e video + lightbox ===== */
(function(){
  var md=document.getElementById('cesdMd'), lb=document.getElementById('cesdLb');
  if(!md||!lb) return;
  // fuori dalla sezione: altrimenti header e cookie restano sopra la finestra
  document.body.appendChild(md); document.body.appendChild(lb);
  var prevOv='', items=[].slice.call(md.querySelectorAll('[data-cesd]'));
  var big=lb.querySelector('.icb-big'), info=lb.querySelector('.icb-info'), cur=0;
  function stopVids(){ [].forEach.call(md.querySelectorAll('video'),function(v){ v.pause(); }); }
  function openMd(){ prevOv=document.body.style.overflow; md.classList.add('on'); md.scrollTop=0; document.body.style.overflow='hidden'; }
  function closeMd(){ stopVids(); md.classList.remove('on'); document.body.style.overflow=prevOv; }
  [].forEach.call(document.querySelectorAll('[data-cesd-open]'),function(b){ b.addEventListener('click',function(e){ e.preventDefault(); openMd(); }); });
  md.querySelector('.cesd-x').addEventListener('click',closeMd);
  md.addEventListener('click',function(e){ if(e.target===md) closeMd(); });
  function show(n){
    cur=(n+items.length)%items.length;
    var im=items[cur].querySelector('img');
    big.src=im.getAttribute('src'); big.alt=im.getAttribute('alt')||'';
    info.innerHTML=(items[cur].getAttribute('data-cap')||'')+' &nbsp;&middot;&nbsp; '+(cur+1)+' / '+items.length;
  }
  function openLb(n){ stopVids(); show(n); lb.classList.add('on'); }
  function closeLb(){ lb.classList.remove('on'); big.removeAttribute('src'); }
  items.forEach(function(el,n){ el.addEventListener('click',function(){ openLb(n); }); });
  lb.addEventListener('click',function(e){ if(e.target===lb||e.target===big) closeLb(); });
  lb.querySelector('.icb-x').addEventListener('click',function(e){ e.stopPropagation(); closeLb(); });
  lb.querySelector('.icb-prev').addEventListener('click',function(e){ e.stopPropagation(); show(cur-1); });
  lb.querySelector('.icb-next').addEventListener('click',function(e){ e.stopPropagation(); show(cur+1); });
  document.addEventListener('keydown',function(e){
    if(lb.classList.contains('on')){
      if(e.key==='Escape') closeLb(); else if(e.key==='ArrowLeft') show(cur-1); else if(e.key==='ArrowRight') show(cur+1);
    } else if(md.classList.contains('on') && e.key==='Escape'){ closeMd(); }
  });
  var sx=null;
  lb.addEventListener('touchstart',function(e){ sx=e.touches[0].clientX; },{passive:true});
  lb.addEventListener('touchend',function(e){
    if(sx===null) return; var dx=e.changedTouches[0].clientX-sx; sx=null;
    if(Math.abs(dx)>50) show(cur+(dx<0?1:-1));
  },{passive:true});
})();


/* ===== Catalogo lauree: apertura ===== */
(function(){ var o=document.getElementById('ecOpen'); if(!o)return; o.addEventListener('click',function(e){ e.stopPropagation(); var w=o.closest('.ec-wrap'); w.classList.add('all'); o.setAttribute('aria-expanded','true') }) })();
/* ===== Piano di studi dentro la scheda del corso ===== */
document.addEventListener('click',function(e){
  var a=e.target.closest('[data-pds-open]'); if(!a) return;
  var d=document.querySelector('.cdl-pds-d'); if(!d) return;
  e.preventDefault(); d.open=true;
  d.scrollIntoView({behavior:'smooth',block:'start'});
});
(function(){ if(location.hash==='#piano-di-studi'){ var d=document.querySelector('.cdl-pds-d'); if(d) d.open=true; } })();
/* ===== Catalogo lauree - filtro per area ===== */
(function(){
  var f=document.getElementById('ecFilters'), g=document.getElementById('ecGrid');
  if(!f||!g) return;
  var bs=[].slice.call(f.querySelectorAll('[data-ec]')), cs=[].slice.call(g.querySelectorAll('.ec-card'));
  bs.forEach(function(b){ b.addEventListener('click',function(e){
    e.stopPropagation();
    bs.forEach(function(x){ x.classList.toggle('on',x===b); });
    var k=b.getAttribute('data-ec');
    cs.forEach(function(c){ c.classList.toggle('off',k!=='all'&&c.getAttribute('data-ec')!==k); });
  }); });
})();


/* ---------- JANUS: EVIDENZIA LICEO / TECNICO / PROFESSIONALE ---------- */
(function(){
  var rail=document.getElementById('jnRail'); if(!rail) return;
  var btns=[].slice.call(document.querySelectorAll('.jn-filt .tab')), items=[].slice.call(rail.querySelectorAll('.rail-i'));
  btns.forEach(function(b){ b.addEventListener('click',function(){
    var t=b.getAttribute('data-tipo'), on=!b.classList.contains('on');
    btns.forEach(function(x){ var a=on&&x===b; x.classList.toggle('on',a); x.setAttribute('aria-pressed',a?'true':'false'); });
    rail.classList.toggle('hl',on);
    items.forEach(function(it){ it.classList.toggle('hit',on&&it.getAttribute('data-tipo')===t); });
  }); });
})();

/* ===== AREA RISERVATA =====
   Per collegare il portale vero, incolla qui URL e chiave pubblica (anon key) del progetto Supabase:
   istruzioni in sorgenti/area-riservata/LEGGIMI-AREA-RISERVATA.md. Finche' restano vuote, il portale
   funziona in modalita' dimostrativa (dati salvati solo nel browser di chi prova). */
window.UO_AUTH = window.UO_AUTH || { url: 'https://jalsxmyviroicqrgwvyv.supabase.co', key: 'sb_publishable_Xw0LEqS4vuJz3_soF93RIA_f7CZ6MgT' };
(function(){
  var bg=document.getElementById('arbg'); if(!bg) return;
  /* ?demo=1 nell'indirizzo: forza la modalita' dimostrativa (per presentare il portale senza toccare i dati veri) */
  var FORCE_DEMO=false; try{ if(/[?&]demo=1/.test(location.search)) sessionStorage.setItem('uo-demo','1'); if(/[?&]demo=0/.test(location.search)) sessionStorage.removeItem('uo-demo'); FORCE_DEMO=sessionStorage.getItem('uo-demo')==='1' }catch(e){}
  var CFG=window.UO_AUTH, LIVE=!!(CFG.url&&CFG.key)&&!FORCE_DEMO;
  var APP=document.documentElement.classList.contains('ar-app'); // pagina /app/: l'Area Riservata come app a schermo intero
  var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var BASE=location.protocol==='file:'?'':'/';
  var EDIT=['cellulare','telefono','indirizzo','cap','comune','provincia','domicilio','polo','consenso_marketing'];
  var STATI={registrato:['Registrazione ricevuta',1,'Ora carica i tuoi documenti e il contratto firmato: la segreteria li verifica e ti ricontatta.'],
             documenti:['Documenti caricati',2,'Abbiamo ricevuto i documenti. La segreteria li sta controllando.'],
             verifica:['In verifica',3,'La segreteria sta completando la tua pratica con l\'ateneo o l\'ente di riferimento.'],
             iscritto:['Iscrizione perfezionata',4,'La tua iscrizione &egrave; completa. Riceverai via email le credenziali della piattaforma didattica.']};
  var DOCS=[['identita','Documento d\'identit&agrave;','Fronte e retro, in corso di validit&agrave;.'],
            ['cf','Codice fiscale o tessera sanitaria','Fronte e retro.'],
            ['titolo','Titolo di studio','Diploma, certificato o autocertificazione firmata.'],
            ['foto','Fototessera','Recente, su fondo chiaro.'],
            ['contratto','Contratto firmato','Il contratto con lo studente firmato in ogni pagina.'],
            ['pagamento','Ricevuta di pagamento','Bonifico o ricevuta della prima rata.'],
            ['altro','Altro documento','Moduli compilati, riconoscimento crediti, certificati.']];
  var MODULI=[['Iscrizione',[['domanda-di-iscrizione','Domanda di iscrizione e adesione ai servizi'],['contratto-con-lo-studente','Contratto con lo studente'],['richiesta-rateizzazione','Richiesta di pagamento rateale']]],
    ['Crediti e carriera',[['riconoscimento-crediti','Richiesta di valutazione e riconoscimento crediti (CFU)'],['iscrizione-corsi-singoli','Domanda di iscrizione a corsi singoli'],['iscrizione-uditore','Domanda di iscrizione come uditore'],['studente-tempo-parziale','Richiesta di iscrizione a tempo parziale'],['passaggio-ad-altro-corso','Passaggio ad altro corso'],['trasferimento','Domanda di trasferimento'],['ricongiunzione-carriera','Richiesta di ricongiunzione della carriera'],['rinuncia-agli-studi','Rinuncia agli studi e recesso dai servizi']]],
    ['Esami e titoli',[['scelta-sede-esami','Scelta della sede per esami e sedute di laurea'],['richiesta-duplicati','Richiesta di duplicato di documenti']]],
    ['Dati e dichiarazioni',[['variazione-dati-anagrafici','Variazione dei dati anagrafici'],['istanza-alla-direzione','Istanza alla Direzione'],['autocertificazione-titolo-di-studio','Autocertificazione del titolo di studio'],['dichiarazione-sostitutiva-certificazione','Dichiarazione sostitutiva di certificazione'],['dichiarazione-sostitutiva-atto-notorio','Dichiarazione sostitutiva dell\'atto di notoriet&agrave;']]]];
  var CORSI=['Giurisprudenza','Economia','Scienze e tecniche psicologiche','Scienze dell\'educazione e della formazione','Ingegneria informatica e dell\'automazione','Scienze delle attività motorie e sportive','Mediazione linguistica','Scienze politiche','Lettere','Scienze biologiche','Management sanitario','Made in Italy Global Leadership','Liceo scientifico','Liceo scientifico sportivo','Liceo linguistico','Liceo delle scienze umane','Istituto tecnico AFM','Medicina e chirurgia (estero)','Odontoiatria (estero)','Infermieristica (estero)','EIPASS','Certificazione linguistica'];

  /* ---------- servizio: Supabase o modalita' dimostrativa ---------- */
  var sb=null, sbLoading=null;
  function loadSb(){
    if(sb) return Promise.resolve(sb);
    if(sbLoading) return sbLoading;
    sbLoading=new Promise(function(res,rej){
      var s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/dist/umd/supabase.js';
      s.onload=function(){ sb=window.supabase.createClient(CFG.url,CFG.key,{auth:{persistSession:true,detectSessionInUrl:true}});
        sb.auth.onAuthStateChange(function(ev){ if(ev==='PASSWORD_RECOVERY'){ open('recover') } });
        res(sb) };
      s.onerror=function(){ rej(new Error('Impossibile raggiungere il server. Controlla la connessione.')) };
      document.head.appendChild(s);
    });
    return sbLoading;
  }
  function itErr(e){
    var m=(e&&e.message)||String(e);
    if(/invalid login/i.test(m)) return 'Email o password non corrette.';
    if(/not confirmed/i.test(m)) return 'Devi prima confermare l\'email: apri il messaggio che ti abbiamo inviato.';
    if(/already registered|already exists/i.test(m)) return 'Esiste gi&agrave; un account con questa email. Prova ad accedere o recupera la password.';
    if(/database error saving new user/i.test(m)) return 'Non &egrave; stato possibile completare l\'iscrizione: il codice fiscale potrebbe essere gi&agrave; registrato. Contatta la segreteria.';
    if(/codice_fiscale|duplicate key/i.test(m)) return 'Questo codice fiscale risulta gi&agrave; registrato. Contatta la segreteria.';
    if(/schema cache|does not exist|could not find the (table|function)/i.test(m)) return 'Questa sezione non &egrave; ancora attiva: la segreteria la sta configurando.';
    if(/rate limit|too many/i.test(m)) return 'Troppi tentativi ravvicinati. Riprova fra qualche minuto.';
    if(/password/i.test(m)&&/least|weak|short/i.test(m)) return 'La password &egrave; troppo debole.';
    return m;
  }
  /* modalita' dimostrativa: tutto in localStorage */
  var DKEY='uo-area-demo';
  function dload(){ try{ return JSON.parse(localStorage.getItem(DKEY))||{users:{},cur:null} }catch(e){ return {users:{},cur:null} } }
  function dsave(d){ try{ localStorage.setItem(DKEY,JSON.stringify(d)) }catch(e){} }
  function hash(s){ var h=5381; for(var i=0;i<s.length;i++){ h=((h<<5)+h+s.charCodeAt(i))|0 } return 'h'+(h>>>0).toString(36) }

  var API={
    session:function(){
      if(!LIVE){ var d=dload(); return Promise.resolve(d.cur&&d.users[d.cur]?{email:d.cur}:null) }
      return loadSb().then(function(c){ return c.auth.getSession() }).then(function(r){ var s=r.data.session; return s?{email:s.user.email,id:s.user.id}:null });
    },
    signIn:function(email,pw){
      if(!LIVE){ var d=dload(), u=d.users[email]; if(!u||u.pw!==hash(pw)) return Promise.reject(new Error('Invalid login')); d.cur=email; dsave(d); return Promise.resolve({email:email}) }
      return loadSb().then(function(c){ return c.auth.signInWithPassword({email:email,password:pw}) }).then(function(r){ if(r.error) throw r.error; return {email:r.data.user.email,id:r.data.user.id} });
    },
    signUp:function(email,pw,profile){
      if(!LIVE){ var d=dload(); if(d.users[email]) return Promise.reject(new Error('already registered'));
        var n=Object.keys(d.users).length+1; profile.email=email; profile.matricola='UO'+String(new Date().getFullYear()).slice(2)+String(n).padStart(5,'0');
        profile.stato='registrato'; profile.created_at=new Date().toISOString(); profile.consenso_contratto=profile.created_at;
        d.users[email]={pw:hash(pw),profile:profile,docs:{}}; d.cur=email; dsave(d); return Promise.resolve({session:true}) }
      return loadSb().then(function(c){ return c.auth.signUp({email:email,password:pw,options:{data:profile,emailRedirectTo:location.origin+(APP?'/app/':'/?area=1')}}) })
        .then(function(r){ if(r.error) throw r.error; if(r.data.user&&r.data.user.identities&&r.data.user.identities.length===0) throw new Error('already registered'); return {session:!!r.data.session} });
    },
    quick:function(){ var d=dload(), e='studente.prova@unicesd-olympo.com';
      if(!d.users[e]){ d.users[e]={pw:hash('Prova2026'),docs:{contratto:[{name:'contratto-firmato.pdf',at:new Date().toISOString()}],identita:[{name:'carta-identita.pdf',at:new Date().toISOString()}]},
        profile:{email:e,nome:'Mario',cognome:'Rossi',sesso:'M',data_nascita:'2001-03-14',comune_nascita:'Palermo',prov_nascita:'PA',cittadinanza:'Italiana',codice_fiscale:'RSSMRA01C14G273X',
          cellulare:'333 123 4567',indirizzo:'Via Libert\u00e0 10',cap:'90139',comune:'Palermo',provincia:'PA',percorso:'Laurea triennale',corso:'Giurisprudenza',modalita:'Online',polo:'Palermo \u00b7 Via Trabia 1',
          titolo_studio:'Diploma di maturit\u00e0',istituto:'Liceo classico G. Garibaldi',anno_titolo:'2020',matricola:'UO2600042',stato:'iscritto',created_at:new Date(Date.now()-40*864e5).toISOString()}} }
      d.cur=e; dsave(d); return Promise.resolve() },
    signOut:function(){ if(!LIVE){ var d=dload(); d.cur=null; dsave(d); return Promise.resolve() } return loadSb().then(function(c){ return c.auth.signOut() }) },
    profile:function(){
      if(!LIVE){ var d=dload(); return Promise.resolve(d.users[d.cur].profile) }
      return loadSb().then(function(c){ return c.from('profili').select('*').single() }).then(function(r){ if(r.error) throw r.error; return r.data });
    },
    update:function(patch){
      if(!LIVE){ var d=dload(); Object.assign(d.users[d.cur].profile,patch); dsave(d); return Promise.resolve(d.users[d.cur].profile) }
      return loadSb().then(function(c){ return c.auth.getUser().then(function(u){ return c.from('profili').update(patch).eq('id',u.data.user.id).select().single() }) })
        .then(function(r){ if(r.error) throw r.error; return r.data });
    },
    reset:function(email){
      if(!LIVE) return Promise.resolve();
      return loadSb().then(function(c){ return c.auth.resetPasswordForEmail(email,{redirectTo:location.origin+(APP?'/app/':'/?area=1')}) }).then(function(r){ if(r.error) throw r.error });
    },
    setPw:function(pw){
      if(!LIVE){ var d=dload(); d.users[d.cur].pw=hash(pw); dsave(d); return Promise.resolve() }
      return loadSb().then(function(c){ return c.auth.updateUser({password:pw}) }).then(function(r){ if(r.error) throw r.error });
    },
    docs:function(){
      if(!LIVE){ var d=dload(); return Promise.resolve(d.users[d.cur].docs||{}) }
      return loadSb().then(function(c){ return c.auth.getUser().then(function(u){ var id=u.data.user.id;
        return c.storage.from('documenti').list(id,{limit:100,sortBy:{column:'created_at',order:'desc'}}).then(function(r){
          if(r.error) throw r.error; var out={};
          (r.data||[]).forEach(function(f){ var slot=f.name.split('__')[0]; (out[slot]=out[slot]||[]).push({name:f.name.split('__').slice(2).join('__')||f.name,path:id+'/'+f.name,at:f.created_at}) });
          return out }) }) });
    },
    upload:function(slot,file){
      if(!LIVE){ var d=dload(), u=d.users[d.cur]; u.docs=u.docs||{}; (u.docs[slot]=u.docs[slot]||[]).unshift({name:file.name,at:new Date().toISOString()});
        if(u.profile.stato==='registrato') u.profile.stato='documenti'; dsave(d); return Promise.resolve() }
      return loadSb().then(function(c){ return c.auth.getUser().then(function(u){
        var safe=file.name.normalize('NFD').replace(/[^\w.\-]+/g,'_');
        return c.storage.from('documenti').upload(u.data.user.id+'/'+slot+'__'+Date.now()+'__'+safe,file,{upsert:false}) }) })
        .then(function(r){ if(r.error) throw r.error; return sb.rpc('segnala_documento') });
    },
    link:function(path){ return loadSb().then(function(c){ return c.storage.from('documenti').createSignedUrl(path,120) }).then(function(r){ if(r.error) throw r.error; return r.data.signedUrl }) }
  };

  /* ---------- situazione economica, carriera, esami (tabelle in supabase-carriera.sql) ---------- */
  function rows(r){ if(r.error) throw r.error; return r.data||[] }
  API.eco=function(){
    if(!LIVE){ var u=demoU(); return Promise.resolve({rette:u.eco.rette,rate:u.eco.rate}) }
    return loadSb().then(function(c){ return Promise.all([c.from('rette').select('*').order('id'),c.from('rate').select('*').order('scadenza').order('numero')]) })
      .then(function(r){ return {rette:rows(r[0]),rate:rows(r[1])} });
  };
  API.car=function(){
    if(!LIVE) return Promise.resolve(demoU().car);
    return loadSb().then(function(c){ return c.from('carriera').select('*').order('anno_corso').order('ordine').order('id') }).then(rows);
  };
  API.app=function(){
    if(!LIVE){ var u=demoU(), m=u.profile.matricola;
      return Promise.resolve(u.app.map(function(a){ var x=Object.assign({},a), ex=u.car.filter(function(c){ return c.insegnamento.toLowerCase()===a.insegnamento.toLowerCase() });
        x.prenotato=(a.chi||[]).indexOf(m)>-1; x.iscritti=(a.chi||[]).length+(a.altri||0); x.nel_piano=ex.length>0; x.superato=ex.some(function(c){ return c.esito!=='da sostenere' }); return x })) }
    return loadSb().then(function(c){ return c.rpc('miei_appelli') }).then(rows);
  };
  API.prenota=function(id){
    if(!LIVE){ var d=dload(), u=d.users[d.cur], a=u.app.filter(function(x){ return x.id===id })[0], m=u.profile.matricola, oggi=ymd(new Date());
      if(!a) return Promise.reject(new Error('Appello non disponibile.'));
      if(a.apertura&&oggi<a.apertura) return Promise.reject(new Error('Le prenotazioni si aprono il '+itShort(a.apertura)+'.'));
      if(oggi>(a.chiusura||ymd(addD(pd(a.data),-1)))) return Promise.reject(new Error('Le prenotazioni per questo appello sono chiuse.'));
      var altro=u.app.filter(function(x){ return x.id!==id&&x.data>=oggi&&x.insegnamento===a.insegnamento&&(x.chi||[]).indexOf(m)>-1 })[0];
      if(altro) return Promise.reject(new Error('Sei gi&agrave; prenotato per questo esame all\'appello del '+itShort(altro.data)+'. Annulla quella prenotazione prima di sceglierne un\'altra.'));
      if(a.posti&&(a.chi||[]).length+(a.altri||0)>=a.posti) return Promise.reject(new Error('Posti esauriti per questo appello.'));
      a.chi=a.chi||[]; if(a.chi.indexOf(m)<0) a.chi.push(m); dsave(d); return Promise.resolve() }
    return loadSb().then(function(c){ return c.rpc('prenota_appello',{p_appello:id}) }).then(function(r){ if(r.error) throw r.error });
  };
  API.annulla=function(id){
    if(!LIVE){ var d=dload(), u=d.users[d.cur], a=u.app.filter(function(x){ return x.id===id })[0], m=u.profile.matricola;
      if(a) a.chi=(a.chi||[]).filter(function(x){ return x!==m }); dsave(d); return Promise.resolve() }
    return loadSb().then(function(c){ return c.rpc('annulla_prenotazione',{p_appello:id}) }).then(function(r){ if(r.error) throw r.error });
  };

  /* date: le colonne "date" arrivano come AAAA-MM-GG */
  function pd(s){ var p=String(s).slice(0,10).split('-'); return new Date(+p[0],+p[1]-1,+p[2]) }
  function ymd(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0') }
  function addD(d,n){ var x=new Date(d); x.setDate(x.getDate()+n); return x }
  function itShort(s){ return s?pd(s).toLocaleDateString('it-IT',{day:'2-digit',month:'2-digit',year:'numeric'}):'' }
  function eur(n){ return (+n||0).toLocaleString('it-IT',{style:'currency',currency:'EUR'}) }

  /* dati di prova per la modalita' dimostrativa (creati una volta per utente) */
  function demoU(){
    var d=dload(), u=d.users[d.cur]; if(u.car&&u.eco&&u.app) return u;
    var t=new Date(); t.setHours(12,0,0,0); var D=function(n){ return ymd(addD(t,n)) }, aa=t.getMonth()>=8?t.getFullYear()+'/'+(t.getFullYear()+1):(t.getFullYear()-1)+'/'+t.getFullYear();
    u.eco={rette:[{anno_accademico:aa,voce:'Retta annuale',importo:2400,riduzione:300,causale_riduzione:'Convenzione con il polo di riferimento'},{anno_accademico:aa,voce:'Tassa di iscrizione e servizi',importo:200,riduzione:0}],
      rate:[{anno_accademico:aa,numero:1,descrizione:'Prima rata, all\'iscrizione',importo:500,scadenza:D(-40),pagata_il:D(-42),metodo:'Bonifico',riferimento:'CRO 0412 7781'},
            {anno_accademico:aa,numero:2,descrizione:'Seconda rata',importo:600,scadenza:D(-5)},
            {anno_accademico:aa,numero:3,descrizione:'Terza rata',importo:600,scadenza:D(10)},
            {anno_accademico:aa,numero:4,descrizione:'Quarta rata',importo:600,scadenza:D(70)}]};
    var P=[[1,'Istituzioni di diritto privato','IUS/01',15,'esame',28,0,-130],[1,'Filosofia del diritto','IUS/20',15,'esame',30,1,-95],[1,'Diritto romano','IUS/18',15,'esame',26,0,-60],[1,'Diritto costituzionale','IUS/08',15,'esame'],
      [2,'Storia del diritto medievale e moderno','IUS/19',15,'esame'],[2,'Diritto ecclesiastico','IUS/11',6,'esame'],[2,'Diritto commerciale','IUS/04',15,'esame'],[2,'Diritto tributario','IUS/12',9,'esame'],[2,'Economia politica','SECS-P/01',15,'esame'],
      [3,'Diritto penale','IUS/17',15,'esame'],[3,'Diritto amministrativo','IUS/10',15,'esame'],[3,'Diritto del lavoro','IUS/07',12,'esame'],[3,'Esami a scelta','',6,'a scelta'],[3,'Lingua inglese','L-LIN/12',6,'altro',null,0,-20,'riconosciuto']];
    u.car=P.map(function(r,i){ var ok=r[5]||r[8]; return {anno_corso:r[0],insegnamento:r[1],ssd:r[2],cfu:r[3],tipo:r[4],esito:r[8]||(r[5]?'superato':'da sostenere'),voto:r[5]||null,lode:!!r[6],data_esame:ok?D(r[7]):null,anno_accademico:ok?aa:null} });
    var A=[['Diritto costituzionale',12,'Scritto','Online','Piattaforma d\'esame',-10,null,30,true],['Diritto costituzionale',47,'Orale','Palermo · Via Trabia 1','Aula 2',25,null,null],
      ['Storia del diritto medievale e moderno',19,'Orale','Online','Videochiamata',-5,15,20,false,20],['Diritto ecclesiastico',26,'Scritto','Polo 00001 · Global Campus Licata','Aula magna',-3,null,40],
      ['Diritto commerciale',33,'Scritto e orale','Online','Piattaforma d\'esame',-1,null,null],['Diritto tributario',54,'Scritto','Online','Piattaforma d\'esame',20,null,null],['Economia politica',40,'Scritto','Campofelice di Roccella','Aula 1',5,null,25],
      ['Diritto romano',22,'Orale','Online','Videochiamata',-8,null,null],['Diritto costituzionale',-18,'Scritto','Online','Piattaforma d\'esame',-40,null,null]];
    var doc={'Diritto costituzionale':'Prof. G. Marino','Storia del diritto medievale e moderno':'Prof.ssa L. Ferrante','Diritto ecclesiastico':'Prof. A. Greco','Diritto commerciale':'Prof.ssa M. Lo Presti','Diritto tributario':'Prof. S. Amato','Economia politica':'Prof. F. Russo','Diritto romano':'Prof. C. Bellini'};
    var W=function(n){ var x=addD(t,n), g=x.getDay(); return ymd(addD(x,g===6?-1:g===0?1:0)) };
    u.app=A.map(function(a,i){ return {id:i+1,insegnamento:a[0],docente:doc[a[0]],data:W(a[1]),ora:['09:30:00','15:00:00','10:00:00'][i%3],tipo:a[2],sede:a[3],aula:a[4],apertura:D(a[5]),chiusura:a[6]!=null?D(a[6]):null,posti:a[7],chi:a[8]?[u.profile.matricola]:[],altri:a[9]||(a[7]?Math.min(a[7]-4,i*3+2):i*2)} });
    dsave(d); return u;
  }

  /* ---------- interfaccia ---------- */
  var auth=$('#arAuth'), dash=$('#arDash'), lastFocus=null;
  $$('[data-ar-demo]',bg).forEach(function(e){ e.hidden=LIVE });
  $$('a[href^="modulistica/"]',bg).forEach(function(a){ a.setAttribute('href',BASE+a.getAttribute('href')) });
  var dl=$('#ar-corsi'); CORSI.forEach(function(c){ var o=document.createElement('option'); o.value=c; dl.appendChild(o) });
  $('#are-polo').innerHTML=$('#ar-polo').innerHTML;

  function show(el,on){ if(on){ el.hidden=false; requestAnimationFrame(function(){ bg.classList.add('on') }) } }
  function pane(name){ $$('.ar-pane',auth).forEach(function(p){ p.hidden=p.getAttribute('data-pane')!==name }); var f=$('[data-pane="'+name+'"] input',auth); if(f&&matchMedia('(pointer:fine)').matches) setTimeout(function(){ f.focus() },80); $$('.ar-msg',auth).forEach(function(m){ m.className='ar-msg' }) }
  function msg(form,t,ok){ var m=$('.ar-msg',form); m.innerHTML=t; m.className='ar-msg on'+(ok?' ok':'') }
  function busy(btn,on){ if(!btn) return; btn.disabled=on; btn.style.opacity=on?.6:'' }
  function open(view){
    lastFocus=document.activeElement; bg.hidden=false; document.documentElement.classList.add('ar-lock');
    requestAnimationFrame(function(){ bg.classList.add('on') });
    if(view==='recover'){ dash.hidden=true; auth.hidden=false; pane('recover'); return }
    API.session().then(function(s){
      if(s&&view!=='register'){ auth.hidden=true; dash.hidden=false; loadDash() }
      else { dash.hidden=true; auth.hidden=false; pane(view==='register'?'register':'login'); if(view==='register') step(1) }
    }).catch(function(e){ auth.hidden=false; dash.hidden=true; pane('login'); msg($('#arLogin'),itErr(e)) });
  }
  function close(){
    lezLeave(); if(APP) return;
    bg.classList.remove('on'); document.documentElement.classList.remove('ar-lock');
    setTimeout(function(){ bg.hidden=true },300);
    if(location.hash==='#area-riservata') history.replaceState(null,'',location.pathname+location.search);
    if(lastFocus&&lastFocus.focus) lastFocus.focus();
  }
  window.UOArea={open:open,close:close};

  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-area]');
    if(t){ e.preventDefault(); e.stopPropagation(); var mob=document.getElementById('mob'); if(mob&&mob.classList.contains('on')){ var b=document.getElementById('burger'); if(b) b.click() } open(t.getAttribute('data-area')||'login'); return }
    if(bg.hidden) return;
    if(e.target===bg||e.target.closest('[data-ar-close]')){ e.preventDefault(); close(); return }
    var g=e.target.closest('[data-ar-go]'); if(g){ e.preventDefault(); pane(g.getAttribute('data-ar-go')); if(g.getAttribute('data-ar-go')==='register') step(1); return }
    var tb=e.target.closest('[data-ar-tab]'); if(tb){ e.preventDefault(); tab(tb.getAttribute('data-ar-tab')); return }
    var eye=e.target.closest('.ar-eye'); if(eye){ var i=eye.parentElement.querySelector('input'); i.type=i.type==='password'?'text':'password'; return }
    if(e.target.closest('[data-ar-quick]')){ API.quick().then(function(){ auth.hidden=true; dash.hidden=false; loadDash() }); return }
    if(e.target.closest('[data-ar-menu]')){ var mo=dash.classList.toggle('menu'); e.target.closest('[data-ar-menu]').setAttribute('aria-expanded',mo); return }
    if(e.target.closest('[data-ios-x]')){ $('#appIos').hidden=true; return }
    if(e.target.closest('[data-ar-logout]')){ lezLeave(); API.signOut().then(function(){ setBtn(null); dash.hidden=true; auth.hidden=false; pane('login') }) }
  },true);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!bg.hidden&&!APP){ e.stopPropagation(); close() } },true);

  /* validazione */
  var EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function strong(p){ return p.length>=8&&/[a-z]/i.test(p)&&/\d/.test(p) }
  function cfOk(cf){
    cf=cf.toUpperCase(); if(!/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/.test(cf)) return false;
    var odd=[1,0,5,7,9,13,15,17,19,21,2,4,18,20,11,3,6,8,12,14,16,10,22,25,24,23], s=0;
    for(var i=0;i<15;i++){ var c=cf.charCodeAt(i), v=c<65?c-48:c-65; s+=(i%2===0)?odd[v]:v }
    return String.fromCharCode(65+s%26)===cf[15];
  }
  function check(el){
    var v=(el.value||'').trim(), ok=true, n=el.name;
    if(el.type==='checkbox') ok=!el.required||el.checked;
    else if(el.required&&!v) ok=false;
    else if(n==='email'&&v) ok=EMAIL.test(v);
    else if(n==='password'&&(el.closest('#arReg,#arPw,#arRecover'))) ok=strong(el.value);
    else if(n==='password2') ok=v===el.form.elements.password.value&&v!=='';
    else if(n==='codice_fiscale') ok=cfOk(v);
    else if(n==='cap'&&v) ok=/^\d{5}$/.test(v);
    else if(n==='cellulare'&&v) ok=v.replace(/\D/g,'').length>=8;
    else if(n==='provincia'&&v) ok=/^[A-Za-z]{2}$/.test(v);
    else if(n==='data_nascita'&&v){ var y=+v.slice(0,4); ok=y>1920&&y<=new Date().getFullYear()-13 }
    var f=el.closest('.field'); if(f) f.classList.toggle('err',!ok);
    if(el.type==='checkbox'&&!ok) el.closest('.check').style.color='var(--err)'; else if(el.type==='checkbox') el.closest('.check').style.color='';
    return ok;
  }
  function checkAll(scope){ var ok=true, first=null; $$('input,select',scope).forEach(function(el){ if(el.closest('[hidden]')&&el.closest('[hidden]')!==scope) return; if(!check(el)){ ok=false; first=first||el } }); if(first) first.focus(); return ok }
  bg.addEventListener('input',function(e){ var f=e.target.closest('.field'); if(f) f.classList.remove('err'); if(e.target.classList.contains('ar-up')){ var p=e.target.selectionStart; e.target.value=e.target.value.toUpperCase(); e.target.setSelectionRange(p,p) } if(e.target.id==='ar-pw') meter(e.target.value) });
  function meter(p){ var s=0; if(p.length>=8)s++; if(/[a-z]/.test(p)&&/[A-Z]/.test(p))s++; if(/\d/.test(p))s++; if(/[^\w]/.test(p)||p.length>=12)s++; var i=$('.ar-meter i'); i.style.width=(s*25)+'%'; i.style.background=['#c62838','#c62838','#e0a020','#1f5fd0','#0a7a45'][s] }

  /* login */
  $('#arLogin').addEventListener('submit',function(e){ e.preventDefault(); var f=this; if(!checkAll(f)) return; var b=$('[type=submit]',f); busy(b,true);
    API.signIn(f.email.value.trim().toLowerCase(),f.password.value).then(function(){ f.reset(); auth.hidden=true; dash.hidden=false; loadDash() })
      .catch(function(err){ msg(f,itErr(err)) }).then(function(){ busy(b,false) }) });
  $('#arForgot').addEventListener('submit',function(e){ e.preventDefault(); var f=this; if(!checkAll(f)) return; var b=$('[type=submit]',f); busy(b,true);
    API.reset(f.email.value.trim().toLowerCase()).then(function(){ msg(f,LIVE?'Se l\'indirizzo &egrave; registrato, riceverai a breve un\'email con il link per scegliere una nuova password.':'In modalit&agrave; dimostrativa non vengono inviate email.',true) })
      .catch(function(err){ msg(f,itErr(err)) }).then(function(){ busy(b,false) }) });
  $('#arRecover').addEventListener('submit',function(e){ e.preventDefault(); var f=this; if(!checkAll(f)) return; var b=$('[type=submit]',f); busy(b,true);
    API.setPw(f.password.value).then(function(){ f.reset(); auth.hidden=true; dash.hidden=false; loadDash() }).catch(function(err){ msg(f,itErr(err)) }).then(function(){ busy(b,false) }) });

  /* iscrizione a passi */
  var reg=$('#arReg'), cur=1, N=5;
  function step(n){ cur=n; $$('.ar-step',reg).forEach(function(s){ s.hidden=+s.getAttribute('data-step')!==n });
    $$('.ar-steps li',reg).forEach(function(li,i){ li.className=i+1<n?'done':(i+1===n?'on':'') });
    $('[data-ar-prev]',reg).hidden=n===1; $('[data-ar-next]',reg).hidden=n===N; $('[data-ar-submit]',reg).hidden=n!==N;
    $('.ar-msg',reg).className='ar-msg'; if(n===N) recap(); var m=$('.ar-main'); if(m) m.scrollTop=0; bg.scrollTop=0 }
  $('[data-ar-next]',reg).addEventListener('click',function(){ if(checkAll($('.ar-step[data-step="'+cur+'"]',reg))) step(cur+1) });
  $('[data-ar-prev]',reg).addEventListener('click',function(){ step(cur-1) });
  reg.addEventListener('keydown',function(e){ if(e.key==='Enter'&&e.target.tagName==='INPUT'&&cur<N){ e.preventDefault(); $('[data-ar-next]',reg).click() } });
  function val(n){ var el=reg.elements[n]; return el?(el.type==='checkbox'?el.checked:el.value.trim()):'' }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c] }) }
  function itDate(s){ if(!s) return ''; var d=new Date(s.length===10?s+'T12:00:00':s); return isNaN(d)?s:d.toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'}) }
  function recap(){
    var rows=[['Nome e cognome',val('nome')+' '+val('cognome')],['Codice fiscale',val('codice_fiscale').toUpperCase()],['Nato/a a',val('comune_nascita')+(val('prov_nascita')?' ('+val('prov_nascita').toUpperCase()+')':'')+', '+itDate(val('data_nascita'))],
      ['Email',val('email')],['Cellulare',val('cellulare')],['Residenza',val('indirizzo')+', '+val('cap')+' '+val('comune')+' ('+val('provincia').toUpperCase()+')'],
      ['Percorso',val('percorso')],['Corso',val('corso')+' &middot; '+esc(val('modalita'))],['Sede',val('polo')],['Titolo posseduto',val('titolo_studio')]];
    $('#arRecap').innerHTML=rows.map(function(r){ return '<div><dt>'+r[0]+'</dt><dd>'+(r[0]==='Corso'?esc(val('corso'))+' &middot; '+esc(val('modalita')):esc(r[1]))+'</dd></div>' }).join('');
  }
  reg.addEventListener('submit',function(e){ e.preventDefault(); if(!checkAll($('.ar-step[data-step="5"]',reg))) return;
    var b=$('[data-ar-submit]',reg); busy(b,true);
    var p={}; ['nome','cognome','sesso','data_nascita','comune_nascita','prov_nascita','cittadinanza','codice_fiscale','cellulare','telefono','indirizzo','cap','comune','provincia','domicilio','percorso','corso','modalita','polo','titolo_studio','anno_titolo','istituto'].forEach(function(n){ p[n]=val(n) });
    p.codice_fiscale=p.codice_fiscale.toUpperCase(); p.provincia=p.provincia.toUpperCase(); p.prov_nascita=p.prov_nascita.toUpperCase();
    p.consenso_privacy=true; p.consenso_marketing=val('consenso_marketing');
    var email=val('email').toLowerCase();
    API.signUp(email,reg.elements.password.value,p).then(function(r){
      if(r.session){ reg.reset(); auth.hidden=true; dash.hidden=false; loadDash(true) }
      else { $('[data-ar-mail]',auth).textContent=email; reg.reset(); pane('check') }
    }).catch(function(err){ msg(reg,itErr(err)); if(/already/i.test(err.message||'')) step(1) }).then(function(){ busy(b,false) });
  });

  /* scheda personale */
  var P=null;
  function fill(p){
    P=p; var st=STATI[p.stato]||STATI.registrato;
    var v={nome_completo:p.nome+' '+p.cognome,iniziali:((p.nome||' ')[0]+(p.cognome||' ')[0]).toUpperCase(),sesso_label:p.sesso==='F'?'Femminile':(p.sesso==='M'?'Maschile':''),
      data_nascita_it:itDate(p.data_nascita),luogo_nascita:(p.comune_nascita||'')+(p.prov_nascita?' ('+p.prov_nascita+')':''),creato_it:itDate(p.created_at),
      contratto_it:itDate(p.consenso_contratto||p.created_at),stato_label:st[0]};
    $$('[data-f]',dash).forEach(function(el){ var k=el.getAttribute('data-f');
      if(k==='track'){ $$('li',el).forEach(function(li,i){ li.className=i+1<st[1]||st[1]===4?'done':(i+1===st[1]?'now':'') }); return }
      if(k==='stato_testo'){ el.innerHTML=st[2]; return }
      var x=k in v?v[k]:p[k]; el.textContent=(x===null||x===undefined||x==='')?'—':x });
    var f=$('#arEdit'); EDIT.forEach(function(n){ var el=f.elements[n]; if(!el) return; if(el.type==='checkbox') el.checked=!!p[n]; else el.value=p[n]||'' });
  }
  function loadDash(nuovo){
    ecoData=carData=esaData=calM=calSel=ecoAA=null; esaF='tutti'; lezLeave(); lezData=null;
    API.profile().then(function(p){ fill(p); setBtn(p); tab(startTab()); if(nuovo) toast('Iscrizione completata: benvenuto, '+p.nome+'!') })
      .catch(function(err){ dash.hidden=true; auth.hidden=false; pane('login'); msg($('#arLogin'),itErr(err)) });
  }
  function tab(n){ if(n!=='lezioni') lezLeave(); dash.classList.remove('menu');
    $$('.ar-tab',dash).forEach(function(s){ s.hidden=s.getAttribute('data-tab')!==n }); $$('.ar-tabs button,.ar-bnav button',dash).forEach(function(b){ b.classList.toggle('on',b.getAttribute('data-ar-tab')===n) });
    $('.ar-body',dash).scrollTop=0; if(n==='scheda') riepilogo(); if(n==='documenti') docs(); if(n==='moduli') mods(); if(n==='economia') eco(); if(n==='carriera') car(); if(n==='esami') esa(); if(n==='lezioni') les();
    if(APP&&!(n==='lezioni'&&/^#lezione-/.test(location.hash))) try{ history.replaceState(null,'',location.pathname+location.search+(n==='scheda'?'':'#'+n)) }catch(e){} }
  function startTab(){ if(/^#lezione-\d+$/.test(location.hash)) return 'lezioni'; var m=/^#(\w+)$/.exec(location.hash); return APP&&m&&$('.ar-tab[data-tab="'+m[1]+'"]',dash)?m[1]:'scheda' }
  $('#arEdit').addEventListener('submit',function(e){ e.preventDefault(); var f=this, ok=true;
    ['cellulare','indirizzo','cap','comune','provincia'].forEach(function(n){ var el=f.elements[n]; el.required=true; if(!check(el)) ok=false });
    if(!ok) return; var patch={}; EDIT.forEach(function(n){ var el=f.elements[n]; patch[n]=el.type==='checkbox'?el.checked:el.value.trim() }); patch.provincia=patch.provincia.toUpperCase();
    var b=$('[type=submit]',f); busy(b,true);
    API.update(patch).then(function(p){ fill(p); msg(f,'Modifiche salvate.',true) }).catch(function(err){ msg(f,itErr(err)) }).then(function(){ busy(b,false) }) });
  $('#arPw').addEventListener('submit',function(e){ e.preventDefault(); var f=this; if(!checkAll(f)) return; var b=$('[type=submit]',f); busy(b,true);
    API.setPw(f.password.value).then(function(){ f.reset(); msg(f,'Password aggiornata.',true) }).catch(function(err){ msg(f,itErr(err)) }).then(function(){ busy(b,false) }) });

  function docs(){
    var box=$('#arDocs'); box.innerHTML='<p class="ar-sub">Caricamento&hellip;</p>';
    API.docs().then(function(have){
      box.innerHTML=DOCS.map(function(d){ var l=have[d[0]]||[];
        return '<div class="ar-doc'+(l.length?' ok':'')+'"><div class="ar-doc-h"><b>'+d[1]+'</b><small>'+(l.length?'&#10003; Caricato':'Da caricare')+'</small></div><p>'+d[2]+'</p>'
          +(l.length?'<ul>'+l.map(function(x){ return '<li>'+(x.path?'<a href="#" data-path="'+esc(x.path)+'">'+esc(x.name)+'</a>':esc(x.name))+'<span>'+itDate(x.at)+'</span></li>' }).join('')+'</ul>':'')
          +'<label class="btn btn-g btn-sm">'+(l.length?'Carica un altro file':'Carica il file')+'<input type="file" accept=".pdf,.jpg,.jpeg,.png,.heic" data-slot="'+d[0]+'"></label></div>' }).join('');
    }).catch(function(err){ box.innerHTML='<div class="ar-msg on">'+itErr(err)+'</div>' });
  }
  $('#arDocs').addEventListener('change',function(e){ var i=e.target; if(!i.files||!i.files[0]) return; var f=i.files[0];
    if(f.size>10*1024*1024){ toast('Il file supera i 10 MB'); i.value=''; return }
    i.parentElement.firstChild.textContent='Caricamento…';
    API.upload(i.getAttribute('data-slot'),f).then(function(){ toast('Documento caricato'); docs(); if(!LIVE) API.profile().then(fill) }).catch(function(err){ toast(itErr(err)); docs() }) });
  $('#arDocs').addEventListener('click',function(e){ var a=e.target.closest('[data-path]'); if(!a) return; e.preventDefault(); API.link(a.getAttribute('data-path')).then(function(u){ window.open(u,'_blank','noopener') }) });
  function mods(){ $('#arMods').innerHTML=MODULI.map(function(g){ return '<div class="ar-mod-g">'+g[0]+'</div>'+g[1].map(function(m){ return '<a class="ar-mod" href="'+BASE+'modulistica/'+m[0]+'.pdf" target="_blank" rel="noopener"><i>PDF</i><span>'+m[1]+'</span><small>Scarica</small></a>' }).join('') }).join('') }

  /* ===== scheda: SITUAZIONE ECONOMICA ===== */
  var ecoAA=null, ecoData=null;
  function oggi(){ var t=new Date(); t.setHours(0,0,0,0); return t }
  function failBox(box,err){ box.innerHTML='<div class="ar-msg on">'+itErr(err)+'</div>' }
  function emptyBox(ic,t,p){ return '<div class="ar-card ar-empty"><div class="ic">'+ic+'</div><b>'+t+'</b><p>'+p+'</p></div>' }
  function rataStato(r){
    var s=pd(r.scadenza), g=Math.round((s-oggi())/864e5);
    if(r.pagata_il) return ['ok','Pagata il '+itShort(r.pagata_il)];
    if(g<0) return ['late','Scaduta da '+(-g)+(g===-1?' giorno':' giorni')];
    if(g<=15) return ['warn',g===0?'Scade oggi':'Scade fra '+g+(g===1?' giorno':' giorni')];
    return ['todo','Da pagare'];
  }
  function eco(){
    var box=$('#arEco'); if(!ecoData) box.innerHTML='<p class="ar-load">Caricamento&hellip;</p>';
    API.eco().then(function(d){ ecoData=d; ecoDraw() }).catch(function(e){ failBox(box,e) });
  }
  function ecoDraw(){
    var box=$('#arEco'), d=ecoData, anni=[];
    d.rette.concat(d.rate).forEach(function(r){ if(anni.indexOf(r.anno_accademico)<0) anni.push(r.anno_accademico) });
    anni.sort().reverse();
    if(!anni.length){ box.innerHTML=emptyBox('&#128182;','Piano dei pagamenti non ancora disponibile','La segreteria inserisce retta e rate al perfezionamento dell\'iscrizione. Se hai gi&agrave; pagato, carica la ricevuta fra <a href="#" data-ar-tab="documenti">I miei documenti</a>.')+payCard(); return }
    if(anni.indexOf(ecoAA)<0) ecoAA=anni[0];
    var rette=d.rette.filter(function(r){ return r.anno_accademico===ecoAA }), rate=d.rate.filter(function(r){ return r.anno_accademico===ecoAA })
      .sort(function(a,b){ return a.scadenza<b.scadenza?-1:a.scadenza>b.scadenza?1:a.numero-b.numero });
    var lordo=0, rid=0; rette.forEach(function(r){ lordo+=+r.importo; rid+=+r.riduzione||0 });
    var totRate=0, pagato=0, scad=[], next=null; rate.forEach(function(r){ totRate+=+r.importo; if(r.pagata_il) pagato+=+r.importo; else if(pd(r.scadenza)<oggi()) scad.push(r); else if(!next) next=r });
    var dovuto=rette.length?lordo-rid:totRate, resto=Math.max(0,dovuto-pagato), perc=dovuto?Math.min(100,Math.round(pagato/dovuto*100)):0, sc=0; scad.forEach(function(r){ sc+=+r.importo });
    var h='';
    if(anni.length>1) h+='<div class="ar-chips" role="tablist">'+anni.map(function(a){ return '<button type="button" data-eco-aa="'+esc(a)+'" class="'+(a===ecoAA?'on':'')+'">A.A. '+esc(a)+'</button>' }).join('')+'</div>';
    if(scad.length) h+='<div class="ar-alert"><i>&#9888;</i><div><b>'+(scad.length===1?'Hai una rata scaduta':'Hai '+scad.length+' rate scadute')+' per '+eur(sc)+'.</b> Effettua il pagamento e carica la ricevuta fra <a href="#" data-ar-tab="documenti">I miei documenti</a>; se hai gi&agrave; pagato, la segreteria la registra appena controllata.</div></div>';
    h+='<div class="ar-kpis">'
      +'<div class="ar-kpi top"><small>Totale A.A. '+esc(ecoAA)+'</small><b>'+eur(dovuto)+'</b><span>'+(rid?'gi&agrave; scontato di '+eur(rid):rate.length+' '+(rate.length===1?'rata':'rate'))+'</span></div>'
      +'<div class="ar-kpi ok"><small>Pagato</small><b>'+eur(pagato)+'</b><span>'+perc+'% del totale</span></div>'
      +'<div class="ar-kpi'+(scad.length?' late':'')+'"><small>Da pagare</small><b>'+eur(resto)+'</b><span>'+(scad.length?eur(sc)+' scaduti':'nessuna rata scaduta')+'</span></div>'
      +'<div class="ar-kpi"><small>Prossima scadenza</small><b>'+(next?itShort(next.scadenza):'&mdash;')+'</b><span>'+(next?eur(next.importo)+' &middot; rata '+next.numero:(resto?'vedi le rate scadute':'tutto saldato'))+'</span></div>'
      +'</div>';
    h+='<div class="ar-card"><div class="ar-bar"><i style="width:'+perc+'%"></i></div><div class="ar-bar-l"><span>Pagato '+eur(pagato)+'</span><span>Totale '+eur(dovuto)+'</span></div></div>';
    if(rette.length) h+='<div class="ar-card"><div class="ar-card-h"><h5>Composizione</h5><span class="ar-lockt">A.A. '+esc(ecoAA)+'</span></div><div class="ar-voci">'
      +rette.map(function(r){ return '<div><span>'+esc(r.voce)+(r.note?'<small>'+esc(r.note)+'</small>':'')+'</span><b>'+eur(r.importo)+'</b></div>'+(+r.riduzione?'<div class="rid"><span>Riduzione'+(r.causale_riduzione?'<small>'+esc(r.causale_riduzione)+'</small>':'')+'</span><b>&minus; '+eur(r.riduzione)+'</b></div>':'') }).join('')
      +'<div class="tot"><span>Totale dovuto</span><b>'+eur(dovuto)+'</b></div></div>'
      +(rate.length&&Math.abs(totRate-dovuto)>.009?'<p class="ar-hint">Le rate programmate sommano '+eur(totRate)+': per chiarimenti scrivi alla segreteria.</p>':'')+'</div>';
    h+='<div class="ar-card"><div class="ar-card-h"><h5>Piano delle rate</h5><span class="ar-lockt">'+rate.length+' '+(rate.length===1?'rata':'rate')+'</span></div>';
    if(rate.length) h+='<div class="ar-rate-h"><span>N.</span><span>Descrizione</span><span>Scadenza</span><span>Importo</span><span>Stato</span></div><div class="ar-rate">'
      +rate.map(function(r){ var s=rataStato(r); return '<div class="ar-rata '+s[0]+'"><i>'+esc(r.numero)+'</i><div><b>'+esc(r.descrizione||('Rata '+r.numero))+'</b>'
        +(r.pagata_il&&(r.metodo||r.riferimento)?'<small>'+esc([r.metodo,r.riferimento].filter(Boolean).join(' · '))+'</small>':'')+(r.note?'<small>'+esc(r.note)+'</small>':'')+'</div>'
        +'<div class="dt"><small>Scadenza</small>'+itShort(r.scadenza)+'</div><div class="imp">'+eur(r.importo)+'</div><div class="st"><span class="ar-st '+s[0]+'">'+s[1]+'</span></div></div>' }).join('')+'</div>';
    else h+='<p>Le rate di questo anno non sono ancora state inserite.</p>';
    h+='</div>'+payCard();
    box.innerHTML=h;
  }
  function payCard(){
    var cau='Matricola '+(P&&P.matricola||'')+' - '+(P?(P.cognome+' '+P.nome).toUpperCase():'')+' - Rata n. ...';
    return '<div class="ar-card"><div class="ar-card-h"><h5>Come pagare</h5></div><dl class="ar-pay">'
      +'<div><dt>Modalit&agrave;</dt><dd>Bonifico bancario, oppure in sede</dd></div>'
      +'<div><dt>Coordinate bancarie</dt><dd>Te le comunica la segreteria</dd></div>'
      +'<div style="grid-column:1/-1"><dt>Causale</dt><dd><span data-cau>'+esc(cau)+'</span><button type="button" class="ar-copy" data-copy>Copia</button></dd></div></dl>'
      +'<p>Dopo il pagamento carica la ricevuta: la rata risulta pagata quando la segreteria l\'ha registrata.</p><div class="ar-actions">'
      +'<button type="button" class="btn btn-p btn-sm" data-ar-tab="documenti"><span>Carica la ricevuta</span><span class="shine"></span></button>'
      +'<a class="btn btn-g btn-sm" href="'+BASE+'modulistica/richiesta-rateizzazione.pdf" target="_blank" rel="noopener">Chiedi una rateizzazione diversa</a></div></div>';
  }
  $('#arEco').addEventListener('click',function(e){
    var b=e.target.closest('[data-eco-aa]'); if(b){ ecoAA=b.getAttribute('data-eco-aa'); ecoDraw(); return }
    if(e.target.closest('[data-copy]')){ var t=$('[data-cau]',this).textContent; try{ navigator.clipboard.writeText(t).then(function(){ toast('Causale copiata') }) }catch(x){ toast(t) } }
  });

  /* ===== scheda: CARRIERA ===== */
  var carData=null;
  function voto(c){ if(c.esito==='da sostenere') return '';
    if(c.voto) return c.voto+(c.lode?' e lode':'')+'<small style="display:inline;font-size:12px;color:var(--txt-mute);font-family:Outfit">/30</small>';
    return c.esito==='riconosciuto'?'Convalidato':'Idoneo' }
  function car(){
    var box=$('#arCar'); if(!carData) box.innerHTML='<p class="ar-load">Caricamento&hellip;</p>';
    API.car().then(function(l){ carData=l; carDraw() }).catch(function(e){ failBox(box,e) });
  }
  function medie(l){
    var sp=0, sc=0, sv=0, n=0; l.forEach(function(c){ if(c.esito!=='da sostenere'&&c.voto){ var v=+c.voto; sp+=v*(+c.cfu); sc+=+c.cfu; sv+=v; n++ } });
    return {pond:sc?sp/sc:0, arit:n?sv/n:0, n:n};
  }
  function carDraw(){
    var box=$('#arCar'), l=carData||[];
    if(!l.length){ box.innerHTML=emptyBox('&#127891;','Il tuo libretto non &egrave; ancora attivo','Il piano di studi compare qui quando l\'iscrizione &egrave; perfezionata. Per far valutare esami gi&agrave; sostenuti altrove usa il modulo <a href="'+BASE+'modulistica/riconoscimento-crediti.pdf" target="_blank" rel="noopener">Riconoscimento crediti</a>.'); return }
    var tot=0, ok=0, ne=0, nok=0, anni={};
    l.forEach(function(c){ var f=+c.cfu||0, s=c.esito!=='da sostenere'; tot+=f; if(s) ok+=f; if(c.tipo!=='tirocinio'&&c.tipo!=='prova finale'){ ne++; if(s) nok++ }
      (anni[c.anno_corso]=anni[c.anno_corso]||[]).push(c) });
    var m=medie(l), p=tot?Math.round(ok/tot*100):0, fmt=function(x){ return x?x.toLocaleString('it-IT',{minimumFractionDigits:2,maximumFractionDigits:2}):'&mdash;' };
    var h='<div class="ar-car-top"><div class="ar-ring"><div class="r" style="--p:'+p+'"><div><b>'+(ok%1?ok.toFixed(1):ok)+'</b><small>di '+(tot%1?tot.toFixed(1):tot)+' CFU</small></div></div><span>'+p+'% del percorso completato</span></div>'
      +'<div class="ar-kpis"><div class="ar-kpi ok"><small>Esami superati</small><b>'+nok+' su '+ne+'</b><span>'+(ne-nok)+' ancora da sostenere</span></div>'
      +'<div class="ar-kpi"><small>Media ponderata</small><b>'+fmt(m.pond)+'</b><span>sui crediti, con '+m.n+' '+(m.n===1?'voto':'voti')+'</span></div>'
      +'<div class="ar-kpi"><small>Media aritmetica</small><b>'+fmt(m.arit)+'</b><span>la lode vale 30</span></div>'
      +'<div class="ar-kpi top"><small>Base di laurea</small><b>'+(m.pond?fmt(m.pond*110/30):'&mdash;')+'<span style="display:inline;font-size:13px"> /110</span></b><span>media ponderata &times; 110 / 30</span></div></div></div>';
    var primo=null;
    Object.keys(anni).sort(function(a,b){ return a-b }).forEach(function(a){
      var es=anni[a], cf=0, co=0, n=0, no=0; es.forEach(function(c){ cf+=+c.cfu||0; if(c.esito!=='da sostenere'){ co+=+c.cfu||0; no++ } n++ });
      var aperto=primo===null&&no<n; if(aperto) primo=a;
      h+='<details class="ar-yr"'+(aperto?' open':'')+'><summary><h5>'+a+'&deg; anno</h5><div class="ar-bar"><i style="width:'+(cf?Math.round(co/cf*100):0)+'%"></i></div><em>'+no+'/'+n+' &middot; '+co+'/'+cf+' CFU</em></summary>'
        +'<div class="ar-exs"><div class="ar-ex-h"><span>Insegnamento</span><span>CFU</span><span>Esito</span><span>Data</span></div>'
        +es.map(function(c){ var s=c.esito!=='da sostenere', tp={'a scelta':'A scelta','tirocinio':'Tirocinio','prova finale':'Prova finale','altro':'Attivit&agrave;'}[c.tipo]||'';
          return '<div class="ar-ex'+(s?'':' todo')+'"><div><b>'+esc(c.insegnamento)+'</b><small>'+[esc(c.ssd||''),tp,c.note?esc(c.note):''].filter(Boolean).join(' &middot; ')+'</small></div>'
            +'<span class="cfu">'+(+c.cfu)+'<span class="m-only"> CFU</span></span>'
            +'<span class="es">'+(s?(c.voto?'<span class="vt">'+voto(c)+'</span>':'<span class="ar-st ok">'+voto(c)+'</span>')+(c.esito==='riconosciuto'&&c.voto?' <span class="ar-st info">Riconosciuto</span>':''):'<span class="ar-st todo">Da sostenere</span>')+'</span>'
            +'<span class="dt">'+(s&&c.data_esame?itShort(c.data_esame):'&mdash;')+'</span></div>' }).join('')+'</div></details>';
    });
    h+='<div class="ar-actions" style="margin-top:6px"><button type="button" class="btn btn-g btn-sm" data-car-print>&#128424; Stampa il libretto</button><button type="button" class="btn btn-g btn-sm" data-ar-tab="esami">&#128197; Prenota un esame</button></div>'
      +'<p class="ar-hint">Il libretto lo aggiorna la segreteria dopo la verbalizzazione. Se manca un esame o un dato &egrave; sbagliato, scrivi alla segreteria con il modulo <a href="'+BASE+'modulistica/istanza-alla-direzione.pdf" target="_blank" rel="noopener">Istanza alla Direzione</a>.</p>';
    box.innerHTML=h;
  }
  $('#arCar').addEventListener('click',function(e){ if(!e.target.closest('[data-car-print]')) return;
    var l=carData||[], m=medie(l), w=window.open('','_blank'); if(!w){ toast('Consenti le finestre pop-up per stampare'); return }
    var r=l.map(function(c){ var s=c.esito!=='da sostenere'; return '<tr><td>'+c.anno_corso+'&deg;</td><td>'+esc(c.insegnamento)+'</td><td>'+esc(c.ssd||'')+'</td><td>'+(+c.cfu)+'</td><td>'+(s?(c.voto?c.voto+(c.lode?' e lode':''):(c.esito==='riconosciuto'?'Convalidato':'Idoneo')):'&mdash;')+'</td><td>'+(s&&c.data_esame?itShort(c.data_esame):'')+'</td></tr>' }).join('');
    w.document.write('<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Libretto '+esc(P.matricola)+'</title><style>body{font:13px/1.45 Arial,sans-serif;color:#111;margin:32px}h1{font-size:19px;margin:0}p{margin:4px 0 16px;color:#444}table{width:100%;border-collapse:collapse}th,td{border-bottom:1px solid #ccc;padding:6px 8px;text-align:left}th{background:#eef1f8;font-size:11px;text-transform:uppercase}tfoot td{font-weight:bold;border:0;padding-top:12px}.n{font-size:11px;color:#666;margin-top:24px}</style></head><body>'
      +'<h1>UNICESD Olympo &middot; Libretto dello studente</h1><p><b>'+esc(P.cognome+' '+P.nome)+'</b> &middot; Matricola '+esc(P.matricola)+' &middot; '+esc(P.corso||'')+'</p>'
      +'<table><thead><tr><th>Anno</th><th>Insegnamento</th><th>SSD</th><th>CFU</th><th>Esito</th><th>Data</th></tr></thead><tbody>'+r+'</tbody><tfoot><tr><td colspan="6">Media ponderata '+(m.pond?m.pond.toFixed(2):'—')+' &middot; Media aritmetica '+(m.arit?m.arit.toFixed(2):'—')+'</td></tr></tfoot></table>'
      +'<p class="n">Estratto stampato dall\'Area Riservata il '+new Date().toLocaleDateString('it-IT')+'. Non sostituisce il certificato ufficiale rilasciato dall\'ateneo.</p><script>onload=function(){print()}<\/script></body></html>');
    w.document.close();
  });

  /* ===== scheda: CALENDARIO ESAMI E PRENOTAZIONI ===== */
  var esaData=null, calM=null, calSel=null, esaF='tutti';
  var MESI=['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'], GG=['dom','lun','mar','mer','gio','ven','sab'];
  function esa(){
    var box=$('#arEsa'); if(!esaData) box.innerHTML='<p class="ar-load">Caricamento&hellip;</p>';
    API.app().then(function(l){ esaData=l; esaDraw() }).catch(function(e){ failBox(box,e) });
  }
  function appStato(a){
    var o=oggi(), d=pd(a.data), ch=a.chiusura?pd(a.chiusura):addD(d,-1), pieno=a.posti&&a.iscritti>=a.posti;
    if(d<o) return {k:'past',t:a.prenotato?'Sostenuto':'Concluso',c:'todo'};
    if(a.superato) return {k:'done',t:'Esame gi&agrave; superato',c:'ok'};
    if(a.prenotato) return {k:'mine',t:'Prenotato',c:'ok',annulla:o<=ch,sub:o<=ch?'Puoi annullare fino al '+itShort(ymd(ch)):'Prenotazioni chiuse'};
    if(a.apertura&&o<pd(a.apertura)) return {k:'soon',t:'Prenotazioni dal '+itShort(a.apertura),c:'info'};
    if(o>ch) return {k:'closed',t:'Prenotazioni chiuse',c:'todo'};
    if(pieno) return {k:'full',t:'Posti esauriti',c:'late'};
    var g=Math.round((ch-o)/864e5);
    return {k:'open',t:g===0?'Ultimo giorno per prenotare':'Prenotabile fino al '+itShort(ymd(ch)),c:g<=3?'warn':'info',prenota:true};
  }
  function appCard(a){
    var s=appStato(a), d=pd(a.data), libero=a.posti?Math.max(0,a.posti-a.iscritti):null;
    var meta=[esc(a.tipo||''),a.ora?'ore '+String(a.ora).slice(0,5):'',esc(a.sede||'')+(a.aula?' &middot; '+esc(a.aula):''),esc(a.docente||'')].filter(Boolean).map(function(x){ return '<span>'+x+'</span>' }).join('');
    var act='';
    if(s.prenota) act='<button type="button" class="btn btn-p btn-sm" data-pren="'+a.id+'"><span>Prenota</span><span class="shine"></span></button>';
    if(s.annulla) act='<button type="button" class="btn btn-g btn-sm danger" data-ann="'+a.id+'">Annulla</button>';
    return '<div class="ar-app'+(s.k==='mine'?' mine':'')+(/past|closed|done|full/.test(s.k)?' off':'')+'"><div class="ar-day"><small>'+GG[d.getDay()]+'</small><b>'+d.getDate()+'</b><small>'+MESI[d.getMonth()]+'</small></div>'
      +'<div><h6>'+esc(a.insegnamento)+'</h6><div class="meta">'+meta+'</div><div class="st-l"><span class="ar-st '+s.c+'">'+s.t+'</span>'+(s.sub?'<small class="posti">'+s.sub+'</small>':'')+(a.note?'<small class="posti">'+esc(a.note)+'</small>':'')+'</div></div>'
      +'<div class="act">'+act+(libero!==null&&s.k!=='past'&&s.k!=='done'?'<span class="posti">'+(libero?libero+' '+(libero===1?'posto libero':'posti liberi')+' su '+a.posti:'Nessun posto libero')+'</span>':'')+'</div></div>';
  }
  function esaDraw(){
    var box=$('#arEsa'), l=(esaData||[]).slice().sort(function(a,b){ return a.data<b.data?-1:a.data>b.data?1:String(a.ora||'')<String(b.ora||'')?-1:1 }), o=oggi(), h='';
    if(LIVE&&P&&P.stato!=='iscritto') h+='<div class="ar-info"><i>&#8505;</i><div>Potrai prenotare gli esami quando la tua iscrizione sar&agrave; <b>perfezionata</b>. Intanto puoi consultare il calendario.</div></div>';
    if(!l.length){ box.innerHTML=h+emptyBox('&#128197;','Nessun appello in calendario','Gli appelli dei tuoi esami compaiono qui appena la segreteria li pubblica. Per sostenere gli esami in una sede diversa usa il modulo <a href="'+BASE+'modulistica/scelta-sede-esami.pdf" target="_blank" rel="noopener">Scelta della sede esami</a>.'); return }
    var mie=l.filter(function(a){ return a.prenotato&&pd(a.data)>=o });
    var fut=l.filter(function(a){ return pd(a.data)>=o });
    if(!calM){ var f=fut[0]||l[l.length-1]; calM=new Date(pd(f.data).getFullYear(),pd(f.data).getMonth(),1) }
    h+='<div class="ar-sec"><span>Le mie prenotazioni</span></div><div class="ar-mylist">'+(mie.length?mie.map(appCard).join(''):'<div class="ar-card" style="margin:0;padding:16px 20px"><p style="margin:0">Non hai prenotazioni attive. Scegli un appello qui sotto.</p></div>')+'</div>';
    // calendario del mese
    var y=calM.getFullYear(), mo=calM.getMonth(), first=(new Date(y,mo,1).getDay()+6)%7, nd=new Date(y,mo+1,0).getDate(), byDay={};
    l.forEach(function(a){ var d=pd(a.data); if(d.getFullYear()===y&&d.getMonth()===mo){ var k=d.getDate(); (byDay[k]=byDay[k]||[]).push(a) } });
    var cal='<div class="ar-cal"><div class="ar-cal-h"><button type="button" data-cal="-1" aria-label="Mese precedente">&lsaquo;</button><b>'+calM.toLocaleDateString('it-IT',{month:'long',year:'numeric'})+'</b><button type="button" data-cal="1" aria-label="Mese successivo">&rsaquo;</button></div><div class="ar-cal-g">'
      +['L','M','M','G','V','S','D'].map(function(x){ return '<span>'+x+'</span>' }).join('')+new Array(first+1).join('<i></i>');
    for(var g=1;g<=nd;g++){ var dd=new Date(y,mo,g), ap=byDay[g]||[], k=ymd(dd), c=[];
      if(ap.length) c.push('has'); if(ap.some(function(a){ return a.prenotato })) c.push('mine'); if(dd<o) c.push('past'); if(+dd===+o) c.push('today'); if(calSel===k) c.push('sel');
      cal+='<button type="button" class="'+c.join(' ')+'"'+(ap.length?' data-day="'+k+'" aria-label="'+g+': '+ap.length+' appell'+(ap.length===1?'o':'i')+'"':' tabindex="-1"')+'>'+g+'</button>' }
    cal+='</div><div class="ar-cal-l"><span><i></i>Appello</span><span><i class="g"></i>Prenotato</span><span><i class="r"></i>Oggi</span></div></div>';
    // elenco filtrato
    var vis=l.filter(function(a){ var d=pd(a.data); if(calSel) return a.data.slice(0,10)===calSel; return d.getFullYear()===y&&d.getMonth()===mo })
      .filter(function(a){ if(esaF==='aperti') return appStato(a).prenota; if(esaF==='piano') return a.nel_piano&&!a.superato; return true });
    var titolo=calSel?pd(calSel).toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'}):'Appelli di '+calM.toLocaleDateString('it-IT',{month:'long'});
    var lista='<div><div class="ar-chips">'+[['tutti','Tutti'],['aperti','Prenotabili ora'],['piano','Da sostenere']].map(function(f){ return '<button type="button" data-esaf="'+f[0]+'" class="'+(esaF===f[0]?'on':'')+'">'+f[1]+'</button>' }).join('')+'</div>'
      +'<div class="ar-sec"><span style="text-transform:none;letter-spacing:0;font-size:14px;color:var(--txt-strong)">'+titolo+'</span>'+(calSel?'<a data-day-clear>Tutto il mese</a>':'')+'</div>'
      +'<div class="ar-apps">'+(vis.length?vis.map(appCard).join(''):'<div class="ar-card" style="margin:0;padding:16px 20px"><p style="margin:0">Nessun appello'+(esaF!=='tutti'?' con questo filtro':'')+' '+(calSel?'in questo giorno':'in questo mese')+'.'+(fut.length&&!calSel?' Usa le frecce del calendario per vedere gli altri mesi.':'')+'</p></div>')+'</div></div>';
    box.innerHTML=h+'<div class="ar-sec"><span>Calendario degli appelli</span></div><div class="ar-esa">'+cal+lista+'</div>'
      +'<p class="ar-hint">Ti presenti all\'esame con un documento d\'identit&agrave; valido. Per sostenere l\'esame in un\'altra sede usa il modulo <a href="'+BASE+'modulistica/scelta-sede-esami.pdf" target="_blank" rel="noopener">Scelta della sede esami</a>.</p>';
  }
  var confT=null;
  $('#arEsa').addEventListener('click',function(e){
    var t;
    if((t=e.target.closest('[data-cal]'))){ calM=new Date(calM.getFullYear(),calM.getMonth()+(+t.getAttribute('data-cal')),1); calSel=null; esaDraw(); return }
    if((t=e.target.closest('[data-day]'))){ var k=t.getAttribute('data-day'); calSel=calSel===k?null:k; esaDraw(); return }
    if(e.target.closest('[data-day-clear]')){ calSel=null; esaDraw(); return }
    if((t=e.target.closest('[data-esaf]'))){ esaF=t.getAttribute('data-esaf'); esaDraw(); return }
    t=e.target.closest('[data-pren],[data-ann]'); if(!t) return;
    var pren=t.hasAttribute('data-pren'), id=+t.getAttribute(pren?'data-pren':'data-ann');
    if(!t.classList.contains('confirm')){ // primo clic: chiede conferma sul pulsante stesso
      $$('#arEsa .confirm').forEach(function(b){ b.classList.remove('confirm'); b.firstChild.textContent=b.hasAttribute('data-pren')?'Prenota':'Annulla' });
      t.classList.add('confirm'); t.firstChild.textContent=pren?'Conferma prenotazione':'Conferma annullamento';
      clearTimeout(confT); confT=setTimeout(function(){ if(t.isConnected){ t.classList.remove('confirm'); t.firstChild.textContent=pren?'Prenota':'Annulla' } },5000); return }
    busy(t,true); t.firstChild.textContent=pren?'Prenotazione…':'Annullamento…';
    (pren?API.prenota(id):API.annulla(id)).then(function(){ toast(pren?'Prenotazione confermata':'Prenotazione annullata'); esa() })
      .catch(function(err){ toast(itErr(err)); esa() });
  });

  /* ===== scheda: LE MIE LEZIONI e AULA VIRTUALE (tabelle in supabase-aula.sql) =====
     Elenco delle lezioni del corso; dentro la lezione, accanto al video, l'aula: chi c'e' adesso
     (presenze in tempo reale sul canale privato della classe), la chat della lezione e gli appunti,
     personali o condivisi con la classe, con i rimandi al minuto [12:34]. Tutto sulla piattaforma UNICESD.
     In modalita' dimostrativa: due lezioni vere da guardare e una classe simulata. */
  var lezData=null, AU=null;
  function mmss(s){ s=Math.max(0,Math.floor(+s||0)); var h=Math.floor(s/3600), m=Math.floor(s%3600/60), x=s%60; return (h?h+':'+String(m).padStart(2,'0'):String(m).padStart(2,'0'))+':'+String(x).padStart(2,'0') }
  function secOf(t){ var p=t.split(':').map(Number); return p.length===3?p[0]*3600+p[1]*60+p[2]:p[0]*60+p[1] }
  var TSRE=/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g;
  function rich(t){ return esc(t).replace(TSRE,function(_,x){ return '<button type="button" class="au-ts" data-seek="'+secOf(x)+'">'+x+'</button>' }).replace(/\n/g,'<br>') }
  function hue(n){ var h=7; for(var i=0;i<n.length;i++) h=(h*31+n.charCodeAt(i))%360; return h }
  function avt(n,cls){ var i=String(n||'?').replace(/\./g,'').split(' ').map(function(w){ return w.charAt(0) }).join('').slice(0,2).toUpperCase();
    return '<span class="au-av'+(cls?' '+cls:'')+'" style="--h:'+hue(String(n||''))+'" aria-hidden="true">'+esc(i)+'</span>' }
  function hhmm(d){ return d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'}) }
  function quando(iso){ var d=new Date(iso), s=(Date.now()-d)/1000; if(s<50) return 'adesso'; if(s<3600) return Math.round(s/60)+' min fa';
    var o=new Date(); if(d.toDateString()===o.toDateString()) return 'oggi, '+hhmm(d); o.setDate(o.getDate()-1); if(d.toDateString()===o.toDateString()) return 'ieri, '+hhmm(d);
    return d.toLocaleDateString('it-IT',{day:'numeric',month:'short'})+', '+hhmm(d) }
  function lezBox(){ return $('#arLez') }

  /* ---------- dati: Supabase o demo ---------- */
  var DEMO_NOMI=['Giulia M.','Marco R.','Sara L.','Andrea C.','Francesca P.','Luca B.','Chiara D.','Davide F.','Elena G.','Paolo T.','Martina S.','Simone V.'];
  function demoAula(){ var d=dload(), u=d.users[d.cur];
    if(!u.aula){ u.aula={vis:{1:{secondi:62,visti:62,durata:192}},msgs:{},notes:{},utili:{}}; dsave(d) } return {d:d,u:u} }
  function demoLezioni(){
    var el=lezBox(), t=new Date(); t.setHours(12,0,0,0); var D=function(n){ return ymd(addD(t,n)) };
    return [
      {id:1,insegnamento:'Diritto costituzionale',titolo:'Lezione 1 · Le fonti del diritto',docente:'Prof. G. Marino',descrizione:'Che cos\'è una fonte del diritto, la gerarchia delle fonti, i criteri per risolvere i conflitti fra norme; decreto-legge, decreto legislativo e referendum abrogativo.',video:el.getAttribute('data-v1'),poster:el.getAttribute('data-p1'),durata_min:3,ordine:1,materiali:[{titolo:'Slide della lezione',url:'#demo'},{titolo:'Costituzione, artt. 70-82',url:'#demo'}],pubblicata:D(-6)},
      {id:2,insegnamento:'Diritto costituzionale',titolo:'Lezione 2 · La Costituzione e la sua revisione',docente:'Prof. G. Marino',durata_min:52,ordine:2,pubblicata:D(3)},
      {id:3,insegnamento:'Diritto costituzionale',titolo:'Lezione 3 · Il Parlamento',docente:'Prof. G. Marino',durata_min:47,ordine:3,pubblicata:D(10)},
      {id:4,insegnamento:'Diritto commerciale',titolo:'Lezione 1 · L\'imprenditore',docente:'Prof.ssa M. Lo Presti',descrizione:'La nozione di imprenditore dell\'art. 2082 c.c. e le tre figure del codice: agricolo, piccolo e commerciale, con lo statuto che ne segue.',video:el.getAttribute('data-v2'),poster:el.getAttribute('data-p2'),durata_min:3,ordine:1,materiali:[{titolo:'Slide della lezione',url:'#demo'}],pubblicata:D(-2)},
      {id:5,insegnamento:'Diritto commerciale',titolo:'Lezione 2 · L\'azienda e i segni distintivi',docente:'Prof.ssa M. Lo Presti',durata_min:44,ordine:2,pubblicata:D(5)},
      {id:6,insegnamento:'Storia del diritto medievale e moderno',titolo:'Lezione 1 · Il diritto comune',docente:'Prof.ssa L. Ferrante',durata_min:55,ordine:1,pubblicata:D(8)}
    ].map(function(l){ l.in_arrivo=l.pubblicata>ymd(new Date()); return l });
  }
  var DEMO_NOTE={
    1:[{id:901,autore:'Giulia M.',utili:4,ore:-20,testo:'LE FONTI DEL DIRITTO\n[00:24] Fonte = atto o fatto che produce norme giuridiche\n- di produzione: creano le norme\n- di cognizione: le fanno conoscere (Gazzetta Ufficiale)\n\n[00:48] GERARCHIA\n1. Costituzione e leggi costituzionali\n2. Leggi ordinarie, decreti-legge, decreti legislativi\n3. Leggi regionali\n4. Regolamenti\n5. Consuetudini\n\n[01:12] Conflitti fra norme: gerarchico, cronologico, specialità, competenza'},
       {id:902,autore:'Marco R.',utili:2,ore:-3,testo:'[01:36] DECRETO-LEGGE (art. 77) → necessità e urgenza, conversione entro 60 giorni, altrimenti perde efficacia dall\'inizio\n[02:00] DECRETO LEGISLATIVO (art. 76) → legge delega con principi e criteri, tempo limitato, oggetti definiti\n[02:24] REFERENDUM (art. 75) → 500.000 elettori o 5 Consigli regionali; quorum: maggioranza degli aventi diritto'}],
    4:[{id:903,autore:'Chiara D.',utili:3,ore:-26,testo:'[00:24] Art. 2082: attività economica + organizzata + professionale + per produrre o scambiare\n[01:12] Piccolo imprenditore (2083): lavoro proprio e dei familiari\n[01:36] Commerciale (2195): industria, intermediazione, trasporto, banca e assicurazioni\n[02:00] Statuto: registro imprese, scritture contabili, crisi d\'impresa'}]};
  var DEMO_STORIA={1:[['Elena G.','Le slide si scaricano dai materiali sotto il video 👍',null,-22],['Paolo T.','Grazie Elena!',null,-21.5]],4:[['Davide F.','Lezione chiarissima, ottima per ripassare',null,-30]]};
  var DEMO_COPIONE={
    1:[[5,'Giulia M.','Ciao a tutti! Oggi fonti del diritto 📚',null],[16,'Marco R.','Qualcuno mi spiega la differenza fra fonti di produzione e di cognizione?',30],
       [28,'Sara L.','Quelle di produzione creano le norme, quelle di cognizione le fanno conoscere: tipo la Gazzetta Ufficiale',30],
       [46,'Giulia M.','La gerarchia è al [00:48], segnatevela per l\'esame 📌',50],[72,'Andrea C.','Il decreto-legge non convertito perde efficacia da subito o dall\'inizio?',100],
       [84,'Marco R.','Dall\'inizio, è al [01:36]. Ho messo tutto nei miei appunti condivisi',100]],
    4:[[7,'Luca B.','Buongiorno! Qualcuno ha già dato l\'esame di commerciale?',null],[22,'Chiara D.','Io a giugno: chiedono tanto la differenza fra piccolo imprenditore e commerciale',null],
       [40,'Luca B.','Grazie! È dal [01:12] in poi',75]]};

  API.lezioni=function(){
    if(!LIVE){ var a=demoAula().u.aula;
      return Promise.resolve(demoLezioni().map(function(l){ var v=a.vis[l.id]||{}, n=a.notes[l.id];
        l.secondi=v.secondi||0; l.visti=v.visti||0; l.durata=v.durata||null; l.completata=!!v.completata; l.miei_appunti=!!(n&&n.testo);
        l.appunti_classe=(DEMO_NOTE[l.id]||[]).length; l.messaggi=(DEMO_STORIA[l.id]||[]).length+(a.msgs[l.id]||[]).length; return l })) }
    return loadSb().then(function(c){ return c.rpc('mie_lezioni') }).then(rows);
  };
  API.visione=function(id,s,d){
    if(!LIVE){ var x=demoAula(), v=x.u.aula.vis[id]||{secondi:0,visti:0}; v.secondi=Math.floor(s); v.visti=Math.max(v.visti,v.secondi); if(d) v.durata=Math.floor(d);
      v.completata=v.completata||(v.durata&&v.visti>=v.durata*.9); x.u.aula.vis[id]=v; dsave(x.d); return Promise.resolve() }
    return loadSb().then(function(c){ return c.rpc('segna_visione',{p_lezione:id,p_secondi:Math.floor(s),p_durata:d?Math.floor(d):null}) }).then(function(r){ if(r.error) throw r.error });
  };
  API.videoUrl=function(path){ if(/^https?:|^data:|^blob:|^assets\/|^\//.test(path)||!LIVE) return Promise.resolve(path);
    return loadSb().then(function(c){ return c.storage.from('lezioni').createSignedUrl(path,4*3600) }).then(function(r){ if(r.error) throw r.error; return r.data.signedUrl }) };

  /* ---------- la classe: chi e' online adesso (presenze) ---------- */
  var INVK='uo-aula-invisibile';
  var CL={on:false,list:[],subs:[],me:{l:0,t:0,s:'idle'},inv:false,nome:'',ch:null,sim:null,tk:0,
    start:function(){ if(CL.on) return; CL.on=true; try{ CL.inv=localStorage.getItem(INVK)==='1' }catch(e){}
      CL.nome=P?(String(P.nome||'').trim().split(' ')[0]+' '+String(P.cognome||' ').trim().charAt(0).toUpperCase()+'.'):'Tu';
      if(!LIVE){ simStart(); return }
      var c; loadSb().then(function(x){ c=x; return c.rpc('mia_classe') }).then(function(r){ if(r.error) throw r.error; if(!r.data||!CL.on) return;
        CL.nome=r.data.nome||CL.nome;
        return c.auth.getSession().then(function(s){ var tok=s.data.session&&s.data.session.access_token; if(tok&&c.realtime.setAuth) c.realtime.setAuth(tok);
          var key=Math.random().toString(36).slice(2,10);
          CL.ch=c.channel(r.data.topic,{config:{private:true,presence:{key:key}}});
          CL.ch.on('presence',{event:'sync'},function(){ var st=CL.ch.presenceState(), out=[];
            Object.keys(st).forEach(function(k){ if(k===key) return; var m=st[k][st[k].length-1]; if(m&&m.n) out.push({k:k,n:m.n,l:+m.l||0,t:+m.t||0,s:m.s||'idle',at:m.at||Date.now()}) });
            CL.list=out; CL.emit() });
          CL.ch.subscribe(function(st){ if(st==='SUBSCRIBED') CL.push(true) });
        }) }).catch(function(){ /* presenze non disponibili: l'aula funziona lo stesso */ });
    },
    stop:function(){ CL.on=false; clearInterval(CL.sim); CL.sim=null; if(CL.ch){ try{ CL.ch.untrack(); sb.removeChannel(CL.ch) }catch(e){} CL.ch=null } CL.list=[] },
    set:function(p){ Object.assign(CL.me,p); CL.push() },
    push:function(now){ if(!CL.ch) return; var go=function(){ CL.tk=Date.now(); if(CL.inv){ CL.ch.untrack(); return }
        CL.ch.track({n:CL.nome,l:CL.me.l,t:Math.floor(CL.me.t),s:CL.me.s,at:Date.now()}) };
      clearTimeout(CL.pt); if(now||Date.now()-CL.tk>4000) go(); else CL.pt=setTimeout(go,4000-(Date.now()-CL.tk)) },
    invisibile:function(on){ CL.inv=on; try{ localStorage.setItem(INVK,on?'1':'0') }catch(e){} CL.push(true); CL.emit() },
    emit:function(){ CL.subs.forEach(function(f){ f(CL.list) }) },
    in:function(id){ return CL.list.filter(function(p){ return p.l===id }) }
  };
  /* classe simulata (solo demo) */
  function simStart(){
    var pick=DEMO_NOMI.slice().sort(function(){ return Math.random()-.5 }), now=Date.now();
    var base=[['Giulia M.',1,30,'play'],['Marco R.',1,96,'play'],['Sara L.',1,140,'appunti'],['Andrea C.',1,12,'play'],['Luca B.',4,40,'play'],['Chiara D.',4,88,'pausa'],['Elena G.',0,0,'idle']];
    CL.list=base.map(function(b){ return {k:b[0],n:b[0],l:b[1],t:b[2],s:b[3],at:now-Math.random()*6e5} });
    var tick=0;
    CL.sim=setInterval(function(){ tick++;
      CL.list.forEach(function(p){ if(p.s==='play'){ p.t+=1; if(p.t>190){ p.t=0 } } });
      if(tick%7===0){ var r=Math.random(), on=CL.list.map(function(p){ return p.n });
        if(r<.25&&CL.list.length<9){ var nn=pick.filter(function(n){ return on.indexOf(n)<0 })[0]; if(nn) CL.list.push({k:nn,n:nn,l:Math.random()<.6?1:(Math.random()<.5?4:0),t:Math.floor(Math.random()*60),s:'play',at:Date.now()}) }
        else if(r<.4&&CL.list.length>5){ var i=Math.floor(Math.random()*CL.list.length); if(['Giulia M.','Marco R.','Luca B.'].indexOf(CL.list[i].n)<0) CL.list.splice(i,1) }
        else { var q=CL.list[Math.floor(Math.random()*CL.list.length)]; if(q&&q.l) q.s=['play','play','pausa','appunti','chat'][Math.floor(Math.random()*5)] } }
      if(tick%3===0) CL.emit();
    },1000);
    setTimeout(CL.emit,50);
  }
  function simJoin(n,l,s){ var p=CL.list.filter(function(x){ return x.n===n })[0]; if(!p){ p={k:n,n:n,l:l,t:0,s:'play',at:Date.now()}; CL.list.push(p) } p.l=l; if(s) p.s=s; CL.emit() }

  /* ---------- elenco delle lezioni ---------- */
  function les(){
    var box=lezBox(); if(AU) return; box.classList.remove('au-room'); $('.ar-body',dash).classList.remove('ar-wide');
    if(!lezData) box.innerHTML='<p class="ar-load">Caricamento&hellip;</p>';
    CL.start(); CL.set({l:0,s:'idle'});
    API.lezioni().then(function(d){ lezData=d; if(!AU) lesDraw(); var m=/^#lezione-(\d+)$/.exec(location.hash); if(m&&!AU) aulaOpen(+m[1]) }).catch(function(e){ failBox(box,e) });
  }
  function lesDraw(){
    var box=lezBox(), l=lezData||[];
    var h='<h4 class="ar-h">Le mie lezioni</h4><p class="ar-sub">Le videolezioni del tuo corso. Entrando in una lezione sei <b>in aula</b>: vedi chi la sta seguendo con te, scrivi in chat e scambi gli appunti con i compagni.</p>';
    if(!l.length){ box.innerHTML=h+emptyBox('&#127916;','Le tue lezioni compariranno qui','Le videolezioni del tuo corso si attivano quando l\'iscrizione &egrave; perfezionata. Per qualsiasi dubbio scrivi alla segreteria.'); return }
    h+='<div class="au-online" data-au-online></div>';
    var rip=l.filter(function(x){ return !x.in_arrivo&&x.secondi>5&&!x.completata })[0];
    if(rip) h+='<button type="button" class="au-resume" data-au-open="'+rip.id+'">'+(rip.poster?'<img src="'+esc(rip.poster)+'" alt="" loading="lazy">':'<span class="au-resume-ph">&#9654;</span>')
      +'<span><small>Riprendi da dove eri rimasto</small><b>'+esc(rip.titolo)+'</b><em>'+esc(rip.insegnamento)+' &middot; dal minuto '+mmss(rip.secondi)+'</em>'
      +'<i class="au-bar"><i style="width:'+pct(rip)+'%"></i></i></span><span class="au-go">Riprendi &rarr;</span></button>';
    var g={}, ord=[]; l.forEach(function(x){ if(!g[x.insegnamento]){ g[x.insegnamento]=[]; ord.push(x.insegnamento) } g[x.insegnamento].push(x) });
    ord.forEach(function(k){ var a=g[k], ok=a.filter(function(x){ return !x.in_arrivo }).length, fatte=a.filter(function(x){ return x.completata }).length;
      h+='<div class="au-grp"><div class="ar-sec"><span>'+esc(k)+'</span><span class="au-cnt">'+ok+' disponibili'+(fatte?' &middot; '+fatte+' completate':'')+'</span></div><div class="au-list">';
      a.forEach(function(x,i){
        if(x.in_arrivo){ h+='<div class="au-row soon"><span class="au-num">'+(x.ordine||i+1)+'</span><span class="au-rt"><b>'+esc(x.titolo)+'</b><small>'+esc([x.docente,x.durata_min?x.durata_min+' min':''].filter(Boolean).join(' · '))+'</small></span><span class="au-badges"><span class="au-b soon">In arrivo il '+itShort(x.pubblicata).slice(0,5)+'</span></span></div>'; return }
        h+='<button type="button" class="au-row'+(x.completata?' done':'')+'" data-au-open="'+x.id+'"><span class="au-num">'+(x.completata?'&#10003;':(x.ordine||i+1))+'</span>'
          +'<span class="au-rt"><b>'+esc(x.titolo)+'</b><small>'+esc([x.docente,x.durata_min?x.durata_min+' min':''].filter(Boolean).join(' · '))+'</small>'
          +(x.visti?'<i class="au-bar"><i style="width:'+pct(x)+'%"></i></i>':'')+'</span>'
          +'<span class="au-badges"><span class="au-b live" data-au-live="'+x.id+'" hidden></span>'
          +(x.appunti_classe?'<span class="au-b">&#128221; '+x.appunti_classe+'</span>':'')+(x.messaggi?'<span class="au-b">&#128172; '+x.messaggi+'</span>':'')
          +'<span class="au-enter">Entra in aula &rarr;</span></span></button>' });
      h+='</div></div>' });
    box.innerHTML=h; lesLive();
  }
  function pct(x){ var d=x.durata||(x.durata_min?x.durata_min*60:0); return d?Math.min(100,Math.round(100*(x.visti||0)/d)):0 }
  function lesLive(){
    var box=lezBox(); if(!box||AU) return; var on=$('[data-au-online]',box); if(!on) return;
    var L=CL.list, ids={}; L.forEach(function(p){ if(p.l) ids[p.l]=(ids[p.l]||0)+1 });
    $$('[data-au-live]',box).forEach(function(b){ var n=ids[b.getAttribute('data-au-live')]||0; b.hidden=!n; b.innerHTML='<i></i>'+n+' in aula' });
    if(!L.length){ on.innerHTML='<span class="au-on-t">Nessun compagno online in questo momento.</span>'; return }
    var top=Object.keys(ids).sort(function(a,b){ return ids[b]-ids[a] })[0], tl=top&&(lezData||[]).filter(function(x){ return x.id==top })[0];
    on.innerHTML='<span class="au-stack">'+L.slice(0,5).map(function(p){ return avt(p.n) }).join('')+'</span><span class="au-on-t"><i class="au-dot"></i><b>'+L.length+(L.length===1?' compagno':' compagni')+'</b> del tuo corso online adesso'
      +(tl?' &middot; '+ids[top]+' in <a href="#" data-au-open="'+tl.id+'">'+esc(tl.insegnamento)+'</a>':'')+'</span>';
  }
  CL.subs.push(function(){ if(AU) aulaPeople(); else lesLive() });

  /* ---------- l'aula: video + presenze + chat + appunti ---------- */
  function aulaOpen(id){
    var L=(lezData||[]).filter(function(x){ return x.id===id })[0]; if(!L||L.in_arrivo) return;
    if(AU) aulaClose(true);
    AU={id:id,L:L,msgs:[],notes:[],mine:null,utili:{},unread:0,pane:'aula',nt:'miei',v:null,iframe:false,timers:[],bot:0,ch:null,saveT:0,lastSave:0};
    var box=lezBox(); box.classList.add('au-room'); $('.ar-body',dash).classList.add('ar-wide'); $('.ar-body',dash).scrollTop=0;
    try{ history.replaceState(null,'',location.pathname+location.search+'#lezione-'+id) }catch(e){}
    var mat=(L.materiali||[]).map(function(m){ return '<a class="au-mat" href="'+esc(m.url)+'" data-mat="'+esc(m.url)+'" target="_blank" rel="noopener">&#128196; '+esc(m.titolo||'Materiale')+'</a>' }).join('');
    box.innerHTML='<div class="au">'
      +'<div class="au-top"><button type="button" class="au-back" data-au-back>&larr; Tutte le lezioni</button><span class="au-live"><i></i><b data-au-n>1</b>&nbsp;in aula</span></div>'
      +'<div class="au-grid"><div class="au-main"><div class="au-player" id="auPlayer"><p class="ar-load">Caricamento del video&hellip;</p></div>'
      +'<div class="au-info"><span class="au-ins">'+esc(L.insegnamento)+'</span><h4>'+esc(L.titolo)+'</h4><p class="au-doc">'+esc([L.docente,L.durata_min?L.durata_min+' min':''].filter(Boolean).join(' · '))+'</p>'
      +(L.descrizione?'<p class="au-desc">'+esc(L.descrizione)+'</p>':'')+(mat?'<div class="au-mats">'+mat+'</div>':'')+'</div></div>'
      +'<aside class="au-side" aria-label="Aula virtuale"><div class="au-tabs" role="tablist">'
      +'<button type="button" class="on" data-au-tab="aula" role="tab">In aula <em data-au-n>1</em></button>'
      +'<button type="button" data-au-tab="chat" role="tab">Chat <em class="au-unr" data-au-unr hidden></em></button>'
      +'<button type="button" data-au-tab="appunti" role="tab">Appunti</button></div>'
      +'<div class="au-pane" data-au-pane="aula"><div id="auPeople"></div></div>'
      +'<div class="au-pane" data-au-pane="chat" hidden><div class="au-msgs" id="auMsgs" aria-live="polite"><p class="ar-load">Caricamento&hellip;</p></div>'
      +'<form class="au-send" id="auSend"><label class="au-at"><input type="checkbox" checked> collega al minuto <b data-au-now>00:00</b></label>'
      +'<div class="au-in"><textarea rows="1" maxlength="1000" placeholder="Scrivi alla classe&hellip;" aria-label="Messaggio"></textarea><button type="submit" aria-label="Invia"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg></button></div></form></div>'
      +'<div class="au-pane" data-au-pane="appunti" hidden><div class="au-seg"><button type="button" class="on" data-au-nt="miei">I miei</button><button type="button" data-au-nt="classe">Della classe <em data-au-ncl>0</em></button></div>'
      +'<div data-au-ntp="miei"><div class="au-ntbar"><button type="button" class="au-stamp" data-au-stamp>+ <span data-au-now>00:00</span></button>'
      +'<label class="au-share"><input type="checkbox" data-au-share><span>Condividi con la classe</span></label></div>'
      +'<textarea class="au-note" id="auNote" placeholder="Scrivi qui i tuoi appunti. Con &laquo;+ minuto&raquo; inserisci il punto del video: [12:34] diventa un link che ci riporta." maxlength="30000"></textarea>'
      +'<div class="au-saved" data-au-saved>&nbsp;</div><div class="au-marks" data-au-marks></div></div>'
      +'<div data-au-ntp="classe" hidden><div id="auNotesCl"></div></div>'
      +'<p class="au-fmt">&#128274; Gli appunti restano sulla piattaforma UNICESD: li leggono solo gli studenti del corso, se scegli di condividerli.</p></div>'
      +'</aside></div></div>';
    CL.set({l:id,t:L.secondi||0,s:'pausa'});
    aulaPlayer(L); aulaPeople(); aulaLoad();
  }
  function aulaClose(quiet){
    if(!AU) return; var a=AU; aulaSave(true);
    a.timers.forEach(clearTimeout); clearInterval(a.iv); if(a.hls) try{ a.hls.destroy() }catch(e){}
    if(a.ch){ try{ sb.removeChannel(a.ch) }catch(e){} }
    if(a.v){ try{ a.v.pause() }catch(e){} }
    AU=null; if(location.hash.indexOf('#lezione-')===0) try{ history.replaceState(null,'',location.pathname+location.search+(APP?'#lezioni':'')) }catch(e){}
    if(!quiet){ lezData=null; les() }
  }
  function lezLeave(){ if(AU) aulaClose(true); if(CL.on) CL.stop(); var b=lezBox(); if(b){ b.classList.remove('au-room') } var ab=$('.ar-body',dash); if(ab) ab.classList.remove('ar-wide') }

  /* il lettore: mp4/webm, HLS (m3u8), oppure YouTube/Vimeo/Bunny incorporati */
  function aulaPlayer(L){
    var box=$('#auPlayer'), v=L.video||'';
    if(!v){ box.innerHTML='<div class="au-novid">&#127916;<b>Video in preparazione</b><span>La segreteria lo sta caricando: intanto puoi usare chat e appunti.</span></div>'; AU.iframe=true; nowTick(); return }
    var yt=/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([\w-]{11})/.exec(v), vm=/vimeo\.com\/(?:video\/)?(\d+)/.exec(v), bn=/iframe\.mediadelivery\.net\/(?:embed|play)\/(\d+)\/([\w-]+)/.exec(v);
    if(yt||vm||bn){ AU.iframe=true;
      var src=yt?'https://www.youtube-nocookie.com/embed/'+yt[1]+'?rel=0&modestbranding=1':vm?'https://player.vimeo.com/video/'+vm[1]+'?dnt=1':'https://iframe.mediadelivery.net/embed/'+bn[1]+'/'+bn[2]+'?autoplay=false';
      box.innerHTML='<iframe src="'+src+'" title="'+esc(L.titolo)+'" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen loading="lazy"></iframe>'; nowTick(); return }
    API.videoUrl(v).then(function(url){ if(!AU||AU.L!==L) return;
      box.innerHTML='<video controls playsinline preload="metadata"'+(L.poster?' poster="'+esc(L.poster)+'"':'')+' controlslist="nodownload" oncontextmenu="return false"></video>';
      var el=$('video',box); AU.v=el;
      var hlsNeeded=/\.m3u8(\?|$)/i.test(url)&&!el.canPlayType('application/vnd.apple.mpegurl');
      var go=function(){ if(hlsNeeded&&window.Hls&&window.Hls.isSupported()){ AU.hls=new window.Hls(); AU.hls.loadSource(url); AU.hls.attachMedia(el) } else el.src=url };
      if(hlsNeeded&&!window.Hls){ var s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.13/hls.min.js'; s.onload=go; s.onerror=function(){ el.src=url }; document.head.appendChild(s) } else go();
      el.addEventListener('loadedmetadata',function(){ if(!mine()) return; var s=L.secondi||0; if(s>5&&s<el.duration-8){ el.currentTime=s; toast('Riprendi dal minuto '+mmss(s)) } },{once:true});
      var mine=function(){ return AU&&AU.v===el };
      el.addEventListener('play',function(){ if(mine()) CL.set({s:'play',t:el.currentTime}) });
      el.addEventListener('pause',function(){ if(!mine()) return; CL.set({s:'pausa',t:el.currentTime}); aulaSave(true) });
      el.addEventListener('seeked',function(){ if(mine()) CL.set({t:el.currentTime}) });
      el.addEventListener('ended',function(){ if(mine()) aulaSave(true) });
      el.addEventListener('timeupdate',function(){ if(!mine()) return; nowTick(); CL.me.t=el.currentTime; if(Date.now()-AU.lastSave>20000&&!el.paused) aulaSave() });
      nowTick();
    }).catch(function(e){ box.innerHTML='<div class="au-novid">&#9888;<b>Video non disponibile</b><span>'+itErr(e)+'</span></div>' });
  }
  function nowT(){ return AU&&AU.v?AU.v.currentTime:null }
  function nowTick(){ if(!AU) return; var t=nowT(), s=t==null?'--:--':mmss(t);
    $$('[data-au-now]',lezBox()).forEach(function(e){ e.textContent=s }); var st=$('[data-au-stamp]',lezBox()); if(st) st.disabled=t==null;
    var at=$('.au-at input',lezBox()); if(at&&t==null){ at.checked=false; at.disabled=true } }
  function seek(s){ if(!AU) return; if(!AU.v){ toast('Con questo tipo di video il salto al minuto non &egrave; disponibile'); return }
    AU.v.currentTime=s; var p=AU.v.play(); if(p&&p.catch) p.catch(function(){}); if(matchMedia('(max-width:1060px)').matches) $('#auPlayer').scrollIntoView({behavior:'smooth',block:'start'}) }
  function aulaSave(force){ if(!AU||!AU.v) return; var v=AU.v, s=v.currentTime||0, d=isFinite(v.duration)?v.duration:null; if(!force&&s<1) return;
    AU.lastSave=Date.now(); var L=AU.L; L.secondi=Math.floor(s); L.visti=Math.max(L.visti||0,L.secondi); if(d) L.durata=Math.floor(d); if(d&&L.visti>=d*.9) L.completata=true;
    API.visione(AU.id,s,d).catch(function(){}) }

  /* presenze nell'aula */
  function aulaPeople(){
    if(!AU) return; var box=$('#auPeople'); if(!box) return;
    var qui=CL.in(AU.id), altri=CL.list.filter(function(p){ return p.l!==AU.id }), n=qui.length+(CL.inv?0:1);
    $$('[data-au-n]',lezBox()).forEach(function(e){ e.textContent=n });
    var ST={play:'&#9654; sta guardando',pausa:'&#10074;&#10074; in pausa',appunti:'&#9998; scrive appunti',chat:'&#128172; in chat',idle:'nell\'area riservata'};
    var h='<div class="au-me">'+avt(CL.nome,'me')+'<div><b>'+esc(CL.nome)+' <small>(tu)</small></b><span>'+(CL.inv?'Sei invisibile: i compagni non ti vedono':'I compagni ti vedono in aula')+'</span></div>'
      +'<label class="au-sw" title="Visibile ai compagni"><input type="checkbox" data-au-vis'+(CL.inv?'':' checked')+'><i></i></label></div>';
    h+='<div class="ar-sec"><span>In questa lezione</span><span>'+qui.length+'</span></div>';
    if(!qui.length) h+='<p class="au-empty">Per ora ci sei solo tu. Quando entra un compagno lo vedi qui, in tempo reale.</p>';
    else h+='<ul class="au-ppl">'+qui.map(function(p){ var t=p.l&&p.s!=='idle'?mmss(p.t):'';
      return '<li>'+avt(p.n)+'<div><b>'+esc(p.n)+'</b><span>'+ST[p.s]+(t&&(p.s==='play'||p.s==='pausa')?' &middot; '+t:'')+'</span></div>'
        +(AU.v&&t?'<button type="button" class="au-follow" data-seek="'+Math.floor(p.t)+'" title="Vai al punto in cui si trova">Vai a '+t+'</button>':'')+'</li>' }).join('')+'</ul>';
    if(altri.length){ h+='<div class="ar-sec"><span>Altri compagni online</span><span>'+altri.length+'</span></div><ul class="au-ppl dim">'
      +altri.map(function(p){ var x=p.l&&(lezData||[]).filter(function(z){ return z.id===p.l })[0];
        return '<li>'+avt(p.n)+'<div><b>'+esc(p.n)+'</b><span>'+(x?'in <a href="#" data-au-open="'+x.id+'">'+esc(x.insegnamento)+' &middot; '+esc(x.titolo.split(' · ')[0])+'</a>':'online nell\'area riservata')+'</span></div></li>' }).join('')+'</ul>' }
    h+='<p class="au-priv">I compagni vedono solo il tuo nome e l\'iniziale del cognome. Puoi diventare invisibile con l\'interruttore qui sopra.</p>';
    box.innerHTML=h;
  }

  /* chat e appunti: caricamento e tempo reale */
  function aulaLoad(){
    var id=AU.id, a=AU;
    if(!LIVE){ var x=demoAula().u.aula, t=Date.now();
      a.msgs=(DEMO_STORIA[id]||[]).map(function(m,i){ return {id:-100-i,autore:m[0],testo:m[1],minuto:m[2],created_at:new Date(t+m[3]*3600e3).toISOString()} }).concat(x.msgs[id]||[]);
      a.notes=(DEMO_NOTE[id]||[]).map(function(n){ return {id:n.id,autore:n.autore,testo:n.testo,condiviso:true,utili:n.utili+(x.utili[n.id]?1:0),updated_at:new Date(t+n.ore*3600e3).toISOString()} });
      a.utili=x.utili; a.mine=x.notes[id]||{testo:'',condiviso:false}; chatDraw(); notesDraw(); mineDraw(); botStart(); return }
    loadSb().then(function(c){
      return Promise.all([
        c.from('aula_messaggi').select('id,matricola,autore,testo,minuto,created_at,nascosto').eq('lezione',id).order('created_at',{ascending:false}).limit(200),
        c.from('appunti').select('id,matricola,autore,testo,condiviso,utili,updated_at').eq('lezione',id),
        c.from('appunti_utili').select('appunti')
      ]).then(function(r){ if(AU!==a) return;
        a.msgs=rows(r[0]).reverse().map(function(m){ m.me=m.matricola===P.matricola; return m });
        var all=rows(r[1]); a.mine=all.filter(function(n){ return n.matricola===P.matricola })[0]||{testo:'',condiviso:false};
        a.notes=all.filter(function(n){ return n.matricola!==P.matricola&&n.condiviso&&n.testo });
        (r[2].data||[]).forEach(function(u){ a.utili[u.appunti]=true });
        chatDraw(); notesDraw(); mineDraw();
        a.ch=c.channel('lezione-'+id)
          .on('postgres_changes',{event:'*',schema:'public',table:'aula_messaggi',filter:'lezione=eq.'+id},function(ev){ if(AU!==a) return;
            if(ev.eventType==='DELETE'){ a.msgs=a.msgs.filter(function(m){ return m.id!==ev.old.id }); chatDraw(); return }
            var m=ev.new; m.me=m.matricola===P.matricola; var i=a.msgs.map(function(x){ return x.id }).indexOf(m.id);
            if(m.nascosto&&!m.me){ if(i>-1) a.msgs.splice(i,1) } else if(i>-1) a.msgs[i]=m; else { a.msgs.push(m); if(!m.me) unread() } chatDraw() })
          .on('postgres_changes',{event:'*',schema:'public',table:'appunti',filter:'lezione=eq.'+id},function(ev){ if(AU!==a) return; var n=ev.new||{};
            if(ev.eventType==='DELETE'||n.matricola===P.matricola) return; a.notes=a.notes.filter(function(x){ return x.id!==n.id });
            if(n.condiviso&&n.testo) a.notes.unshift(n); notesDraw() })
          .subscribe();
      });
    }).catch(function(e){ var mb=$('#auMsgs'); if(mb) mb.innerHTML='<div class="ar-msg on">'+itErr(e)+'</div>' });
  }
  function unread(){ if(AU.pane==='chat') return; AU.unread++; var u=$('[data-au-unr]',lezBox()); if(u){ u.hidden=false; u.textContent=AU.unread } }
  function chatDraw(){
    var box=$('#auMsgs'); if(!box||!AU) return; var stick=box.scrollHeight-box.scrollTop-box.clientHeight<80;
    if(!AU.msgs.length){ box.innerHTML='<p class="au-empty">Nessun messaggio ancora. Rompi il ghiaccio: una domanda, un dubbio, un saluto alla classe.</p>'; return }
    box.innerHTML=AU.msgs.map(function(m){ var me=m.me||m.mio;
      return '<div class="au-msg'+(me?' me':'')+'">'+(me?'':avt(m.autore))+'<div class="au-bub"><div class="au-mh"><b>'+(me?'Tu':esc(m.autore))+'</b><span>'+quando(m.created_at)+'</span>'
        +(me&&m.id>0?'<button type="button" class="au-del" data-au-del="'+m.id+'" aria-label="Cancella il messaggio">&times;</button>':'')+'</div>'
        +(m.minuto!=null?'<button type="button" class="au-ts min" data-seek="'+m.minuto+'">&#9654; '+mmss(m.minuto)+'</button> ':'')+rich(m.testo)+'</div></div>' }).join('');
    if(stick||AU.firstChat!==true){ box.scrollTop=box.scrollHeight; AU.firstChat=true }
  }
  function notesDraw(){
    var box=$('#auNotesCl'); if(!box||!AU) return; var n=AU.notes;
    var c=$('[data-au-ncl]',lezBox()); if(c) c.textContent=n.length;
    if(!n.length){ box.innerHTML='<p class="au-empty">Nessun compagno ha ancora condiviso i suoi appunti per questa lezione. Puoi essere il primo: scrivi i tuoi e attiva &laquo;Condividi con la classe&raquo;.</p>'; return }
    box.innerHTML=n.slice().sort(function(a,b){ return (b.utili||0)-(a.utili||0) }).map(function(x){ var on=!!AU.utili[x.id];
      return '<article class="au-nt">'+'<div class="au-nt-h">'+avt(x.autore)+'<div><b>'+esc(x.autore)+'</b><span>aggiornati '+quando(x.updated_at)+'</span></div></div>'
        +'<div class="au-nt-b">'+rich(x.testo)+'</div><div class="au-nt-f"><button type="button" class="au-ut'+(on?' on':'')+'" data-au-ut="'+x.id+'">&#128077; Utili'+(x.utili?' &middot; '+x.utili:'')+'</button>'
        +'<button type="button" class="au-cp" data-au-cp="'+x.id+'">Aggiungi ai miei</button></div></article>' }).join('');
  }
  function mineDraw(){ if(!AU) return; var t=$('#auNote'), s=$('[data-au-share]',lezBox()); if(!t) return; t.value=AU.mine.testo||''; s.checked=!!AU.mine.condiviso; marks();
    $('[data-au-saved]',lezBox()).innerHTML=AU.mine.updated_at?'Salvati '+quando(AU.mine.updated_at):'&nbsp;' }
  function marks(){ var t=$('#auNote'), b=$('[data-au-marks]',lezBox()); if(!t||!b) return; var m=[], r; TSRE.lastIndex=0;
    while((r=TSRE.exec(t.value))&&m.length<40){ var line=t.value.slice(r.index).split('\n')[0].replace(/\[\d{1,2}:\d{2}(?::\d{2})?\]/g,'').trim(); m.push('<button type="button" class="au-ts" data-seek="'+secOf(r[1])+'">'+r[1]+'</button>'+(line?'<span>'+esc(line.slice(0,60))+'</span>':'')) }
    b.innerHTML=m.length?'<div class="ar-sec"><span>I momenti che hai segnato</span></div><div class="au-mk">'+m.map(function(x){ return '<div>'+x+'</div>' }).join('')+'</div>':'' }
  function notesSave(){ if(!AU) return; var a=AU, txt=$('#auNote').value, sh=$('[data-au-share]',lezBox()).checked, lab=$('[data-au-saved]',lezBox());
    a.mine.testo=txt; a.mine.condiviso=sh; lab.textContent='Salvataggio…';
    var done=function(){ a.mine.updated_at=new Date().toISOString(); if(AU===a) lab.textContent='Salvati alle '+hhmm(new Date())+(sh?' · condivisi con la classe':' · visibili solo a te') };
    if(!LIVE){ var x=demoAula(); x.u.aula.notes[a.id]={testo:txt,condiviso:sh,updated_at:new Date().toISOString()}; dsave(x.d); setTimeout(done,250); return }
    loadSb().then(function(c){ return c.rpc('salva_appunti',{p_lezione:a.id,p_testo:txt,p_condiviso:sh}) }).then(function(r){ if(r.error) throw r.error; done() })
      .catch(function(e){ if(AU===a) lab.innerHTML='<span class="au-err">Non salvati: '+itErr(e)+'</span>' });
  }
  function chatSend(txt,min){ var a=AU;
    if(!LIVE){ var x=demoAula(), m={id:Date.now(),autore:CL.nome,testo:txt,minuto:min,created_at:new Date().toISOString(),mio:true};
      (x.u.aula.msgs[a.id]=x.u.aula.msgs[a.id]||[]).push(m); dsave(x.d); a.msgs.push(m); chatDraw(); botReply(txt,min); return Promise.resolve() }
    return loadSb().then(function(c){ return c.rpc('scrivi_in_aula',{p_lezione:a.id,p_testo:txt,p_minuto:min==null?null:Math.floor(min)}) }).then(function(r){ if(r.error) throw r.error;
      if(AU===a&&!a.msgs.some(function(m){ return m.id===r.data })){ a.msgs.push({id:r.data,autore:CL.nome,testo:txt,minuto:min==null?null:Math.floor(min),created_at:new Date().toISOString(),me:true,matricola:P.matricola}); chatDraw() } });
  }
  /* demo: la classe che scrive */
  function botPost(n,txt,min){ if(!AU) return; simJoin(n,AU.id,'chat'); AU.msgs.push({id:-Date.now(),autore:n,testo:txt,minuto:min,created_at:new Date().toISOString()}); chatDraw(); unread();
    setTimeout(function(){ var p=CL.list.filter(function(x){ return x.n===n })[0]; if(p&&p.s==='chat') p.s='play' },6000) }
  function botStart(){ var a=AU, cp=DEMO_COPIONE[a.id]||[]; cp.forEach(function(m){ a.timers.push(setTimeout(function(){ if(AU===a) botPost(m[1],m[2],m[3]) },m[0]*1000)) }) }
  function botReply(txt,min){ var a=AU; if(a.bot>=3) return; a.bot++;
    var chi=CL.in(a.id).map(function(p){ return p.n }); if(!chi.length) chi=['Giulia M.']; var n=chi[Math.floor(Math.random()*chi.length)];
    var r=/\?/.test(txt)?'Bella domanda! Io l\'ho capita riguardando il punto '+(min!=null?'['+mmss(min)+']':'della lezione')+' con calma: se vuoi ne parliamo qui 🙂'
      :['👍','D\'accordo con te!','Grazie, utilissimo 🙏','Giusto, me lo segno 📌'][Math.floor(Math.random()*4)];
    a.timers.push(setTimeout(function(){ if(AU===a) botPost(n,r,null) },3500+Math.random()*3000)) }

  /* eventi dell'aula */
  lezBox()&&lezBox().addEventListener('click',function(e){
    var t;
    if((t=e.target.closest('[data-au-open]'))){ e.preventDefault(); aulaOpen(+t.getAttribute('data-au-open')); return }
    if(e.target.closest('[data-au-back]')){ aulaClose(); return }
    if((t=e.target.closest('[data-seek]'))){ e.preventDefault(); seek(+t.getAttribute('data-seek')); return }
    if((t=e.target.closest('[data-mat]'))){ if(t.getAttribute('data-mat')==='#demo'){ e.preventDefault(); toast('Nella demo le dispense non sono collegate'); return }
      if(LIVE&&!/^https?:/.test(t.getAttribute('data-mat'))){ e.preventDefault(); API.videoUrl(t.getAttribute('data-mat')).then(function(u){ window.open(u,'_blank','noopener') }).catch(function(err){ toast(itErr(err)) }) } return }
    if((t=e.target.closest('[data-au-tab]'))){ var p=t.getAttribute('data-au-tab'); AU.pane=p;
      $$('[data-au-tab]',lezBox()).forEach(function(b){ b.classList.toggle('on',b===t) }); $$('[data-au-pane]',lezBox()).forEach(function(x){ x.hidden=x.getAttribute('data-au-pane')!==p });
      if(p==='chat'){ AU.unread=0; var u=$('[data-au-unr]',lezBox()); if(u) u.hidden=true; var mb=$('#auMsgs'); mb.scrollTop=mb.scrollHeight } return }
    if((t=e.target.closest('[data-au-nt]'))){ var q=t.getAttribute('data-au-nt'); $$('[data-au-nt]',lezBox()).forEach(function(b){ b.classList.toggle('on',b===t) });
      $$('[data-au-ntp]',lezBox()).forEach(function(x){ x.hidden=x.getAttribute('data-au-ntp')!==q }); return }
    if(e.target.closest('[data-au-stamp]')){ var ta=$('#auNote'), s='['+mmss(nowT()||0)+'] ', i=ta.selectionStart||ta.value.length, pre=ta.value.slice(0,i);
      if(pre&&!/\n$/.test(pre)) s='\n'+s; ta.value=pre+s+ta.value.slice(i); ta.focus(); ta.selectionStart=ta.selectionEnd=i+s.length; ta.dispatchEvent(new Event('input')); return }
    if((t=e.target.closest('[data-au-ut]'))){ var id=+t.getAttribute('data-au-ut'), n=AU.notes.filter(function(x){ return x.id===id })[0]; if(!n) return;
      if(!LIVE){ var x=demoAula(); if(x.u.aula.utili[id]){ delete x.u.aula.utili[id]; n.utili-- } else { x.u.aula.utili[id]=true; n.utili++ } AU.utili=x.u.aula.utili; dsave(x.d); notesDraw(); return }
      loadSb().then(function(c){ return c.rpc('appunti_utili_toggle',{p_appunti:id}) }).then(function(r){ if(r.error) throw r.error; n.utili=r.data; if(AU.utili[id]) delete AU.utili[id]; else AU.utili[id]=true; notesDraw() }).catch(function(err){ toast(itErr(err)) }); return }
    if((t=e.target.closest('[data-au-cp]'))){ var nn=AU.notes.filter(function(x){ return x.id===+t.getAttribute('data-au-cp') })[0], ta2=$('#auNote'); if(!nn) return;
      ta2.value=(ta2.value?ta2.value.replace(/\s+$/,'')+'\n\n':'')+'— dagli appunti di '+nn.autore+' —\n'+nn.testo; ta2.dispatchEvent(new Event('input'));
      $('[data-au-nt="miei"]',lezBox()).click(); toast('Aggiunti ai tuoi appunti'); return }
    if((t=e.target.closest('[data-au-del]'))){ var mid=+t.getAttribute('data-au-del');
      loadSb().then(function(c){ return c.rpc('cancella_messaggio',{p_id:mid}) }).then(function(){ AU.msgs=AU.msgs.filter(function(m){ return m.id!==mid }); chatDraw() }); return }
  });
  lezBox()&&lezBox().addEventListener('change',function(e){
    if(e.target.matches('[data-au-vis]')){ CL.invisibile(!e.target.checked); return }
    if(e.target.matches('[data-au-share]')){ notesSave(); if(e.target.checked) toast('I tuoi appunti ora li vede la classe') }
  });
  lezBox()&&lezBox().addEventListener('input',function(e){
    if(e.target.id==='auNote'){ clearTimeout(AU.saveT); AU.saveT=setTimeout(notesSave,1200); marks(); if(CL.me.s!=='appunti'){ CL.set({s:'appunti'}) } clearTimeout(AU.stT); AU.stT=setTimeout(function(){ if(AU) CL.set({s:AU.v&&!AU.v.paused?'play':'pausa'}) },8000) }
    if(e.target.matches('.au-in textarea')){ var ta=e.target; ta.style.height='auto'; ta.style.height=Math.min(ta.scrollHeight,120)+'px' }
  });
  lezBox()&&lezBox().addEventListener('keydown',function(e){ if(e.target.matches('.au-in textarea')&&e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); $('#auSend').requestSubmit?$('#auSend').requestSubmit():$('#auSend [type=submit]').click() } });
  lezBox()&&lezBox().addEventListener('submit',function(e){ if(e.target.id!=='auSend') return; e.preventDefault();
    var f=e.target, ta=$('textarea',f), txt=ta.value.trim(), b=$('[type=submit]',f); if(!txt) return;
    var min=$('.au-at input',f).checked?nowT():null; busy(b,true);
    chatSend(txt,min).then(function(){ ta.value=''; ta.style.height='auto' }).catch(function(err){ toast(itErr(err)) }).then(function(){ busy(b,false) }) });
  window.addEventListener('pagehide',function(){ aulaSave(true) });
  document.addEventListener('visibilitychange',function(){ if(document.hidden) aulaSave(true) });

  /* ===== riepilogo in cima alla scheda: prossimo esame, pagamenti, CFU, lezione da riprendere ===== */
  function riepilogo(){
    var box=$('#arRiep'); if(!box) return; box.innerHTML=''; var o=ymd(new Date());
    var card=function(tab,ic,k,v,s,cls){ return '<button type="button" class="ar-rp'+(cls?' '+cls:'')+'" data-ar-tab="'+tab+'"><i>'+ic+'</i><small>'+k+'</small><b>'+v+'</b><span>'+s+'</span></button>' };
    var jobs=[API.app().then(function(l){ var p=l.filter(function(a){ return a.prenotato&&String(a.data).slice(0,10)>=o })[0];
        return p?card('esami','&#128197;','Prossimo esame',esc(p.insegnamento),itShort(p.data)+(p.ora?' &middot; '+String(p.ora).slice(0,5):'')+' &middot; '+esc(p.sede))
          :card('esami','&#128197;','Esami','Nessuna prenotazione',l.length?'Vedi gli appelli e prenota':'Calendario degli appelli') }),
      API.eco().then(function(d){ var r=d.rate||[]; if(!r.length) return null; var oggiD=oggi(), sc=r.filter(function(x){ return !x.pagata_il&&pd(x.scadenza)<oggiD });
        if(sc.length){ var t=sc.reduce(function(s,x){ return s+(+x.importo) },0); return card('economia','&#9888;','Pagamenti',sc.length===1?'1 rata scaduta':sc.length+' rate scadute',eur(t)+' da regolarizzare','late') }
        var nx=r.filter(function(x){ return !x.pagata_il })[0];
        return nx?card('economia','&#128182;','Prossima rata',eur(nx.importo),'scade il '+itShort(nx.scadenza)):card('economia','&#10003;','Pagamenti','In regola','Tutte le rate pagate','ok') }),
      API.car().then(function(l){ if(!l.length) return null; var tot=0, ok=0; l.forEach(function(c){ tot+=+c.cfu||0; if(c.esito!=='da sostenere') ok+=+c.cfu||0 });
        return card('carriera','&#127891;','Carriera',ok+' / '+tot+' CFU',l.filter(function(c){ return c.esito!=='da sostenere' }).length+' esami superati') }),
      API.lezioni().then(function(l){ if(!l.length) return null; var r=l.filter(function(x){ return !x.in_arrivo&&x.secondi>5&&!x.completata })[0];
        return r?card('lezioni','&#9654;','Riprendi la lezione',esc(r.titolo.split(' · ').pop()),esc(r.insegnamento)+' &middot; dal minuto '+mmss(r.secondi))
          :card('lezioni','&#127916;','Le mie lezioni',l.filter(function(x){ return !x.in_arrivo }).length+' disponibili','Entra in aula con la classe') })];
    Promise.all(jobs.map(function(p){ return p.catch(function(){ return null }) })).then(function(c){ c=c.filter(Boolean); box.innerHTML=c.join(''); box.hidden=!c.length });
  }

  function toast(t){ var el=document.getElementById('toast'), tx=document.getElementById('toast-txt'); if(!el||!tx) return; tx.innerHTML=t; el.classList.add('on'); clearTimeout(toast.t); toast.t=setTimeout(function(){ el.classList.remove('on') },3600) }

  /* pulsante "Area Riservata" -> "La mia area" quando sei dentro */
  function setBtn(p){ $$('[data-area]').forEach(function(b){ if(!b.classList.contains('btn-lock')) return; var s=b.querySelector('span:not(.shine)'); if(!s) return;
    if(!b.getAttribute('data-l0')) b.setAttribute('data-l0',s.textContent); s.textContent=p?'La mia area':b.getAttribute('data-l0'); b.classList.toggle('ar-in',!!p) }) }
  var hasSess=false; try{ hasSess=LIVE?Object.keys(localStorage).some(function(k){ return /^sb-.*-auth-token$/.test(k) }):!!dload().cur }catch(e){}
  if(hasSess) API.session().then(function(s){ if(s) API.profile().then(setBtn).catch(function(){}) }).catch(function(){});

  /* l'app per il telefono: promo nella scheda del sito, installazione e funzionamento offline nell'app */
  $$('[data-app-promo]').forEach(function(e){ e.hidden=APP||location.protocol==='file:' });
  $$('.ar-app-only').forEach(function(e){ if(!APP) e.remove() });
  if(APP){
    var bip=null, isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),
        alone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
    var instShow=function(){ $$('[data-app-install]').forEach(function(b){ b.hidden=alone||!(bip||isIOS) }) };
    window.addEventListener('beforeinstallprompt',function(e){ e.preventDefault(); bip=e; instShow() });
    window.addEventListener('appinstalled',function(){ bip=null; alone=true; instShow(); toast('App installata: la trovi fra le tue app') });
    document.addEventListener('click',function(e){ if(!e.target.closest('[data-app-install]')) return; e.preventDefault();
      if(bip){ bip.prompt(); bip.userChoice.then(function(){ bip=null; instShow() }) } else $('#appIos').hidden=false });
    instShow();
    if('serviceWorker' in navigator&&location.protocol==='https:') navigator.serviceWorker.register('/app/sw.js',{scope:'/app/'}).catch(function(){});
    var net=function(){ document.documentElement.classList.toggle('offline',!navigator.onLine) }; window.addEventListener('online',net); window.addEventListener('offline',net); net();
    window.addEventListener('hashchange',function(){ var m=/^#(\w+)$/.exec(location.hash); if(!dash.hidden&&m&&$('.ar-tab[data-tab="'+m[1]+'"]',dash)) tab(m[1]) });
  }

  /* apertura da indirizzo: #area-riservata, ?area=1, link di conferma o di recupero password */
  var q=location.search+location.hash;
  if(/type=recovery/.test(q)) loadSb().then(function(){ open('recover') });
  else if(APP) open('login');
  else if(/^#lezione-\d+$/.test(location.hash)) setTimeout(function(){ open('login') },LIVE?600:300);
  else if(location.hash==='#area-riservata'||/[?&]area=1/.test(location.search)||(LIVE&&/access_token=|[?&]code=/.test(q))) setTimeout(function(){ open('login') },LIVE?600:300);
  window.addEventListener('hashchange',function(){ if(location.hash==='#area-riservata') open('login') });
})();


/* ===== JANUS IN EVIDENZA =====
   Alla prima pagina della visita la finestra segue il mouse per SEGUI millisecondi, poi si ferma
   in basso a destra. Sulle pagine successive compare gia' ferma. La X la nasconde fino alla visita dopo. */
(function(){
  var box=document.getElementById('jnfly'); if(!box) return;
  var SEGUI=8000, RITARDO=1800;
  var S={get:function(k){ try{ return sessionStorage.getItem(k) }catch(e){ return null } }, set:function(k,v){ try{ sessionStorage.setItem(k,v) }catch(e){} }};
  var force=/[?&]janus=1/.test(location.search);
  if(!force&&S.get('uo-jn-chiuso')) return;
  if(/janus-diploma-online/.test(location.pathname)) return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches, fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var follow=(force||!S.get('uo-jn-visto'))&&fine&&!reduce;
  var x=0,y=0,tx=0,ty=0,mx=-1,my=-1,raf=0,t0=0,docked=false;
  function W(){ return box.offsetWidth } function H(){ return box.offsetHeight }
  function dockPos(){ var b=window.innerWidth<=640?84:96, dx=window.innerWidth-W()-(window.innerWidth<=640?14:26), dy=window.innerHeight-H()-b;
    var ck=document.getElementById('cookie'); if(ck){ var r=ck.getBoundingClientRect(), cs=getComputedStyle(ck);
      if(r.width&&cs.visibility!=='hidden'&&+cs.opacity>0.1&&r.top<window.innerHeight&&r.right>dx) dy=Math.min(dy,r.top-H()-14) }
    return [dx, Math.max(70,dy)] }
  document.addEventListener('click',function(e){ if(e.target.closest('#cookie')) setTimeout(function(){ if(docked){ var d=dockPos(); x=d[0]; y=d[1]; place(0) } },700) });
  function place(rot){ box.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0) rotate('+(rot||0).toFixed(2)+'deg)' }
  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)) }
  function loop(t){
    if(!t0) t0=t; var p=Math.min(1,(t-t0)/SEGUI); box.style.setProperty('--p',p);
    if(mx<0){ tx=window.innerWidth*.62+Math.sin(t/900)*90; ty=window.innerHeight*.28+Math.cos(t/1100)*60 }
    else { tx=mx+28; ty=my+22 }
    tx=clamp(tx,10,window.innerWidth-W()-10); ty=clamp(ty,70,window.innerHeight-H()-10);
    var vx=(tx-x)*.075, vy=(ty-y)*.075; x+=vx; y+=vy; place(clamp(vx*.35,-9,9));
    if(p<1) raf=requestAnimationFrame(loop); else dock();
  }
  function dock(){
    if(docked) return; docked=true; cancelAnimationFrame(raf); document.removeEventListener('mousemove',mv);
    box.classList.add('docked'); var d=dockPos(); x=d[0]; y=d[1]; place(0);
    setTimeout(function(){ box.classList.add('float') },900);
  }
  function mv(e){ mx=e.clientX; my=e.clientY }
  function start(){
    box.hidden=false; S.set('uo-jn-visto','1');
    if(follow){ x=window.innerWidth-W()-30; y=window.innerHeight; place(0); requestAnimationFrame(function(){ box.classList.add('on') });
      document.addEventListener('mousemove',mv,{passive:true}); raf=requestAnimationFrame(loop) }
    else { var d=dockPos(); x=d[0]; y=window.innerHeight+20; place(0); box.classList.add('docked');
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ box.classList.add('on'); docked=true; var d2=dockPos(); y=d2[1]; place(0); setTimeout(function(){ box.classList.add('float') },900) }) }) }
  }
  box.querySelector('.jnf-x').addEventListener('click',function(e){ e.preventDefault(); S.set('uo-jn-chiuso','1'); cancelAnimationFrame(raf); box.classList.remove('on'); setTimeout(function(){ box.hidden=true },500) });
  box.querySelector('.jnf-min').addEventListener('click',function(e){ e.preventDefault(); box.classList.toggle('mini'); if(docked){ var d=dockPos(); x=d[0]; y=d[1]; place(0) } });
  box.querySelector('.jnf-card').addEventListener('click',function(){ if(!docked) dock() });
  window.addEventListener('resize',function(){ if(docked){ var d=dockPos(); x=d[0]; y=d[1]; place(0) } });
  function go(){ setTimeout(start,RITARDO) }
  var pl=document.getElementById('preloader');
  if(document.readyState==='complete') go(); else window.addEventListener('load',function(){ setTimeout(go,pl?1400:0) });
})();


/* ===== POLI APERTI: contatore con obiettivo =====
   Conta le schede dei poli (.polo-card, esclusa la tratteggiata .polo-next) e riempie la barra verso l'obiettivo. */
(function(){
  var box=document.querySelector('[data-polo-goal]'); if(!box) return;
  var goal=+box.getAttribute('data-polo-goal')||1000, n=document.querySelectorAll('#poli .polo-card:not(.polo-next)').length||1;
  var q=function(s){ return box.querySelector(s) }, it=function(v){ return v.toLocaleString('it-IT') };
  q('[data-pg-n]').setAttribute('data-count',n); q('[data-pg-n]').textContent=it(n);
  q('[data-pg-open]').textContent=it(n); q('[data-pg-word]').textContent=n===1?'polo aperto':'poli aperti';
  q('[data-pg-left]').textContent=it(Math.max(goal-n,0));
  var bar=q('.pg-bar'); bar.setAttribute('aria-valuenow',n); bar.setAttribute('aria-valuemax',goal);
  var w=Math.max(100*n/goal,1.2)+'%'; // anche 1 polo su 1000 deve vedersi
  if(!('IntersectionObserver' in window)){ q('.pg-bar i').style.width=w; return }
  var o=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ o.disconnect(); setTimeout(function(){ q('.pg-bar i').style.width=w },250) } },{threshold:.4});
  o.observe(bar);
})();
