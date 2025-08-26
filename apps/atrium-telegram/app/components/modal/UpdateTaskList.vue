<template>
  <UModal :title="$t('app.update.task-list.title')">
    <template #body>
      <FormUpdateTaskList
        :list-id="listId ?? ''"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  listId?: string
}>()

const overlay = useOverlay()
</script>
