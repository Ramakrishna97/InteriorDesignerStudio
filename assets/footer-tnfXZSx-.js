function n(){const e=document.createElement("nav");e.className="nav",e.setAttribute("role","navigation"),e.setAttribute("aria-label","Main navigation"),e.innerHTML=`
    <div class="nav__container">
      <div class="nav__logo">
        <a href="/" aria-label="Interior Designer Home">
          <h1>Interior Design</h1>
        </a>
      </div>
      <button class="nav__toggle" aria-label="Toggle navigation menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul class="nav__menu" role="menu">
        <li role="menuitem"><a href="/InteriorDesignerStudio/">Home</a></li>
        <li role="menuitem"><a href="/InteriorDesignerStudio/portfolio.html">Portfolio</a></li>
        <li role="menuitem"><a href="/InteriorDesignerStudio/about.html">About</a></li>
        <li role="menuitem"><a href="/InteriorDesignerStudio/contact.html">Contact</a></li>
      </ul>
    </div>
  `;const t=e.querySelector(".nav__toggle"),i=e.querySelector(".nav__menu");return t&&i&&(t.addEventListener("click",()=>{const o=t.getAttribute("aria-expanded")==="true";t.setAttribute("aria-expanded",(!o).toString()),i.classList.toggle("nav__menu--open")}),i.querySelectorAll("a").forEach(o=>{o.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),i.classList.remove("nav__menu--open")})})),e}function r(){const e=document.createElement("footer");e.className="footer";const t=new Date().getFullYear();return e.innerHTML=`
    <div class="footer__container">
      <div class="footer__content">
        <div class="footer__section">
          <h3>About</h3>
          <p>Professional interior design services for residential and commercial spaces.</p>
        </div>
        <div class="footer__section">
          <h3>Quick Links</h3>
          <ul role="list">
            <li><a href="/InteriorDesignerStudio/">Home</a></li>
            <li><a href="/InteriorDesignerStudio/portfolio.html">Portfolio</a></li>
            <li><a href="/InteriorDesignerStudio/about.html">About</a></li>
            <li><a href="/InteriorDesignerStudio/contact.html">Contact</a></li>
            <li><a href="/InteriorDesignerStudio/admin.html">Login As Admin</a></li>
          </ul>
        </div>
        <div class="footer__section">
          <h3>Contact</h3>
          <p>Email: <a href="mailto:info@interiordesigner.com">info@interiordesigner.com</a></p>
          <p>Phone: <a href="tel:+1234567890">(123) 456-7890</a></p>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; ${t} Interior Designer. All rights reserved.</p>
      </div>
    </div>
  `,e}export{r as a,n as c};
