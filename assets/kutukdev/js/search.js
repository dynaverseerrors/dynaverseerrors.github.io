/*! Dynaverse Errors search - client-side JSON index */
(function(){
  'use strict';
  var input=document.getElementById('dv-search-input');
  var box=document.getElementById('dv-search-results');
  if(!input||!box)return;
  var DATA=null,LOADING=false,TL=[];
  function norm(s){s=(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');if(s.slice(0,2)==='0x')s=s.slice(2);return s.replace(/^0+/,'')||s;}
  function load(){
    if(DATA||LOADING)return;LOADING=true;
    fetch('/assets/kutukdev/js/search/manifest.json').then(function(r){return r.json()}).then(function(m){
      return Promise.all(m.shards.map(function(u){return fetch(u).then(function(r){return r.json()})}));
    }).then(function(parts){DATA=[].concat.apply([],parts);
      TL=DATA.map(function(e){return e[1].toLowerCase()});
      LOADING=false;if(input.value)run();
    }).catch(function(){LOADING=false});
  }
  function score(q,raw,e,i){
    var s=0,c=e[0];
    if(q){if(c===q)s=1000;else if(q.length>=3&&c.indexOf(q)===0)s=800-(c.length-q.length);}
    if(!s){
      var t=TL[i];
      if(raw.length>=3&&t.indexOf(raw)>-1)s=300;
      else if(raw.length>=3&&e[3]&&e[3].indexOf(raw)>-1)s=150;
    }
    return s;
  }
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function run(){
    var raw=input.value.trim().toLowerCase(),q=norm(raw);
    if(!raw){box.hidden=true;box.innerHTML='';return}
    if(!DATA){if(!LOADING)load();return}
    var hits=[];
    for(var i=0;i<DATA.length&&hits.length<24;i++){
      var sc=score(q,raw,DATA[i],i);
      if(sc>0)hits.push([sc,i]);
    }
    hits.sort(function(a,b){return b[0]-a[0]});
    var out='';
    if(!hits.length){out='<div class="none">No results for &ldquo;'+esc(raw)+'&rdquo;</div>'}
    else{
      hits.slice(0,6).forEach(function(h){
        var e=DATA[h[1]];
        var code=e[0]&&e[0].indexOf(raw)>=0?e[0]:(q&&e[0]===q?e[0]:'');
        out+='<a href="'+e[2]+'">'+(code?'<span class="code">'+esc(code)+'</span>':'')+'<span class="t">'+esc(e[1])+'</span></a>';
      });
    }
    box.innerHTML=out;box.hidden=false;
  }
  var tmr;
  input.addEventListener('input',function(){clearTimeout(tmr);tmr=setTimeout(run,120)});
  input.addEventListener('focus',function(){if(!DATA)load();else if(input.value)run()});
  input.addEventListener('keydown',function(ev){
    if(ev.key==='Enter'){
      ev.preventDefault();
      var q=input.value.trim();
      if(q)window.location.href='/?q='+encodeURIComponent(q);
    }else if(ev.key==='Escape'){box.hidden=true}
  });
  document.addEventListener('click',function(ev){
    if(!box.hidden&&!box.contains(ev.target)&&ev.target!==input){box.hidden=true}
  });
  document.addEventListener('keydown',function(ev){
    if(ev.key==='/'&&!/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)&&!document.activeElement.isContentEditable){
      ev.preventDefault();input.focus();
    }
  });
  /* homepage ?q= results */
  var res=document.getElementById('dv-results');
  if(res&&window.location.pathname==='/'&&window.location.search.indexOf('q=')>-1){
    var q0=decodeURIComponent(window.location.search.split('q=')[1].split('&')[0]);
    var nq=norm(q0).toLowerCase();
    function render(){
      var hits=[];
      for(var i=0;i<DATA.length;i++){var sc=score(nq,q0.toLowerCase(),DATA[i],i);if(sc>0)hits.push([sc,i])}
      hits.sort(function(a,b){return b[0]-a[0]});
      var html='<h1 class="category-title">Search results</h1><p class="dv-results__note">'+hits.length+' result(s) for &ldquo;'+esc(q0)+'&rdquo;</p><div class="posts-feed" data-layout-grid="columns">';
      hits.slice(0,30).forEach(function(h){
        var e=DATA[h[1]];
        html+='<article class="post-card post" data-layout="vertical" data-has-featured-image="true"><div class="post-card__content"><a href="'+e[2]+'" class="post-card__content-link"><h2 class="post-card__title">'+esc(e[1])+'</h2></a><div class="post-card__footer"><span class="post-card__meta post-card__meta-tag-primary">'+esc(e[0]?'Code '+e[0]:'Error')+'</span></div></div></article>';
      });
      html+='</div>';
      var feed=document.querySelector('.posts-feed');
      if(feed){feed.style.display='none'}
      res.innerHTML=html;
    }
    if(DATA)render();else{var iv=setInterval(function(){if(DATA){clearInterval(iv);render()}},150);setTimeout(function(){clearInterval(iv)},8000)}
  }
  /* copy buttons */
  document.addEventListener('click',function(ev){
    var b=ev.target.closest?ev.target.closest('.code-copy'):null;
    if(!b)return;
    var pre=b.parentNode.querySelector('code');
    if(!pre)return;
    var txt=pre.textContent;
    function done(){b.textContent='Copied!';b.classList.add('copied');setTimeout(function(){b.textContent='Copy';b.classList.remove('copied')},2500)}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(done,function(){fallback()})}else fallback();
    function fallback(){var ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}document.body.removeChild(ta);done()}
  });
})();
