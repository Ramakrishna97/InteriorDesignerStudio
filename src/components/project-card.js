export function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `
    <div class="project-card__image">
      <img
        src="${project.heroImage}"
        alt="${project.title}"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="project-card__content">
      <span class="project-card__category">${project.category}</span>
      <h3 class="project-card__title">${project.title}</h3>
      <p class="project-card__description">${project.shortDescription}</p>
      <a href="/project.html?id=${project.id}" class="project-card__link">View Project →</a>
    </div>
  `;
    return card;
}
//# sourceMappingURL=project-card.js.map