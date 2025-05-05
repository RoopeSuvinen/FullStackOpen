import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import stylisticJs from '@stylistic/eslint-plugin-js';
import vitestGlobals from "eslint-config-vitest-globals/flat";


export default [
  js.configs.recommended,
  vitestGlobals(),
  { ignores: ['dist', 'node_modules', 'eslint.config.js', 'vite.config.js', '**/coverage/**'] },
  
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic/js': stylisticJs
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/prop-types': 0,
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ["error", "single"],
      '@stylistic/js/semi': ["error", "never"],
      'eqeqeq': 'error',
      '@stylistic/js/no-trailing-spaces': "error",
      '@stylistic/js/object-curly-spacing': ["error", "always"],
      '@stylistic/js/arrow-spacing': ["error", { "before": true, "after": true }],
      'no-console': 0,
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": 0
    }
  },
];