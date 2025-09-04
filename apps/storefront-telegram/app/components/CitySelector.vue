<template>
  <UDrawer
    v-if="clientStore.cities.length && !clientStore.selectedCityId"
    :open="clientStore.isCitySelectorOpened"
    :dismissible="false"
    should-scale-background
    :set-background-color-on-scale="false"
    :ui="{
      content: 'max-h-10/12',
    }"
  >
    <template #content>
      <div class="p-4 pb-20 flex flex-col gap-3 overflow-y-auto">
        <h3 class="text-lg font-semibold">
          Выберите город
        </h3>

        <div class="flex flex-col gap-1">
          <UButton
            v-for="city in clientStore.cities"
            :key="city.id"
            variant="outline"
            color="neutral"
            size="xl"
            class="ring-muted font-medium"
            :label="city.name"
            @click="clientStore.updateCity(city.id)"
          />
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
const clientStore = useClientStore()
</script>
