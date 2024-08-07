import { fixture, fixtureCleanup } from '@open-wc/testing/index-no-side-effects.js';
import '@open-wc/testing/register-chai-plugins.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import { setViewport } from '@web/test-runner-commands';

import type { XApp } from '../src/x-app.js';
import '../src/x-app.js';

describe('x-app', () => {
  let element: XApp;
  beforeEach(async () => {
    fixtureCleanup();
    await setViewport({ width: 900, height: 800 });
    element = await fixture(`<x-app></x-app>`);
  });

  it('it correctly initializes', async () => {
    await visualDiff(element, `initializing`);
    await setViewport({ width: 360, height: 800 });
    await visualDiff(element, `initializing-mobile`);
  });
});
