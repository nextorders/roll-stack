<template>
  <USwitch
    v-model="taskStore.isTodayOnly"
    size="xl"
    color="secondary"
    :label="taskStore.isTodayOnly ? 'Задачи на сегодня' : 'Показаны все задачи'"
    :ui="{
      root: 'items-center',
      label: 'ml-1.5 text-base/5 font-semibold',
    }"
    @change="vibrate()"
  />
</template>

<script setup lang="ts">
const { vibrate } = useFeedback()
const taskStore = useTaskStore()
</script>
