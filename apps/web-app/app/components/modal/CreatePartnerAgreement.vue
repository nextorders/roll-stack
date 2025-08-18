<template>
  <UModal title="Создание договора">
    <template #body>
      <FormCreatePartnerAgreement
        :legal-entity-id="legalEntityId ?? ''"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  legalEntityId?: string
}>()

const overlay = useOverlay()
</script>
