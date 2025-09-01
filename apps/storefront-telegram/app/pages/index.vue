<template>
  <PageContainer :back="false">
    <div class="flex flex-row gap-3.5 items-center">
      <div class="flex flex-col gap-1">
        <h2 class="text-lg/5 font-bold">
          {{ clientStore.name }}, привет!
        </h2>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
const clientStore = useClientStore()

useHead({
  title: 'Суши Love',
})
</script>
