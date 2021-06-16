const fs = require('fs');
const path = require('path');
const util = require('util');
const translate = require('../../dist/lib/translate.js');

const byProperties = translate.loadConfig(path.resolve('./tailwind.config.js'));

const bookmarklet = `${fs.readFileSync('./bin/figma-tailwind/runtime.js', 'utf-8')}
let byProperties = ${util.inspect(byProperties)};`;

fs.writeFileSync('./dist/bookmarklet.js', bookmarklet, {
  flag: 'w+',
});
