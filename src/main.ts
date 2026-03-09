import { createNav } from './components/nav';
import { createFooter } from './components/footer';
import { createHero } from './components/hero';
import { createGallery } from './components/gallery';
import type { ProjectMetadata } from './utils/types';
import './styles/global.css';

// Generate a colorful SVG placeholder that includes the project title
function escapeXml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function makePlaceholder(title = 'No image', w = 1200, h = 800) {
  const safe = escapeXml(title);
  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='#4ADEDE'/><stop offset='0.5' stop-color='#7C5CFF'/><stop offset='1' stop-color='#FF6BA7'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial' font-size='40' fill='rgba(255,255,255,0.95)'>${safe}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const sampleProjects: ProjectMetadata[] = [
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
    details: 'This project involved complete redesign with new furniture, lighting, and color scheme.',
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
];

function render(): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = '';

  // Add nav
  app.appendChild(createNav());

  // Add hero
  const hero = createHero({
    title: 'Welcome to Interior Design',
    subtitle: 'Creating beautiful spaces that inspire',
    backgroundImage: sampleProjects[0]?.heroImage || makePlaceholder('Welcome to Interior Design'),
    ctaText: 'View Portfolio',
    ctaLink: '/portfolio.html',
  });
  app.appendChild(hero);

  // Add featured projects section
  const featuredSection = document.createElement('section');
  featuredSection.className = 'featured-section';
  featuredSection.innerHTML = '<h2 class="section-title">Featured Projects</h2>';

  const gallery = createGallery(sampleProjects.filter((p) => p.featured));
  featuredSection.appendChild(gallery);
  app.appendChild(featuredSection);

  // Add footer
  app.appendChild(createFooter());
}

render();
