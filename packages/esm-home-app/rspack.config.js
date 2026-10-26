const config = require('openmrs/default-rspack-config');
config.scriptRuleConfig.exclude = /(node_modules(?![\/\\]@(?:openmrs)))/;
// The large chunks are module-federation fallbacks for shared libraries (react-dom, Carbon),
// which the app shell normally provides, so webpack's 244 KiB default budget doesn't fit them.
config.additionalConfig.performance = { maxAssetSize: 1.5 * 1024 * 1024, maxEntrypointSize: 1.5 * 1024 * 1024 };
module.exports = config;
