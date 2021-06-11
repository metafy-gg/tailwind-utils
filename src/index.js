// const {
//   languages,
//   parsers,
//   printers,
//   options,
// } = require('prettier-plugin-svelte');
// const sortClasses = require('./sort');

// function print(path, options, print) {
//   const node = path.getValue();
//   if (!node) {
//     return '';
//   }

//   let doc = printers['svelte-ast'].print(path, options, print);

//   if (node.type === 'Attribute' && node.name === 'class') {
//     const sorted = sortClasses(node.value[0].data);
//     doc.parts.find((p) => p.type === 'concat').parts[0] = sorted;
//     return doc;
//   }

//   return doc;
// }

// module.exports = {
//   languages,
//   parsers,
//   printers: {
//     'svelte-ast': {
//       ...printers['svelte-ast'],
//       print,
//     },
//   },
//   options,
// };

const breakpoints = ['2xl', 'xl', 'lg', 'md', 'sm'];

// Match helpers
let m = {
  any: '[0-9a-z./-]+',
};
m.color = `${m.any}-${m.any}`;

let classOrder = [
  // Utils
  `container`,

  // Position
  `fixed`,
  `absolute`,
  `relative`,
  `static`,

  // Display
  `hidden`,
  `block`,
  `inline-block`,
  `flex`,
  `grid`,

  // Flex
  `flex-1`,
  `flex-${m.any}`,
  `self-${m.any}`,
  // TODO: justify, etc

  // TODO: Grid

  // Overflow
  `overflow-${m.any}`,

  // Size
  `w-${m.any}`,
  `min-w-${m.any}`,
  `max-w-${m.any}`,
  `h-${m.any}`,
  `min-h-${m.any}`,
  `max-h-${m.any}`,

  // Text
  `uppercase`,
  `font-${m.any}`,
  `text-${m.any}`,
  `text-${m.color}`,
  `tracking-${m.any}`,
  `leading-${m.any}`,

  // Background
  `bg-${m.any}`,
  `bg-${m.color}`,
  `bg-opacity-${m.any}`,

  // Border
  `border`,
  `border-${m.any}`,
  `border-${m.color}`,
  `border-[tblr]-${m.any}`,
  `border-(tl)|(tr)|(bl)|(br)-${m.any}`,
  `border-opacity-${m.any}`,
  `rounded-${m.any}`,

  // Padding
  `p-${m.any}`,
  `p[xy]-${m.any}`,
  `p[tblr]-${m.any}`,

  // Spacing
  `space-[xy]-${m.any}`,

  // Margin
  `m-${m.any}`,
  `m[xy]-${m.any}`,
  `m[tblr]-[${m.any}`,
].map((rule) => new RegExp(rule));

// Append each responsive variant after every entry.
// Each rule will be wrapped inside `^{rule}$`
for (let i = 0; i < classOrder.length; i++) {
  breakpoints.forEach((bp) =>
    classOrder.splice(
      i + 1,
      0,
      new RegExp('^' + bp + ':' + classOrder[i].source + '$')
    )
  );
  classOrder[i] = new RegExp('^' + classOrder[i].source + '$');
  i += breakpoints.length;
}

function sort(classes) {
  // Remove unwanted spaces:
  classes = classes.replace(/\s+/g, ' ');
  
  return classes
    .split(' ')
    .sort((a, b) => {
      return (
        classOrder.findIndex((re) => a.match(re)) -
        classOrder.findIndex((re) => b.match(re))
      );
    })
    .join(' ');
}

module.exports = sort;
