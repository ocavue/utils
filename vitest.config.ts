import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    hookTimeout: 60000,
    coverage: {
      enabled: true,
      reporter: ['text', 'json-summary', 'json'],
    },
  },
})
