<template>
  <USwitch
    v-model="taskStore.isTodayOnly"
    size="xl"
    color="secondary"
    :label="taskStore.isTodayOnly ? 'Сегодня' : 'Все задачи'"
    :default-value="taskStore.isTodayOnly"
    :ui="{
      root: 'flex-row-reverse items-center',
      label: 'mr-3 text-base/5 md:text-lg/5 font-semibold',
    }"
    @change="vibrate"
  />
</template>

<script setup lang="ts">
const { vibrate } = useFeedback()
const taskStore = useTaskStore()
</script>
