<template>
  <UModal :title="$t('app.create.beacon.title')">
    <template #body>
      <FormCreateEpicCommentBeacon
        :comment-id="commentId"
        @submitted="overlay.closeAll"
        @success="overlay.closeAll"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  commentId: string
}>()

const overlay = useOverlay()
</script>
