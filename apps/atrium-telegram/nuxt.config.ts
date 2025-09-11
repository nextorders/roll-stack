export default defineNuxtConfig({
  extends: ['@roll-stack/ui'],
  modules: ['@pinia/nuxt'],
  devtools: {
    componentInspector: false,
  },
  devServer: {
    port: 4300,
    host: 'app.local',
    https: {
      key: '../../.cert/localhost-key.pem',
      cert: '../../.cert/localhost.pem',
    },
  },
  routeRules: {
    '/**': { ssr: false },
    '/api/**': { prerender: false },
  },
  runtimeConfig: {
    telegram: {
      atriumBotId: '',
      atriumBotToken: '',
      devBotToken: '',
      adminId: '',
      teamGroupId: '',
    },
    public: {
      coreApiUrl: '',
    },
  },
  app: {
    rootAttrs: {
      'data-vaul-drawer-wrapper': '',
    },
  },
  ui: {
    colorMode: true,
    fonts: true,
  },
  colorMode: {
    storageKey: 'color-mode',
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
  css: ['~/assets/css/styles.css'],
  i18n: {
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru-RU.json' },
    ],
    strategy: 'no_prefix',
  },
  pinia: {
    storesDirs: ['./app/stores/**'],
  },
  compatibilityDate: '2025-08-22',
})
