<template>
  <UModal :title="$t('app.create.task-list.title')">
    <template #body>
      <FormCreateTaskList
        :chat-id="chatId"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  chatId?: string
}>()

const overlay = useOverlay()
</script>
