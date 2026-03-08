import type { ProjectMetadata } from './types';

export async function loadProjects(): Promise<ProjectMetadata[]> {
  try {
    // Try to load the projects index
    const response = await fetch('/content/projects/index.json');
    if (!response.ok) {
      console.warn('Projects index not found, returning empty array');
      return [];
    }
    const indexRaw = await response.json();
    // Support either array of slugs or array of objects with slug property
    const index: string[] = Array.isArray(indexRaw)
      ? indexRaw.map((v) => (typeof v === 'string' ? v : v.slug))
      : [];

    const projects: ProjectMetadata[] = [];

    // Load local overrides (admin preview) first
    let overrides: Record<string, ProjectMetadata> = {};
    try {
      const raw = localStorage.getItem('project_overrides');
      if (raw) overrides = JSON.parse(raw);
    } catch (err) {
      // ignore parse errors
    }

    // Load each project's metadata
    for (const slug of index) {
      try {
        if (overrides[slug]) {
          projects.push(overrides[slug]);
          continue;
        }

        const metaResponse = await fetch(`/content/projects/${slug}/metadata.json`);
        if (metaResponse.ok) {
          const metadata: ProjectMetadata = await metaResponse.json();
          projects.push(metadata);
        }
      } catch (error) {
        console.warn(`Failed to load metadata for project: ${slug}`, error);
      }
    }

    // Also include any overrides for projects not yet in the index
    for (const slug of Object.keys(overrides)) {
      if (!projects.some((p) => p.slug === slug)) {
        projects.push(overrides[slug]);
      }
    }

    return projects;
  } catch (error) {
    console.warn('Failed to load projects:', error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<ProjectMetadata | null> {
  try {
    const projects = await loadProjects();
    return projects.find((p) => p.id === id) || null;
  } catch (error) {
    console.warn(`Failed to get project ${id}:`, error);
    return null;
  }
}

export async function getFeaturedProjects(): Promise<ProjectMetadata[]> {
  try {
    const projects = await loadProjects();
    return projects.filter((p) => p.featured);
  } catch (error) {
    console.warn('Failed to load featured projects:', error);
    return [];
  }
}
