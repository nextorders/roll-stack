export default defineNuxtConfig({
  extends: ['@roll-stack/ui'],
  devtools: {
    componentInspector: false,
  },
  css: ['~/assets/css/styles.css'],
  routeRules: {
    '/**': { prerender: true },
  },
  ui: {
    colorMode: false,
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
  i18n: {
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru-RU.json' },
    ],
    strategy: 'no_prefix',
  },
  compatibilityDate: '2025-02-20',
})
