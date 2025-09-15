<template>
  <UIcon name="i-lucide-loader" class="size-8 text-primary animate-spin" />
</template>

<script setup lang="ts">
// Data as query param from Telegram
const separator = 'zzzzz'
const { query } = useRoute()
const { tgWebAppStartParam } = query

if (tgWebAppStartParam?.length && tgWebAppStartParam.includes(separator)) {
  const data = tgWebAppStartParam.toString()
  const params = data.split(separator)

  const [key, value] = params

  if (!key || !value) {
    await navigateTo('/')
  }

  if (key === 'epic') {
    await navigateTo(`/epic/${value}`)
  }

  if (key === 'flow') {
    await navigateTo(`/flow/${value}`)
  }
} else {
  await navigateTo('/')
}
</script>
