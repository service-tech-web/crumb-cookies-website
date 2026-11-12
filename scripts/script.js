import Lenis from 'lenis';
window.Lenis = Lenis;

// Box size toggle
const opts=document.querySelectorAll('.opt'),btn=document.querySelector('#buildBtn span');
opts.forEach(o=>o.addEventListener('click',()=>{
 opts.forEach(x=>{x.setAttribute('aria-pressed',x===o);x.textContent=x===o?x.dataset.n+' cookies  ✓':x.dataset.n+' cookies'});
 btn.textContent='Build my box — R'+o.dataset.p;document.getElementById('buildBtn').href='box.html?size='+o.dataset.n;
}));
// Newsletter
document.getElementById('nl').addEventListener('submit',e=>{
 e.preventDefault();
 document.getElementById('msg').textContent='Thanks! A little crumb is on its way.';
 e.target.reset();
});
// Floating crumbs that drift as you scroll
const box=document.getElementById('crumbs'),bits=[];
for(let i=0;box&&i<22;i++){
 const s=document.createElement('span'),z=4+Math.random()*9;
 s.style.cssText=`width:${z}px;height:${z*.8}px;left:${Math.random()*100}%;top:${Math.random()*95}%;opacity:${.35+Math.random()*.5}`;
 s.dataset.d=(Math.random()*.25+.05).toFixed(2);box.appendChild(s);bits.push(s);
}

(function(){
 var anim=document.documentElement.classList.contains('anim'),$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
 var hdr=document.querySelector('header'),prog=document.getElementById('prog');

 /* 1. smooth scroll (Lenis, falls back to native smooth scroll) */
 var lenis=null;
 if(anim){lenis=new Lenis({lerp:.1,smoothWheel:true});window.__lenis=lenis;}
 $('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){
  var id=a.getAttribute('href');if(id==='#')return;e.preventDefault();
  var t=id==='#top'?0:document.querySelector(id);if(t===null)return;
  if(lenis)lenis.scrollTo(t,{offset:-80,duration:1.3});else if(t===0)scrollTo({top:0,behavior:'smooth'});else t.scrollIntoView({behavior:'smooth'});
 })});

 /* 2. headline text effects: words rise out of a mask */
 function split(el){
  var label='',nodes=[].slice.call(el.childNodes),i=0;
  nodes.forEach(function(n){label+=n.nodeType===3?n.textContent:' '});
  el.setAttribute('aria-label',label.replace(/\s+/g,' ').trim());el.textContent='';
  nodes.forEach(function(n){
   if(n.nodeType!==3){el.appendChild(n.cloneNode(true));return}
   n.textContent.split(/(\s+)/).forEach(function(t){
    if(!t)return;if(/^\s+$/.test(t)){el.append(' ');return}
    var w=document.createElement('span'),s=document.createElement('span');
    w.className='w';w.setAttribute('aria-hidden','true');s.textContent=t;s.style.setProperty('--i',i++);w.appendChild(s);el.appendChild(w);
   });
  });
  el.classList.add('split');
 }
 function letters(el){
  var t=el.textContent;el.setAttribute('aria-label',t);el.textContent='';
  t.split('').forEach(function(c,i){var s=document.createElement('span');s.className='lt';s.setAttribute('aria-hidden','true');s.textContent=c;s.style.setProperty('--i',i);el.appendChild(s)});
 }
 if(anim){
  $('h1.anton,h2.anton').forEach(split);
  letters(document.querySelector('footer .logo'));
 }

 /* 3. appear on scroll */
 if(anim){
  $('.eyebrow,.lead,.cta,.card,.more,.bakery .body,.facts>div,.build .sub,.opts,.build small,.flavours .head p,.mascot,.box,.badge,footer .tagline,footer h4,footer .top p,footer form,.links,.legal,.fcard,.dcard,.acc,.phead .lead2').forEach(function(e){e.classList.add('reveal')});
  $('.hero-img,.art img,.box img').forEach(function(e){e.classList.add('pop')});
  $('.reveal,.pop').forEach(function(e){
   var sibs=$(':scope>.reveal,:scope>.pop',e.parentElement),k=sibs.indexOf(e);e.style.setProperty('--d',(k<0?0:k)*110+'ms');
  });
  var hi=document.querySelector('.hero-img');if(hi)hi.style.setProperty('--d','250ms');
  var io=new IntersectionObserver(function(es){es.forEach(function(en){
   if(!en.isIntersecting)return;var e=en.target;e.classList.add('in');io.unobserve(e);
   if(e.classList.contains('split'))setTimeout(function(){e.classList.add('done')},1800);
  })},{threshold:.15,rootMargin:'0px 0px -8% 0px'});
  $('.reveal,.pop,.split').forEach(function(e){io.observe(e)});
  var lg=document.querySelector('footer .logo'),io2=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){lg.classList.add('lt-on');io2.disconnect()}})},{threshold:.3});io2.observe(lg);
 }

 /* 4. parallax (uses the independent "translate" property so it never fights hover/float transforms) */
 var items=[];
 function add(sel,mode,val){$(sel).forEach(function(e,i){items.push({e:e,m:mode,v:typeof val==='function'?val(i):val,p:mode==='c'?e.parentElement:null})})}
 if(anim){
  add('.hero-img','s',.12);
  $('#crumbs span').forEach(function(e){items.push({e:e,m:'s',v:parseFloat(e.dataset.d)+.05})});
  add('.art img','c',function(i){return[-.07,-.14,-.05][i]});
  add('.box img','c',-.07);
  add('.mascot svg','c',-.08);
  add('footer .logo','c',-.1);
 }
 var lastY=-1,lastW=0;
 function frame(t){
  if(lenis)lenis.raf(t);
  var y=window.scrollY,w=innerWidth;
  if(y!==lastY||w!==lastW){
   lastY=y;lastW=w;
   var max=document.documentElement.scrollHeight-innerHeight;prog.style.transform='scaleX('+(max>0?y/max:0)+')';
   hdr.classList.toggle('s',y>20);
   var vh=innerHeight,k=w<900?.6:1;
   items.forEach(function(it){
    var o=0;
    if(it.m==='s'){if(y>1400)return;o=y*it.v}
    else{var r=it.p.getBoundingClientRect();if(r.bottom<-300||r.top>vh+300)return;o=(r.top+r.height/2-vh/2)*it.v}
    it.e.style.translate='0 '+(o*k).toFixed(1)+'px';
   });
  }
  requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);

 /* 5. micro-interactions */
 var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
 $('.btn').forEach(function(b){
  b.addEventListener('pointerdown',function(e){
   var r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*2,d=document.createElement('span');
   d.className='rip';d.style.cssText='width:'+s+'px;height:'+s+'px;left:'+(e.clientX-r.left-s/2)+'px;top:'+(e.clientY-r.top-s/2)+'px';
   b.appendChild(d);setTimeout(function(){d.remove()},650);
  });
  if(!fine)return;
  b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();
   b.style.setProperty('--mx',((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px');b.style.setProperty('--my',((e.clientY-r.top-r.height/2)*.28).toFixed(1)+'px')});
  b.addEventListener('pointerleave',function(){b.style.setProperty('--mx','0px');b.style.setProperty('--my','0px')});
 });
 $('.opt').forEach(function(o){o.addEventListener('click',function(){
  [o,document.querySelector('#buildBtn span')].forEach(function(e){e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump')});
 })});
 var bx=document.querySelector('.box');
 if(fine&&bx){var bi=bx.querySelector('img');
  bx.addEventListener('pointermove',function(e){var r=bx.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
   bi.style.setProperty('--ry',(px*8).toFixed(1)+'deg');bi.style.setProperty('--rx',(-py*8).toFixed(1)+'deg')});
  bx.addEventListener('pointerleave',function(){bi.style.setProperty('--ry','0deg');bi.style.setProperty('--rx','0deg')});
 }
 document.getElementById('nl').addEventListener('submit',function(){var m=document.getElementById('msg');m.classList.remove('pop');void m.offsetWidth;m.classList.add('pop')});

 })();
