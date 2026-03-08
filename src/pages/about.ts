import { createNav } from '../components/nav';
import { createFooter } from '../components/footer';

function render(): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = '';
  app.appendChild(createNav());

  const aboutSection = document.createElement('section');
  aboutSection.className = 'about-section';

  const container = document.createElement('div');
  container.className = 'content-container';

  container.innerHTML = `
    <h1>About Me</h1>
    <div class="about-content">
      <div class="about-text">
        <h2>Your Interior Designer</h2>
        <p>
          With over 15 years of experience in interior design, I specialize in creating spaces
          that are both beautiful and functional. My approach combines contemporary design principles
          with timeless elegance.
        </p>
        <p>
          I work closely with clients to understand their vision, lifestyle, and preferences,
          ensuring that each project reflects their unique personality and needs.
        </p>
        <h3>Specializations</h3>
        <ul role="list">
          <li>Residential Design</li>
          <li>Commercial Spaces</li>
          <li>Color Consultation</li>
          <li>Space Planning</li>
          <li>Furniture Selection</li>
          <li>Lighting Design</li>
        </ul>
      </div>
      <div class="about-contact-info">
        <h3>Get in Touch</h3>
        <p>Ready to transform your space? Let's work together.</p>
        <p>
          <strong>Email:</strong> <a href="mailto:info@interiordesigner.com">info@interiordesigner.com</a>
        </p>
        <p>
          <strong>Phone:</strong> <a href="tel:+1234567890">(123) 456-7890</a>
        </p>
        <p>
          <strong>Location:</strong> New York, NY
        </p>
      </div>
    </div>
  `;

  aboutSection.appendChild(container);
  app.appendChild(aboutSection);
  app.appendChild(createFooter());
}

render();
