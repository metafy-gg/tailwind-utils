const {
  languages,
  parsers,
  printers,
  options,
} = require('prettier-plugin-svelte');
const sortClasses = require('./sort');

function print(path, options, print) {
  const node = path.getValue();
  if (!node) {
    return '';
  }

  let doc = printers['svelte-ast'].print(path, options, print);

  if (node.type === 'Attribute' && node.name === 'class') {
    const sorted = sortClasses(node.value[0].data);
    doc.parts.find((p) => p.type === 'concat').parts[0] = sorted;
    return doc;
  }

  return doc;
}

module.exports = {
  languages,
  parsers,
  printers: {
    'svelte-ast': {
      ...printers['svelte-ast'],
      print,
    },
  },
  options,
};
