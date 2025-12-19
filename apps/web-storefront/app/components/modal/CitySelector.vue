<template>
  <UModal
    :ui="{ footer: 'justify-end', header: 'min-h-30 pb-2' }"
    :close="dismissible"
    :dismissible="dismissible"
    class="h-2/3 lg:h-1/2 max-w-sm"
  >
    <template #header>
      <div class="w-full flex flex-col gap-2">
        <div class="flex flex-row gap-4 items-center">
          <img
            src="/sushi-heart.svg"
            alt=""
            class="w-12 h-auto motion-preset-pulse motion-duration-4000"
          >

          <div class="flex flex-col gap-1.5">
            <h2 class="text-lg/5 font-semibold">
              Суши-путешествие <span class="block">начинается с выбора</span>
            </h2>
            <h3 class="text-sm/4">
              {{ subtitle }}
            </h3>
          </div>
        </div>

        <UInput
          v-model="search"
          placeholder="Найти город"
          class="mt-2.5"
        />
      </div>
    </template>

    <template #body>
      <div v-if="filteredCities.length" class="flex flex-col gap-1">
        <UButton
          v-for="c in filteredCities"
          :key="c.id"
          :to="c.storefrontUrl ?? ''"
          external
          variant="link"
          size="sm"
          :label="c.name"
          class="px-0 py-0 text-md font-semibold cursor-pointer"
          :class="{ 'text-secondary!': c.id === city?.id }"
        />
      </div>

      <div v-else class="text-sm/4 text-muted">
        Не найдено
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { dismissible = true } = defineProps<{
  dismissible?: boolean
}>()

const { public: publicEnv } = useRuntimeConfig()
const cityStore = useCityStore()

const city = computed(() => cityStore.cities.find((c) => c.id === publicEnv.cityId))

const search = ref('')
const filteredCities = computed(() => cityStore.cities.filter((c) => c.name.toLowerCase().includes(search.value.toLowerCase())))

const subtitle = computed(() => `${cityStore.cities.length} населенный пункт, 48 ресторанов – везде одинаково вкусно`)
</script>
