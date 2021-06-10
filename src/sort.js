const breakpoints = ['2xl', 'xl', 'lg', 'md', 'sm'];

// Match helpers
let m = {
  any: '[0-9a-z./]+',
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
  `h-${m.any}`,

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

function sortClasses(classes) {
  // Remove unwanted spaces while we're at it:
  classes = classes.replace(/\s+/g, ' ').trim();
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

module.exports = sortClasses;
