// user time duration on each page - logged to console. 
console.log('main.js loaded —', window.location.pathname);

(function() {
  const path = window.location.pathname;
  const entryTime = new Date();

  function formatTime(date) {
    return date.toISOString();
  }

  function logExit(trigger) {
    const exitTime = new Date();
    const duration = ((exitTime - entryTime) / 1000).toFixed(2);
    console.log(`[Page Timing] ${trigger} — Path: ${path}`);
    console.log(`  Entry: ${formatTime(entryTime)}`);
    console.log(`  Exit:  ${formatTime(exitTime)}`);
    console.log(`  Duration: ${duration} seconds`);
  }

  // 1) Log entry immediately
  console.log(`[Page Timing] ENTER — Path: ${path}`);
  console.log(`  Time: ${formatTime(entryTime)}`);

  // 2) Log on any link click (navigation)
  document.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', () => logExit('LINK CLICK'));
  });

  // 3) Log on visibility change (tab switch, navigate away)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      logExit('VISIBILITY HIDDEN');
    }
  });

  // 4) Log on pagehide (covers unload on mobile and some browsers)
  window.addEventListener('pagehide', () => logExit('PAGEHIDE'));

  // 5) Also try beforeunload as a last resort
  window.addEventListener('beforeunload', () => logExit('BEFOREUNLOAD'));
})();
