const js = require('@eslint/js');

module.exports = [
  {
    ignores: [
      'dist/',
      'coverage/',
      'node_modules/',
      'assets/js/bootstrap.min.js',
      'assets/css/',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        // Browser globals (used in script.js)
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        // Engine globals (callable from script.js at runtime in browser)
        evaluateExpression: 'readonly',
        convertToHex: 'readonly',
        // Node / Jest globals
        module: 'writable',
        require: 'readonly',
        process: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'eqeqeq': 'error',
      'semi': ['error', 'always'],
      'no-undef': 'error',
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { console: 'readonly' },
    },
  },
];