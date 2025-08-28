<template>
  <UModal :title="$t('app.update.epic.title')">
    <template #body>
      <FormUpdateEpic
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
