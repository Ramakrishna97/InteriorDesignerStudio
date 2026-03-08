import { createNav } from '../components/nav';
import { createFooter } from '../components/footer';
import { createLightbox } from '../components/lightbox';
import type { ProjectMetadata } from '../utils/types';

function escapeXml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function makePlaceholder(title = 'No image', w = 1200, h = 800) {
  const safe = escapeXml(title);
  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='#4ADEDE'/><stop offset='0.5' stop-color='#7C5CFF'/><stop offset='1' stop-color='#FF6BA7'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial' font-size='36' fill='rgba(255,255,255,0.95)'>${safe}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const projects: Record<string, ProjectMetadata> = {
  'modern-living': {
    id: 'modern-living',
    slug: 'modern-living',
    title: 'Modern Living Room Redesign',
    description: 'A complete transformation of a dated living space into a contemporary oasis.',
    shortDescription: 'Contemporary living room with clean lines and open space.',
    category: 'Residential',
    heroImage: makePlaceholder('Modern Living Room Redesign'),
    images: [
      { url: makePlaceholder('Modern Living — Overview'), alt: 'Modern living room 1', caption: 'Overview' },
      { url: makePlaceholder('Modern Living — Detail'), alt: 'Modern living room 2', caption: 'Detail view' },
    ],
    completionDate: '2024-01-15',
    location: 'Downtown Lofts',
    client: 'Jane & John Smith',
    featured: true,
    details:
      'This project involved a complete redesign with new furniture selection, updated lighting fixtures, and a modern color palette.',
  },
};

function getProjectId(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 'modern-living';
}

function render(): void {
  const app = document.getElementById('app');
  if (!app) return;

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
      (lightbox as any).show();
    });
  });

  projectSection.appendChild(gallery);
  app.appendChild(projectSection);
  app.appendChild(createFooter());
}

render();
