(function(){
  function wireEthos(){
    var nav=document.querySelector('.navlinks');
    if(nav&&!nav.querySelector('a[href="/ethos/"]')){
      var link=document.createElement('a');
      link.href='/ethos/';
      link.textContent='Ethos';
      var contact=nav.querySelector('a[href="#contact"]');
      nav.insertBefore(link,contact||null);
    }

    var principles=document.getElementById('principles');
    if(principles&&!document.getElementById('ethos-entry')){
      var entry=document.createElement('article');
      entry.id='ethos-entry';
      entry.className='panel glass';
      entry.style.marginTop='1px';
      entry.innerHTML='<span class="kicker">Founding document / 2026</span><h3>The minds are human. The intelligences are the Studios.</h3><p>Our Ethos explains why Simple Minds Studios exists, how humans and intelligent systems work together, and why clarity, provenance, uncertainty, and human stakes guide the museum.</p><div class="actions"><a class="button" href="/ethos/">Read the Ethos →</a></div>';
      principles.appendChild(entry);
    }

    document.querySelectorAll('footer .fine').forEach(function(node){
      if(node.textContent.indexOf('Museum Curator: Brad Devowe')!==-1){
        node.innerHTML='Creative Director: Bart Salazar / Museum Creator: Brad Devowe<br>Museum Curator: Lincoln / OpenAI<br>Curatorial ensemble: Claude / Anthropic · Gemini / Google · Meta AI / Meta · Grok / xAI<br>Simple Minds Studios<br>Hart, Michigan — 2026<br>Enjoy your look around!';
      }
    });

    return Boolean(nav&&principles&&document.querySelector('footer .fine'));
  }

  function start(){
    if(wireEthos())return;
    var observer=new MutationObserver(function(){if(wireEthos())observer.disconnect()});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    window.setTimeout(function(){observer.disconnect();wireEthos()},5000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
})();
