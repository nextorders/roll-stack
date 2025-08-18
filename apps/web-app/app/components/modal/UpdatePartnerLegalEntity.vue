<template>
  <UModal title="Обновление юридического лица">
    <template #body>
      <FormUpdatePartnerLegalEntity
        :entity-id="entityId"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  entityId: string
}>()

const overlay = useOverlay()
</script>
