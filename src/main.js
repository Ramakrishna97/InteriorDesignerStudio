import { createNav } from './components/nav';
import { createFooter } from './components/footer';
import { createHero } from './components/hero';
import { createGallery } from './components/gallery';
// Sample placeholder image (tiny base64 placeholder)
const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EPlaceholder%3C/text%3E%3C/svg%3E';
const sampleProjects = [
    {
        id: 'modern-living',
        slug: 'modern-living',
        title: 'Modern Living Room Redesign',
        description: 'A complete transformation of a dated living space into a contemporary oasis.',
        shortDescription: 'Contemporary living room with clean lines and open space.',
        category: 'Residential',
        heroImage: placeholderImage,
        images: [
            { url: placeholderImage, alt: 'Modern living room 1' },
            { url: placeholderImage, alt: 'Modern living room 2' },
        ],
        completionDate: '2024-01-15',
        location: 'Downtown Lofts',
        client: 'Jane & John Smith',
        featured: true,
        details: 'This project involved complete redesign with new furniture, lighting, and color scheme.',
    },
    {
        id: 'luxury-bedroom',
        slug: 'luxury-bedroom',
        title: 'Luxury Master Bedroom Suite',
        description: 'An elegant and serene bedroom retreat for a luxury penthouse.',
        shortDescription: 'Luxury bedroom with marble accents and custom furniture.',
        category: 'Residential',
        heroImage: placeholderImage,
        images: [{ url: placeholderImage, alt: 'Luxury bedroom' }],
        completionDate: '2023-11-20',
        location: 'Penthouse Tower',
        client: 'Private Client',
        featured: true,
    },
];
function render() {
    const app = document.getElementById('app');
    if (!app)
        return;
    app.innerHTML = '';
    // Add nav
    app.appendChild(createNav());
    // Add hero
    const hero = createHero({
        title: 'Welcome to Interior Design',
        subtitle: 'Creating beautiful spaces that inspire',
        backgroundImage: placeholderImage,
        ctaText: 'View Portfolio',
        ctaLink: '/portfolio.html',
    });
    app.appendChild(hero);
    // Add featured projects section
    const featuredSection = document.createElement('section');
    featuredSection.className = 'featured-section';
    featuredSection.innerHTML = '<h2 class="section-title">Featured Projects</h2>';
    const gallery = createGallery(sampleProjects.filter((p) => p.featured));
    featuredSection.appendChild(gallery);
    app.appendChild(featuredSection);
    // Add footer
    app.appendChild(createFooter());
}
render();
//# sourceMappingURL=main.js.map