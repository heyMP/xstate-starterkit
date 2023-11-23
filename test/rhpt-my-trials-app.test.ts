import { html, fixture, expect, fixtureCleanup, aTimeout } from '@open-wc/testing/index-no-side-effects.js';
import '@open-wc/testing/register-chai-plugins.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import { setViewport } from '@web/test-runner-commands';

import type { RhptMyTrialsApp } from '../src/rhpt-my-trials-app.js';
import { globalMachine } from '../src/machines/globalMachine.js';
import '../src/rhpt-my-trials-app.js';

describe('RhptMyTrialsApp', () => {
  let element: RhptMyTrialsApp;
  beforeEach(async () => {
    fixtureCleanup();
    await setViewport({ width: 900, height: 800 });
    element = await fixture(`<rhpt-my-trials-app></rhpt-my-trials-app>`);
  });

  it('it correctly initializes', async () => {
    element.globalMachine = globalMachine
      .withConfig({
        services: {
          initializerMachine: () => new Promise(res => null)
        }
      });
    await visualDiff(element, `initializing`);
    await setViewport({ width: 360, height: 800 });
    await visualDiff(element, `initializing-mobile`);
  });
});
