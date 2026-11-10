/* MAB Auto Styling — Linktree landing page. No external dependencies. */
(() => {
  'use strict';
  const whatsappDialog = document.getElementById('whatsapp-dialog');
  const callDialog = document.getElementById('call-dialog');
  const waForm = document.getElementById('whatsapp-form');
  const preview = document.getElementById('message-preview');
  const messages = {
    en: {
      quote: "Hi! I'm interested in MAB Auto Styling services. I'd like to request a quote for my vehicle.",
      appointment: "Hi! I'd like to schedule an appointment with MAB Auto Styling."
    },
    es: {
      quote: '¡Hola! Estoy interesado en los servicios de MAB Auto Styling. Me gustaría solicitar una cotización para mi vehículo.',
      appointment: '¡Hola! Me gustaría agendar una cita con MAB Auto Styling.'
    }
  };
  const selection = () => ({
    lang: waForm.elements.language.value,
    request: waForm.elements.request.value
  });
  function refreshPreview() {
    const { lang, request } = selection();
    preview.textContent = messages[lang][request];
    waForm.querySelectorAll('[data-lang-en]').forEach(item => {
      item.textContent = item.getAttribute('data-lang-' + lang);
    });
    document.getElementById('wa-submit').textContent = lang === 'es' ? 'ABRIR WHATSAPP' : 'OPEN WHATSAPP';
  }
  function openDialog(dialog) {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  document.querySelectorAll('[data-open]').forEach(button => {
    button.addEventListener('click', () => openDialog(button.dataset.open === 'whatsapp' ? whatsappDialog : callDialog));
  });
  [whatsappDialog, callDialog].forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  });
  waForm.addEventListener('change', refreshPreview);
  waForm.addEventListener('submit', event => {
    event.preventDefault();
    const { lang, request } = selection();
    const target = 'https://wa.me/14698832177?text=' + encodeURIComponent(messages[lang][request]);
    // The customer reviews and sends the message inside WhatsApp.
    window.location.href = target;
  });
  refreshPreview();
})();
