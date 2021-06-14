import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { propertiesToClass } from '../src/index.js';

const s = suite('propertiesToClass');
s('all', () => {
  assert.equal(propertiesToClass('position: static'), 'static');
  assert.equal(propertiesToClass('display: inline-block'), 'inline-block');
  assert.equal(propertiesToClass('display: none'), 'hidden');
  assert.equal(propertiesToClass('z-index: 50'), 'z-modal-backdrop');
  assert.equal(propertiesToClass('z-index: 40'), 'z-40');
  assert.equal(propertiesToClass('z-index: 39'), undefined);
  assert.equal(propertiesToClass('z-index: 5'), 'z-guest-navbar');
  assert.equal(propertiesToClass('flex: 1 1 0%'), 'flex-1');
  assert.equal(propertiesToClass('order: 1'), 'order-1');
  assert.equal(propertiesToClass('order: -9999'), 'order-first');
  assert.equal(propertiesToClass('order: 9999'), 'order-last');
  assert.equal(propertiesToClass('align-self: flex-start'), 'self-start');
  assert.equal(propertiesToClass('align-self: flex-end'), 'self-end');
  assert.equal(propertiesToClass('align-self: auto'), 'self-auto');
  assert.equal(propertiesToClass('grid-template-columns: repeat(2, minmax(0, 1fr))'), 'grid-cols-2');
  assert.equal(propertiesToClass('grid-template-columns: none'), 'grid-cols-none');
  assert.equal(propertiesToClass('margin-bottom: 1rem; margin-top: 1rem'), 'my-4');
  assert.equal(propertiesToClass('margin-top: 2rem'), 'mt-8');
  assert.equal(propertiesToClass('margin-top: -2rem'), '-mt-8');
  assert.equal(propertiesToClass('margin-top: -2rem'), '-mt-8');
  assert.equal(propertiesToClass('margin-bottom: 0px'), 'mb-0');
  assert.equal(propertiesToClass('font-size: 0.875rem'), 'text-sm');
  // assert.equal(propertiesToClass(''), '');
});
s.run();
