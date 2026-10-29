// Analytics is opt-in through content/analytics.json; never load on localhost.
(async function () {
  if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return;
  let config;
  try {
    const response = await fetch('./content/analytics.json', {cache: 'no-cache'});
    if (!response.ok) return;
    config = await response.json();
  } catch { return; }
  if (!config.enabled || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(config.siteCode) || !Array.isArray(config.allowedHosts) || !config.allowedHosts.includes(location.hostname)) return;
  const origin = 'https://' + config.siteCode + '.goatcounter.com';
  let lastPath, totalCount;
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
    box.title = ko ? 'GoatCounter 통계 · 고유 인원 수가 아니며 반영이 지연될 수 있습니다.' : 'GoatCounter statistics; not a count of individual people. Updates may be delayed.';
  }
  window.goatcounter = {no_onload: true};
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = origin + '/count';
  script.onload = track;
  document.head.append(script);
  window.addEventListener('hashchange', track);
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
    display();
  }
})();
