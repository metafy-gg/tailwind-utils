import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { sortClasses } from '../src/index.js';

const s = suite('sort');
s('sorts', () => {
  assert.equal(sortClasses('mt-4 relative'), 'relative mt-4');
  assert.equal(sortClasses('xl:mt-8 mt-4 relative'), 'relative mt-4 xl:mt-8');
  assert.equal(sortClasses('space-x-8 xl:mt-8 mt-4 relative'), 'relative space-x-8 mt-4 xl:mt-8');
});
s.run();
