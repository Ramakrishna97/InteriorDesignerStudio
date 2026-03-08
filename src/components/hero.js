export function createHero(options) {
    const hero = document.createElement('section');
    hero.className = 'hero';
    if (options.backgroundImage) {
        hero.style.backgroundImage = `url('${options.backgroundImage}')`;
    }
    hero.innerHTML = `
    <div class="hero__content">
      <h1 class="hero__title">${options.title}</h1>
      ${options.subtitle ? `<p class="hero__subtitle">${options.subtitle}</p>` : ''}
      ${options.ctaText && options.ctaLink
        ? `<a href="${options.ctaLink}" class="hero__cta btn btn--primary">${options.ctaText}</a>`
        : ''}
    </div>
  `;
    return hero;
}
//# sourceMappingURL=hero.js.map