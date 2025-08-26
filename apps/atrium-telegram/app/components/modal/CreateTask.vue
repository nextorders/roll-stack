<template>
  <UModal :title="$t('app.create.task.title')">
    <template #body>
      <FormCreateTask
        :performer-id="performerId"
        :list-id="listId"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  performerId?: string
  listId: string
}>()

const overlay = useOverlay()
</script>
