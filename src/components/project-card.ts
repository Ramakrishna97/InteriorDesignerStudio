import type { ProjectMetadata } from '../utils/types';

export function createProjectCard(project: ProjectMetadata): HTMLElement {
  const card = document.createElement('article');
  card.className = 'project-card reveal tilt-enabled';

  // Build image area: simple img for single image, carousel for multiple
  const hasCarousel = Array.isArray(project.images) && project.images.length > 1;

  const imageHtml = hasCarousel
    ? `<div class="carousel" tabindex="0" aria-roledescription="carousel">
         <div class="carousel__slides">
           ${project.images
             .map(
               (img, i) =>
                 `<div class="carousel__slide ${i === 0 ? 'is-active' : ''}"><img src="${img.url}" alt="${
                   img.alt || project.title
                 }" loading="lazy" decoding="async" /></div>`
             )
             .join('')}
         </div>
         <button class="carousel__nav carousel__prev" aria-label="Previous slide">‹</button>
         <button class="carousel__nav carousel__next" aria-label="Next slide">›</button>
         <div class="carousel__dots">
           ${project.images
             .map((_, i) => `<button class="carousel__dot ${i === 0 ? 'is-active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`)
             .join('')}
         </div>
       </div>`
    : `<div class="project-card__image">
         <div class="project-card__image-inner" style="position:relative;">
           <img src="${project.heroImage}" alt="${project.title}" loading="lazy" decoding="async" />
         </div>
       </div>`;

  card.innerHTML = `
    ${imageHtml}
    <div class="project-card__content">
      <span class="project-card__category">${project.category}</span>
      <h3 class="project-card__title">${project.title}</h3>
      <p class="project-card__description">${project.shortDescription}</p>
      <a href="/project.html?id=${project.id}" class="project-card__link">View Project →</a>
    </div>
  `;

  // Carousel behavior
  if (hasCarousel) {
    const carousel = card.querySelector('.carousel') as HTMLElement;
    const slides = Array.from(card.querySelectorAll<HTMLDivElement>('.carousel__slide'));
    const prevBtn = card.querySelector('.carousel__prev') as HTMLButtonElement | null;
    const nextBtn = card.querySelector('.carousel__next') as HTMLButtonElement | null;
    const dots = Array.from(card.querySelectorAll<HTMLButtonElement>('.carousel__dot'));

    let current = 0;
    let intervalId: number | null = null;
    const autoplayDelay = 4000;

    function show(index: number) {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
      current = index;
    }

    function next() {
      show((current + 1) % slides.length);
    }

    function prev() {
      show((current - 1 + slides.length) % slides.length);
    }

    function startAutoplay() {
      stopAutoplay();
      intervalId = window.setInterval(next, autoplayDelay);
    }

    function stopAutoplay() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    // Attach listeners
    nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); next(); });
    prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
    dots.forEach((d) => d.addEventListener('click', (e) => { e.stopPropagation(); const idx = Number((e.currentTarget as HTMLElement).dataset.index); show(idx); }));

    // Pause on hover / focus for accessibility
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    // Keyboard support
    carousel.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowLeft') prev();
      if (ev.key === 'ArrowRight') next();
    });

    // Start autoplay
    startAutoplay();
  }

  // 3D tilt / parallax interaction (works for single-image and carousel)
  const imgArea = card.querySelector('.project-card__image, .carousel') as HTMLElement | null;
  if (imgArea) {
    const inner = imgArea.querySelector('.project-card__image-inner') as HTMLElement | null;
    let sawInteraction = false;

    function doMove(clientX: number, clientY: number) {
      const rect = imgArea.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 12; // degrees
      const rotateX = (0.5 - py) * 8; // degrees
      const translateZ = 12;
      if (inner) {
        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
      } else {
        imgArea.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
      }
    }

    function onPointerMove(e: PointerEvent) {
      sawInteraction = true;
      card.classList.remove('auto-motion');
      doMove(e.clientX, e.clientY);
    }

    function onMouseMove(e: MouseEvent) {
      sawInteraction = true;
      card.classList.remove('auto-motion');
      doMove(e.clientX, e.clientY);
    }

    function onPointerLeave() {
      if (inner) inner.style.transform = '';
      imgArea.style.transform = '';
    }

    // Pointer / mouse events for compatibility
    imgArea.addEventListener('pointermove', onPointerMove);
    imgArea.addEventListener('pointerleave', onPointerLeave);
    imgArea.addEventListener('pointerup', onPointerLeave);
    imgArea.addEventListener('pointercancel', onPointerLeave);
    imgArea.addEventListener('mousemove', onMouseMove);
    imgArea.addEventListener('mouseleave', onPointerLeave);
    imgArea.addEventListener('touchstart', () => { /* noop to enable pointer events on iOS */ }, { passive: true });

    // If no interaction occurs shortly after mount, start subtle auto-motion to show the effect
    const autoTimeout = window.setTimeout(() => {
      if (!sawInteraction) {
        card.classList.add('auto-motion');
      }
    }, 1500);
    // Clear timeout when card is removed (best-effort)
    card.addEventListener('remove', () => clearTimeout(autoTimeout));
  }

  return card;
}
