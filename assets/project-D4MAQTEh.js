import{c as v,a as _}from"./global-rCE_2aqg.js";function b(i){const e=document.createElement("div");e.className="lightbox",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label","Image viewer");let t=0;e.innerHTML=`
    <div class="lightbox__overlay"></div>
    <div class="lightbox__content">
      <button class="lightbox__close" aria-label="Close lightbox">✕</button>
      <button class="lightbox__prev" aria-label="Previous image">❮</button>
      <div class="lightbox__image-wrapper">
        <img class="lightbox__image" src="" alt="" />
        <p class="lightbox__caption"></p>
      </div>
      <button class="lightbox__next" aria-label="Next image">❯</button>
      <div class="lightbox__counter">
        <span class="lightbox__current">1</span> / <span class="lightbox__total">${i.length}</span>
      </div>
      <div class="lightbox__thumbnails"></div>
    </div>
  `;const o=e.querySelector(".lightbox__image"),c=e.querySelector(".lightbox__caption"),d=e.querySelector(".lightbox__current"),l=e.querySelector(".lightbox__thumbnails");i.forEach((a,p)=>{const s=document.createElement("img");s.className="lightbox__thumbnail",p===0&&s.classList.add("lightbox__thumbnail--active"),s.src=a.url,s.alt=`Thumbnail ${p+1}`,s.addEventListener("click",()=>r(p)),l.appendChild(s)});function g(){i[t]&&(o.src=i[t].url,o.alt=i[t].alt,c.textContent=i[t].caption||"",d.textContent=(t+1).toString(),l.querySelectorAll(".lightbox__thumbnail").forEach((a,p)=>{a.classList.toggle("lightbox__thumbnail--active",p===t)}))}function r(a){t=(a+i.length)%i.length,g()}function n(){r(t+1)}function u(){r(t-1)}function h(){e.classList.add("lightbox--hidden"),e.setAttribute("aria-hidden","true")}return e.querySelector(".lightbox__next")?.addEventListener("click",n),e.querySelector(".lightbox__prev")?.addEventListener("click",u),e.querySelector(".lightbox__close")?.addEventListener("click",h),e.querySelector(".lightbox__overlay")?.addEventListener("click",h),document.addEventListener("keydown",a=>{e.classList.contains("lightbox--hidden")||(a.key==="ArrowRight"&&n(),a.key==="ArrowLeft"&&u(),a.key==="Escape"&&h())}),g(),e.classList.add("lightbox--hidden"),e.setAttribute("aria-hidden","true"),e.show=()=>{e.classList.remove("lightbox--hidden"),e.setAttribute("aria-hidden","false")},e.hide=h,e}function x(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function m(i="No image",e=1200,t=800){const o=x(i),c=`<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='${e}' height='${t}' viewBox='0 0 ${e} ${t}'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='#4ADEDE'/><stop offset='0.5' stop-color='#7C5CFF'/><stop offset='1' stop-color='#FF6BA7'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial' font-size='36' fill='rgba(255,255,255,0.95)'>${o}</text></svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(c)}`}const f={"modern-living":{id:"modern-living",slug:"modern-living",title:"Modern Living Room Redesign",description:"A complete transformation of a dated living space into a contemporary oasis.",shortDescription:"Contemporary living room with clean lines and open space.",category:"Residential",heroImage:m("Modern Living Room Redesign"),images:[{url:m("Modern Living — Overview"),alt:"Modern living room 1",caption:"Overview"},{url:m("Modern Living — Detail"),alt:"Modern living room 2",caption:"Detail view"}],completionDate:"2024-01-15",location:"Downtown Lofts",client:"Jane & John Smith",featured:!0,details:"This project involved a complete redesign with new furniture selection, updated lighting fixtures, and a modern color palette."}};function y(){return new URLSearchParams(window.location.search).get("id")||"modern-living"}function L(){const i=document.getElementById("app");if(!i)return;const e=y(),t=f[e];if(!t){i.innerHTML="<p>Project not found.</p>";return}i.innerHTML="",i.appendChild(v());const o=document.createElement("article");o.className="project-detail";const c=document.createElement("header");c.className="project-detail__header",c.innerHTML=`
    <div class="project-detail__hero">
      <img src="${t.heroImage}" alt="${t.title}" class="project-detail__image" />
    </div>
    <div class="project-detail__meta">
      <h1>${t.title}</h1>
      <p class="project-detail__category">${t.category}</p>
      <div class="project-detail__info">
        <div><strong>Location:</strong> ${t.location||"N/A"}</div>
        <div><strong>Client:</strong> ${t.client||"N/A"}</div>
        <div><strong>Completed:</strong> ${t.completionDate}</div>
      </div>
    </div>
  `,o.appendChild(c);const d=document.createElement("div");d.className="project-detail__content",d.innerHTML=`
    <p>${t.description}</p>
    ${t.details?`<p>${t.details}</p>`:""}
  `,o.appendChild(d);const l=document.createElement("div");l.className="project-detail__gallery",t.images.forEach(r=>{const n=document.createElement("img");n.src=r.url,n.alt=r.alt,n.loading="lazy",n.decoding="async",n.style.cursor="pointer",l.appendChild(n)});const g=b(t.images);l.appendChild(g),l.querySelectorAll("img:not(.lightbox__image)").forEach(r=>{r.addEventListener("click",()=>{g.show()})}),o.appendChild(l),i.appendChild(o),i.appendChild(_())}L();
