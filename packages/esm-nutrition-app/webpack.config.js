const config = (module.exports = require('openmrs/default-webpack-config'));
config.scriptRuleConfig.exclude = /(node_modules(?![\/\\]@(?:openmrs)))/;
config.overrides.resolve = {
  extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss'],
  alias: {
    '@openmrs/esm-form-engine-lib': '@openmrs/esm-form-engine-lib/src/index',
  },
};

module.exports = config;
