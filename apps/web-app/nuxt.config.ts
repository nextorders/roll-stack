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
      dailyReportPrompt: '',
    },
    telegram: {
      localBotApiServerUrl: '',
      wasabiBotId: '',
      atriumBotId: '',
      orderBotId: '',
      adminId: '',
      teamGroupId: '',
    },
    public: {
      mediaUrl: '',
    },
  },
  css: ['~/assets/css/styles.css'],
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
