// eslintrc.js
// ESLint konfiguracija

module.exports = {
  root: true,
  extends: [
    'universe/native',
    'universe/web',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
