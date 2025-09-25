<template>
  <div class="flex flex-row gap-2">
    <CountdownTimerItem :value="state.days" label="Дней" />
    <CountdownTimerItem :value="state.hours" label="Часов" />
    <CountdownTimerItem :value="state.minutes" label="Минут" />
    <CountdownTimerItem :value="state.seconds" label="Секунд" />
  </div>
</template>

<script setup lang="ts">
const target = ref(new Date('2025-10-25T00:00:00'))

const state = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

onMounted(() => {
  const interval = setInterval(() => {
    const now = new Date()
    const diff = target.value.getTime() - now.getTime()
    state.value = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }, 1000)

  onBeforeUnmount(() => clearInterval(interval))
})
</script>
