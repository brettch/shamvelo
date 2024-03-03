/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // Add this when we have proper types.
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    '/.eslintrc.cjs',
    "/dist",
    "/src/strava"
  ],
  plugins: ['@typescript-eslint'],
  root: true,
};
