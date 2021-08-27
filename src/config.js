import resolveConfig from 'tailwindcss/lib/util/resolveConfig.js';
import getAllConfigs from 'tailwindcss/lib/util/getAllConfigs.js';

export default {
  load: (path) => {
    const config = require(path);
    return resolveConfig([...getAllConfigs(config), { corePlugins: { caretColor: false, content: false } }]);
  },
};
