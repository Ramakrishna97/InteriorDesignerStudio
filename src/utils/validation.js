export function validateProjectForm(input) {
    const errors = [];
    if (!input.title || input.title.trim().length === 0) {
        errors.push({ field: 'title', message: 'Project title is required' });
    }
    if (!input.description || input.description.trim().length === 0) {
        errors.push({ field: 'description', message: 'Project description is required' });
    }
    if (!input.shortDescription || input.shortDescription.trim().length === 0) {
        errors.push({ field: 'shortDescription', message: 'Short description is required' });
    }
    if (!input.category || input.category.trim().length === 0) {
        errors.push({ field: 'category', message: 'Category is required' });
    }
    if (!input.completionDate || input.completionDate.trim().length === 0) {
        errors.push({ field: 'completionDate', message: 'Completion date is required' });
    }
    if (!input.images || input.images.length === 0) {
        errors.push({ field: 'images', message: 'At least one project image is required' });
    }
    if (input.images && input.images.length > 0) {
        input.images.forEach((file, index) => {
            if (!file.type.startsWith('image/')) {
                errors.push({ field: `images[${index}]`, message: 'All files must be images' });
            }
            if (file.size > 5 * 1024 * 1024) {
                errors.push({
                    field: `images[${index}]`,
                    message: 'Image files must be under 5MB each',
                });
            }
        });
    }
    return errors;
}
export function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
export function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}
//# sourceMappingURL=validation.js.map