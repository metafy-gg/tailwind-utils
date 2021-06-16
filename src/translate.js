import { loadPlugin } from './plugins.js';
import config from './config.js';
import { concatProperties } from './translate-slim.js';

// Ignore zero negative margin classes, translate to the regular margin classes instead.
const ignoreClassnames = ['-m-0', '-mx-0', '-my-0', '-mt-0', '-mb-0', '-ml-0', '-mr-0'];
const ignorePlugins = ['preflight', 'container'];

// Load all corePlugins into a map where the key is an alphabetically sorted concatenation of the plugin's properties.
export function loadConfig(path) {
  const cfg = config.load(path);
  
  let byProperties = {};
  cfg.corePlugins
    .filter((p) => !ignorePlugins.includes(p))
    .forEach((plugin) => {
      loadPlugin(cfg, plugin, (classname, properties) => {
        if (ignoreClassnames.includes(classname)) {
          return;
        }
        const catted = concatProperties(properties);
        byProperties[catted] = classname;
      });
    });
  return byProperties;
}
