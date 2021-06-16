import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { loadConfig } from '../src/translate.js';
import { propertiesToClass } from '../src/translate-slim.js';

const s = suite('propertiesToClass');
s('all', () => {
  const byProperties = loadConfig('../tailwind.config.js');
  const toClass = (properties) => propertiesToClass(properties, byProperties);

  assert.equal(toClass('position: static'), 'static');
  assert.equal(toClass('display: inline-block'), 'inline-block');
  assert.equal(toClass('display: none'), 'hidden');
  assert.equal(toClass('z-index: 50'), 'z-modal-backdrop');
  assert.equal(toClass('z-index: 40'), 'z-40');
  assert.equal(toClass('z-index: 39'), undefined);
  assert.equal(toClass('z-index: 5'), 'z-guest-navbar');
  assert.equal(toClass('flex: 1 1 0%'), 'flex-1');
  assert.equal(toClass('order: 1'), 'order-1');
  assert.equal(toClass('order: -9999'), 'order-first');
  assert.equal(toClass('order: 9999'), 'order-last');
  assert.equal(toClass('align-self: flex-start'), 'self-start');
  assert.equal(toClass('align-self: flex-end'), 'self-end');
  assert.equal(toClass('align-self: auto'), 'self-auto');
  assert.equal(toClass('grid-template-columns: repeat(2, minmax(0, 1fr))'), 'grid-cols-2');
  assert.equal(toClass('grid-template-columns: none'), 'grid-cols-none');
  assert.equal(toClass('margin-bottom: 1rem; margin-top: 1rem'), 'my-4');
  assert.equal(toClass('margin-top: 2rem'), 'mt-8');
  assert.equal(toClass('margin-top: -2rem'), '-mt-8');
  assert.equal(toClass('margin-top: -2rem'), '-mt-8');
  assert.equal(toClass('margin-bottom: 0px'), 'mb-0');
  assert.equal(toClass('font-size: 0.875rem'), 'text-sm');
  assert.equal(toClass('font-size: 14px'), 'text-sm');
  assert.equal(toClass('line-height: 100%'), 'leading-none');
  assert.equal(toClass('line-height: 150%'), 'leading-normal');
  assert.equal(toClass('background-color: #262A33'), 'bg-neutrals-d80');
  assert.equal(toClass('background: #262A33'), 'bg-neutrals-d80');
  assert.equal(toClass('color: #262A33'), 'text-neutrals-d80');
  assert.equal(toClass('width: 297px'), 'w-[297px]');
  assert.equal(toClass('width: 16px'), 'w-4');
  // assert.equal(toClass(''), '');
});
s.run();
