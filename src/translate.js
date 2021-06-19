// TODO: omitDefaults, pass options?
const defaults = {
  'border-style': 'solid',
  // ...
};

// TODO: Comment this:
export function propertiesToClass(props, byProperties) {
  let properties = props.split(';').map((s) => {
    const [name, value] = s
      .trim()
      .split(':')
      .map((s) => s.trim());
    return { name, value };
  });

  // TODO: Make it a Map again?
  const removeProperty = (name) => {
    properties = properties.filter((p) => p.name !== name);
  };
  const setProperty = (name, value) => {
    removeProperty(name);
    properties.push({ name, value });
  };

  let classnames = [];

  // Convert between units for certain properties
  let initialProperties = [...properties];
  for (const { name, value } of properties) {
    // Decompose certain CSS rules into multiple properties
    // TODO: Whenever we need to decompose something, insert it directly
    if (name === 'border') {
      // `1px solid rgba(121, 134, 148, 0.65)`
      const borderRe = /([0-9]+px) ([a-z]+) (rgba\([0-9]+, [0-9]+, [0-9]+, [0-9.]+\))/;
      // console.log('value:', value);

      const m = value.match(borderRe);
      if (m) {
        removeProperty('border');

        // TODO: Insert these instantly, no need to consider them and assemble at the end
        // setProperty('border-width', m[1]);
        // TODO: Create an insert function that does this:
        classnames.push(byProperties[concatProperties([{ name: 'border-width', value: m[1] }])]);

        // `solid` is the default border style so we leave it out.
        if (m[2] !== 'solid') {
          setProperty('border-style', m[2]);
        }
        // Border color
        // setProperty('--tw-border-opacity', '1');
        // setProperty('border-color', `rgba(${rgbOnly(m[3])}, var(--tw-border-opacity))`);
        classnames.push(
          byProperties[
            concatProperties([
              { name: '--tw-border-opacity', value: '1' },
              { name: 'border-color', value: `rgba(${rgbOnly(m[3])}, var(--tw-border-opacity))` },
            ])
          ]
        );
        // Border opacity
        // TODO: IF has opacity:
        // pushProperty('--tw-border-opacity', alphaOnly(m[3]));
        classnames.push(byProperties[concatProperties([{ name: '--tw-border-opacity', value: alphaOnly(m[3]) }])]);

        // console.log('properties:', properties);

        // // TODO:
        // console.log('m:', m);
        continue;
      }
    }

    // Leave `0px` alone.
    if (value !== '0px') {
      const conv = convertPxToRem(value);
      if (conv !== null) {
        setProperty(name, conv);
        continue;
      }
    }

    // Only convert percentage for `line-height`, converting other properties (such as `flex: 1 1 0%`) will break them.
    if (name === 'line-height') {
      const conv = convertPercentToDec(value);
      if (conv !== null) {
        setProperty(name, conv);
        continue;
      }
    }

    let setOpacity = false;
    let opacityKind;
    if (name === 'background' || name === 'background-color') {
      opacityKind = 'bg';
      setOpacity = true;
    }
    if (name === 'color') {
      opacityKind = 'text';
      setOpacity = true;
    }
    if (setOpacity) {
      setProperty(`--tw-${opacityKind}-opacity`, '1');
    }
    const conv = convertHexToRgb(value, opacityKind);
    if (conv !== null) {
      // If we've matched a hex value & the rule is called `background`, we change it to `background-color` instead.
      if (name === 'background') {
        setProperty('background-color', conv);
        removeProperty(name);
        // delete properties[name];
      } else {
        setProperty(name, conv);
      }
      continue;
    }
  }

  let skipUnderLength;
  for (const subproperties of subsets(properties)) {
    if (skipUnderLength && subproperties.length < skipUnderLength) {
      // TODO: Hmm? have some rules always show up, like manually added opacity?
      break;
    }

    const catted = concatProperties(subproperties);

    // JIT
    // TODO: Don't look up twice here
    if (catted in byProperties) {
      classnames.push(byProperties[catted]);
      skipUnderLength = subproperties.length;
      continue;
    }

    // TODO: Rethink JIT
    // for (const [name, value] of Object.entries(initialProperties)) {
    //   const jit = ['width', 'height'].includes(name);
    //   if (!jit) {
    //     continue;
    //   }
    //   const zero = byProperties[concatProperties({ [name]: '0px' })];
    //   if (!zero) {
    //     continue;
    //   }
    //   const prefix = zero.slice(0, -1);
    //   classnames.push(`${prefix}[${value}]`);
    // }
  }

  if (classnames.length === 0) {
    return undefined;
  }
  return classnames.join(' ');
}

export function concatProperties(properties) {
  let sorted = [];
  for (let { name, value } of properties) {
    // Normalize decimal numbers. `.80` -> `0.8`, `0.80` -> `0.8`, etc.
    const num = Number(value);
    if (!isNaN(num) && !Number.isInteger(num)) {
      value = num.toString();
    }
    // TODO: Transform Hex colors to lowercase.

    const cat = `${name}:${value}`;
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

function rgbOnly(rgba) {
  const m = rgba.match(/rgba\(([0-9]+, [0-9]+, [0-9]+), [0-9.]+\)/);
  if (m) {
    return m[1];
  }
  return rgba;
}

function alphaOnly(rgba) {
  const m = rgba.match(/rgba\([0-9]+, [0-9]+, [0-9]+, ([0-9.]+)\)/);
  if (m) {
    return m[1];
  }
  return rgba;
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

// Converts "#FFFFFF" to "rgba(255, 255, 255, var(--tw-*)))".
const hexRe = /#([0-9a-fA-F]+)/;
function convertHexToRgb(rule, kind) {
  const match = rule.match(hexRe);
  if (!match) {
    return null;
  }
  const rgb = hexToRgb(match[1]);
  return rule.replace(hexRe, `rgba(${rgb}, var(--tw-${kind}-opacity))`);
}
function hexToRgb(hex) {
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return r + ', ' + g + ', ' + b;
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
