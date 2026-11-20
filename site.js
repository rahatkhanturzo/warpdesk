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
  if(f){f.innerHTML='<span data-s="brand"></span> is a working name. Costing figures are illustrative. Contact: <span data-s="email"></span>';}

  var els=document.querySelectorAll('[data-s]');
  for(var k=0;k<els.length;k++){var val=S[els[k].getAttribute('data-s')];if(typeof val==='number')val=val.toLocaleString('en-US');els[k].textContent=val;}
  var t=document.body.getAttribute('data-title');
  document.title=(t?t+' | ':'')+S.brand;
  var parts=S.brand.split(' '),logo=document.getElementById('logo');
  if(logo){logo.textContent=parts[0];if(parts.length>1){var sp=document.createElement('span');sp.textContent=' '+parts.slice(1).join(' ');logo.appendChild(sp);}}
  var li=document.getElementById('li');if(li){li.href=S.linkedinUrl;li.textContent=S.linkedinText;}
  var wa=document.getElementById('wa');if(wa)wa.hidden=!S.whatsapp;

  var tb=document.getElementById('rows');
  if(tb){
    var lines=[["Yarn, "+S.yarnKgPerPiece+" kg at US$"+S.yarnPricePerKg.toFixed(2)+"/kg",S.yarnKgPerPiece*S.yarnPricePerKg]].concat(S.otherCosts);
    var total=0;
    lines.forEach(function(l){total+=l[1];var tr=document.createElement('tr');
      var a=document.createElement('td');a.textContent=l[0];
      var b=document.createElement('td');b.className='n';b.textContent=l[1].toFixed(2);
      tr.appendChild(a);tr.appendChild(b);tb.appendChild(tr);});
    var tr=document.createElement('tr');tr.className='total';
    var a=document.createElement('td');a.textContent=S.fobPort;
    var b=document.createElement('td');b.className='n';b.textContent=total.toFixed(2);
    tr.appendChild(a);tr.appendChild(b);tb.appendChild(tr);
    var q=document.getElementById('qty'),ov=document.getElementById('ov');q.min=S.minQty;q.value=S.exampleQty;
    function ovu(){var n=Math.max(0,parseFloat(q.value)||0);ov.textContent='US$ '+Math.round(n*total).toLocaleString('en-US');}
    q.addEventListener('input',ovu);ovu();
  }

  var out=document.getElementById('out');
  if(out){
    var fq=document.getElementById('f-qty');fq.min=S.minQty;fq.value=S.exampleQty;
    var ids=['f-brand','f-name','f-style','f-qty','f-fob','f-date','f-fibre'];
    function v(id){return document.getElementById(id).value.trim();}
    function build(){
      var s='Hi,\n\nI would like a costing for one style.\n\n';
      s+='Brand: '+(v('f-brand')||'-')+'\nContact: '+(v('f-name')||'-')+'\n';
      s+='Style: '+v('f-style')+'\nQuantity: '+(v('f-qty')||'-')+' pcs per style\n';
      s+='Target FOB: '+(v('f-fob')?'US$ '+v('f-fob')+' per pc':'-')+'\n';
      s+='Delivery needed by: '+(v('f-date')||'-')+'\nFibre / certification: '+(v('f-fibre')||'-')+'\n\n';
      s+='I will attach a tech pack or photos. Please send factory options and a cost sheet.\n\nThank you,\n'+(v('f-name')||'');
      out.value=s;
    }
    ids.forEach(function(i){var e=document.getElementById(i);e.addEventListener('input',build);e.addEventListener('change',build);});
    build();
    var st=document.getElementById('st');
    document.getElementById('copy').addEventListener('click',function(){
      function fb(){out.removeAttribute('readonly');out.focus();out.select();out.setAttribute('readonly','');st.textContent='Press Ctrl+C (or Cmd+C) to copy the selected text.';}
      try{navigator.clipboard.writeText(out.value).then(function(){st.textContent='Copied.';},fb);}catch(e){fb();}
    });
  }
})();
