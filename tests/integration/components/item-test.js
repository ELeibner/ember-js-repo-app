import { click, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | item', function (hooks) {
  setupRenderingTest(hooks);

  test('it toggles branches visibility', async function (assert) {
    // Mock repository data
    this.set('repo', {
      name: 'test-repo',
      html_url: 'https://github.com/test-repo',
      language: 'JavaScript',
      private: false,
      branches: [{ name: 'main' }],
    });

    // Render the component
    await render(hbs`<Item @repo={{this.repo}} />`);

    // Check that branches are not shown initially
    assert
      .dom('ul.branches')
      .doesNotExist('Branches are not visible initially');

    // Click the toggle button
    await click('.toggle');

    // Check that branches are shown after click
    assert
      .dom('ul.branches')
      .exists('Branches are visible after clicking toggle');
    assert
      .dom('ul.branches li')
      .hasText('main', 'Correct branch name is displayed');

    // Click the toggle button again
    await click('.toggle');

    // Check that branches are hidden again
    assert
      .dom('ul.branches')
      .doesNotExist('Branches are hidden after clicking toggle again');
  });
});
