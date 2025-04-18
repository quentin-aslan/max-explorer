// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'vue/no-v-html': 'off',
      'no-console': ['error', { allow: ['error', 'log'] }],
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      'no-trailing-spaces': 'error',
    },
  },
)
