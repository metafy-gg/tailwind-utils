// TODO: Don't read from disk, take a config object as param instead. We want this to work on the web too.
import path from 'path';
import fs from 'fs';

import _ from 'lodash';

import getModuleDependencies from 'tailwindcss/lib/lib/getModuleDependencies';
import resolveConfig from 'tailwindcss/lib/util/resolveConfig';
import getAllConfigs from 'tailwindcss/lib/util/getAllConfigs';
import defaultConfig from 'tailwindcss/stubs/defaultConfig.stub.js';
import { supportedConfigFiles } from 'tailwindcss/lib/constants';

function resolveConfigPath(filePath) {
  // require('tailwindcss')({ theme: ..., variants: ... })
  if (_.isObject(filePath) && !_.has(filePath, 'config') && !_.isEmpty(filePath)) {
    return undefined;
  }

  // require('tailwindcss')({ config: 'custom-config.js' })
  if (_.isObject(filePath) && _.has(filePath, 'config') && _.isString(filePath.config)) {
    return path.resolve(filePath.config);
  }

  // require('tailwindcss')({ config: { theme: ..., variants: ... } })
  if (_.isObject(filePath) && _.has(filePath, 'config') && _.isObject(filePath.config)) {
    return undefined;
  }

  // require('tailwindcss')('custom-config.js')
  if (_.isString(filePath)) {
    return path.resolve(filePath);
  }

  // require('tailwindcss')
  for (const configFile of supportedConfigFiles) {
    try {
      const configPath = path.resolve(configFile);
      fs.accessSync(configPath);
      return configPath;
    } catch (err) {}
  }

  return undefined;
}

const getConfigFunction = (config) => () => {
  if (_.isUndefined(config)) {
    return resolveConfig([...getAllConfigs(defaultConfig), { corePlugins: { caretColor: false, content: false } }]);
  }

  // Skip this if Jest is running: https://github.com/facebook/jest/pull/9841#issuecomment-621417584
  if (process.env.JEST_WORKER_ID === undefined) {
    if (!_.isObject(config)) {
      getModuleDependencies(config).forEach((mdl) => {
        delete require.cache[require.resolve(mdl.file)];
      });
    }
  }

  const configObject = _.isObject(config) ? _.get(config, 'config', config) : require(config);

  return resolveConfig([...getAllConfigs(configObject), { corePlugins: { caretColor: false, content: false } }]);
};

const configPath = './tailwind.config.js';
const resolvedConfigPath = resolveConfigPath(configPath);
export const config = getConfigFunction(resolvedConfigPath || configPath)();
