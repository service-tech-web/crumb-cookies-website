(function(){
 /* FAQ accordion */
 document.querySelectorAll('.acc .q').forEach(function(q){q.addEventListener('click',function(){
  var a=q.parentElement,o=!a.classList.contains('open');a.classList.toggle('open',o);q.setAttribute('aria-expanded',o)})});
 var list=document.getElementById('list');if(!list)return;

 /* box builder */
 /* [id, image file inside public/images, name]  <- change a file name here if you rename an image */
 var C=[['classic','hero.webp','OG chocolate chunk'],['pistachio','pistachio.webp','Pistachio daydream'],['fudge','fudge.webp','After dark'],['strawberry','strawberry.webp','Berry big crush'],['caramel','caramel.png','Salted caramel chaos'],['cinnamon','cinnamon.png','Cinnamon sugar hug']],
  P={6:27,12:52},q=new URLSearchParams(location.search),size=q.get('size')==='12'?12:6,n={},$=function(i){return document.getElementById(i)};
 C.forEach(function(c){n[c[0]]=0});
 var add=q.get('add');if(add&&n.hasOwnProperty(add))n[add]=1;
 var sum=function(){return C.reduce(function(t,c){return t+n[c[0]]},0)};
 C.forEach(function(c){
  var r=document.createElement('div');r.className='crow';r.innerHTML='<img src="images/'+c[1]+'" alt=""><div><h3>'+c[2]+'</h3></div><div class="step"><button type="button" aria-label="Remove one '+c[2]+'">−</button><output id="o-'+c[0]+'">0</output><button type="button" aria-label="Add one '+c[2]+'">+</button></div>';
  var b=r.querySelectorAll('button');
  b[0].onclick=function(){if(n[c[0]]>0){n[c[0]]--;draw(c[0])}};
  b[1].onclick=function(){if(sum()<size){n[c[0]]++;draw(c[0])}};
  r._b=b;list.appendChild(r);
 });
 function draw(bump){
  var s=sum(),full=s===size;
  C.forEach(function(c,i){$('o-'+c[0]).textContent=n[c[0]];var b=list.children[i]._b;b[0].disabled=!n[c[0]];b[1].disabled=full});
  var sl=$('slots');sl.innerHTML='';sl.style.gridTemplateColumns='repeat(6,1fr)';var k=0;
  C.forEach(function(c){for(var i=0;i<n[c[0]];i++){var d=document.createElement('div');d.className='slot f';d.innerHTML='<img src="images/'+c[1]+'" alt="">';sl.appendChild(d);k++}});
  for(;k<size;k++){var e=document.createElement('div');e.className='slot';sl.appendChild(e)}
  $('prog2').textContent=full?'Box full. Nice picks!':s+' of '+size+' picked';
  $('tot').textContent='R'+P[size];$('next').disabled=!full;
  document.querySelectorAll('.sz').forEach(function(z){z.setAttribute('aria-pressed',+z.dataset.n===size)});
 }
 document.querySelectorAll('.sz').forEach(function(z){z.onclick=function(){
  size=+z.dataset.n;var ex=sum()-size;
  for(var i=C.length-1;ex>0&&i>=0;i--){var t=Math.min(ex,n[C[i][0]]);n[C[i][0]]-=t;ex-=t}
  draw()}});
 $('surprise').onclick=function(){while(sum()<size){n[C[Math.floor(Math.random()*C.length)][0]]++}draw()};
 function show(id){['pick','details','done'].forEach(function(p){$(p).hidden=p!==id});scrollTo({top:0,behavior:'smooth'})}
 $('next').onclick=function(){
  var s=$('date');s.innerHTML='';var d=new Date(),c=0;d.setDate(d.getDate()+1);
  while(c<7){d.setDate(d.getDate()+1);if(d.getDay()!==0){var o=document.createElement('option');o.value=o.textContent=d.toLocaleDateString('en-ZA',{weekday:'long',day:'numeric',month:'long'});s.appendChild(o);c++}}
  show('details');$('next').firstChild.nodeValue='Place order ';$('next').onclick=function(){$('details').requestSubmit()};$('next').disabled=false;
 };
 $('back').onclick=function(){show('pick');location.reload()};
 $('details').onsubmit=function(e){
  e.preventDefault();var f=new FormData(e.target),no='CR-'+Math.floor(1000+Math.random()*9000);
  $('doneMsg').textContent='Thanks '+f.get('name').split(' ')[0]+'! Your '+size+'-cookie box (R'+P[size]+') is booked for '+f.get('date')+'. Order '+no+'. (Demo only, no payment was taken.)';
  show('done');document.querySelector('.sum').hidden=true;
 };
 draw();
})();
