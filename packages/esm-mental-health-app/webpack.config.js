const config = (module.exports = require('openmrs/default-webpack-config'));
config.overrides.resolve = {
  extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss'],
  alias: {
    '@openmrs/openmrs-form-engine-lib': '@openmrs/openmrs-form-engine-lib/src/index',
  },
};

module.exports = config;
