import { get, toPath, kebabCase } from 'lodash';
import * as plugins from 'tailwindcss/lib/plugins';
import transformThemeValue from 'tailwindcss/lib/util/transformThemeValue';

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
    variants,
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

function variants() {}

function getConfigValue(cfg, path, defaultValue) {
  return path ? get(cfg, path, defaultValue) : cfg;
}
