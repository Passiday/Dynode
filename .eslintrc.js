module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    project: "tsconfig.json",
  },
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  rules: {
    'no-console': 'off',
    'max-classes-per-file': 'off',
    'no-plusplus': 'off',
    'func-names': 'off',
  },
};
