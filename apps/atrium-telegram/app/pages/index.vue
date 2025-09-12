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

    <div class="flex flex-col gap-2">
      <NuxtLink
        v-for="item in flowStore.items"
        :key="item.id"
        :to="`/flow/${item.id}`"
        class="motion-preset-slide-left"
      >
        <FlowItemCard :item="item" />
      </NuxtLink>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
const flowStore = useFlowStore()

useHead({
  title: 'Суши Атриум',
})
</script>
