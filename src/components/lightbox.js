export function createLightbox(images) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image viewer');
    let currentIndex = 0;
    lightbox.innerHTML = `
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
        <span class="lightbox__current">1</span> / <span class="lightbox__total">${images.length}</span>
      </div>
      <div class="lightbox__thumbnails"></div>
    </div>
  `;
    const img = lightbox.querySelector('.lightbox__image');
    const caption = lightbox.querySelector('.lightbox__caption');
    const currentSpan = lightbox.querySelector('.lightbox__current');
    const thumbnails = lightbox.querySelector('.lightbox__thumbnails');
    // Create thumbnails
    images.forEach((image, index) => {
        const thumb = document.createElement('img');
        thumb.className = 'lightbox__thumbnail';
        if (index === 0)
            thumb.classList.add('lightbox__thumbnail--active');
        thumb.src = image.url;
        thumb.alt = `Thumbnail ${index + 1}`;
        thumb.addEventListener('click', () => goToImage(index));
        thumbnails.appendChild(thumb);
    });
    function updateImage() {
        if (images[currentIndex]) {
            img.src = images[currentIndex].url;
            img.alt = images[currentIndex].alt;
            caption.textContent = images[currentIndex].caption || '';
            currentSpan.textContent = (currentIndex + 1).toString();
            // Update active thumbnail
            thumbnails.querySelectorAll('.lightbox__thumbnail').forEach((thumb, index) => {
                thumb.classList.toggle('lightbox__thumbnail--active', index === currentIndex);
            });
        }
    }
    function goToImage(index) {
        currentIndex = (index + images.length) % images.length;
        updateImage();
    }
    function next() {
        goToImage(currentIndex + 1);
    }
    function prev() {
        goToImage(currentIndex - 1);
    }
    function close() {
        lightbox.classList.add('lightbox--hidden');
        lightbox.setAttribute('aria-hidden', 'true');
    }
    // Event listeners
    lightbox.querySelector('.lightbox__next')?.addEventListener('click', next);
    lightbox.querySelector('.lightbox__prev')?.addEventListener('click', prev);
    lightbox.querySelector('.lightbox__close')?.addEventListener('click', close);
    lightbox.querySelector('.lightbox__overlay')?.addEventListener('click', close);
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('lightbox--hidden'))
            return;
        if (e.key === 'ArrowRight')
            next();
        if (e.key === 'ArrowLeft')
            prev();
        if (e.key === 'Escape')
            close();
    });
    // Initialize
    updateImage();
    // Hide by default
    lightbox.classList.add('lightbox--hidden');
    lightbox.setAttribute('aria-hidden', 'true');
    // Public API
    lightbox.show = () => {
        lightbox.classList.remove('lightbox--hidden');
        lightbox.setAttribute('aria-hidden', 'false');
    };
    lightbox.hide = close;
    return lightbox;
}
//# sourceMappingURL=lightbox.js.map