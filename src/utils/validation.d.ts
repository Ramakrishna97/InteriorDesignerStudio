import type { AdminProjectInput, ValidationError } from './types';
export declare function validateProjectForm(input: Partial<AdminProjectInput>): ValidationError[];
export declare function generateSlug(title: string): string;
export declare function sanitizeFilename(filename: string): string;
//# sourceMappingURL=validation.d.ts.map