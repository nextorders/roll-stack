<template>
  <UModal title="Настройка уведомлений">
    <template #body>
      <FormUpdateUserNotifications
        :user-id="userId"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  userId: string
}>()

const overlay = useOverlay()
</script>
