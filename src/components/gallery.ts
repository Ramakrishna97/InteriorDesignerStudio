import type { ProjectMetadata } from '../utils/types';
import { createProjectCard } from './project-card';

export function createGallery(projects: ProjectMetadata[]): HTMLElement {
  const section = document.createElement('section');
  section.className = 'gallery';

  const container = document.createElement('div');
  container.className = 'gallery__container';

  if (projects.length === 0) {
    container.innerHTML = '<p class="gallery__empty">No projects yet.</p>';
  } else {
    projects.forEach((project) => {
      const card = createProjectCard(project);
      container.appendChild(card);
    });
  }

  section.appendChild(container);
  // Scroll reveal: observe `.reveal` elements and add `is-visible` with stagger
  // Reveal with IntersectionObserver when available; otherwise fall back to timed reveal
  const reveals = Array.from(container.querySelectorAll<HTMLElement>('.reveal'));
  if (reveals.length > 0) {
    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const idx = Number(el.dataset.index || 0);
            setTimeout(() => el.classList.add('is-visible'), idx * 80);
            io.unobserve(el);
          }
        });
      }, { threshold: 0.18 });

      reveals.forEach((el, i) => {
        el.dataset.index = String(i);
        io.observe(el);
      });
    } else {
      // Simple fallback: staggered reveal on load
      reveals.forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), i * 80 + 120);
      });
    }
  }
  return section;
}
