const config = require('openmrs/default-rspack-config');
config.scriptRuleConfig.exclude = /(node_modules(?![\/\\]@(?:openmrs)))/;
module.exports = config;
