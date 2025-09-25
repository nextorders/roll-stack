export default defineNuxtConfig({
  extends: ['@roll-stack/ui'],
  modules: ['nuxt-auth-utils', '@pinia/nuxt'],
  devtools: {
    componentInspector: false,
  },
  css: ['~/assets/css/styles.css'],
  routeRules: {
    '/**': { swr: true },
  },
  ui: {
    colorMode: true,
    fonts: true,
  },
  fonts: {
    defaults: {
      weights: [400, 500, 600, 700, 800, 900],
      styles: ['normal', 'italic'],
      subsets: [
        'cyrillic-ext',
        'cyrillic',
        'latin-ext',
        'latin',
      ],
    },
    families: [
      {
        name: 'Nunito',
        provider: 'google',
      },
      {
        name: 'Nunito Sans',
        provider: 'google',
      },
    ],
  },
  colorMode: {
    storageKey: 'color-mode',
    fallback: 'light',
  },
  i18n: {
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru-RU.json' },
    ],
    strategy: 'no_prefix',
  },
  pinia: {
    storesDirs: ['./app/stores/**'],
  },
  compatibilityDate: '2025-02-20',
})
