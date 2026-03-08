import { createNav } from '../components/nav';
import { createFooter } from '../components/footer';
function render() {
    const app = document.getElementById('app');
    if (!app)
        return;
    app.innerHTML = '';
    app.appendChild(createNav());
    const contactSection = document.createElement('section');
    contactSection.className = 'contact-section';
    const container = document.createElement('div');
    container.className = 'content-container';
    container.innerHTML = `
    <h1>Contact</h1>
    <div class="contact-content">
      <div class="contact-form-container">
        <h2>Get in Touch</h2>
        <form id="contact-form" class="contact-form" novalidate>
          <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone" />
          </div>
          <div class="form-group">
            <label for="subject">Subject *</label>
            <input type="text" id="subject" name="subject" required />
          </div>
          <div class="form-group">
            <label for="message">Message *</label>
            <textarea id="message" name="message" rows="6" required></textarea>
          </div>
          <button type="submit" class="btn btn--primary">Send Message</button>
        </form>
        <div id="form-status"></div>
      </div>
      <div class="contact-info">
        <h2>Contact Information</h2>
        <div class="info-block">
          <h3>Email</h3>
          <p><a href="mailto:info@interiordesigner.com">info@interiordesigner.com</a></p>
        </div>
        <div class="info-block">
          <h3>Phone</h3>
          <p><a href="tel:+1234567890">(123) 456-7890</a></p>
        </div>
        <div class="info-block">
          <h3>Office Location</h3>
          <p>
            Interior Design Studio<br />
            123 Design Street<br />
            New York, NY 10001<br />
            USA
          </p>
        </div>
        <div class="info-block">
          <h3>Hours</h3>
          <p>
            Monday - Friday: 9:00 AM - 6:00 PM<br />
            Saturday: 10:00 AM - 4:00 PM<br />
            Sunday: Closed
          </p>
        </div>
      </div>
    </div>
  `;
    container.appendChild(container);
    app.appendChild(contactSection);
    app.appendChild(createFooter());
    // Form handling
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            statusDiv.textContent = 'Thank you! Your message has been received.';
            statusDiv.className = 'form-status form-status--success';
            form.reset();
        });
    }
}
render();
//# sourceMappingURL=contact.js.map