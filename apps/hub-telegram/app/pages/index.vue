<template>
  <PageContainer :back="false" class="flex flex-col gap-y-8">
    <div class="flex flex-col gap-2.5">
      <SectionTitle title="Мое пространство" />

      Чуть позже
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'index',
})

useHead({
  title: 'Васаби Хаб',
})
</script>
