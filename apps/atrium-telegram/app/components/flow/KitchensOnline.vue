<template>
  <Section v-if="kitchensOnline">
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2 items-center">
        <UChip
          color="primary"
          :ui="{
            base: 'motion-scale-loop motion-duration-3000',
          }"
        >
          <UIcon name="i-lucide-store" class="size-8 text-primary" />
        </UChip>
        <h3 class="text-3xl/5 font-bold">
          {{ kitchensOnline }}
        </h3>
      </div>
      <p class="text-sm/4">
        {{ pluralizationRu(kitchensOnline, ['Кухня', 'Кухни', 'Кухонь']) }} сейчас {{ pluralizationRu(kitchensOnline, ['работает', 'работают', 'работают']) }}
      </p>
    </div>
  </Section>

  <Section v-else>
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2 items-center">
        <UIcon name="i-lucide-store" class="size-8 text-primary" />
        <UIcon name="i-lucide-moon" class="size-8 motion-preset-oscillate-sm motion-preset-seesaw motion-duration-3000" />
      </div>
      <p class="text-sm/4">
        Все кухни сейчас закрыты
      </p>
    </div>
  </Section>
</template>

<script setup lang="ts">
const kitchenStore = useKitchenStore()

const kitchensOnline = computed(() => kitchenStore.kitchens.filter((k) => k.isOpenedNow).length)
</script>
