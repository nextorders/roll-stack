import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

function resolvePath(path: string) {
  const currentDir = dirname(fileURLToPath(import.meta.url))

  return join(currentDir, path)
}

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],
  experimental: {
    typedPages: true,
  },
  i18n: {
    langDir: 'locales',
    defaultLocale: 'ru',
    vueI18n: resolvePath('./i18n/vue-i18n.options.ts'),
    detectBrowserLanguage: {
      useCookie: true,
      alwaysRedirect: true,
    },
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru-RU.json' },
    ],
  },
  css: [resolvePath('./app/assets/css/main.css')],
  icon: {
    customCollections: [
      { prefix: 'sushi', dir: resolvePath('./app/assets/icons') },
    ],
    clientBundle: {
      scan: {
        globInclude: ['app/**/*.{vue,ts}'],
        globExclude: ['node_modules', 'dist', 'build', 'coverage', 'test', 'tests', '.*'],
      },
    },
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',
})
