<template>
  <UModal :title="$t('app.update.user-photo.title')">
    <template #body>
      <FormUploadUserAvatar
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const overlay = useOverlay()
</script>
