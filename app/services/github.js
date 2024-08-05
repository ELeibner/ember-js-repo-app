import Service from '@ember/service';
import fetch from 'fetch';

export default class GithubService extends Service {
  token = '';

  async fetchRepos(orgName) {
    let url = `https://api.github.com/orgs/${orgName}/repos`;
    let response = await fetch(url, {
      headers: {
        Authorization: `token ${this.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (response.ok) {
      let repos = await response.json();
      // Fetch branches for each repo concurrently
      let reposWithBranches = await Promise.all(
        repos.map(async (repo) => {
          let branches = await this.fetchBranches(repo.full_name);
          return { ...repo, branches };
        }),
      );
      return reposWithBranches;
    } else {
      throw new Error(`Failed to fetch repositories: ${response.statusText}`);
    }
  }

  async fetchBranches(repoFullName) {
    let url = `https://api.github.com/repos/${repoFullName}/branches`;
    let response = await fetch(url, {
      headers: {
        Authorization: `token ${this.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Failed to fetch branches: ${response.statusText}`);
    }
  }
}
