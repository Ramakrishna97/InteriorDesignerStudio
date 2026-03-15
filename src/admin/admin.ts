import '../styles/global.css';
import '../styles/admin.css';
import { GitHubAPI } from '../utils/github-api';
import { validateProjectForm, generateSlug, sanitizeFilename } from '../utils/validation';
import type { AdminProjectInput } from '../utils/types';

interface AdminConfig {
  admins: Array<{ username: string; password: string }>;
  github?: {
    pat: string;
    owner: string;
    repo: string;
  };
}

class AdminInterface {
  private ghapi: GitHubAPI | null = null;
  private config: AdminConfig | null = null;
  private isProd = import.meta.env.PROD;

  constructor() {
    this.loadConfig();
  }

  private async loadConfig(): Promise<void> {
    try {
      if (this.isProd) {
        // Production: no PAT needed
        this.config = { admins: [{ username: 'admin', password: 'admin123' }] };
      } else {
        // Local: load admin-config.json
        const response = await fetch(`${import.meta.env.BASE_URL}admin-config.json`);
        if (!response.ok) throw new Error('Failed to load admin configuration');
        this.config = await response.json();
      }
      this.renderLoginForm();
    } catch (error) {
      console.error('Admin config load failed:', error);
      const app = document.getElementById('app');
      if (app)
        app.innerHTML = `
          <div style="color:red;padding:20px;text-align:center">
            <h2>Configuration Error</h2>
            <p>Could not load admin-config.json</p>
          </div>`;
    }
  }

  private renderLoginForm(): void {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <div class="admin-container">
        <h1 class="admin-header">Interior Design Admin</h1>
        <form id="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" placeholder="Enter username" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" placeholder="Enter password" required />
          </div>
          <div class="form-group">
            <button type="submit" class="btn">Login</button>
          </div>
          <div id="auth-status" class="status"></div>
        </form>
      </div>
    `;

    const form = document.getElementById('login-form') as HTMLFormElement;
    const status = document.getElementById('auth-status') as HTMLElement;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = (document.getElementById('username') as HTMLInputElement).value;
      const password = (document.getElementById('password') as HTMLInputElement).value;

      if (this.validateCredentials(username, password)) {
        status.textContent = 'Login successful';
        setTimeout(() => this.renderProjectForm(), 500);
      } else {
        status.textContent = 'Invalid credentials';
      }
    });
  }

  private validateCredentials(username: string, password: string): boolean {
    if (!this.config) return false;
    return this.config.admins.some((a) => a.username === username && a.password === password);
  }

  private renderProjectForm(): void {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <div class="admin-container">
        <h1 class="admin-header">Upload Project</h1>
        <form id="project-form">
          <div class="form-group">
            <label for="title">Project Title</label>
            <input id="title" placeholder="Project title" required />
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" required>
              <option value="">Select category</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Interior Design">Interior Design</option>
              <option value="Renovation">Renovation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="short-description">Short Description</label>
            <input id="short-description" placeholder="Short description" required />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" placeholder="Full description"></textarea>
          </div>

          <div class="form-group">
            <label for="completion-date">Completion Date</label>
            <input id="completion-date" type="date" required />
          </div>

          <div class="form-group">
            <label for="location">Location</label>
            <input id="location" placeholder="Location" />
          </div>

          <div class="form-group">
            <label for="client">Client</label>
            <input id="client" placeholder="Client" />
          </div>

          <div class="form-group">
            <label for="hero-image">Hero Image</label>
            <input id="hero-image" type="file" accept="image/*" required />
          </div>

          <div class="form-group">
            <label for="images">Project Images</label>
            <input id="images" type="file" multiple accept="image/*" required />
          </div>

          <div class="form-group">
            <button type="submit" class="btn">Upload</button>
          </div>

          <div id="submit-status" class="status"></div>
        </form>
      </div>
    `;

    const form = document.getElementById('project-form') as HTMLFormElement;
    const status = document.getElementById('submit-status') as HTMLElement;

    form.addEventListener('submit', (e) => this.handleProjectSubmit(e, status));
  }

  private async handleProjectSubmit(e: Event, statusDiv: HTMLElement): Promise<void> {
    e.preventDefault();
    if (!this.config) return;

    const input: Partial<AdminProjectInput> = {
      title: (document.getElementById('title') as HTMLInputElement).value,
      category: (document.getElementById('category') as HTMLSelectElement).value,
      shortDescription: (document.getElementById('short-description') as HTMLInputElement).value,
      description: (document.getElementById('description') as HTMLTextAreaElement).value,
      completionDate: (document.getElementById('completion-date') as HTMLInputElement).value,
      location: (document.getElementById('location') as HTMLInputElement).value,
      client: (document.getElementById('client') as HTMLInputElement).value,
      heroImageFile: (document.getElementById('hero-image') as HTMLInputElement).files?.[0],
      images: Array.from((document.getElementById('images') as HTMLInputElement).files || []),
    };

    const errors = validateProjectForm(input);
    if (!input.category) errors.push({ field: 'category', message: 'Category is required' });

    if (errors.length > 0) {
      statusDiv.textContent = errors.map((e) => e.message).join(', ');
      return;
    }

    statusDiv.textContent = 'Uploading...';

    try {
      const slug = generateSlug(input.title || '');
      const hero = input.heroImageFile ? await this.readFileAsBase64(input.heroImageFile) : '';
      const images = await Promise.all(
        (input.images || []).map(async (file) => ({
          name: sanitizeFilename(file.name),
          data: await this.readFileAsBase64(file),
        }))
      );

      const payload = { slug, ...input, heroImage: hero, images };

      // Determine paths
      const basePath = this.isProd
        ? `content/projects/${slug}`
        : `public/content/projects/${slug}`;

      const baseUrl = this.isProd
        ? `${import.meta.env.BASE_URL}`
        : `${import.meta.env.BASE_URL}public/`;

      const metadata = {
        slug,
        title: input.title,
        category: input.category,
        description: input.description,
        shortDescription: input.shortDescription,
        completionDate: input.completionDate,
        location: input.location,
        client: input.client,
        heroImage: `${baseUrl}content/projects/${slug}/hero.jpg`,
        images: images.map((_, i) => ({
          url: `${baseUrl}content/projects/${slug}/image-${i + 1}.jpg`,
          alt: `Image ${i + 1}`,
        })),
      };

      if (!this.isProd) {
        // LOCAL: commit directly using GitHub PAT
        if (!this.config.github) throw new Error('GitHub config missing for local');
        this.ghapi = new GitHubAPI(this.config.github.pat, this.config.github.owner, this.config.github.repo);

        const changes: any[] = [
          { path: `${basePath}/hero.jpg`, content: hero, encoding: 'base64' },
        ];
        images.forEach((img, i) =>
          changes.push({ path: `${basePath}/image-${i + 1}.jpg`, content: img.data, encoding: 'base64' })
        );
        changes.push({ path: `${basePath}/metadata.json`, content: JSON.stringify(metadata, null, 2), encoding: 'utf-8' });

        // Update index.json locally
        const indexPath = `public/content/projects/index.json`;
        let index: string[] = [];
        try {
          const indexFile = await fetch(`${import.meta.env.BASE_URL}${indexPath}`);
          index = await indexFile.json();
        } catch {}
        index.push(slug);
        changes.push({ path: indexPath, content: JSON.stringify([...new Set(index)], null, 2), encoding: 'utf-8' });

        const sha = await this.ghapi.createCommit(`Add project: ${input.title}`, changes);
        statusDiv.innerHTML = `Project uploaded ✓ <br> Commit ${sha.slice(0, 7)}`;
      } else {
        // PROD: trigger workflow endpoint
        const response = await fetch('/api/trigger-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Upload failed');
        statusDiv.innerHTML =
          'Project submitted successfully ✓<br>GitHub Actions workflow will commit the files.';
      }
    } catch (err) {
      console.error(err);
      statusDiv.textContent = 'Upload failed';
    }
  }

  private async readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result.split(',')[1]);
        else reject('Failed to read file as base64');
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

new AdminInterface();