(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function i(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(e){if(e.ep)return;e.ep=!0;const o=i(e);fetch(e.href,o)}})();function s(){const t=document.createElement("nav");t.className="nav",t.setAttribute("role","navigation"),t.setAttribute("aria-label","Main navigation"),t.innerHTML=`
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
        <li role="menuitem"><a href="/">Home</a></li>
        <li role="menuitem"><a href="/InteriorDesignerStudio/portfolio.html">Portfolio</a></li>
        <li role="menuitem"><a href="/InteriorDesignerStudio/about.html">About</a></li>
        <li role="menuitem"><a href="/InteriorDesignerStudio/contact.html">Contact</a></li>
      </ul>
    </div>
  `;const r=t.querySelector(".nav__toggle"),i=t.querySelector(".nav__menu");return r&&i&&(r.addEventListener("click",()=>{const n=r.getAttribute("aria-expanded")==="true";r.setAttribute("aria-expanded",(!n).toString()),i.classList.toggle("nav__menu--open")}),i.querySelectorAll("a").forEach(n=>{n.addEventListener("click",()=>{r.setAttribute("aria-expanded","false"),i.classList.remove("nav__menu--open")})})),t}function l(){const t=document.createElement("footer");t.className="footer";const r=new Date().getFullYear();return t.innerHTML=`
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
        <p>&copy; ${r} Interior Designer. All rights reserved.</p>
      </div>
    </div>
  `,t}export{l as a,s as c};
