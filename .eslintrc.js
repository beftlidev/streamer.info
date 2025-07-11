module.exports = {
  env: {
    node: true,
    es6: true,
    browser: true  // document, window vs. için
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-console': 'off',
    'prefer-const': 'off',  // Compiled JS'te var kullanımına izin ver
    'no-var': 'off',        // Compiled JS'te var kullanımına izin ver
    'object-shorthand': 'off',
    'prefer-template': 'off',
    'no-undef': 'off'       // document, window gibi browser globals için
  },
  ignorePatterns: [
    'node_modules/',
    'dist/**/*.d.ts'        // Type definition dosyalarını ignore et
  ]
}; 