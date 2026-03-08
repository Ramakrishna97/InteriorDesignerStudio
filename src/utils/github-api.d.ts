export declare class GitHubAPI {
    private baseUrl;
    private token;
    private owner;
    private repo;
    constructor(token: string, owner: string, repo: string);
    private request;
    createBlob(content: string, encoding?: 'utf-8' | 'base64'): Promise<string>;
    getFileContent(path: string): Promise<string>;
    createCommit(message: string, changes: Array<{
        path: string;
        content: string;
        encoding?: string;
    }>): Promise<string>;
    validateToken(): Promise<boolean>;
}
//# sourceMappingURL=github-api.d.ts.map