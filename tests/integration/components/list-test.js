import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | list', function (hooks) {
  setupRenderingTest(hooks);

  test('it displays the list of repositories', async function (assert) {
    // Set up sample data
    this.set('repos', [
      {
        name: 'repo1',
        language: 'JavaScript',
        private: false,
        branches: ['main'],
      },
      {
        name: 'repo2',
        language: 'Python',
        private: true,
        branches: ['main', 'develop'],
      },
    ]);

    // Render the component
    await render(hbs`<List @repos={{this.repos}} />`);

    // Verify that the list items are rendered correctly
    assert.dom('ul').exists('The repo list is rendered');
    assert
      .dom('ul li')
      .exists({ count: 2 }, 'The list contains two repositories');
    assert
      .dom('ul li:nth-of-type(1)')
      .includesText('repo1', 'The first repo is displayed');
    assert
      .dom('ul li:nth-of-type(2)')
      .includesText('repo2', 'The second repo is displayed');
  });
});
