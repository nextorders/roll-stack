<template>
  <div class="aspect-3/2 bg-primary rounded-lg">
    <div class="w-full h-full p-4 flex flex-col justify-between tg-text-button">
      <div class="text-lg/5 font-semibold">
        {{ clientStore.fullName }}
      </div>
      <div class="text-3xl/5 font-bold">
        5%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const clientStore = useClientStore()
</script>
