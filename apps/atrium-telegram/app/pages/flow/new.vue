<template>
  <PageContainer>
    <div class="flex flex-col gap-2.5">
      <SectionTitle title="Создание поста" />

      <FormCreateFlowItem @success="handleSuccess()" />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'flow-new',
  canReturn: true,
})

function handleSuccess() {
  return navigateTo('/')
}
</script>
