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
      modelPro: '',
      baseUrl: '',
      apiKey: '',
      serviceToken: '',
    },
    telegram: {
      wasabiBotId: '',
      atriumBotId: '',
      adminId: '',
      teamGroupId: '',
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
      '0 17 * * 1-5': ['ai:daily-report'], // Mon-Fri 17:00
    },
  },
  tiptap: {
    prefix: 'Tiptap',
  },
  compatibilityDate: '2025-02-20',
})
