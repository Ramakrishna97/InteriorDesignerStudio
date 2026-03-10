export function createNav(): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Main navigation');

  nav.innerHTML = `
    <div class="nav__container">
      <div class="nav__logo">
        <a href="/" aria-label="Interior Designer Home">
          <h1>Interior Design</h1>
        </a>
      </div>
      <button class="nav__toggle" aria-label="Toggle navigation menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul class="nav__menu" role="menu">
        <li role="menuitem"><a href="/">Home</a></li>
        <li role="menuitem"><a href="/InteriorDesignerStudio/portfolio.html">Portfolio</a></li>
        <li role="menuitem"><a href="/InteriorDesignerStudio/about.html">About</a></li>
        <li role="menuitem"><a href="/InteriorDesignerStudio/contact.html">Contact</a></li>
      </ul>
    </div>
  `;

  const toggle = nav.querySelector('.nav__toggle') as HTMLButtonElement;
  const menu = nav.querySelector('.nav__menu') as HTMLElement;

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', (!isExpanded).toString());
      menu.classList.toggle('nav__menu--open');
    });

    // Close menu when a link is clicked
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('nav__menu--open');
      });
    });
  }

  return nav;
}
