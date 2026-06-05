const config = (module.exports = require('openmrs/default-webpack-config'));
config.scriptRuleConfig.exclude = /(node_modules(?![\/\\]@(?:openmrs)))/;

module.exports = config;
