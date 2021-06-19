import { get, toPath, kebabCase } from 'lodash';
import * as plugins from 'tailwindcss/lib/plugins';
import transformThemeValue from 'tailwindcss/lib/util/transformThemeValue';

import { order } from './sort';
import { concatProperties } from './translate.js';

const ignorePlugins = ['preflight', 'container'];

// Map Tailwind class names to their resulting properties.
export function propertiesByClassname(cfg) {
  let byClassname = {};
  cfg.corePlugins
    .filter((p) => !ignorePlugins.includes(p))
    .forEach((plugin) => {
      loadPlugin(cfg, plugin, (classname, properties) => {
        byClassname[classname] = concatProperties(Object.entries(properties).map(([name, value]) => ({ name, value })));
      });
    });
  return byClassname;
}

// Load all plugins in the order defined by `order`.
export function orderByClassname(cfg) {
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

// Load all corePlugins into a map where the key is an alphabetically sorted concatenation of the plugin's properties.
export function classnameByProperties(cfg) {
  // Ignore zero negative margin classes, translate to the regular margin classes instead.
  const ignoreClassnames = ['-m-0', '-mx-0', '-my-0', '-mt-0', '-mb-0', '-ml-0', '-mr-0'];

  let byProperties = {};
  cfg.corePlugins
    .filter((p) => !ignorePlugins.includes(p))
    .forEach((plugin) => {
      loadPlugin(cfg, plugin, (classname, properties) => {
        if (ignoreClassnames.includes(classname)) {
          return;
        }
        const catted = concatProperties(Object.entries(properties).map(([name, value]) => ({ name, value })));
        byProperties[catted] = classname;
      });
    });
  return byProperties;
}

export function loadPlugin(cfg, name, load) {
  if (!(name in plugins)) {
    throw new Error(`plugin '${name}' doesn't exist`);
  }
  plugins[name]()({
    addUtilities: (twrules) => {
      let source = twrules;
      if (Array.isArray(twrules)) {
        if (twrules.length > 1) {
          source = twrules.reduce((acc, v) => {
            for (const [key, val] of Object.entries(v)) {
              acc[key] = val;
            }
            return acc;
          }, {});
        } else if (twrules.length === 1) {
          source = twrules[0];
        }
      }
      loadPluginRules(source, load);
    },
    theme: themeForConfig(cfg),
    variants: () => {},
    corePlugins: () => true,
    prefix: (s) => '--tw' + s,
    config: (key) => get(cfg, key),
  });
}

function loadPluginRules(twrules, load) {
  Object.entries(twrules).forEach(([classname, properties]) => {
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

      const kebab = kebabCase(key);
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
    const [pathRoot, ...subPaths] = toPath(path);
    const value = getConfigValue(cfg, ['theme', pathRoot, ...subPaths], defaultValue);

    const transformedValue = transformThemeValue(pathRoot)(value);
    return transformedValue;
  };
}

function getConfigValue(cfg, path, defaultValue) {
  return path ? get(cfg, path, defaultValue) : cfg;
}
