# Interior Designer Portfolio Website

A modern, responsive portfolio website for interior designers built with **TypeScript**, **Vite**, and plain **CSS**. Features a client-side GitHub API admin panel for managing projects without a backend server.

## 🎯 Features

- **Responsive Design**: Mobile-first, works on all devices
- **Accessible**: WCAG-compliant markup with semantic HTML, ARIA labels, and keyboard navigation
- **GitHub API Admin**: Upload projects directly to the repository via Personal Access Token
- **Client-Side Built**: No backend server required—all TypeScript compiles to JavaScript
- **Lightweight**: Minimal dependencies, fast builds with Vite
- **Image Optimization**: Lazy loading and modern image practices
- **Multiple Pages**: Home, Portfolio, Project Detail, About, Contact
- **Lightbox Gallery**: Interactive image carousel with keyboard navigation
- **Type-Safe**: Full TypeScript support with strict mode
- **SEO-Friendly**: Semantic markup and meta tags

## 📋 Project Structure

```
.
├── index.html                      # Home page
├── portfolio.html                  # Portfolio listing
├── project.html                    # Project detail
├── about.html                      # About page
├── contact.html                    # Contact form
├── admin.html                      # Admin panel
├── src/
│   ├── main.ts                    # Home page entry
│   ├── components/                # Reusable components
│   │   ├── nav.ts                 # Navigation
│   │   ├── footer.ts              # Footer
│   │   ├── hero.ts                # Hero section
│   │   ├── gallery.ts             # Project gallery
│   │   ├── project-card.ts        # Project card
│   │   └── lightbox.ts            # Image lightbox
│   ├── pages/                     # Page-specific code
│   │   ├── portfolio.ts           # Portfolio page
│   │   ├── project-detail.ts      # Project detail
│   │   ├── about.ts               # About page
│   │   └── contact.ts             # Contact page
│   ├── admin/                     # Admin interface
│   │   └── admin.ts               # Admin panel logic
│   ├── utils/                     # Utilities
│   │   ├── types.ts               # TypeScript interfaces
│   │   ├── validation.ts          # Form validation
│   │   └── github-api.ts          # GitHub API client
│   └── styles/                    # CSS files
│       ├── global.css             # Global styles
│       └── admin.css              # Admin page styles
├── content/                       # Project content (stored in repo)
│   └── projects/
│       └── {slug}/
│           ├── metadata.json      # Project metadata
│           ├── hero.jpg           # Hero image
│           └── image-*.jpg        # Project images
├── .github/
│   └── workflows/
│       └── build.yml              # GitHub Actions build workflow
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
├── .eslintrc.json                 # ESLint rules
├── .prettierrc.json               # Prettier format rules
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm 9+
- Git (for version control)
- A GitHub account

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/interior-designer.git
   cd interior-designer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The site will open at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```
   Output goes to `dist/` directory

5. **Preview production build**
   ```bash
   npm run preview
   ```

6. **Lint code**
   ```bash
   npm run lint
   ```

7. **Format code**
   ```bash
   npm run format
   ```

## 🔐 Admin Panel & GitHub API Integration

### One-Time Developer Setup

1. **Create a GitHub Personal Access Token (PAT)**
   - Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
   - Click **Generate new token (classic)**
   - Give it a descriptive name: `interior-designer-admin`
   - Select scopes:
     - ✅ `repo` (full control of repositories)
     - ✅ `contents` (read and write access to repo contents)
   - Copy the token

2. **Configure Admin Credentials**
   - Open `admin-config.json` in the project root
   - Update the GitHub section with your credentials:
     ```json
     {
       "admins": [
         { "username": "admin", "password": "admin123" }
       ],
       "github": {
         "pat": "ghp_YOUR_TOKEN_HERE",
         "owner": "your-github-username",
         "repo": "interior-designer"
       }
     }
     ```
   - Change the admin username/password to something secure
   - **WARNING**: `admin-config.json` is in `.gitignore` and won't be committed—**never commit this file with real credentials**
   - If deploying to production, set credentials via environment variables (see deployment notes)

### Admin Usage (Simple Login)

The admin doesn't need to know any GitHub details. They simply:

1. **Navigate to admin page**
   - Visit `/admin.html` on your site

2. **Login with username/password**
   - Enter the credentials you configured above
   - No GitHub token, username, or repo name needed

3. **Upload a project**
   - Fill in project title, description, images
   - Click Submit
   - Project automatically uploads to GitHub repository

### How It Works (Behind the Scenes)

- ✅ GitHub credentials stored securely in `admin-config.json` (not committed)
- ✅ Admin only needs simple username/password
- ✅ All GitHub API communication is client-side
- ✅ Images and metadata automatically committed to `/content/projects/{slug}/`

## 📝 Adding & Editing Projects

### Adding a Project Manually

You can also add projects by committing to the repo:

1. Create a folder: `content/projects/{slug}/`
2. Add files:
   ```
   metadata.json    # JSON metadata (see example below)
   hero.jpg         # Main image
   image-1.jpg      # Gallery image
   image-2.jpg      # Gallery image (optional)
   ```

3. Commit and push:
   ```bash
   git add content/projects/{slug}/
   git commit -m "Add project: {title}"
   git push origin main
   ```

### Metadata Format

```json
{
  "id": "project-id",
  "slug": "project-slug",
  "title": "Project Title",
  "description": "Long description of the project.",
  "shortDescription": "Brief one-line description.",
  "category": "Residential",
  "images": [
    {
      "url": "/content/projects/project-slug/image-1.jpg",
      "alt": "Alt text for accessibility",
      "caption": "Optional caption"
    }
  ],
  "heroImage": "/content/projects/project-slug/hero.jpg",
  "completionDate": "2024-01-15",
  "location": "Location details",
  "client": "Client name",
  "featured": true,
  "details": "Additional details about the project"
}
```

## 🛠 Build & Deployment

### GitHub Pages Deployment

This project includes a GitHub Actions workflow that automatically builds and deploys to GitHub Pages on every push to `main`.

1. **Enable GitHub Pages**
   - Go to repository **Settings → Pages**
   - Set source to **GitHub Actions** or **main branch /docs**
   - Save

2. **Automatic Deployment**
   - Every push to `main` triggers the build workflow
   - Runs `npm install && npm run build`
   - Deploys to `https://yourusername.github.io/interior-designer`

3. **Monitor Deployments**
   - Check the **Actions** tab in your repository
   - Click on the workflow run to see logs

### Deploy to Other Hosts

The `dist/` folder created by `npm run build` can be deployed to:
- **Vercel**: `vercel deploy dist/`
- **Netlify**: Drag and drop `dist/` folder
- **AWS S3 + CloudFront**: Upload `dist/` contents to S3
- **Traditional Hosting**: Upload `dist/` via FTP or SFTP
- **Cloudflare Pages**: Connect GitHub repo (auto-deploys)

### Custom Domain

1. Add `CNAME` file to `dist/` with your domain:
   ```
   echo "yourdomain.com" > public/CNAME
   ```

2. Update DNS records to point to GitHub Pages
3. Configure custom domain in repository settings

### Deployment Security Note

The `admin-config.json` file contains your GitHub PAT and admin credentials. It's in `.gitignore` so it won't be committed, but:

**For GitHub Pages Deployment:**
- The config file is **local-only** and won't be deployed
- You need to either:
  1. **Keep the admin panel local** - don't deploy `/admin.html` to live site
  2. **Use environment variables** - set them via GitHub Actions/CI (more complex)
  3. **Use a different hosting provider** that supports environment files

**Simplest approach:** Keep admin.html and admin functionality local, deploy only the portfolio site to GitHub Pages.

## 🎨 Customization

### Change Colors & Branding

Edit `src/styles/global.css` CSS variables in `:root`:

```css
:root {
  --color-primary: #2c3e50;      /* Nav, footer background */
  --color-secondary: #e74c3c;    /* Buttons, accents */
  --color-accent: #ecf0f1;       /* Light backgrounds */
  --color-text: #333;            /* Main text */
  /* ... more variables ... */
}
```

### Add New Pages

1. Create `newpage.html` in root
2. Create `src/pages/newpage.ts` with:
   ```typescript
   import { createNav } from '../components/nav';
   import { createFooter } from '../components/footer';

   function render(): void {
     const app = document.getElementById('app');
     if (!app) return;
     
     app.innerHTML = '';
     app.appendChild(createNav());
     // Your page content here
     app.appendChild(createFooter());
   }

   render();
   ```
3. Update navigation in `src/components/nav.ts`

### Disable Lightbox

Remove the lightbox code from `src/pages/project-detail.ts` if not needed.

### Change Typography

Edit font imports and sizes in `src/styles/global.css`:

```css
--font-primary: 'Your Font', sans-serif;
```

## 🧪 Code Quality

### Linting

```bash
npm run lint
```

Checks TypeScript and code style per `.eslintrc.json`.

### Formatting

```bash
npm run format
```

Auto-formats code per `.prettierrc.json`.

### Type Checking

```bash
npx tsc --noEmit
```

Checks TypeScript for errors.

## 📦 Dependencies

### Core
- **vite**: Fast build tool for modern web apps
- **typescript**: Static type checking

### Dev Tools
- **eslint**: Code quality linting
- **@typescript-eslint/parser**: TypeScript linting
- **prettier**: Code formatter

All dependencies listed in `package.json`.

## 📄 License

MIT License - feel free to use this project as a template.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

## ❓ FAQ

**Q: Is my GitHub token safe?**
A: Your token is stored **only in `admin-config.json`** which is **not committed to git** (it's in `.gitignore`). The file is local-only. For production deployments, use environment variables instead (see Deployment).

**Q: Does the admin need developer knowledge?**
A: No! Admins only need a username/password. All GitHub details are configured once by you and hidden from the admin interface.

**Q: Can I have multiple admin users?**
A: Yes! Edit `admin-config.json` to add more admins:
```json
"admins": [
  { "username": "admin1", "password": "pass1" },
  { "username": "admin2", "password": "pass2" }
]
```

**Q: What if I lose my GitHub token?**
A: Generate a new one on GitHub and update `admin-config.json`. The old token can be revoked.

**Q: Can I use this without GitHub?**
A: Not for the admin panel. The admin specifically uses GitHub REST API. You can manually add projects by editing JSON files in `content/projects/`.

**Q: What if I need a backend database?**
A: Consider alternatives like Supabase, Firebase, or a traditional Node.js backend. This design prioritizes simplicity and no-server deployment.

**Q: How do I backup projects?**
A: All projects are stored in your Git repository. Regular `git push` serves as backup. GitHub is itself a backup service.

**Q: Can I host this on GitHub Pages for free?**
A: Yes! The included GitHub Actions workflow automatically builds and deploys to GitHub Pages (`yourusername.github.io/repo-name`).

## 🐛 Troubleshooting

### Projects not appearing
- Check `content/projects/*/metadata.json` exists and is valid JSON
- Ensure image paths in metadata are correct
- Run `npm run build` and check `dist/` folder

### Images not loading
- Images must be in `/content/projects/{slug}/`
- Check file permissions in Git
- Verify paths in `metadata.json` start with `/`

### Admin panel token errors
- Ensure token has `repo` and `contents:write` scopes
- Check token hasn't been revoked in GitHub settings
- Verify you own the repository or have write access

### Deployment issues
- Check GitHub Actions workflow status in **Actions** tab
- Verify `.github/workflows/build.yml` is present
- Enable GitHub Pages in repository settings
- Check build logs for compile errors

## 📞 Support

For issues with GitHub API:
- [GitHub REST API Docs](https://docs.github.com/en/rest)
- [GitHub Personal Access Tokens](https://github.com/settings/tokens)

For issues with TypeScript:
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

For issues with Vite:
- [Vite Documentation](https://vitejs.dev/)

---

**Built with ❤️ for interior designers. Keep creating beautiful spaces!**
