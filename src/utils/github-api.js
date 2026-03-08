export class GitHubAPI {
    constructor(token, owner, repo) {
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'https://api.github.com'
        });
        Object.defineProperty(this, "token", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ''
        });
        Object.defineProperty(this, "owner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ''
        });
        Object.defineProperty(this, "repo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ''
        });
        this.token = token;
        this.owner = owner;
        this.repo = repo;
    }
    async request(method, endpoint, data) {
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                Authorization: `token ${this.token}`,
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github.v3+json',
            },
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API Error: ${errorData.message || response.statusText}`);
        }
        return response.json();
    }
    async createBlob(content, encoding = 'utf-8') {
        const response = await this.request('POST', `/repos/${this.owner}/${this.repo}/git/blobs`, {
            content,
            encoding,
        });
        return response.sha;
    }
    async getFileContent(path) {
        const response = await this.request('GET', `/repos/${this.owner}/${this.repo}/contents/${path}`);
        const data = response;
        if (data.content && typeof data.content === 'string') {
            return decodeURIComponent(atob(data.content).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
        }
        throw new Error('Could not decode file content');
    }
    async createCommit(message, changes) {
        // First, get the current main branch ref
        const refResponse = await this.request('GET', `/repos/${this.owner}/${this.repo}/git/refs/heads/main`);
        const refData = refResponse;
        const sha = refData.object;
        // Get the current commit tree
        const commitResponse = await this.request('GET', `/repos/${this.owner}/${this.repo}/git/commits/${sha.sha}`);
        const commitData = commitResponse;
        const currentTreeSha = commitData.tree.sha;
        // Create blobs for each changed file
        const treeItems = [];
        for (const change of changes) {
            const blobSha = await this.createBlob(change.content, (change.encoding || 'utf-8'));
            treeItems.push({
                path: change.path,
                mode: '100644',
                type: 'blob',
                sha: blobSha,
            });
        }
        // Create a new tree
        const treeResponse = await this.request('POST', `/repos/${this.owner}/${this.repo}/git/trees`, {
            base_tree: currentTreeSha,
            tree: treeItems,
        });
        const treeData = treeResponse;
        // Create a new commit
        const newCommitResponse = await this.request('POST', `/repos/${this.owner}/${this.repo}/git/commits`, {
            message,
            tree: treeData.sha,
            parents: [sha.sha],
        });
        const newCommitData = newCommitResponse;
        // Update the main branch to point to the new commit
        await this.request('PATCH', `/repos/${this.owner}/${this.repo}/git/refs/heads/main`, {
            sha: newCommitData.sha,
            force: true,
        });
        return newCommitData.sha;
    }
    async validateToken() {
        try {
            await this.request('GET', '/user');
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=github-api.js.map