import { createNav } from '../components/nav';
import { createFooter } from '../components/footer';
import { createHero } from '../components/hero';
import { createGallery } from '../components/gallery';
import type { ProjectMetadata } from '../utils/types';

// Placeholder in case images are missing
function makePlaceholder(title = 'No image', w = 1200, h = 800) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
    <rect width='100%' height='100%' fill='#ddd'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='36' fill='#333'>${title}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Load all projects dynamically
async function fetchAllProjects(): Promise<ProjectMetadata[]> {
  try {
    // 1. Load the projects index
    const indexRes = await fetch('./content/projects/index.json');
    const projectFolders: string[] = await indexRes.json();

    // 2. Load each folder's project.json
    const projects = await Promise.all(
      projectFolders.map(async folder => {
        const res = await fetch(`./content/projects/${folder}/metadata.json`);
        const project = await res.json() as ProjectMetadata;

        // Use placeholder if hero image missing
        project.heroImage = project.heroImage || makePlaceholder(project.title);

        // Map images array
        if (project.images) {
          project.images = project.images.map(img => ({
            url: img.url || makePlaceholder(img.alt || project.title),
            alt: img.alt || project.title,
            caption: img.caption || ''
          }));
        } else {
          project.images = [];
        }

        return project;
      })
    );

    // Sort by completionDate descending
    projects.sort((a, b) => (b.completionDate > a.completionDate ? 1 : -1));

    return projects;
  } catch (err) {
    console.error('Error loading projects:', err);
    return [];
  }
}

async function render(): Promise<void> {
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

  const allProjects = await fetchAllProjects();
  portfolioSection.appendChild(createGallery(allProjects));

  app.appendChild(portfolioSection);
  app.appendChild(createFooter());
}

render();