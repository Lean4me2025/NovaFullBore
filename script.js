(function () {
  const audio = document.getElementById('nova-intro');
  if (!audio) return;
  const status = document.getElementById('status');
  const playOverlay = document.getElementById('play-overlay');
  const playBtn = document.getElementById('play-btn');
  const replayBtn = document.getElementById('replay-btn');

  document.addEventListener('DOMContentLoaded', async () => {
    try { audio.load(); await audio.play(); if(status) status.textContent = 'Intro is playing…'; }
    catch (err) { if (playOverlay) playOverlay.classList.remove('hidden'); if(status) status.textContent = 'Tap "Play Intro" to start audio.'; }
  });

  playBtn?.addEventListener('click', async () => {
    try { await audio.play(); if(status) status.textContent = 'Intro is playing…'; playOverlay?.classList.add('hidden'); }
    catch (err) { if(status) status.textContent = 'Could not start audio.'; }
  });

  replayBtn?.addEventListener('click', () => {
    audio.currentTime = 0;
    audio.play().catch(()=>{});
  });

  audio.addEventListener('error', () => {
    const e = audio.error;
    let msg = 'Audio error.';
    if (e) {
      const codes = ['MEDIA_ERR_CUSTOM','MEDIA_ERR_ABORTED','MEDIA_ERR_NETWORK','MEDIA_ERR_DECODE','MEDIA_ERR_SRC_NOT_SUPPORTED'];
      msg = `Audio error (${codes[e.code] || e.code}).`;
    }
    if(status) status.textContent = msg;
  });
})();