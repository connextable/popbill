import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'
import vitest from '@vitest/eslint-plugin'

export default defineConfig(
  globalIgnores(['legacy', '**/dist', 'node_modules', '.turbo']),
  {
    files: ['**/*.{js,ts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  stylistic.configs.recommended,
  {
    rules: {
      'object-shorthand': ['error', 'always', {
        avoidExplicitReturnArrows: false,
      }],
      '@typescript-eslint/no-floating-promises': ['error'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        args: 'all',
        caughtErrors: 'all',
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
    },
  },
  {
    files: ['**/*.test.{ts,tsx,js,jsx}'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/consistent-test-it': ['error', {
        fn: 'test',
      }],
      'vitest/consistent-vitest-vi': ['error', {
        fn: 'vi',
      }],
      // type-aware parser 설정 없이도 test lint가 동작하도록 비활성화
      'vitest/valid-title': 'off',
      'vitest/no-standalone-expect': 'off',
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
)
