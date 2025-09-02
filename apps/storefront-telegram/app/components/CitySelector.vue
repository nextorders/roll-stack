<template>
  <UDrawer
    v-if="cityStore.cities.length && !cityStore.selected"
    :open="isCitySelectOpened"
    :dismissible="false"
    should-scale-background
    :set-background-color-on-scale="false"
    :ui="{
      content: 'max-h-10/12 !mt-150',
      overlay: 'tg-content-safe-area-top',
    }"
  >
    <template #content>
      <div class="p-4 flex flex-col gap-3 overflow-y-auto">
        <h3 class="text-lg font-semibold">
          Выберите город
        </h3>

        <UCheckboxGroup
          v-model="selectedCities"
          color="primary"
          variant="card"
          size="lg"
          :items="items"
          icon="i-lucide-map-pin"
          :ui="{
            item: 'items-center',
            label: '!text-lg',
          }"
        />
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import type { CheckboxGroupItem } from '@nuxt/ui'

const cityStore = useCityStore()

const items = ref<CheckboxGroupItem[]>(cityStore.cities.map((c) => ({ label: c.name, value: c.id })))

const selectedCities = ref<string[]>([])
const isCitySelectOpened = ref(true)

watch(selectedCities, () => {
  if (!selectedCities.value.length) {
    isCitySelectOpened.value = true
    return
  }

  cityStore.selected = cityStore.cities.find((c) => c.id === selectedCities.value[0])
  isCitySelectOpened.value = false
})
</script>
