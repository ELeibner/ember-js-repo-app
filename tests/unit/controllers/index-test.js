import { setupTest } from 'dealfront-app/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Controller | index', function (hooks) {
  setupTest(hooks);

  test('it filters repositories by language and visibility', function (assert) {
    let controller = this.owner.lookup('controller:index');

    // Mock repositories
    controller.repos = [
      { name: 'repo1', language: 'JavaScript', private: false },
      { name: 'repo2', language: 'Python', private: true },
      { name: 'repo3', language: 'JavaScript', private: true },
    ];

    // Test language filter
    controller.filterRepos('JavaScript', '');
    assert.deepEqual(
      controller.filteredRepos.map((repo) => repo.name),
      ['repo1', 'repo3'],
      'Filters by language correctly',
    );

    // Test visibility filter
    controller.filterRepos('', 'private');
    assert.deepEqual(
      controller.filteredRepos.map((repo) => repo.name),
      ['repo2', 'repo3'],
      'Filters by visibility correctly',
    );

    // Test combined filter
    controller.filterRepos('JavaScript', 'private');
    assert.deepEqual(
      controller.filteredRepos.map((repo) => repo.name),
      ['repo3'],
      'Filters by both language and visibility correctly',
    );
  });

  test('it loads repositories', async function (assert) {
    let controller = this.owner.lookup('controller:index');
    let githubService = this.owner.lookup('service:github');

    // Mock fetchRepos method
    githubService.fetchRepos = () =>
      Promise.resolve([
        { name: 'repo1', language: 'JavaScript', private: false, branches: [] },
      ]);

    // Load repositories
    await controller.loadRepos({ preventDefault() {} });

    assert.deepEqual(
      controller.repos.map((repo) => repo.name),
      ['repo1'],
      'Repos are loaded correctly',
    );
  });
});
