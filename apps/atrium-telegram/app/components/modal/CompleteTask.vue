<template>
  <UModal :title="$t('app.update.task.completion')">
    <template #body>
      <FormCompleteTask
        :task-id="taskId ?? ''"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  taskId?: string
}>()

const overlay = useOverlay()
</script>
