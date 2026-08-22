import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      root: fileURLToPath(new URL('./', import.meta.url)),
      include: ['tests/**/*.{test,spec}.ts'],
      exclude: [...configDefaults.exclude],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/utils/**', 'src/services/mappers/**', 'src/stores/**'],
      },
    },
  }),
)
