import { click, fillIn, render, select } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | filters', function (hooks) {
  setupRenderingTest(hooks);

  test('it updates language and visibility filters and applies them', async function (assert) {
    // Set up a mock filterRepos function
    this.set('filterRepos', (language, visibility) => {
      assert.strictEqual(
        language,
        'JavaScript',
        'Language filter is applied correctly',
      );
      assert.strictEqual(
        visibility,
        'public',
        'Visibility filter is applied correctly',
      );
    });

    // Render the component
    await render(hbs`<Filters @filterRepos={{this.filterRepos}} />`);

    // Interact with the language input
    await fillIn('#language', 'JavaScript');
    assert
      .dom('#language')
      .hasValue('JavaScript', 'Language input is updated correctly');

    // Interact with the visibility select
    await select('#visibility', 'public');
    assert
      .dom('#visibility')
      .hasValue('public', 'Visibility select is updated correctly');

    // Submit the form
    await click('button[type="submit"]');
  });
});
