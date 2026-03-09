import { GitHubAPI } from '../utils/github-api';
import { validateProjectForm, generateSlug, sanitizeFilename } from '../utils/validation';
import type { AdminProjectInput } from '../utils/types';

interface AdminConfig {
  admins: Array<{ username: string; password: string }>;
  github: {
    pat: string;
    owner: string;
    repo: string;
  };
}

class AdminInterface {
  private ghapi: GitHubAPI | null = null;
  private config: AdminConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  private async loadConfig(): Promise<void> {
    try {
      const response = await fetch('/admin-config.json');
      if (!response.ok) {
        throw new Error('Failed to load admin configuration');
      }
      this.config = await response.json();
      this.renderLoginForm();
    } catch (error) {
      const app = document.getElementById('app');
      if (app) {
        app.innerHTML = `
        <div class="admin-container">
          <div style="color:red;text-align:center;padding:20px">
            <h2>Configuration Error</h2>
            <p>Could not load admin-config.json</p>
          </div>
        </div>`;
      }
      console.error(error);
    }
  }

  private renderLoginForm(): void {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <div class="admin-container">
        <h1>Interior Design Admin</h1>
        <form id="login-form">
          <input id="username" placeholder="Username" required />
          <input id="password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <div id="auth-status"></div>
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
    return this.config.admins.some(
      (a) => a.username === username && a.password === password
    );
  }

  private renderProjectForm(): void {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <div class="admin-container">
        <h1>Upload Project</h1>

        <form id="project-form">
          <input id="title" placeholder="Project title" required />
          <input id="short-description" placeholder="Short description" required />
          <textarea id="description" placeholder="Description"></textarea>

          <input id="completion-date" type="date" required />
          <input id="location" placeholder="Location" />
          <input id="client" placeholder="Client" />

          <label>Hero image</label>
          <input id="hero-image" type="file" accept="image/*" required />

          <label>Project images</label>
          <input id="images" type="file" multiple accept="image/*" required />

          <button type="submit">Upload</button>
        </form>

        <div id="submit-status"></div>
      </div>
    `;

    const form = document.getElementById('project-form') as HTMLFormElement;
    const status = document.getElementById('submit-status') as HTMLElement;

    form.addEventListener('submit', (e) =>
      this.handleProjectSubmit(e, status)
    );
  }

  private async handleProjectSubmit(
    e: Event,
    statusDiv: HTMLElement
  ): Promise<void> {
    e.preventDefault();

    if (!this.config) return;

    this.ghapi = new GitHubAPI(
      this.config.github.pat,
      this.config.github.owner,
      this.config.github.repo
    );

    const input: Partial<AdminProjectInput> = {
      title: (document.getElementById('title') as HTMLInputElement).value,
      shortDescription: (document.getElementById('short-description') as HTMLInputElement).value,
      description: (document.getElementById('description') as HTMLTextAreaElement).value,
      completionDate: (document.getElementById('completion-date') as HTMLInputElement).value,
      location: (document.getElementById('location') as HTMLInputElement).value,
      client: (document.getElementById('client') as HTMLInputElement).value,
      heroImageFile: (document.getElementById('hero-image') as HTMLInputElement).files?.[0],
      images: Array.from((document.getElementById('images') as HTMLInputElement).files || [])
    };

    const errors = validateProjectForm(input);

    if (errors.length > 0) {
      statusDiv.textContent = errors.map((e) => e.message).join(', ');
      return;
    }

    statusDiv.textContent = 'Uploading...';

    try {
      const slug = generateSlug(input.title || '');
      const basePath = `content/projects/${slug}`;

      const hero = await this.readFileAsBase64(input.heroImageFile!);

      const images = await Promise.all(
        (input.images || []).map(async (file) => ({
          name: sanitizeFilename(file.name),
          data: await this.readFileAsBase64(file)
        }))
      );

      const changes: any[] = [];

      changes.push({
        path: `${basePath}/hero.jpg`,
        content: hero,
        encoding: 'base64'
      });

      images.forEach((img, i) => {
        changes.push({
          path: `${basePath}/image-${i + 1}.jpg`,
          content: img.data,
          encoding: 'base64'
        });
      });

      const metadata = {
        slug,
        title: input.title,
        description: input.description,
        shortDescription: input.shortDescription,
        completionDate: input.completionDate,
        location: input.location,
        client: input.client,
        heroImage: `/${basePath}/hero.jpg`,
        images: images.map((_, i) => ({
          url: `/${basePath}/image-${i + 1}.jpg`,
          alt: `Image ${i + 1}`
        }))
      };

      changes.push({
        path: `${basePath}/metadata.json`,
        content: JSON.stringify(metadata, null, 2),
        encoding: 'utf-8'
      });

      const sha = await this.ghapi.createCommit(
        `Add project: ${input.title}`,
        changes
      );

      statusDiv.innerHTML = `Project uploaded ✓ <br> Commit ${sha.slice(0, 7)}`;
    } catch (err) {
      console.error(err);
      statusDiv.textContent = 'Upload failed';
    }
  }

  private async readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

new AdminInterface();