import { createNav } from '../components/nav';
import { createFooter } from '../components/footer';
import { createLightbox } from '../components/lightbox';
const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EPlaceholder%3C/text%3E%3C/svg%3E';
const projects = {
    'modern-living': {
        id: 'modern-living',
        slug: 'modern-living',
        title: 'Modern Living Room Redesign',
        description: 'A complete transformation of a dated living space into a contemporary oasis.',
        shortDescription: 'Contemporary living room with clean lines and open space.',
        category: 'Residential',
        heroImage: placeholderImage,
        images: [
            { url: placeholderImage, alt: 'Modern living room 1', caption: 'Overview' },
            { url: placeholderImage, alt: 'Modern living room 2', caption: 'Detail view' },
        ],
        completionDate: '2024-01-15',
        location: 'Downtown Lofts',
        client: 'Jane & John Smith',
        featured: true,
        details: 'This project involved a complete redesign with new furniture selection, updated lighting fixtures, and a modern color palette.',
    },
};
function getProjectId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'modern-living';
}
function render() {
    const app = document.getElementById('app');
    if (!app)
        return;
    const projectId = getProjectId();
    const project = projects[projectId];
    if (!project) {
        app.innerHTML = '<p>Project not found.</p>';
        return;
    }
    app.innerHTML = '';
    app.appendChild(createNav());
    const projectSection = document.createElement('article');
    projectSection.className = 'project-detail';
    const header = document.createElement('header');
    header.className = 'project-detail__header';
    header.innerHTML = `
    <div class="project-detail__hero">
      <img src="${project.heroImage}" alt="${project.title}" class="project-detail__image" />
    </div>
    <div class="project-detail__meta">
      <h1>${project.title}</h1>
      <p class="project-detail__category">${project.category}</p>
      <div class="project-detail__info">
        <div><strong>Location:</strong> ${project.location || 'N/A'}</div>
        <div><strong>Client:</strong> ${project.client || 'N/A'}</div>
        <div><strong>Completed:</strong> ${project.completionDate}</div>
      </div>
    </div>
  `;
    projectSection.appendChild(header);
    const content = document.createElement('div');
    content.className = 'project-detail__content';
    content.innerHTML = `
    <p>${project.description}</p>
    ${project.details ? `<p>${project.details}</p>` : ''}
  `;
    projectSection.appendChild(content);
    const gallery = document.createElement('div');
    gallery.className = 'project-detail__gallery';
    project.images.forEach((image) => {
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.alt;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.style.cursor = 'pointer';
        gallery.appendChild(img);
    });
    // Add lightbox
    const lightbox = createLightbox(project.images);
    gallery.appendChild(lightbox);
    // Add click listeners to gallery images
    gallery.querySelectorAll('img:not(.lightbox__image)').forEach((img) => {
        img.addEventListener('click', () => {
            lightbox.show();
        });
    });
    projectSection.appendChild(gallery);
    app.appendChild(projectSection);
    app.appendChild(createFooter());
}
render();
//# sourceMappingURL=project-detail.js.map