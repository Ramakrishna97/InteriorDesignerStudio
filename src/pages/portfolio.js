import { createNav } from '../components/nav';
import { createFooter } from '../components/footer';
import { createHero } from '../components/hero';
import { createGallery } from '../components/gallery';
const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EPlaceholder%3C/text%3E%3C/svg%3E';
const allProjects = [
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
    {
        id: 'office-space',
        slug: 'office-space',
        title: 'Corporate Office Redesign',
        description: 'Modern workspace design for a tech startup.',
        shortDescription: 'Contemporary office space with open concept layout.',
        category: 'Commercial',
        heroImage: placeholderImage,
        images: [{ url: placeholderImage, alt: 'Office space' }],
        completionDate: '2023-09-10',
        location: 'Tech Hub Downtown',
        client: 'TechStart Inc.',
        featured: false,
    },
];
function render() {
    const app = document.getElementById('app');
    if (!app)
        return;
    app.innerHTML = '';
    app.appendChild(createNav());
    const hero = createHero({
        title: 'Our Portfolio',
        subtitle: 'Explore our latest projects and designs',
    });
    app.appendChild(hero);
    const portfolioSection = document.createElement('section');
    portfolioSection.className = 'portfolio-section';
    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = 'All Projects';
    portfolioSection.appendChild(title);
    const gallery = createGallery(allProjects);
    portfolioSection.appendChild(gallery);
    app.appendChild(portfolioSection);
    app.appendChild(createFooter());
}
render();
//# sourceMappingURL=portfolio.js.map