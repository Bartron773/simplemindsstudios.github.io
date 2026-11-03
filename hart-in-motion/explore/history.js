import {items} from './history-data.js';
export function setupHistory() {
  const $=id=>document.getElementById(id),keys=Object.keys(items);
  const labels={then:'The story',detail:'Look closer',now:'Today'};
  let selected=0,tab='then';
  function render(){
    const item=items[keys[selected]],fact=item.tabs[tab];
    $('historyMeta').textContent=item.meta;
    $('historyText').textContent=fact.text;
    $('historyQuestion').textContent=item.question;
    $('historyContext').textContent=tab==='then'?'FROM THE ARCHIVE':tab==='detail'?'PHOTOGRAPHIC / MODEL OBSERVATION':'PRESENT-DAY CONTEXT';
    $('historySource').href=fact.source;
    $('historySource').textContent=tab==='detail'?'District background ↗':'Read the source ↗';
    $('historyPanel').setAttribute('aria-labelledby',`history-tab-${tab}`);
    [...$('historyTabs').children].forEach(b=>{const on=b.dataset.tab===tab;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});
  }
  Object.entries(labels).forEach(([id,label],i)=>{
    const b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.id=`history-tab-${id}`;b.dataset.tab=id;b.textContent=label;b.setAttribute('aria-controls','historyPanel');
    b.onclick=()=>{tab=id;render();};
    b.onkeydown=e=>{const tabs=[...$('historyTabs').children];let n;if(e.key==='ArrowRight')n=(i+1)%3;if(e.key==='ArrowLeft')n=(i+2)%3;if(e.key==='Home')n=0;if(e.key==='End')n=2;if(n!==undefined){e.preventDefault();tabs[n].focus();tabs[n].click();}};
    $('historyTabs').append(b);
  });
  render();
  return {select(i){selected=i;tab='then';render();$('story').scrollTop=0;}};
}
