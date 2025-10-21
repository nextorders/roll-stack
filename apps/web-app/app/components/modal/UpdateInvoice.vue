<template>
  <UModal title="Обновление счета">
    <template #body>
      <FormUpdateInvoice
        :invoice-id="invoiceId"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  invoiceId: string
}>()

const overlay = useOverlay()
</script>
