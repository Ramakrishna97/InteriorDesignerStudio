import type { ProjectMetadata } from '../utils/types';

export function createProjectCard(project: ProjectMetadata): HTMLElement {
  const card = document.createElement('article');
  card.className = 'project-card reveal tilt-enabled';

  const hasCarousel = Array.isArray(project.images) && project.images.length > 1;

  const imageHtml = hasCarousel
    ? `<div class="carousel" tabindex="0" aria-roledescription="carousel">
        <div class="carousel__slides">
          ${project.images
            .map(
              (img, i) =>
                `<div class="carousel__slide ${i === 0 ? 'is-active' : ''}">
                  <img src="${img.url}" alt="${img.alt || project.title}" loading="lazy" decoding="async"/>
                </div>`
            )
            .join('')}
        </div>
        <button class="carousel__nav carousel__prev" aria-label="Previous slide">‹</button>
        <button class="carousel__nav carousel__next" aria-label="Next slide">›</button>
        <div class="carousel__dots">
          ${project.images
            .map(
              (_, i) =>
                `<button class="carousel__dot ${i === 0 ? 'is-active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`
            )
            .join('')}
        </div>
      </div>`
    : `<div class="project-card__image">
        <div class="project-card__image-inner" style="position:relative;">
          <img src="${project.heroImage}" alt="${project.title}" loading="lazy" decoding="async"/>
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

  /* ---------------- CAROUSEL ---------------- */

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

    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      next();
    });

    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      prev();
    });

    dots.forEach((d) =>
      d.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = Number((e.currentTarget as HTMLElement).dataset.index);
        show(idx);
      })
    );

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    carousel.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowLeft') prev();
      if (ev.key === 'ArrowRight') next();
    });

    startAutoplay();
  }

  /* ---------------- 3D TILT EFFECT ---------------- */

  const imgArea = card.querySelector(
    '.project-card__image, .carousel'
  ) as HTMLElement | null;

  if (!imgArea) return card;

  const safeImgArea = imgArea!;

  const inner = safeImgArea.querySelector(
    '.project-card__image-inner'
  ) as HTMLElement | null;

  let sawInteraction = false;

  function doMove(clientX: number, clientY: number) {
    const rect = safeImgArea.getBoundingClientRect();

    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * 12;
    const rotateX = (0.5 - py) * 8;
    const translateZ = 12;

    if (inner) {
      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
    } else {
      safeImgArea.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
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
    safeImgArea.style.transform = '';
  }

  safeImgArea.addEventListener('pointermove', onPointerMove);
  safeImgArea.addEventListener('pointerleave', onPointerLeave);
  safeImgArea.addEventListener('pointerup', onPointerLeave);
  safeImgArea.addEventListener('pointercancel', onPointerLeave);

  safeImgArea.addEventListener('mousemove', onMouseMove);
  safeImgArea.addEventListener('mouseleave', onPointerLeave);

  safeImgArea.addEventListener('touchstart', () => {}, { passive: true });

  const autoTimeout = window.setTimeout(() => {
    if (!sawInteraction) {
      card.classList.add('auto-motion');
    }
  }, 1500);

  card.addEventListener('remove', () => clearTimeout(autoTimeout));

  return card;
}