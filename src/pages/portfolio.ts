import { createNav } from '../components/nav';
import { createFooter } from '../components/footer';
import { createHero } from '../components/hero';
import { createGallery } from '../components/gallery';
import type { ProjectMetadata } from '../utils/types';

function escapeXml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function makePlaceholder(title = 'No image', w = 1200, h = 800) {
  const safe = escapeXml(title);
  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='#4ADEDE'/><stop offset='0.5' stop-color='#7C5CFF'/><stop offset='1' stop-color='#FF6BA7'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial' font-size='36' fill='rgba(255,255,255,0.95)'>${safe}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const allProjects: ProjectMetadata[] = [
  {
    id: 'modern-living',
    slug: 'modern-living',
    title: 'Modern Living Room Redesign',
    description: 'A complete transformation of a dated living space into a contemporary oasis.',
    shortDescription: 'Contemporary living room with clean lines and open space.',
    category: 'Residential',
    heroImage: makePlaceholder('Modern Living Room Redesign'),
    images: [
      { url: makePlaceholder('Modern Living — Overview'), alt: 'Modern living room 1' },
      { url: makePlaceholder('Modern Living — Detail'), alt: 'Modern living room 2' },
    ],
    completionDate: '2024-01-15',
    location: 'Downtown Lofts',
    client: 'Jane & John Smith',
    featured: true,
  },
  {
    id: 'luxury-bedroom',
    slug: 'luxury-bedroom',
    title: 'Luxury Master Bedroom Suite',
    description: 'An elegant and serene bedroom retreat for a luxury penthouse.',
    shortDescription: 'Luxury bedroom with marble accents and custom furniture.',
    category: 'Residential',
    heroImage: makePlaceholder('Luxury Master Bedroom Suite'),
    images: [{ url: makePlaceholder('Luxury Bedroom — View'), alt: 'Luxury bedroom' }],
    completionDate: '2023-11-20',
    location: 'Penthouse Tower',
    client: 'Private Client',
    featured: true,
  },
  {
    id: 'office-space',
    slug: 'office-space',
    title: 'Corporate Office Redesign',
    description: 'Modern workspace design for a tech startup.',
    shortDescription: 'Contemporary office space with open concept layout.',
    category: 'Commercial',
    heroImage: makePlaceholder('Corporate Office Redesign'),
    images: [{ url: makePlaceholder('Office Space — View'), alt: 'Office space' }],
    completionDate: '2023-09-10',
    location: 'Tech Hub Downtown',
    client: 'TechStart Inc.',
    featured: false,
  },
];

function render(): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = '';

  app.appendChild(createNav());

  const hero = createHero({
    title: 'Our Portfolio',
    subtitle: 'Explore our latest projects and designs',
  });
  app.appendChild(hero);

  const portfolioSection = document.createElement('section');
  portfolioSection.className = 'portfolio-section';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'All Projects';
  portfolioSection.appendChild(title);

  const gallery = createGallery(allProjects);
  portfolioSection.appendChild(gallery);

  app.appendChild(portfolioSection);
  app.appendChild(createFooter());
}

render();
