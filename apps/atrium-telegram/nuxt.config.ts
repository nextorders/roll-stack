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
