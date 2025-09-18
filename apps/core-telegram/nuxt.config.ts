export default defineNuxtConfig({
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
    telegram: {
      localBotApiServerUrl: '',
      wasabiBotId: '',
      atriumBotId: '',
      orderBotId: '',
      adminId: '',
      teamGroupId: '',
      filesGroupId: '',
    },
    public: {
      mediaUrl: '',
    },
  },
  css: ['~/assets/css/styles.css'],
  compatibilityDate: '2025-02-20',
})
