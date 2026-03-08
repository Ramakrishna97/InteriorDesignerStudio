import { createProjectCard } from './project-card';
export function createGallery(projects) {
    const section = document.createElement('section');
    section.className = 'gallery';
    const container = document.createElement('div');
    container.className = 'gallery__container';
    if (projects.length === 0) {
        container.innerHTML = '<p class="gallery__empty">No projects yet.</p>';
    }
    else {
        projects.forEach((project) => {
            const card = createProjectCard(project);
            container.appendChild(card);
        });
    }
    section.appendChild(container);
    return section;
}
//# sourceMappingURL=gallery.js.map