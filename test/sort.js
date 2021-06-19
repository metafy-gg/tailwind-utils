import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import config from '../src/config';
import { orderByClassname } from '../src/plugins.js';
import { sortClasses } from '../src/sort.js';

const s = suite('sort');
s('sorts', () => {
  const cfg = config.load('../tailwind.config.js');
  const byClassname = orderByClassname(cfg);
  const sort = (classnames) => sortClasses(classnames, byClassname);

  assert.equal(sort('mt-4 relative'), 'relative mt-4');
  assert.equal(sort('xl:mt-8 mt-4 relative'), 'relative mt-4 xl:mt-8');
  assert.equal(sort('space-x-8 xl:mt-8 mt-4 relative'), 'relative space-x-8 mt-4 xl:mt-8');
});
s.run();
