/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

// Absolute path to your package
const packagePath = '/Users/philippemertens/sources/react-native-modules/IcureCrypto';

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    nodeModulesPaths: [packagePath],
  },
  watchFolders: [packagePath],
};
