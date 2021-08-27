'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var resolveConfig = require('tailwindcss/lib/util/resolveConfig.js');
var getAllConfigs = require('tailwindcss/lib/util/getAllConfigs.js');
var lodash = require('lodash');
var plugins = require('tailwindcss/lib/plugins.js');
var transformThemeValue = require('tailwindcss/lib/util/transformThemeValue.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var resolveConfig__default = /*#__PURE__*/_interopDefaultLegacy(resolveConfig);
var getAllConfigs__default = /*#__PURE__*/_interopDefaultLegacy(getAllConfigs);
var plugins__namespace = /*#__PURE__*/_interopNamespace(plugins);
var transformThemeValue__default = /*#__PURE__*/_interopDefaultLegacy(transformThemeValue);

var config = {
  load: (path) => {
    const config = require(path);
    return resolveConfig__default['default']([...getAllConfigs__default['default'](config), { corePlugins: { caretColor: false, content: false } }]);
  },
};

var config$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': config
});

// TODO: variants

let order = [
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

// TODO: Add an option to disable inserting breakpoints.
function sortClasses(classnames, byClassname) {
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

const defaults = {
  'border-style': 'solid',
  'font-style': 'not-italic',
  'box-sizing': 'box-border',
  '--tw-bg-opacity': '1',
  '--tw-border-opacity': '1',
  '--tw-text-opacity': '1',
};
// List of properties for which we'll try to snap to nearest.
const snapToNearest = ['--tw-border-opacity', '--tw-bg-opacity'];

function propertiesToClass(
  props,
  byProperties,
  options = { omitDefaults: true, opacityShorthand: true, snapToNearest: true }
) {
  const lookup = (...properties) => {
    // TODO: Snap this to nearest too?
    return byProperties[concatProperties(...properties)];
  };

  let properties = Object.fromEntries(
    props.split(';').map((s) => {
      const [name, value] = s
        .trim()
        .split(':')
        .map((s) => s.trim());
      return [name, value];
    })
  );

  let classnames = [];
  let toLookup = { ...properties };
  for (let [name, value] of Object.entries(properties)) {
    // Rename semi-equivalent property names.
    name = rename(name);

    // Convert between units for certain properties.
    value = convert(name, value);

    // Directly decompose complex CSS rules into multiple properties, after all conversions have run.
    if (decompose(name, value, properties, classnames, byProperties, options)) {
      continue;
    }

    // Otherwise, mark converted property for lookup
    toLookup[name] = value;
  }

  // Iterate over all possible combinations (power set) of properties.
  // First we try to lookup all three
  let skipUnderLength;
  for (const subprops of subsets(Object.entries(toLookup))) {
    if (subprops.length === 0 || (skipUnderLength && subprops.length < skipUnderLength)) {
      break;
    }

    const [[name]] = subprops;
    const found = lookup(subprops);
    if (found && (!options.omitDefaults || defaults[name] !== found)) {
      classnames.push(found);
      skipUnderLength = subprops.length;
      continue;
    }

    // JIT
    for (const [name, value] of subprops) {
      const jit = ['width', 'height'].includes(name);
      if (!jit) {
        continue;
      }
      const zero = lookup([[name, '0px']]);
      if (!zero) {
        continue;
      }
      const prefix = zero.slice(0, -1);
      classnames.push(`${prefix}[${value}]`);
    }
  }

  if (classnames.length === 0) {
    return undefined;
  }
  return classnames.join(' ');
}

function rename(name) {
  if (name === 'background') {
    return 'background-color';
  }
  return name;
}

const rgbaRe = /rgba\([0-9]+, [0-9]+, [0-9]+, [0-9.]+\)/;

function convert(name, value) {
  // Don't convert `0px` as it breaks spacing classes.
  // Border values are in px, so don't convert.
  if (name !== 'border' && value !== '0px') {
    const conv = convertPxToRem(value);
    if (conv !== null) {
      return conv;
    }
  }

  // Only convert percentage for `line-height`, converting other properties (such as `flex: 1 1 0%`) will break them.
  if (name === 'line-height') {
    const conv = convertPercentToDec(value);
    if (conv !== null) {
      return conv;
    }
  }

  let conv = convertHexToRgb(value);
  if (conv !== null) {
    return conv;
  }

  return value;
}

// Converts pixels to rem, like `16px` to `1rem`, or `24px` to `1.5rem`.
const baseFontSize = 16;
const pxRe = /([0-9]+)px/;
function convertPxToRem(rule) {
  const match = rule.match(pxRe);
  if (!match) {
    return null;
  }
  const px = parseInt(match[1]);
  const rem = px / baseFontSize;
  return rule.replace(pxRe, `${rem}rem`);
}

// Converts percentage to number, like `100%` to `1`, or `150%` to `1.5`.
const percRe = /([0-9]+)%/;
function convertPercentToDec(rule) {
  const match = rule.match(percRe);
  if (!match) {
    return null;
  }
  const perc = parseInt(match[1]);
  const dec = perc / 100;
  return rule.replace(percRe, dec);
}

// Converts "#FFFFFF" to "rgba(255, 255, 255, 1)".
const hexRe = /#([0-9a-fA-F]+)/;
function convertHexToRgb(rule) {
  const match = rule.match(hexRe);
  if (!match) {
    return null;
  }
  const rgb = hexToRgb(match[1]);
  return rule.replace(hexRe, `rgba(${rgb}, 1)`);
}
function hexToRgb(hex) {
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return r + ', ' + g + ', ' + b;
}

/**
 * @returns {boolean} If anything was decomposed or not.
 */
function decompose(name, value, properties, classnames, byProperties, options) {
  const lookup = (...properties) => {
    const f = byProperties[concatProperties(...properties)];
    if (f) {
      return f;
    }

    for (const prop of properties) {
      for (const [name, value] of prop) {
        if (!snapToNearest.includes(name)) {
          continue;
        }
        // TODO: Only works for decimal numbers
        let v = parseFloat(value);

        const distance = 3;
        for (let i = v - distance / 100; i < v + distance / 100; i += 0.01) {
          const sf =
            byProperties[concatProperties(...properties.filter(([[n]]) => n !== name), [[name, i.toFixed(2)]])];
          if (sf) {
            return sf;
          }
        }
      }
    }
    return;
  };
  // Finds classname and inserts it directly, without needing to compose it out of multiple properties.
  const pushClassname = (...properties) => {
    const found = lookup(properties);
    if (found) {
      classnames.push(found);
    }
  };

  if (name === 'color') {
    if (!value.match(rgbaRe)) {
      return false;
    }

    const opacity = alphaOnly(value);

    if (options.opacityShorthand) {
      // Look up color class manually, but don't add it yet. Afterwards we check to see if we can find the opacity value and if so we push the joined classes, like `${color}/${opacity}`
      // Text color
      let colorClassname = lookup([
        ['--tw-text-opacity', '1'],
        ['color', `rgba(${rgbOnly(value)}, var(--tw-text-opacity))`],
      ]);
      // Text opacity
      const found = lookup([['--tw-text-opacity', opacity]]);
      if (found && (!options.omitDefaults || opacity !== defaults['--tw-text-opacity'])) {
        const opacityValue = found.slice(found.lastIndexOf('-') + 1, found.length);
        colorClassname += '/' + opacityValue;
      }
      classnames.push(colorClassname);
    } else {
      // Text color
      pushClassname(['--tw-text-opacity', '1'], ['color', `rgba(${rgbOnly(value)}, var(--tw-text-opacity))`]);
      // Text opacity
      if (!options.omitDefaults || opacity !== defaults['--tw-text-opacity']) {
        pushClassname(['--tw-text-opacity', opacity]);
      }
    }

    return true;
  }
  if (name === 'background-color') {
    if (!value.match(rgbaRe)) {
      return false;
    }

    const opacity = alphaOnly(value);

    if (options.opacityShorthand) {
      // Look up color class manually, but don't add it yet. Afterwards we check to see if we can find the opacity value and if so we push the joined classes, like `${color}/${opacity}`
      // Background color
      let colorClassname = lookup([
        ['--tw-bg-opacity', '1'],
        ['background-color', `rgba(${rgbOnly(value)}, var(--tw-bg-opacity))`],
      ]);
      // Background opacity
      const found = lookup([['--tw-bg-opacity', opacity]]);
      if (found && (!options.omitDefaults || opacity !== defaults['--tw-bg-opacity'])) {
        const opacityValue = found.slice(found.lastIndexOf('-') + 1, found.length);
        colorClassname += '/' + opacityValue;
      }
      classnames.push(colorClassname);
    } else {
      // Background color
      pushClassname(['--tw-bg-opacity', '1'], ['background-color', `rgba(${rgbOnly(value)}, var(--tw-bg-opacity))`]);
      // Background opacity
      if (!options.omitDefaults || opacity !== defaults['--tw-bg-opacity']) {
        pushClassname(['--tw-bg-opacity', opacity]);
      }
    }
    return true;
  }
  if (name === 'border') {
    // `1px solid rgba(121, 134, 148, 0.65)`
    const borderRe = /([0-9]+px) ([a-z]+) (rgba\([0-9]+, [0-9]+, [0-9]+, [0-9.]+\))/;
    const m = value.match(borderRe);
    if (!m) {
      return false;
    }

    const [_, borderWidth, borderStyle, borderColor] = m;
    delete properties['border'];
    // Border width
    pushClassname(['border-width', borderWidth]);

    const opacity = alphaOnly(borderColor);

    // Border style
    if (!options.omitDefaults || borderStyle !== defaults['border-style']) {
      pushClassname(['border-style', borderStyle]);
    }

    if (options.opacityShorthand) {
      // Look up color class manually, but don't add it yet. Afterwards we check to see if we can find the opacity value and if so we push the joined classes, like `${color}/${opacity}`
      // Border color
      let colorClassname = lookup([
        ['--tw-border-opacity', '1'],
        ['border-color', `rgba(${rgbOnly(borderColor)}, var(--tw-border-opacity))`],
      ]);
      // Border opacity
      const found = lookup([['--tw-border-opacity', opacity]]);
      if (found && (!options.omitDefaults || opacity !== defaults['--tw-border-opacity'])) {
        const opacityValue = found.slice(found.lastIndexOf('-') + 1, found.length);
        colorClassname += '/' + opacityValue;
      }
      classnames.push(colorClassname);
    } else {
      // Border color
      pushClassname(
        ['--tw-border-opacity', '1'],
        ['border-color', `rgba(${rgbOnly(borderColor)}, var(--tw-border-opacity))`]
      );
      // Border opacity
      if (!options.omitDefaults || opacity !== defaults['--tw-border-opacity']) {
        pushClassname(['--tw-border-opacity', opacity]);
      }
    }
    return true;
  }
  return false;
}

function rgbOnly(rgba) {
  const m = rgba.match(/rgba\(([0-9]+, [0-9]+, [0-9]+), [0-9.]+\)/);
  return m ? m[1] : rgba;
}

function alphaOnly(rgba) {
  const m = rgba.match(/rgba\([0-9]+, [0-9]+, [0-9]+, ([0-9.]+)\)/);
  return m ? m[1] : rgba;
}

function concatProperties(properties) {
  let sorted = [];
  for (let [name, value] of properties) {
    // Normalize decimal numbers. `.80` -> `0.8`, `0.80` -> `0.8`, etc.
    const num = Number(value);
    if (!isNaN(num) && !Number.isInteger(num)) {
      value = num.toString();
    }
    // Transform everything to lowercase (especially useful for hex colors).
    const cat = `${name}:${value}`.toLowerCase();
    const i = sortedIndex(sorted, cat);
    sorted.splice(i, 0, cat);
  }
  return sorted.join(';');
}

function* subsets(array, offset = 0) {
  while (offset < array.length) {
    let first = array[offset++];
    for (let subset of subsets(array, offset)) {
      subset.push(first);
      yield subset;
    }
  }
  yield [];
}

// Lodash `sortedIndex` implementation:
const MAX_ARRAY_LENGTH = 4294967295;
const MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1;
function sortedIndex(array, value, retHighest) {
  let low = 0;
  let high = array == null ? low : array.length;

  if (typeof value === 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
    while (low < high) {
      const mid = (low + high) >>> 1;
      const computed = array[mid];
      if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return high;
  }
  return baseSortedIndexBy(array, value, (value) => value, retHighest);
}
function baseSortedIndexBy(array, value, iteratee, retHighest) {
  let low = 0;
  let high = array == null ? 0 : array.length;
  if (high == 0) {
    return 0;
  }

  value = iteratee(value);

  const valIsNaN = value !== value;
  const valIsNull = value === null;
  const valIsSymbol = isSymbol(value);
  const valIsUndefined = value === undefined;

  while (low < high) {
    let setLow;
    const mid = Math.floor((low + high) / 2);
    const computed = iteratee(array[mid]);
    const othIsDefined = computed !== undefined;
    const othIsNull = computed === null;
    const othIsReflexive = computed === computed;
    const othIsSymbol = isSymbol(computed);

    if (valIsNaN) {
      setLow = retHighest || othIsReflexive;
    } else if (valIsUndefined) {
      setLow = othIsReflexive && (retHighest || othIsDefined);
    } else if (valIsNull) {
      setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
    } else if (valIsSymbol) {
      setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
    } else if (othIsNull || othIsSymbol) {
      setLow = false;
    } else {
      setLow = retHighest ? computed <= value : computed < value;
    }
    if (setLow) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return Math.min(high, MAX_ARRAY_INDEX);
}
function isSymbol(value) {
  const type = typeof value;
  return type == 'symbol' || (type === 'object' && value != null && getTag(value) == '[object Symbol]');
}
const toString = Object.prototype.toString;
function getTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return toString.call(value);
}

const ignorePlugins = ['preflight', 'container'];

// Load all plugins in the order defined by `order`.
function orderByClassname(cfg) {
  const breakpoints = Object.keys(cfg.theme.screens);

  let byClassname = {};
  let i = 0;
  order
    .filter((p) => !ignorePlugins.includes(p))
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

function loadPlugin(cfg, name, load) {
  if (!(name in plugins__namespace)) {
    throw new Error(`plugin '${name}' doesn't exist`);
  }
  plugins__namespace[name]()({
    // Since Tailwind 2.2, dynamic rules are loaded using `matchUtilities`, and static rules are loaded using `addUtilities`.
    matchUtilities: (rules, { values }) => {
      // TODO: animate
      if (rules.animate) {
        return;
      }

      let calculatedRules = {};
      for (const [prefix, matcher] of Object.entries(rules)) {
        for (const [suffix, amount] of Object.entries(values)) {
          const neg = suffix.startsWith('-');
          let classname = `.${neg ? '-' : ''}${prefix}`;
          if (!neg && suffix !== 'DEFAULT') {
            classname += '-';
          }
          if (suffix !== 'DEFAULT') {
            classname += suffix;
          }
          classname = classname.replace('/', '\\/');
          const properties = matcher(amount);
          calculatedRules[classname] = properties;
        }
      }
      loadPluginRules(calculatedRules, load);
    },
    addUtilities: (rules) => {
      let source = rules;
      if (Array.isArray(rules)) {
        if (rules.length > 1) {
          source = rules.reduce((acc, v) => {
            for (const [key, val] of Object.entries(v)) {
              acc[key] = val;
            }
            return acc;
          }, {});
        } else if (rules.length === 1) {
          source = rules[0];
        }
      }
      loadPluginRules(source, load);
    },
    theme: themeForConfig(cfg),
    variants: () => {},
    addBase: () => {},
    corePlugins: () => true,
    prefix: (s) => '--tw' + s,
    config: (key) => lodash.get(cfg, key),
  });
}

function loadPluginRules(rules, load) {
  Object.entries(rules).forEach(([classname, properties]) => {
    // `space-{}` classnames contain the full CSS selector, which is like `.space-y-150 > :not([hidden]) ~ :not([hidden])`
    // but we only want the first part, so copy everything until the first space.
    let spaceIdx = classname.indexOf(' ');
    if (spaceIdx !== -1) {
      classname = classname.slice(0, spaceIdx);
    }

    // Convert camelCase rules into kebab-case.
    for (const key in properties) {
      // Don't convert variable names like `--tw-bg-opacity`
      if (key.startsWith('--tw-')) {
        continue;
      }

      const kebab = lodash.kebabCase(key);
      if (!(kebab in properties)) {
        properties[kebab] = properties[key];
        delete properties[key];
      }
    }

    load(classname.slice(1), properties);
  });
}

function themeForConfig(cfg) {
  return function (path, defaultValue) {
    const [pathRoot, ...subPaths] = lodash.toPath(path);
    const value = getConfigValue(cfg, ['theme', pathRoot, ...subPaths], defaultValue);

    const transformedValue = transformThemeValue__default['default'](pathRoot)(value);
    return transformedValue;
  };
}

function getConfigValue(cfg, path, defaultValue) {
  return path ? lodash.get(cfg, path, defaultValue) : cfg;
}

function responsive({ byClassname, breakpoints }, ...classnames) {
  const occ = {};
  for (const classname of classnames) {
    const cls = classname.split(' ');
    for (const c of cls) {
      const propertyName = byClassname[c].split(':')[0];
      if (propertyName in occ) {
        occ[propertyName].push(c);
      } else {
        occ[propertyName] = [c];
      }
    }
  }
  const clashing = Object.entries(occ)
    .filter(([_, classnames]) => classnames.length > 1)
    .map(([_, classnames]) => [...new Set(classnames)]);

  let resp = '';
  for (const classnames of clashing) {
    for (const [i, classname] of classnames.entries()) {
      resp += `${breakpoints[i - 1] ? breakpoints[i - 1] + ':' : ''}${classname} `;
    }
  }
  return resp.trim();
}

exports.config = config$1;
exports.orderByClassname = orderByClassname;
exports.propertiesToClass = propertiesToClass;
exports.responsive = responsive;
exports.sortClasses = sortClasses;
