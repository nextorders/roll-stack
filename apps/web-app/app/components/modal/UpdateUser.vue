<template>
  <UModal :title="$t('app.update.user.title')">
    <template #body>
      <FormUpdateUser
        :user-id="userId ?? ''"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  userId?: string
}>()

const overlay = useOverlay()
</script>
