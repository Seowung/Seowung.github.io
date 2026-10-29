// Analytics is opt-in through content/analytics.json; never load on localhost.
(async function () {
  const localPreview = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  let config;
  try {
    const response = await fetch('./content/analytics.json', {cache: 'no-cache'});
    if (!response.ok) return;
    config = await response.json();
  } catch { return; }
  if (!config.enabled || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(config.siteCode) || !Array.isArray(config.allowedHosts) || (!localPreview && !config.allowedHosts.includes(location.hostname))) return;
  const origin = 'https://' + config.siteCode + '.goatcounter.com';
  let lastPath, totalCount;
  let dailyCounts = null;
  function path() {
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    const section = ['home','research','faith','interests','life'].includes(parts[0]) ? parts[0] : 'home';
    if (section === 'life') {
      const category = ['survival','ramblings'].includes(parts[1]) ? parts[1] : 'survival';
      return '/life/' + category; // TOC jumps and language changes are not new views.
    }
    return '/' + section;
  }
  function track() {
    const current = path();
    if (current === lastPath || typeof window.goatcounter?.count !== 'function') return;
    lastPath = current;
    window.goatcounter.count({path: current, title: current, referrer: ''});
  }
  function display() {
    if (!config.showPublicCounter) return;
    let box = document.getElementById('visitor-counter');
    if (!box) {
      box = document.createElement('span'); box.id = 'visitor-counter';
      document.querySelector('footer')?.append(box);
    }
    const ko = document.documentElement.lang === 'ko';
    box.textContent = totalCount == null ? (ko ? '누적 조회 수: 집계 준비 중' : 'Total views: awaiting data') : (ko ? '누적 조회 수: ' : 'Total views: ') + totalCount;
    renderChart();
    box.title = ko ? 'GoatCounter 통계 · 고유 인원 수가 아니며 반영이 지연될 수 있습니다.' : 'GoatCounter statistics; not a count of individual people. Updates may be delayed.';
  }
  if (!localPreview) {
    window.goatcounter = {no_onload: true};
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://gc.zgo.at/count.js';
    script.dataset.goatcounter = origin + '/count';
    script.onload = track;
    document.head.append(script);
    window.addEventListener('hashchange', track);
  }
  window.addEventListener('hashchange', () => setTimeout(renderChart, 0));
  function renderChart() {
    const main = document.querySelector('#main');
    if (!main) return;
    let chart = document.getElementById('visits-chart');
    if (path() !== '/home') { if (chart) chart.remove(); return; }
    if (!chart) {chart = document.createElement('section');chart.id = 'visits-chart';chart.className = 'visits-chart';main.append(chart);}
    const ko = document.documentElement.lang === 'ko';
    chart.replaceChildren();
    const header = document.createElement('div');header.className='visits-heading';
    const heading = document.createElement('h2');heading.textContent=ko?'이 공간을 찾아주신 발걸음':'Visits to this little corner';header.append(heading);
    const total = document.createElement('p');total.textContent=(ko?'누적 조회 수: ':'Total views: ')+(totalCount == null?'—':totalCount);header.append(total);chart.append(header);
    if (dailyCounts) {
      const bars = document.createElement('div');bars.className='visits-bars';bars.setAttribute('role','list');bars.setAttribute('aria-label',ko?'최근 7일 일별 조회 수':'Daily views over the last 7 days');
      const max = Math.max(1,...dailyCounts.map(d=>d.count));
      dailyCounts.forEach(day=>{
        const item=document.createElement('div');item.className='visits-day';item.setAttribute('role','listitem');item.setAttribute('aria-label',day.date+': '+day.count+(ko?'회 조회':' views'));
        const number=document.createElement('span');number.textContent=String(day.count);
        const track=document.createElement('div');track.className='visits-track';track.setAttribute('aria-hidden','true');
        const fill=document.createElement('div');fill.className='visits-fill';fill.style.height=(day.count/max*100)+'%';track.append(fill);
        const label=document.createElement('span');label.textContent=day.date.slice(5).replace('-','/');
        item.append(number,track,label);bars.append(item);
      });chart.append(bars);
    } else {const message=document.createElement('p');message.textContent=ko?'일별 통계를 불러오는 중이거나 아직 확인할 수 없습니다.':'Daily statistics are loading or unavailable.';chart.append(message);}
    const note=document.createElement('p');note.className='visits-note';note.textContent=ko?'최근 7일 · UTC 기준 · 조회 수는 고유 방문자 수와 다르며 최대 4시간 늦게 반영될 수 있습니다.':'Last 7 days · UTC · Views are not unique visitors. Updates may be delayed by up to 4 hours.';chart.append(note);
  }
  if (config.showPublicCounter) {
    display();
    new MutationObserver(display).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
    try {
      const response = await fetch(origin + '/counter/TOTAL.json', {credentials:'omit'});
      if (response.ok) {
        const data = await response.json();
        if (typeof data.count === 'string' || typeof data.count === 'number') totalCount = String(data.count);
      }
    } catch { /* Counter failure must never affect the website. */ }
    const dates=Array.from({length:7},(_,i)=>{const date=new Date();date.setUTCDate(date.getUTCDate()-(6-i));return date.toISOString().slice(0,10)});
    try {
      dailyCounts=await Promise.all(dates.map(async date=>{
        const response=await fetch(origin+'/counter/TOTAL.json?start='+date+'&end='+date,{credentials:'omit'});
        if (!response.ok) throw Error('Daily count unavailable');
        const data=await response.json();const raw=String(data.count??'');
        if (!/^\d[\d,]*$/.test(raw)) throw Error('Invalid daily count');
        return {date,count:Number(raw.replace(/,/g,''))};
      }));
    } catch {dailyCounts=null;}
    display();
    new MutationObserver(()=>{if(path()==='/home'&&!document.getElementById('visits-chart'))renderChart()}).observe(document.querySelector('#main'),{childList:true});
  }
})();
