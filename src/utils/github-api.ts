export class GitHubAPI {
  private baseUrl = 'https://api.github.com';
  private token: string = '';
  private owner: string = '';
  private repo: string = '';

  constructor(token: string, owner: string, repo: string) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
  }

  private async request(method: string, endpoint: string, data?: unknown): Promise<unknown> {
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
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
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch (e) {
        // ignore JSON parse errors
      }
      const bodyStr = errorData ? JSON.stringify(errorData) : '';
      throw new Error(`GitHub API Error (${response.status} ${response.statusText}) ${bodyStr} - ${endpoint}`);
    }

    return response.json();
  }

  async createBlob(content: string, encoding: 'utf-8' | 'base64' = 'utf-8'): Promise<string> {
    const response = await this.request('POST', `/repos/${this.owner}/${this.repo}/git/blobs`, {
      content,
      encoding,
    });
    return (response as Record<string, string>).sha;
  }

  async getFileContent(path: string): Promise<string> {
    const response = await this.request('GET', `/repos/${this.owner}/${this.repo}/contents/${path}`);
    const data = response as Record<string, unknown>;
    if (data.content && typeof data.content === 'string') {
      return decodeURIComponent(atob(data.content).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
    }
    throw new Error('Could not decode file content');
  }

  async createCommit(
    message: string,
    changes: Array<{ path: string; content: string; encoding?: string }>
  ): Promise<string> {
    // Try to get the current main branch ref. If the repo is empty, we'll create an initial commit and branch.
    let isEmptyRepo = false;
    let currentTreeSha: string | undefined;
    let parentSha: string | undefined;

    try {
      const refResponse = await this.request('GET', `/repos/${this.owner}/${this.repo}/git/refs/heads/main`);
      const refData = refResponse as Record<string, unknown>;
      const sha = (refData.object as Record<string, string>);

      // Get the current commit tree
      const commitResponse = await this.request('GET', `/repos/${this.owner}/${this.repo}/git/commits/${sha.sha}`);
      const commitData = commitResponse as Record<string, unknown>;
      currentTreeSha = (commitData.tree as Record<string, string>).sha;
      parentSha = sha.sha;
    } catch (err: any) {
      // If the repository is empty GitHub returns a specific message; treat any error here as empty repo fallback
      isEmptyRepo = true;
    }

    // Create blobs for each changed file
    const treeItems = [];
    for (const change of changes) {
      const blobSha = await this.createBlob(change.content, (change.encoding || 'utf-8') as 'utf-8' | 'base64');
      treeItems.push({
        path: change.path,
        mode: '100644',
        type: 'blob',
        sha: blobSha,
      });
    }

    // Create a new tree. If repo is empty, do not include base_tree.
    let treeResponse;
    if (isEmptyRepo) {
      treeResponse = await this.request('POST', `/repos/${this.owner}/${this.repo}/git/trees`, { tree: treeItems });
    } else {
      treeResponse = await this.request('POST', `/repos/${this.owner}/${this.repo}/git/trees`, { base_tree: currentTreeSha, tree: treeItems });
    }
    const treeData = treeResponse as Record<string, string>;

    // Create a new commit. For an empty repo, do not supply parents.
    const commitPayload: any = {
      message,
      tree: treeData.sha,
    };
    if (!isEmptyRepo && parentSha) commitPayload.parents = [parentSha];

    const newCommitResponse = await this.request('POST', `/repos/${this.owner}/${this.repo}/git/commits`, commitPayload);
    const newCommitData = newCommitResponse as Record<string, string>;

    // If repo was empty, create the main branch ref; otherwise update it
    if (isEmptyRepo) {
      try {
        await this.request('POST', `/repos/${this.owner}/${this.repo}/git/refs`, {
          ref: 'refs/heads/main',
          sha: newCommitData.sha,
        });
      } catch (err: any) {
        // If POST fails with 409 (ref already exists) or similar race, try to PATCH the ref instead
        try {
          await this.request('PATCH', `/repos/${this.owner}/${this.repo}/git/refs/heads/main`, {
            sha: newCommitData.sha,
            force: true,
          });
        } catch (patchErr) {
          throw patchErr;
        }
      }
    } else {
      await this.request('PATCH', `/repos/${this.owner}/${this.repo}/git/refs/heads/main`, {
        sha: newCommitData.sha,
        force: true,
      });
    }

    return newCommitData.sha;
  }

  async validateToken(): Promise<boolean> {
    try {
      await this.request('GET', '/user');
      return true;
    } catch {
      return false;
    }
  }
}
