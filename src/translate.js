import sortedIndex from 'lodash/sortedIndex';

import { loadPlugin } from './plugins.js';
import { config } from './config.js';

let byProperties = {};

// Load all corePlugins into a map where the key is an alphabetically sorted concatenation of the plugin's properties.
config.corePlugins
  .filter((p) => !['preflight', 'container'].includes(p))
  .forEach((plugin) => {
    loadPlugin(plugin, (classname, properties) => {
      // Ignore zero negative margin classes, translate to the regular margin classes instead.
      if (['-m-0', '-mx-0', '-my-0', '-mt-0', '-mb-0', '-ml-0', '-mr-0'].includes(classname)) {
        return;
      }
      const catted = concatProperties(properties);
      byProperties[catted] = classname;
    });
  });

// TODO: If single property is not found, then try searching for multiple matching properties:
// e.g.: `margin-top: 8px; margin-left: 12px` should match `mt-4 ml-3`
// TODO: Convert pixels to rem
export function propertiesToClass(props) {
  const properties = props
    .split(';')
    .map((s) => s.trim())
    .reduce((acc, v) => {
      const [name, value] = v.split(':').map((s) => s.trim());
      acc[name] = value;
      return acc;
    }, {});
  const catted = concatProperties(properties);
  return byProperties[catted];
}

function concatProperties(properties) {
  let sorted = [];
  for (const [property, value] of Object.entries(properties)) {
    const cat = `${property}:${value}`;
    const i = sortedIndex(sorted, cat);
    sorted.splice(i, 0, cat);
  }
  return sorted.join(';');
}