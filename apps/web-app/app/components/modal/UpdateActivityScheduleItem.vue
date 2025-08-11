<template>
  <UModal :title="$t('app.update.activity-schedule-item.title')">
    <template #body>
      <FormUpdateActivityScheduleItem
        :schedule-id="scheduleId"
        :item-id="itemId"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  scheduleId: string
  itemId: string
}>()

const overlay = useOverlay()
</script>
