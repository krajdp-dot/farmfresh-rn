module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated must be last
      'react-native-reanimated/plugin',
    ],
  };
};
