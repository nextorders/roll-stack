<template>
  <UModal :title="$t('app.update.partner.title')">
    <template #body>
      <FormUpdatePartner
        :partner-id="partnerId"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  partnerId: string
}>()

const overlay = useOverlay()
</script>
