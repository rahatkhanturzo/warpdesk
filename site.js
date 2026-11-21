/* Shared by every page: menu, footer and the numbers from settings.js. */
(function(){
  var S=SETTINGS;
  var file=(location.pathname.split('/').pop()||'index.html');
  var pages=[["index.html","Home"],["how-it-works.html","How it works"],["terms.html","Terms"],["faq.html","FAQ"]];
  var navHtml='';
  pages.forEach(function(p){navHtml+='<a href="'+p[0]+'"'+(p[0]===file?' class="active" aria-current="page"':'')+'>'+p[1]+'</a>';});
  navHtml+='<a class="btn" href="contact.html">Get a costing</a>';
  var h=document.getElementById('site-header');
  if(h){h.className='top';h.innerHTML='<a class="logo" id="logo" href="index.html" style="color:inherit;text-decoration:none"></a><nav aria-label="Main">'+navHtml+'</nav>';}
  var f=document.getElementById('site-footer');
  if(f){f.innerHTML='&copy; '+new Date().getFullYear()+' <span data-s="brand"></span>. Cost figures shown on this site are illustrative. Contact: <span data-s="email"></span>';}

  var els=document.querySelectorAll('[data-s]');
  for(var k=0;k<els.length;k++){var val=S[els[k].getAttribute('data-s')];if(typeof val==='number')val=val.toLocaleString('en-US');els[k].textContent=val;}
  var logo=document.getElementById('logo');
  if(logo){
    if(S.brand.indexOf(' ')>0){var parts=S.brand.split(' ');logo.textContent=parts[0];var sp=document.createElement('span');sp.textContent=' '+parts.slice(1).join(' ');logo.appendChild(sp);}
    else{logo.textContent='';var a1=document.createElement('span');a1.textContent=S.brand.charAt(0);logo.appendChild(a1);logo.appendChild(document.createTextNode(S.brand.slice(1)));}
  }
  var motion=!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hdr=document.getElementById('site-header');
  function onScroll(){if(hdr)hdr.classList.toggle('scrolled',window.scrollY>8);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  if(motion&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.12});
    var items=document.querySelectorAll('section .eyebrow,section h2,.grid4>div,.linkcards>a,.steps li,.two>div,section details,.endcta');
    for(var m=0;m<items.length;m++){var el=items[m];
      if(el.getBoundingClientRect().top>window.innerHeight*0.95){
        el.classList.add('rv');
        el.style.transitionDelay=((Array.prototype.indexOf.call(el.parentNode.children,el)%4)*70)+'ms';
        io.observe(el);
      }
    }
  }
  function countUp(el,to,fmt){
    if(!motion){el.textContent=fmt(to);return;}
    el.textContent=fmt(0);var t0=null,dur=1100;
    function step(ts){if(t0===null)t0=ts;var p=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=fmt(to*e);if(p<1)requestAnimationFrame(step);}
    setTimeout(function(){requestAnimationFrame(step);},700);
  }
  var li=document.getElementById('li');if(li){li.href=S.linkedinUrl;li.textContent=S.linkedinText;}
  var wa=document.getElementById('wa');if(wa)wa.hidden=!S.whatsapp;

  var tb=document.getElementById('rows');
  if(tb){
    var lines=[["Yarn, "+S.yarnKgPerPiece+" kg at US$"+S.yarnPricePerKg.toFixed(2)+"/kg",S.yarnKgPerPiece*S.yarnPricePerKg]].concat(S.otherCosts);
    var total=0;
    lines.forEach(function(l,idx){total+=l[1];var tr=document.createElement('tr');tr.style.setProperty('--i',idx);
      var a=document.createElement('td');a.textContent=l[0];
      var b=document.createElement('td');b.className='n';b.textContent=l[1].toFixed(2);
      tr.appendChild(a);tr.appendChild(b);tb.appendChild(tr);});
    var tr=document.createElement('tr');tr.className='total';tr.style.setProperty('--i',lines.length);
    var a=document.createElement('td');a.textContent=S.fobPort;
    var b=document.createElement('td');b.className='n';b.textContent=total.toFixed(2);
    tr.appendChild(a);tr.appendChild(b);tb.appendChild(tr);
    countUp(b,total,function(x){return x.toFixed(2);});
    var q=document.getElementById('qty'),ov=document.getElementById('ov');q.min=S.minQty;q.value=S.exampleQty;
    function fmtOv(x){return 'US$ '+Math.round(x).toLocaleString('en-US');}
    function ovu(){var n=Math.max(0,parseFloat(q.value)||0);ov.textContent=fmtOv(n*total);}
    q.addEventListener('input',ovu);
    countUp(ov,Math.max(0,parseFloat(q.value)||0)*total,fmtOv);
  }

  var first=document.getElementById('f-brand');
  if(first){
    var fq=document.getElementById('f-qty');fq.min=S.minQty;fq.value=S.exampleQty;
    var st=document.getElementById('st'),send=document.getElementById('send');
    function v(id){return document.getElementById(id).value.trim();}
    if(S.formEndpoint){send.hidden=false;}
    else{st.textContent='Online requests are not switched on yet. Please email '+S.email+'.';}
    send.addEventListener('click',function(){
      var email=v('f-email');
      if(!v('f-brand')||!v('f-name')||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)||!(parseFloat(v('f-qty'))>0)){st.textContent='Please fill in brand, your name, a valid email and the quantity.';return;}
      if(document.getElementById('f-gotcha').value){return;}
      var d=new Date(),ref='WD-'+d.getFullYear()+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2)+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
      var payload={order_ref:ref,_subject:'New costing request '+ref+' from '+v('f-brand'),brand:v('f-brand'),contact_name:v('f-name'),email:email,style:v('f-style'),quantity_per_style:v('f-qty'),target_fob_usd:v('f-fob')||'-',delivery_needed_by:v('f-date')||'-',fibre_and_certification:v('f-fibre')||'-',notes:v('f-notes')||'-'};
      send.disabled=true;st.textContent='Sending...';
      fetch(S.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)})
        .then(function(r){if(!r.ok)throw new Error('bad');
          st.textContent='Sent. Your reference is '+ref+'. Expect a reply by email within '+S.costingTime+'.';
          ['f-brand','f-name','f-email','f-fob','f-date','f-fibre','f-notes'].forEach(function(id){document.getElementById(id).value='';});
          send.disabled=false;})
        .catch(function(){st.textContent='Could not send. Please email '+S.email+' instead.';send.disabled=false;});
    });
  }
})();
