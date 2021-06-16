import resolveConfig from 'tailwindcss/lib/util/resolveConfig';
import getAllConfigs from 'tailwindcss/lib/util/getAllConfigs';

export default {
  load: (path) => {
    const config = require(path);
    return resolveConfig([...getAllConfigs(config), { corePlugins: { caretColor: false, content: false } }]);
  },
};
