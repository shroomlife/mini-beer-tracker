// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: [
      '.nuxt/**',
      '.output/**',
      'node_modules/**',
      'public/**',
      'prisma/**/*.db*',
      'dist/**',
    ],
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
)
