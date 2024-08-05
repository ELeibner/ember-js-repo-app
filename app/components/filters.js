import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class FiltersComponent extends Component {
  @tracked language = '';
  @tracked visibility = '';

  @action
  updateLanguage(event) {
    this.language = event.target.value;
  }

  @action
  updateVisibility(event) {
    this.visibility = event.target.value;
  }

  @action
  applyFilters(event) {
    event.preventDefault();
    this.args.filterRepos(this.language, this.visibility);
  }
}
