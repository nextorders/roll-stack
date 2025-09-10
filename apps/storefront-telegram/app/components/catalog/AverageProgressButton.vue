<template>
  <div
    class="transition-all duration-200 ease-in-out"
    :class="[
      isAverageProgressButtonShown ? 'ml-2 w-fit' : 'w-0',
    ]"
  >
    <UButton
      v-if="isAverageProgressButtonShown"
      variant="outline"
      color="neutral"
      size="xl"
      class="motion-preset-slide-left motion-duration-500"
      :ui="{
        base: 'p-0 ring-default flex flex-row gap-0',
      }"
      @click="handleClick()"
    >
      <div class="relative size-14 transition-all duration-200 ease-in-out">
        <VisSingleContainer :data="data" class="size-14">
          <VisDonut
            :value="value"
            :color="color"
            :show-background="false"
            :radius="20"
            :arc-width="3"
          />
        </VisSingleContainer>

        <div class="w-full h-full absolute inset-0 flex flex-col justify-center items-center">
          <UIcon name="i-lucide-gift" class="size-6 tg-text-accent" />
        </div>
      </div>

      <div
        class="transition-all duration-600 ease-in-out"
        :class="[
          isTextShown ? 'w-14 pr-2.5' : 'w-0',
        ]"
      >
        <div v-if="isTextShown" class="flex flex-col text-center text-sm/4 font-medium motion-preset-pop">
          <p class="min-w-12">
            Еще
          </p>
          <p class="min-w-12">
            {{ progress * 10 }} ₽
          </p>
        </div>
      </div>
    </UButton>
  </div>

  <UDrawer v-model:open="isDrawerOpened">
    <template #content>
      <div class="p-4 pb-20 flex flex-col gap-5 overflow-y-auto hide-scroll">
        <h2 class="text-xl/6 font-semibold">
          Увеличим чек?
        </h2>

        Тут будут подарки и доставка.
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { VisDonut, VisSingleContainer } from '@unovis/vue'

const { vibrate } = useFeedback()
const { isAverageProgressButtonShown, isNavigationShown } = useNavigation()

const progress = ref(45)
const data = computed(() => [progress.value, Math.max(100 - progress.value, 0)])
const value = (d: number) => d
const color = (_: number, i: number) => ['var(--tg-theme-button-color)', 'var(--tg-theme-section-separator-color)'][i]

// Test
onMounted(() => {
  setInterval(() => {
    progress.value = Math.floor(Math.random() * 100)
    isTextShown.value = true

    setTimeout(() => {
      isTextShown.value = false
    }, 4000)
  }, 12000)
})

const isDrawerOpened = ref(false)

watch(isDrawerOpened, () => {
  isNavigationShown.value = !isDrawerOpened.value
})

function handleClick() {
  vibrate()
  isDrawerOpened.value = !isDrawerOpened.value
}

const isTextShown = ref(false)
</script>
