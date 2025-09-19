module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: './src/config/.env',
      allowUndefined: true,
      verbose: true
    }],
    'react-native-reanimated/plugin' // ⚠️ phải để cuối cùng
  ]
};
