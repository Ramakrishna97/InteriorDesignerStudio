function S(e){const t=document.createElement("section");return t.className="hero",e.backgroundImage&&(t.style.backgroundImage=`url('${e.backgroundImage}')`),t.innerHTML=`
    <div class="hero__content">
      <h1 class="hero__title">${e.title}</h1>
      ${e.subtitle?`<p class="hero__subtitle">${e.subtitle}</p>`:""}
      ${e.ctaText&&e.ctaLink?`<a href="${e.ctaLink}" class="hero__cta btn btn--primary">${e.ctaText}</a>`:""}
    </div>
  `,t}function T(e){const t=document.createElement("article");t.className="project-card reveal tilt-enabled";const c=Array.isArray(e.images)&&e.images.length>1,_=c?`<div class="carousel" tabindex="0" aria-roledescription="carousel">
        <div class="carousel__slides">
          ${e.images.map((r,s)=>`<div class="carousel__slide ${s===0?"is-active":""}">
                  <img src="${r.url}" alt="${r.alt||e.title}" loading="lazy" decoding="async"/>
                </div>`).join("")}
        </div>
        <button class="carousel__nav carousel__prev" aria-label="Previous slide">‹</button>
        <button class="carousel__nav carousel__next" aria-label="Next slide">›</button>
        <div class="carousel__dots">
          ${e.images.map((r,s)=>`<button class="carousel__dot ${s===0?"is-active":""}" data-index="${s}" aria-label="Go to slide ${s+1}"></button>`).join("")}
        </div>
      </div>`:`<div class="project-card__image">
        <div class="project-card__image-inner" style="position:relative;">
          <img src="${e.heroImage}" alt="${e.title}" loading="lazy" decoding="async"/>
        </div>
      </div>`;if(t.innerHTML=`
    ${_}
    <div class="project-card__content">
      <span class="project-card__category">${e.category}</span>
      <h3 class="project-card__title">${e.title}</h3>
      <p class="project-card__description">${e.shortDescription}</p>
      <a href="./project.html?id=${e.id}" class="project-card__link">View Project →</a>
    </div>
  `,c){let $=function(n){s.forEach((m,g)=>m.classList.toggle("is-active",g===n)),y.forEach((m,g)=>m.classList.toggle("is-active",g===n)),v=n},b=function(){$((v+1)%s.length)},A=function(){$((v-1+s.length)%s.length)},E=function(){x(),d=window.setInterval(b,h)},x=function(){d!==null&&(clearInterval(d),d=null)};const r=t.querySelector(".carousel"),s=Array.from(t.querySelectorAll(".carousel__slide")),u=t.querySelector(".carousel__prev"),L=t.querySelector(".carousel__next"),y=Array.from(t.querySelectorAll(".carousel__dot"));let v=0,d=null;const h=4e3;L?.addEventListener("click",n=>{n.stopPropagation(),b()}),u?.addEventListener("click",n=>{n.stopPropagation(),A()}),y.forEach(n=>n.addEventListener("click",m=>{m.stopPropagation();const g=Number(m.currentTarget.dataset.index);$(g)})),r.addEventListener("mouseenter",x),r.addEventListener("mouseleave",E),r.addEventListener("focusin",x),r.addEventListener("focusout",E),r.addEventListener("keydown",n=>{n.key==="ArrowLeft"&&A(),n.key==="ArrowRight"&&b()}),E()}const o=t.querySelector(".project-card__image, .carousel");if(!o)return t;const a=o,i=a.querySelector(".project-card__image-inner");let l=!1;function f(r,s){const u=a.getBoundingClientRect(),L=(r-u.left)/u.width,y=(s-u.top)/u.height,v=(L-.5)*12,d=(.5-y)*8,h=12;i?i.style.transform=`rotateX(${d}deg) rotateY(${v}deg) translateZ(${h}px)`:a.style.transform=`rotateX(${d}deg) rotateY(${v}deg) translateZ(${h}px)`}function k(r){l=!0,t.classList.remove("auto-motion"),f(r.clientX,r.clientY)}function w(r){l=!0,t.classList.remove("auto-motion"),f(r.clientX,r.clientY)}function p(){i&&(i.style.transform=""),a.style.transform=""}a.addEventListener("pointermove",k),a.addEventListener("pointerleave",p),a.addEventListener("pointerup",p),a.addEventListener("pointercancel",p),a.addEventListener("mousemove",w),a.addEventListener("mouseleave",p),a.addEventListener("touchstart",()=>{},{passive:!0});const I=window.setTimeout(()=>{l||t.classList.add("auto-motion")},1500);return t.addEventListener("remove",()=>clearTimeout(I)),t}function q(e){const t=document.createElement("section");t.className="gallery";const c=document.createElement("div");c.className="gallery__container",e.length===0?c.innerHTML='<p class="gallery__empty">No projects yet.</p>':e.forEach(o=>{const a=T(o);c.appendChild(a)}),t.appendChild(c);const _=Array.from(c.querySelectorAll(".reveal"));if(_.length>0)if(typeof IntersectionObserver<"u"){const o=new IntersectionObserver(a=>{a.forEach(i=>{if(i.isIntersecting){const l=i.target,f=Number(l.dataset.index||0);setTimeout(()=>l.classList.add("is-visible"),f*80),o.unobserve(l)}})},{threshold:.18});_.forEach((a,i)=>{a.dataset.index=String(i),o.observe(a)})}else _.forEach((o,a)=>{setTimeout(()=>o.classList.add("is-visible"),a*80+120)});return t}export{q as a,S as c};
