export interface ProjectImage {
    url: string;
    alt: string;
    caption?: string;
}
export interface ProjectMetadata {
    id: string;
    slug: string;
    title: string;
    description: string;
    shortDescription: string;
    category: string;
    images: ProjectImage[];
    heroImage: string;
    completionDate: string;
    location?: string;
    client?: string;
    featured: boolean;
    details?: string;
}
export interface AdminProjectInput {
    title: string;
    description: string;
    shortDescription: string;
    category: string;
    completionDate: string;
    location: string;
    client: string;
    featured: boolean;
    images: File[];
    heroImageFile?: File;
}
export interface GitHubBlob {
    url: string;
    sha: string;
    size: number;
    raw_url: string;
}
export interface ValidationError {
    field: string;
    message: string;
}
//# sourceMappingURL=types.d.ts.map