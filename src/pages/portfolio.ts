import { createNav } from '../components/nav';
import { createFooter } from '../components/footer';
import { createHero } from '../components/hero';
import { createGallery } from '../components/gallery';
import type { ProjectMetadata } from '../utils/types';

// ---------- Placeholder generator ----------
function makePlaceholder(title = 'No image', w = 1200, h = 800): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
    <rect width='100%' height='100%' fill='#ddd'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='36' fill='#333'>${title}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ---------- Load all projects ----------
async function fetchAllProjects(): Promise<ProjectMetadata[]> {
  try {
    // Load index.json from public
    const indexRes = await fetch(`${import.meta.env.BASE_URL}content/projects/index.json`);
    if (!indexRes.ok) throw new Error('Failed to load projects index');
    const projectFolders: string[] = await indexRes.json();

    // Load metadata.json for each project
    const projects = await Promise.all(
      projectFolders.map(async (folder) => {
        const res = await fetch(`${import.meta.env.BASE_URL}content/projects/${folder}/metadata.json`);
        if (!res.ok) throw new Error(`Failed to load project: ${folder}`);
        const project = (await res.json()) as ProjectMetadata;

        // Hero image placeholder
        project.heroImage = project.heroImage || makePlaceholder(project.title);

        // Map images
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

// ---------- Render Portfolio Page ----------
async function render(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  // Clear existing content
  app.innerHTML = '';

  // Navbar
  app.appendChild(createNav());

  // Hero Section
  const hero = createHero({
    title: 'Our Portfolio',
    subtitle: 'Explore our latest projects and designs',
  });
  app.appendChild(hero);

  // Portfolio Section
  const portfolioSection = document.createElement('section');
  portfolioSection.className = 'portfolio-section';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'All Projects';
  portfolioSection.appendChild(title);

  // Fetch and render projects
  const allProjects = await fetchAllProjects();
  const gallery = createGallery(allProjects);
  portfolioSection.appendChild(gallery);

  app.appendChild(portfolioSection);

  // Footer
  app.appendChild(createFooter());
}

// ---------- Run ----------
render();