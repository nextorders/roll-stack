<template>
  <UModal :title="$t('app.update.task.title')">
    <template #body>
      <FormUpdateTask
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
