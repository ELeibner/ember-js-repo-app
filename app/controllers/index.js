import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @service github;

  @tracked repos = [];
  @tracked filteredRepos = [];
  @tracked orgName = '';
  @tracked token = '';
  @tracked errorMessage = '';

  @action
  updateOrgName(event) {
    this.orgName = event.target.value;
  }

  @action
  updateToken(event) {
    this.token = event.target.value;
    this.github.token = this.token; // Update service token
  }

  @action
  async loadRepos(event) {
    event.preventDefault();
    try {
      this.repos = await this.github.fetchRepos(this.orgName);
      this.filteredRepos = this.repos.map((repo) => ({
        ...repo,
        showBranches: false, // Ensure this property is set
      }));
    } catch (error) {
      this.errorMessage =
        'Failed to load repositories. Please check the organization name and try again.';
      console.error('Failed to load repositories:', error);
    }
  }

  @action
  filterRepos(language, visibility) {
    this.filteredRepos = this.repos.filter((repo) => {
      let matchesLanguage =
        !language ||
        (repo.language &&
          repo.language.toLowerCase().includes(language.toLowerCase()));
      let matchesVisibility =
        !visibility ||
        (visibility === 'public' && !repo.private) ||
        (visibility === 'private' && repo.private);
      return matchesLanguage && matchesVisibility;
    });
  }
}
