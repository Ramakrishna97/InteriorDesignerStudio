import { GitHubAPI } from '../utils/github-api';
import { validateProjectForm, generateSlug, sanitizeFilename } from '../utils/validation';
class AdminInterface {
    constructor() {
        Object.defineProperty(this, "ghapi", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.loadConfig();
    }
    async loadConfig() {
        try {
            const response = await fetch('/admin-config.json');
            if (!response.ok) {
                throw new Error('Failed to load admin configuration');
            }
            this.config = await response.json();
            this.renderLoginForm();
        }
        catch (error) {
            const app = document.getElementById('app');
            if (app) {
                app.innerHTML = `
          <div class="admin-container">
            <div style="color: red; padding: 20px; text-align: center;">
              <h2>Configuration Error</h2>
              <p>Could not load admin-config.json</p>
              <p style="font-size: 0.9rem; margin-top: 10px;">
                Make sure admin-config.json exists in the project root with valid credentials.
              </p>
            </div>
          </div>
        `;
            }
            console.error('Config load error:', error);
        }
    }
    renderLoginForm() {
        const app = document.getElementById('app');
        if (!app)
            return;
        app.innerHTML = `
      <div class="admin-container">
        <header class="admin-header">
          <h1>Interior Design Admin</h1>
          <p class="admin-subtitle">Project Manager Login</p>
        </header>

        <form id="login-form" class="form-section" style="max-width: 400px; margin: 0 auto;">
          <h2>Login</h2>
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              autofocus
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" class="btn btn--primary" style="width: 100%;">Login</button>
        </form>

        <div id="auth-status"></div>
      </div>
    `;
        const form = document.getElementById('login-form');
        const statusDiv = document.getElementById('auth-status');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (this.validateCredentials(username, password)) {
                statusDiv.className = 'status status--success';
                statusDiv.textContent = 'Login successful! Loading...';
                setTimeout(() => this.renderProjectForm(), 500);
            }
            else {
                statusDiv.className = 'status status--error';
                statusDiv.textContent = 'Invalid username or password';
            }
        });
    }
    validateCredentials(username, password) {
        if (!this.config)
            return false;
        return this.config.admins.some((admin) => admin.username === username && admin.password === password);
    }
    renderProjectForm() {
        const app = document.getElementById('app');
        if (!app || !this.config)
            return;
        app.innerHTML = `
      <div class="admin-container">
        <header class="admin-header">
          <h1>New Project</h1>
          <button id="logout-btn" class="btn btn--secondary">Logout</button>
        </header>

        <form id="project-form" class="form-section">
          <div class="form-group">
            <label for="title">Project Title *</label>
            <input type="text" id="title" name="title" required />
          </div>

          <div class="form-group">
            <label for="short-description">Short Description *</label>
            <input type="text" id="short-description" name="short-description" required />
          </div>

          <div class="form-group">
            <label for="description">Full Description *</label>
            <textarea id="description" name="description" rows="4" required></textarea>
          </div>

          <div class="form-group">
            <label for="category">Category *</label>
            <select id="category" name="category" required>
              <option value="">Select a category</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Retail">Retail</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="completion-date">Completion Date *</label>
            <input type="date" id="completion-date" name="completion-date" required />
          </div>

          <div class="form-group">
            <label for="location">Location</label>
            <input type="text" id="location" name="location" />
          </div>

          <div class="form-group">
            <label for="client">Client Name</label>
            <input type="text" id="client" name="client" />
          </div>

          <div class="form-group">
            <label for="featured">
              <input type="checkbox" id="featured" name="featured" />
              Featured Project
            </label>
          </div>

          <div class="form-group">
            <label for="hero-image">Hero Image (first image) *</label>
            <input type="file" id="hero-image" name="hero-image" accept="image/*" required />
          </div>

          <div class="form-group">
            <label for="images">Additional Images *</label>
            <input type="file" id="images" name="images" accept="image/*" multiple required />
            <small>All images combined must be under 25MB</small>
          </div>

          <div id="form-errors" class="form-errors"></div>
          <button type="submit" class="btn btn--primary">Upload Project</button>
        </form>

        <div id="submit-status"></div>
      </div>
    `;
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn?.addEventListener('click', () => {
            this.ghapi = null;
            this.renderLoginForm();
        });
        const form = document.getElementById('project-form');
        const statusDiv = document.getElementById('submit-status');
        const errorsDiv = document.getElementById('form-errors');
        form?.addEventListener('submit', (e) => this.handleProjectSubmit(e, statusDiv, errorsDiv));
    }
    async handleProjectSubmit(e, statusDiv, errorsDiv) {
        e.preventDefault();
        if (!this.config) {
            statusDiv.textContent = 'Error: Config not loaded';
            statusDiv.className = 'status status--error';
            return;
        }
        // Initialize GitHub API with config credentials
        this.ghapi = new GitHubAPI(this.config.github.pat, this.config.github.owner, this.config.github.repo);
        const input = {
            title: document.getElementById('title').value,
            shortDescription: document.getElementById('short-description').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            completionDate: document.getElementById('completion-date').value,
            location: document.getElementById('location').value,
            client: document.getElementById('client').value,
            featured: document.getElementById('featured').checked,
            heroImageFile: document.getElementById('hero-image').files?.[0],
            images: Array.from(document.getElementById('images').files || []),
        };
        // Validate
        const errors = validateProjectForm(input);
        if (errors.length > 0) {
            errorsDiv.innerHTML = errors.map((e) => `<p>• ${e.field}: ${e.message}</p>`).join('');
            errorsDiv.className = 'form-errors form-errors--visible';
            statusDiv.textContent = '';
            return;
        }
        errorsDiv.innerHTML = '';
        statusDiv.className = 'status status--loading';
        statusDiv.textContent = 'Uploading project...';
        try {
            const slug = generateSlug(input.title || '');
            const timestamp = new Date().toISOString().split('T')[0];
            const projectId = `${timestamp}-${slug}`;
            const basePath = `content/projects/${slug}`;
            // Read files
            const heroImageBlob = await this.readFileAsBase64(input.heroImageFile);
            const imageBlobPromises = (input.images || []).map((file) => this.readFileAsBase64(file).then((blob) => ({ filename: sanitizeFilename(file.name), blob })));
            const imageBlobs = await Promise.all(imageBlobPromises);
            // Prepare commit changes
            const changes = [];
            // Add hero image
            changes.push({
                path: `${basePath}/hero.jpg`,
                content: heroImageBlob,
                encoding: 'base64',
            });
            // Add all images
            imageBlobs.forEach(({ blob }, index) => {
                changes.push({
                    path: `${basePath}/image-${index + 1}.jpg`,
                    content: blob,
                    encoding: 'base64',
                });
            });
            // Create metadata JSON
            const metadata = {
                id: projectId,
                slug,
                title: input.title,
                description: input.description,
                shortDescription: input.shortDescription,
                category: input.category,
                completionDate: input.completionDate,
                location: input.location || '',
                client: input.client || '',
                featured: input.featured || false,
                images: imageBlobs.map((_, index) => ({
                    url: `/${basePath}/image-${index + 1}.jpg`,
                    alt: `Project image ${index + 1}`,
                })),
                heroImage: `/${basePath}/hero.jpg`,
            };
            changes.push({
                path: `${basePath}/metadata.json`,
                content: JSON.stringify(metadata, null, 2),
                encoding: 'utf-8',
            });
            // Commit to GitHub
            const commitSha = await this.ghapi.createCommit(`Add project: ${input.title}`, changes);
            statusDiv.className = 'status status--success';
            statusDiv.innerHTML = `
        <p>✓ Project uploaded successfully!</p>
        <p><small>Commit: ${commitSha.slice(0, 7)}</small></p>
        <button id="new-project-btn" class="btn btn--secondary">Add Another Project</button>
      `;
            document.getElementById('new-project-btn')?.addEventListener('click', () => this.renderProjectForm());
        }
        catch (error) {
            statusDiv.className = 'status status--error';
            statusDiv.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
            console.error('Upload error:', error);
        }
    }
    async readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}
// Initialize admin interface
new AdminInterface();
//# sourceMappingURL=admin.js.map