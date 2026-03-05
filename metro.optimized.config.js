/**
 * Optimized Metro Configuration for Production
 * Includes performance optimizations and better caching
 */

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Performance optimizations
config.transformer = {
  ...config.transformer,
  minifierPath: 'metro-minify-terser',
  minifierConfig: {
    ecma: 8,
    keep_classnames: false,
    keep_fnames: false,
    module: true,
    mangle: {
      module: true,
      keep_classnames: false,
      keep_fnames: false,
    },
  },
};

// Better caching
config.cacheStores = [
  ...config.cacheStores,
];

// Optimize resolver
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx', 'json'],
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
};

// Enable Hermes for better performance
config.transformer.hermesParser = true;

module.exports = config;
