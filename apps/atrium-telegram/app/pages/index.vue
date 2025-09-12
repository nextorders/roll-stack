<template>
  <PageContainer :back="false">
    <h1 class="text-2xl/6 font-bold tracking-tight">
      Данные на сегодня
    </h1>
    <div class="grid grid-cols-2 gap-2">
      <FlowKitchensOnline />
      <FlowOrdersOnline />
      <FlowOrderAmountAverage />
      <FlowFeedbackAverage />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
useHead({
  title: 'Суши Атриум',
})
</script>
