<template>
  <UModal :title="$t('app.create.epic.title')">
    <template #body>
      <FormCreateEpic @submitted="overlay.closeAll" @success="overlay.closeAll" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const overlay = useOverlay()
</script>
