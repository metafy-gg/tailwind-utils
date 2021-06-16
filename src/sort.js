import { loadPlugin } from './plugins.js';
import config from './config.js';

// TODO: Read from config
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

// TODO: variants
const variants = ['hover'].map((v) => `(${v}:)?`).join('');

export let order = [
  // Utils
  'container',

  // Position
  'position',

  // Z-Index
  'zIndex',

  // Display
  'display',

  // Visibility
  'visibility',

  // Pointer Events
  'pointerEvents',

  // Flex Direction
  'flexDirection',
  // Flex Wrap
  'flexWrap',
  // Flex Grow
  'flexGrow',
  // Flex Shrink
  'flexShrink',

  // Grid Auto Flow
  'gridAutoFlow',
  // Grid Template Columns
  'gridTemplateColumns',
  // Grid Auto Columns
  'gridAutoColumns',
  // Grid Column Start / End
  'gridColumn',
  'gridColumnStart',
  'gridColumnEnd',

  // Grid Template Rows
  'gridTemplateRows',
  // Grid Auto Rows
  'gridAutoRows',
  // Grid Row Start / End
  'gridRow',
  'gridRowStart',
  'gridRowEnd',

  // Order
  'order',

  // Justify Content
  'justifyContent',
  // Justify Items
  'justifyItems',
  // Justify Self
  'justifySelf',
  // Align Content
  'alignContent',
  // Align Items
  'alignItems',
  // Align Self
  'alignSelf',
  // Place Content
  'placeContent',
  // Place Items
  'placeItems',
  // Place Self
  'placeSelf',

  // Object Fit
  'objectFit',
  // Object Position
  'objectPosition',

  // Overflow
  'overflow',

  // Overscroll Behavior
  'overscrollBehavior',

  // Inset, Top / Bottom / Left / Right
  'inset',

  // Size
  'width',
  'minWidth',
  'maxWidth',
  'height',
  'minHeight',
  'maxHeight',

  // Cursor
  'cursor',

  // Text Alignment
  'textAlign',
  // Vertical Alignment
  'verticalAlign',

  // List Style Type
  'listStyleType',

  // Text Transform
  'textTransform',
  // Font Style
  'fontStyle',
  // Text Decoration
  'textDecoration',
  // Font Weight, Size, Color
  'fontWeight',
  'fontSize',
  'textColor',
  // Text Opacity
  'textOpacity',
  // Letter Spacing
  'letterSpacing',
  // Line Height
  'lineHeight',

  // Text Overflow
  'textOverflow',

  // Whitespace
  'whitespace',
  // Word Break
  'wordBreak',

  // Placeholder Color
  'placeholderColor',
  // Placeholder Opacity
  'placeholderOpacity',

  // Background
  'backgroundPosition',
  'backgroundRepeat',
  'backgroundSize',
  'backgroundColor',
  'backgroundOpacity',
  'backgroundImage',
  'gradientColorStops',
  'backgroundAttachment',
  'backgroundBlendMode',
  'backgroundClip',

  // Opacity
  'opacity',

  // Box Shadow
  'boxShadow',

  // Border
  'borderStyle',
  'borderWidth',
  'borderColor',
  'borderOpacity',
  'borderRadius',
  'borderCollapse',

  // Outline
  'outline',

  // Ring
  'ringWidth',
  'ringOpacity',
  'ringOffsetWidth',

  // Transform
  'transform',
  // Transform Origin
  'transformOrigin',
  // Scale
  'scale',
  // Rotate
  'rotate',
  // Translate
  'translate',
  // Skew
  'skew',

  // Transition Property
  'transitionProperty',
  'transitionDuration',
  'transitionDelay',
  'transitionTimingFunction',
  // Animation
  'animation',

  // Box Sizing
  'boxSizing',

  // Padding
  'padding',

  // Spacing
  'space',

  // Gap
  'gap',

  // Margin
  'margin',
];

export function loadConfig(path) {
  const cfg = config.load(path);

  // Load all plugins in the order defined by `order`.
  let byClassname = {};
  let i = 0;
  order
    .filter((p) => !['preflight', 'container'].includes(p))
    .forEach((plugin) => {
      loadPlugin(cfg, plugin, (classname, _) => {
        byClassname[classname] = i;
        i++;
        breakpoints.forEach((bp) => {
          byClassname[`${bp}:${classname}`] = i;
          i++;
        });
      });
    });
  return byClassname;
}

export function sortClasses(classnames, byClassname) {
  // Remove unwanted repeated spaces:
  classnames = classnames.replace(/\s+/g, ' ');
  const leadingSpace = classnames[0] === ' ';
  const trailingSpace = classnames[classnames.length - 1] === ' ';

  const sorted = classnames
    .split(' ')
    .sort((a, b) => byClassname[a] - byClassname[b])
    .join(' ')
    .trim();

  // Make sure leading or trailing spaces are preserved.
  return `${leadingSpace ? ' ' : ''}${sorted}${trailingSpace ? ' ' : ''}`;
}
