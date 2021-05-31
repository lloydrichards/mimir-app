module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: [
          '.ts',
          '.tsx',
          '.js',
          '.jsx',
          '.ios.js',
          '.android.js',
          '.android.tsx',
          '.ios.tsx',
        ],
        root: ['./'],
        alias: {
          '@styles': './src/Styles',
        },
      },
    ],
    'jest-hoist',
  ],
};
