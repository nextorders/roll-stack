<template>
  <UModal :title="$t('app.attach.telegram.title')">
    <template #body>
      <FormAttachTelegram
        :user-id="userId"
        :bot-id="botId"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  userId: string
  botId: string
}>()

const overlay = useOverlay()
</script>
