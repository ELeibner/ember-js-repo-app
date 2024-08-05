import { setupTest } from 'ember-qunit';
import Pretender from 'pretender';
import { module, test } from 'qunit';

module('Unit | Service | github', function (hooks) {
  setupTest(hooks);

  let service;
  let server;

  hooks.beforeEach(function () {
    service = this.owner.lookup('service:github');
    service.token = 'fake-token';

    // Setup Pretender server
    server = new Pretender(function () {
      this.get('https://api.github.com/orgs/:org/repos', (request) => {
        if (request.params.org === 'org') {
          return [
            200,
            { 'Content-Type': 'application/json' },
            JSON.stringify([
              { full_name: 'org/repo1', name: 'repo1' },
              { full_name: 'org/repo2', name: 'repo2' },
            ]),
          ];
        }
        return [
          404,
          { 'Content-Type': 'application/json' },
          JSON.stringify({}),
        ];
      });

      this.get('https://api.github.com/repos/org/repo1/branches', () => {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify([{ name: 'main' }]),
        ];
      });

      this.get('https://api.github.com/repos/org/repo2/branches', () => {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify([{ name: 'develop' }]),
        ];
      });
    });
  });

  hooks.afterEach(function () {
    server.shutdown();
  });

  test('it fetches repositories and their branches', async function (assert) {
    let repos = await service.fetchRepos('org');

    assert.strictEqual(repos.length, 2, 'Fetched two repositories');
    assert.strictEqual(
      repos[0].name,
      'repo1',
      'First repository name is correct',
    );
    assert.strictEqual(
      repos[1].name,
      'repo2',
      'Second repository name is correct',
    );
    assert.strictEqual(
      repos[0].branches.length,
      1,
      'Fetched branches for the first repository',
    );
    assert.strictEqual(
      repos[0].branches[0].name,
      'main',
      'Correct branch name for the first repository',
    );
    assert.strictEqual(
      repos[1].branches.length,
      1,
      'Fetched branches for the second repository',
    );
    assert.strictEqual(
      repos[1].branches[0].name,
      'develop',
      'Correct branch name for the second repository',
    );
  });

  test('it handles fetch error for repositories', async function (assert) {
    // Mock the response to simulate a failure
    server.get('https://api.github.com/orgs/:org/repos', () => {
      return [404, { 'Content-Type': 'application/json' }, JSON.stringify({})];
    });

    try {
      await service.fetchRepos('org');
      assert.ok(false, 'Expected fetchRepos to throw an error');
    } catch (error) {
      assert.strictEqual(
        error.message,
        'Failed to fetch repositories: Not Found',
        'Correct error message when fetching repositories fails',
      );
    }
  });

  test('it handles fetch error for branches', async function (assert) {
    server.get('https://api.github.com/orgs/:org/repos', (request) => {
      if (request.params.org === 'org') {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify([{ full_name: 'org/repo1', name: 'repo1' }]),
        ];
      }
      return [404, { 'Content-Type': 'application/json' }, JSON.stringify({})];
    });

    server.get('https://api.github.com/repos/org/repo1/branches', () => {
      return [403, { 'Content-Type': 'application/json' }, JSON.stringify({})];
    });

    try {
      await service.fetchRepos('org');
      assert.ok(false, 'Expected fetchRepos to throw an error');
    } catch (error) {
      assert.strictEqual(
        error.message,
        'Failed to fetch branches: Forbidden',
        'Correct error message when fetching branches fails',
      );
    }
  });
});
