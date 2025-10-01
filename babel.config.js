module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        alias: {
          '@': './', // maps @ to project root
        },
      },
    ],
  ],
};
