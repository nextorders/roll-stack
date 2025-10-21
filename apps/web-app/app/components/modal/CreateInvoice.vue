<template>
  <UModal title="Создание счета">
    <template #body>
      <FormCreateInvoice
        :partner-id="partnerId ?? ''"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  partnerId?: string
}>()

const overlay = useOverlay()
</script>
