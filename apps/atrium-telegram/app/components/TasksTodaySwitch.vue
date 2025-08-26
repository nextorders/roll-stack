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
    @change="onChange"
  />
</template>

<script setup lang="ts">
const toast = useToast()
const taskStore = useTaskStore()

function onChange() {
  if (taskStore.isTodayOnly) {
    toast.add({
      title: 'Так уже лучше',
      description: 'Фокусируйся на сегодняшних задачах. Ничего не потерялось?',
      icon: 'i-lucide-notebook-text',
      color: 'secondary',
      duration: 2000,
    })
  } else {
    toast.add({
      title: 'Ого, как много задач!',
      description: 'Все и сразу. Ничего не потерялось. Или нет?',
      icon: 'i-lucide-notebook',
      color: 'secondary',
      duration: 2000,
    })
  }
}
</script>
