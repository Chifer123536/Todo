const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const prettier = require('eslint-plugin-prettier');

module.exports = [
  {
    // Какие файлы НЕ линтить
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/backend/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/.out/**',
      '**/frontend/jest.config.ts',
      '**/frontend/jest.setup.ts',
      '**/frontend/next-env.d.ts',
      '**/frontend/next.config.mjs',
      '**/frontend/postcss.config.js',
      '**/frontend/tailwind.config.ts'
    ]
  },

  // Базовые JS-правила от ESLint
  js.configs.recommended,

  // Правила для TS + React
  {
    files: ['frontend/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser, // Парсер TypeScript
      globals: {
        // Глобальные переменные
        ...require('globals').browser,
        ...require('globals').jest,
        process: 'readonly',
        React: 'readonly'
      },
      parserOptions: {
        project: ['./frontend/tsconfig.json'], // Для правил, зависящих от TS-конфигурации
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    settings: {
      react: { version: 'detect' } // Автоподбор версии React
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      prettier
    },
    rules: {
      // Подтягиваем базовые рекомендуемые правила
      ...tsPlugin.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Ошибки/ворнинги
      'jsx-a11y/alt-text': 'warn', // Все <img> должны иметь alt
      'prettier/prettier': 'error', // Формат по Prettier — ошибка

      // Отключаем устаревшие или избыточные правила
      'react/react-in-jsx-scope': 'off', // В новых React не нужен импорт React
      '@typescript-eslint/no-explicit-any': 'off', // Разрешаем any
      'react/display-name': 'off', // Можно без displayName
      'react/prop-types': 'off', // PropTypes не нужны при TS

      // В TS-проектах иногда ругается на window-функции, но нам нужно
      'no-undef': ['error', { typeof: true }],

      // Отключаем проверку «пустого» интерфейса
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  }
];
