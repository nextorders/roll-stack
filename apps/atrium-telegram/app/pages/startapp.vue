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

  const query = { from: 'startapp' }

  switch (key) {
    case 'flow':
      await navigateTo({ path: `/flow/${value}`, query })
      break
    case 'epic':
      await navigateTo({ path: `/epic/${value}`, query })
      break
    case 'ticket':
      await navigateTo({ path: `/ticket/${value}`, query })
      break
    default:
      await navigateTo('/')
  }
} else {
  await navigateTo('/')
}
</script>
