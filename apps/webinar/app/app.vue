<template>
  <UApp
    :locale="locales[locale]"
    class="min-h-svh"
  >
    <NuxtLoadingIndicator :color="false" class="bg-primary h-[2px]" />
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()

const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

useHead({
  htmlAttrs: {
    lang,
    dir,
  },
  script: [
    {
      type: 'text/javascript',
      src: '/vk-pixel.min.js',
    },
    {
      type: 'text/javascript',
      src: '/metric.min.js',
    },
  ],
})
</script>
