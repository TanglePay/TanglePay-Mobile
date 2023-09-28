module.exports = {
  preset: 'react-native',
  compilerOptions: {
    baseUrl: '.',
    paths: {
      '@/*': ['./src/*'],
      '#/*': ['./native-base-theme/*'],
      '@sdk/*': ['./sdk/*'],
    },
  },
  exclude: ['node_modules', '.vscode', '.expo', '.expo-shared', 'bin'],
};
