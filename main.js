(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
      mobileMenu.hidden = expanded;
    });
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      mobileMenu.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }
  document.getElementById('year')?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const message = document.querySelector('#message');
      if (message && !message.value.trim()) message.value = `I'm interested in: ${link.dataset.service}.`;
    });
  });
})();
