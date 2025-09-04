<template>
  <div>
    <div class="z-10 relative w-full h-auto aspect-3/2 perspective-normal motion-preset-slide-down">
      <div
        class="absolute inset-0 bg-primary rounded-lg transition duration-200"
        :style="{
          transform: `rotateX(${x * 5}deg) rotateY(${y * 5}deg)`,
        }"
      />

      <div
        class="z-20 w-full h-full p-4 flex flex-col justify-between transition duration-200 tg-text-button"
        :style="{
          transform: `rotateX(${x * 3}deg) rotateY(${y * 3}deg)`,
        }"
        @click="handleCardClick"
      >
        <div class="flex flex-row justify-between items-center">
          <div class="flex flex-col gap-3">
            <div v-if="clientStore?.level" class="text-lg/5 font-medium">
              Клиент {{ clientStore.level.level }} уровня
            </div>
            <div class="flex flex-row gap-1.5 items-center">
              <p class="text-4xl/6 font-semibold">
                {{ clientStore.points }}
              </p>
              <UIcon name="fluent:heart-circle-24-filled" class="size-7" />
            </div>
          </div>

          <img
            src="/sushi-heart.svg"
            alt=""
            class="w-12 opacity-35 invert-100"
          >
        </div>

        <div class="flex flex-row justify-between items-center">
          <div v-if="clientStore.level?.cashback" class="flex flex-row gap-2 items-center">
            <div class="px-3.5 py-1.5 text-2xl/5 text-primary font-bold rounded-full tg-bg-section">
              {{ clientStore.level.cashback }}%
            </div>

            <div class="tg-text-inverted">
              Ваш кешбэк
            </div>
          </div>

          <UIcon name="i-lucide-info" class="size-6 tg-text-inverted" />
        </div>
      </div>
    </div>

    <div v-if="clientStore.nextLevel && clientStore.nextLevelAmount" class="-mt-8 px-4 pt-12 pb-4 flex flex-col gap-3 tg-bg-section rounded-lg motion-preset-slide-up">
      <div>
        <h3 class="font-semibold">
          Повысьте кешбэк до {{ clientStore.nextLevel.cashback }}%
        </h3>
        <p class="text-sm/4">
          Закажите еще на {{ Intl.NumberFormat('ru').format(clientStore.nextLevelAmount) }} {{ channelStore.currencySign }}
        </p>
      </div>

      <UProgress
        v-model="clientStore.nextLevelProgressPercent"
        color="primary"
        :ui="{
          base: 'bg-primary/10',
        }"
      />
    </div>
  </div>

  <UDrawer
    v-model:open="isDrawerOpened"
    should-scale-background
    :set-background-color-on-scale="false"
    :ui="{
      content: 'max-h-10/12',
    }"
  >
    <template #content>
      <div class="p-4 pb-20 flex flex-col gap-5 overflow-y-auto">
        <h2 class="text-xl font-semibold">
          У вас есть {{ clientStore.points }} «Лавчиков»
        </h2>

        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">
            Программа лояльности
          </h3>

          <p class="text-base/5">
            Позволяет клиентам накапливать бонусные баллы под названием «Лавчики»
            за каждую совершённую покупку.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">
            Как увеличить кешбэк
          </h3>

          <p class="text-base/5">
            Кешбэк определяется по сумме заказов за все время. Система включает разные уровни
            с разными процентами возврата: базовый уровень даёт 5% кешбэка, а максимальный — 15%
            от суммы заказа.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">
            Куда можно потратить
          </h3>

          <p class="text-base/5">
            Накопленные «Лавчики» можно использовать для приобретения специальных блюд
            из отдельного бонусного меню. Важно учитывать, что бонусные баллы имеют
            ограниченный срок действия — они автоматически сгорают через 180 дней
            при отсутствии активности.
          </p>
        </div>

        <p class="text-sm">
          Передавая данные, вы соглашаетесь с
          <ULink to="https://sushi-love.ru" target="_blank">
            условиями программы лояльности,
          </ULink>
          <ULink to="https://sushi-love.ru" target="_blank">
            политикой конфиденциальности
          </ULink> и <ULink to="https://sushi-love.ru" target="_blank">
            условиями обработки персональных данных.
          </ULink>
        </p>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import type { EventListener } from '@telegram-apps/sdk-vue'
import { off, on } from '@telegram-apps/sdk-vue'

const { vibrate } = useFeedback()

const clientStore = useClientStore()
const channelStore = useChannelStore()

const isDrawerOpened = ref(false)

const x = ref(0)
const y = ref(0)
const z = ref(0)

const listener: EventListener<'gyroscope_changed'> = (payload) => {
  x.value = payload.x
  y.value = payload.y
  z.value = payload.z
}

onMounted(() => {
  on('gyroscope_changed', listener)
})

onUnmounted(() => {
  off('gyroscope_changed', listener)
})

function handleCardClick() {
  vibrate()
  isDrawerOpened.value = !isDrawerOpened.value
}
</script>
