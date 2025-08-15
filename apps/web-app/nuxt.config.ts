export default defineNuxtConfig({
  extends: ['@roll-stack/ui'],
  modules: ['nuxt-auth-utils', '@pinia/nuxt', 'nuxt-tiptap-editor'],
  devtools: {
    componentInspector: false,
  },
  runtimeConfig: {
    s3: {
      bucket: '',
      region: '',
      endpoint: '',
      accessKeyId: '',
      secretAccessKey: '',
    },
    ai: {
      model: '',
      baseUrl: '',
      apiKey: '',
      serviceToken: '',
    },
    telegram: {
      wasabiToken: '',
      adminId: '',
    },
    public: {
      mediaUrl: '',
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
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      '* * * * *': ['task:auto-create'], // Every minute
      '0 * * * *': ['kitchen:revenue-update'], // Every hour
      '0 0 * * *': ['kitchen:rating-update'], // Every day
    },
  },
  tiptap: {
    prefix: 'Tiptap',
  },
  compatibilityDate: '2025-02-20',
})
