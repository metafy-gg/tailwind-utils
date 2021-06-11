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
  `static`,
  `fixed`,
  `absolute`,
  `relative`,
  `sticky`,

  // Box Sizing
  `box-${m.any}`,

  // Display
  `hidden`,
  `block`,
  `inline-block`,
  `inline`,
  `flex`,
  `flex-1`,
  `flex-auto`,
  `flex-initial`,
  `flex-none`,
  `inline-flex`,
  `table`,
  `inline-table`,
  `table-caption`,
  `table-cell`,
  `table-column`,
  `table-column-group`,
  `table-footer-group`,
  `table-header-group`,
  `table-row-group`,
  `table-row`,
  `flow-root`,
  `grid`,
  `inline-grid`,
  `contents`,
  `list-item`,

  // Visibility
  `visible`,
  `invisible`,

  // Z-Index
  `-?z-${m.any}`,

  // Pointer Events
  `pointer-events-${m.any}`,

  // Flex:
  // Flex Direction
  `flex-row`,
  `flex-row-reverse`,
  `flex-col`,
  `flex-col-reverse`,
  // Flex Wrap
  `flex-wrap`,
  `flex-wrap-reverse`,
  `flex-nowrap`,
  // Flex Grow
  `flex-grow-0`,
  `flex-grow`,
  // Flex Shrink
  `flex-shrink-0`,
  `flex-shrink`,

  // Order
  `order-${m.any}`,

  // Grid Template Columns
  `grid-cols-${m.any}`,
  // Grid Column Start / End
  `col-auto`,
  `col-span-${m.any}`,
  `col-start-${m.any}`,
  `col-end-${m.any}`,
  // Grid Template Rows
  `grid-rows-${m.any}`,
  // Grid Row Start / End
  `row-auto`,
  `row-span-${m.any}`,
  `row-start-${m.any}`,
  `row-end-${m.any}`,
  // Grid Auto Flow
  `grid-flow-${m.any}`,
  // Grid Auto Columns
  `auto-cols-${m.any}`,
  // Grid Auto Rows
  `auto-rows-${m.any}`,

  // Justify Content
  `justify-${m.any}`,
  // Justify Items
  `justify-items-${m.any}`,
  // Justify Self
  `justify-self-${m.any}`,
  // Align Content
  `content-${m.any}`,
  // Align Items
  `items-${m.any}`,
  // Align Self
  `self-${m.any}`,
  // Place Content
  `place-content-${m.any}`,
  // Place Items
  `place-items-${m.any}`,
  // Place Self
  `place-self-${m.any}`,

  // Object Fit, Position
  `object-${m.any}`,

  // Overflow
  `overflow-${m.any}`,
  `overflow-x-${m.any}`,
  `overflow-y-${m.any}`,

  // Overscroll Behavior
  `overscroll-${m.any}`,
  `overscroll-x-${m.any}`,
  `overscroll-y-${m.any}`,

  // Top / Right / Bottom / Left
  `-?inset-${m.any}`,
  `-?inset-x-${m.any}`,
  `-?inset-y-${m.any}`,
  `-?left-${m.any}`,
  `-?right-${m.any}`,
  `-?top-${m.any}`,
  `-?bottom-${m.any}`,

  // Size
  `w-${m.any}`,
  `min-w-${m.any}`,
  `max-w-${m.any}`,
  `h-${m.any}`,
  `min-h-${m.any}`,
  `max-h-${m.any}`,

  // Cursor
  `cursor-${m.any}`,

  // Text Alignment
  `text-left`,
  `text-center`,
  `text-right`,
  `text-justify`,
  // Vertical Alignment
  `align-${m.any}`,

  // List Style Type
  `list-${m.any}`,

  // Text Transform
  `uppercase`,
  `lowercase`,
  `capitalize`,
  `normal-case`,
  // Font Style
  `italic`,
  `not-italic`,
  // Text Decoration
  `underline`,
  `line-through`,
  `no-underline`,
  // Font Weight, Size, Color
  `font-${m.any}`,
  `text-${m.any}`,
  `text-${m.color}`,
  // Text Opacity
  `text-opacity-${m.any}`,
  // Letter Spacing
  `-?tracking-${m.any}`,
  // Line Height
  `leading-${m.any}`,

  // Text Overflow
  `truncate`,
  `overflow-ellipsis`,
  `overflow-clip`,

  // Whitespace
  `whitespace-${m.any}`,
  // Word Break
  `break-${m.any}`,

  // Placeholder Color
  `placeholder-${m.any}`,
  // Placeholder Opacity
  `placeholder-opacity-${m.any}`,

  // Background
  `bg-${m.any}`,
  `bg-${m.color}`,
  `bg-opacity-${m.any}`,
  // Background Image
  `bg-gradient-${m.any}`,
  `from-${m.any}`,
  `from-${m.color}`,
  `via-${m.any}`,
  `via-${m.color}`,
  `to-${m.any}`,
  `to-${m.color}`,

  // Opacity
  `opacity-${m.any}`,

  // Box Shadow
  `shadow`,
  `shadow-${m.any}`,

  // Border
  `border`,
  // Border Style
  `border-solid`,
  `border-dashed`,
  `border-dotted`,
  `border-double`,
  `border-none`,
  `border-${m.any}`,
  `border-${m.color}`,
  `border-t-${m.any}`,
  `border-b-${m.any}`,
  `border-l-${m.any}`,
  `border-r-${m.any}`,
  `border-tl-${m.any}`,
  `border-tr-${m.any}`,
  `border-bl-${m.any}`,
  `border-br-${m.any}`,
  `border-opacity-${m.any}`,
  // Border Radius
  `rounded`,
  `rounded-${m.any}`,

  // Outline
  `outline-${m.any}`,

  // Ring
  `ring`,
  `ring-${m.any}`,
  // Ring Opacity
  `ring-opacity-${m.any}`,
  // Ring Offset
  `ring-offset-${m.any}`,

  // Transform
  `transform`,
  `transform-${m.any}`,
  // Transform Origin
  `origin-${m.any}`,
  // Scale
  `scale-${m.any}`,
  // Rotate
  `-?rotate-${m.any}`,
  // Translate
  `-?translate-x-${m.any}`,
  `-?translate-y-${m.any}`,
  // Skew
  `-?skew-x-${m.any}`,
  `-?skew-y-${m.any}`,

  // Transition Property
  `transition${m.any}`,
  `duration-${m.any}`,
  `ease-${m.any}`,
  // Animation
  `animate-${m.any}`,

  // Padding
  `-?p-${m.any}`,
  `-?px-${m.any}`,
  `-?py-${m.any}`,
  `-?pt-${m.any}`,
  `-?pb-${m.any}`,
  `-?pl-${m.any}`,
  `-?pr-${m.any}`,

  // Spacing
  `-?space-x-${m.any}`,
  `-?space-y-${m.any}`,

  // Gap
  `gap-${m.any}`,
  `gap-x-${m.any}`,
  `gap-y-${m.any}`,

  // Margin
  `-?m-${m.any}`,
  `-?mx-${m.any}`,
  `-?my-${m.any}`,
  `-?mt-${m.any}`,
  `-?mb-${m.any}`,
  `-?ml-${m.any}`,
  `-?mr-${m.any}`,
].map((rule) => new RegExp(rule));

// Append each responsive variant after every entry.
// Each rule will be wrapped inside `^{rule}$`
for (let i = 0; i < classOrder.length; i++) {
  breakpoints.forEach((bp) =>
    classOrder.splice(
      i + 1,
      0,
      new RegExp('^' + bp + ':' + '(hover:)?' + classOrder[i].source + '$')
    )
  );
  classOrder[i] = new RegExp('^' + '(hover:)?' + classOrder[i].source + '$');
  i += breakpoints.length;
}

function sort(classes) {
  // Remove unwanted repeated spaces:
  classes = classes.replace(/\s+/g, ' ');
  const leadingSpace = classes[0] === ' ';
  const trailingSpace = classes[classes.length - 1] === ' ';

  const sorted = classes
    .split(' ')
    .sort((a, b) => {
      //// Debug:
      // console.log('a, b:', a, b);
      // console.log(
      //   'ma, mb:',
      //   classOrder?.[findIndexReverse(classOrder, (re) => a.match(re))],
      //   classOrder?.[findIndexReverse(classOrder, (re) => b.match(re))],
      // );
      // console.log('\n');
      return (
        findIndexReverse(classOrder, (re) => a.match(re)) -
        findIndexReverse(classOrder, (re) => b.match(re))
      );
    })
    .join(' ')
    .trim();

  // Make sure leading or trailing spaces are preserved.
  return `${leadingSpace ? ' ' : ''}${sorted}${trailingSpace ? ' ' : ''}`;
}

function findIndexReverse(arr, predicate) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      return i;
    }
  }
  return -1;
}

module.exports = sort;
