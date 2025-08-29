<template>
  <UModal :title="$t('app.create.epic-comment.title')">
    <template #body>
      <FormCreateEpicComment
        :epic-id="epicId"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  epicId: string
}>()

const overlay = useOverlay()
</script>
