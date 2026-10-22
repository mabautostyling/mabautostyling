/* Secure quote UI. Server config and token are required; no false-success offline mode. */
(() => {
  const form = document.getElementById('quote-form');
  if (!form) return;
  const submit = document.getElementById('quote-submit');
  const notice = document.getElementById('quote-status');
  const challengeStatus = document.getElementById('turnstile-status');
  const challengeContainer = document.getElementById('turnstile-widget');
  let widgetId = null;
  let token = '';
  let busy = false;
  let backendReady = false;
  const report = (text, kind) => {
    notice.hidden = false;
    notice.textContent = text;
    notice.className = 'quote-status ' + kind;
    if (kind === 'error') notice.setAttribute('role', 'alert');
    else notice.setAttribute('role', 'status');
  };
  const updateButton = () => { submit.disabled = !backendReady || !token || busy; };
  const loadTurnstile = () => new Promise((resolve, reject) => {
    if (window.turnstile) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Turnstile could not load. Check your connection.'));
    document.head.appendChild(script);
  });
  async function init() {
    try {
      if (window.location.protocol === 'file:') throw new Error('Preview mode: publish with Cloudflare Pages and configure D1 + Turnstile to receive quotes.');
      const response = await fetch('/api/config', { cache: 'no-store' });
      if (!response.ok) throw new Error('Secure form service is unavailable.');
      const config = await response.json();
      if (!config.ready || !config.turnstileSiteKey) throw new Error('Secure quote form is awaiting Cloudflare configuration. Call, text, or WhatsApp still work.');
      await loadTurnstile();
      backendReady = true;
      widgetId = window.turnstile.render(challengeContainer, {
        sitekey: config.turnstileSiteKey,
        action: 'quote',
        theme: 'dark',
        callback: newToken => { token = newToken; challengeStatus.textContent = 'Security check complete.'; updateButton(); },
        'expired-callback': () => { token = ''; challengeStatus.textContent = 'Security check expired. Please complete it again.'; updateButton(); },
        'error-callback': () => { token = ''; challengeStatus.textContent = 'Security check failed. Please retry.'; updateButton(); }
      });
      challengeStatus.textContent = 'Complete the security check to enable quote submission.';
      updateButton();
    } catch (error) {
      challengeStatus.textContent = error.message || 'Quote form unavailable. Please contact us by phone or text.';
      backendReady = false;
      updateButton();
    }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    notice.hidden = true;
    if (!form.reportValidity()) { report('Please fill in the required fields and enter a valid email address.', 'error'); return; }
    if (!backendReady || !token) { report('Please complete the security check before submitting.', 'error'); return; }
    busy = true;
    updateButton();
    const data = new FormData(form);
    const payload = {
      fullName: String(data.get('fullName') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      vehicle: String(data.get('vehicle') || '').trim(),
      interiorServices: data.getAll('interiorServices'),
      exteriorServices: data.getAll('exteriorServices'),
      message: String(data.get('message') || '').trim(),
      smsConsent: data.get('smsConsent') === 'true',
      websiteFax: String(data.get('websiteFax') || ''),
      turnstileToken: token
    };
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      });
      let result = null;
      try { result = await response.json(); } catch (_) { /* no JSON */ }
      if (!response.ok || !result?.saved) throw new Error(result?.error || 'We could not send your request. Please try again.');
      form.reset();
      report('Thank you for contacting MAB Auto Styling! We have received your quote request and will get back to you as soon as possible.', 'success');
      notice.focus?.();
    } catch (error) {
      report(error.message || 'A network error occurred. Please try again.', 'error');
    } finally {
      busy = false;
      token = '';
      if (widgetId !== null && window.turnstile) window.turnstile.reset(widgetId);
      updateButton();
    }
  });
  init();
})();
