import resolveConfig from 'tailwindcss/lib/util/resolveConfig.js';
import getAllConfigs from 'tailwindcss/lib/util/getAllConfigs.js';

export function loadConfig(path) {
  const config = require(path);
  return resolveConfig([...getAllConfigs(config), { corePlugins: { caretColor: false, content: false } }]);
}
