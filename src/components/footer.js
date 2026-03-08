export function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    const currentYear = new Date().getFullYear();
    footer.innerHTML = `
    <div class="footer__container">
      <div class="footer__content">
        <div class="footer__section">
          <h3>About</h3>
          <p>Professional interior design services for residential and commercial spaces.</p>
        </div>
        <div class="footer__section">
          <h3>Quick Links</h3>
          <ul role="list">
            <li><a href="/">Home</a></li>
            <li><a href="/portfolio.html">Portfolio</a></li>
            <li><a href="/about.html">About</a></li>
            <li><a href="/contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer__section">
          <h3>Contact</h3>
          <p>Email: <a href="mailto:info@interiordesigner.com">info@interiordesigner.com</a></p>
          <p>Phone: <a href="tel:+1234567890">(123) 456-7890</a></p>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; ${currentYear} Interior Designer. All rights reserved.</p>
      </div>
    </div>
  `;
    return footer;
}
//# sourceMappingURL=footer.js.map