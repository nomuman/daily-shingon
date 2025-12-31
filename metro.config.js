const { getDefaultConfig } = require('expo/metro-config');
const { resolve } = require('metro-resolver');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
  resolveRequest(context, moduleName, platform) {
    if (moduleName === 'tslib') {
      // Avoid Metro picking tslib's "modules/index.js" ESM wrapper on web.
      return resolve(context, 'tslib/tslib.es6.js', platform);
    }
    return resolve(context, moduleName, platform);
  },
};

module.exports = config;
