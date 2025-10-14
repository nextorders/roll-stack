<template>
  <ActiveCard>
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
      >
        <div class="flex flex-row justify-between items-start">
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <h3 class="text-xl/5 font-bold">
                {{ partnerUser?.name }} {{ partnerUser?.surname }}
              </h3>
              <div class="text-sm/4">
                {{ partner?.city }}
              </div>
            </div>

            <div class="relative flex flex-row gap-1.5 items-start">
              <img
                :src="partnerUser?.avatarUrl ?? undefined"
                alt=""
                class="size-28 rounded-lg border-2"
              >

              <div class="flex flex-row justify-end">
                <img
                  v-for="user in otherUsers"
                  :key="user.id"
                  :src="user?.avatarUrl ?? undefined"
                  alt=""
                  class="size-14 rounded-lg border-2"
                >
              </div>
            </div>
          </div>

          <img
            src="/sushi-heart.svg"
            alt=""
            class="w-12 opacity-35 invert-100"
          >
        </div>

        <div class="flex flex-row justify-between items-center">
          <div class="flex flex-row gap-2 items-center">
            <div class="px-3.5 py-1.5 text-2xl/5 text-primary font-bold rounded-full tg-bg-section">
              {{ partner?.priceLevel }}
            </div>

            <p class="tg-text-inverted font-medium">
              Уровень цен
            </p>
          </div>
        </div>
      </div>
    </div>
  </ActiveCard>
</template>

<script setup lang="ts">
const { partnerId } = defineProps<{ partnerId: string }>()

const { x, y } = useGyroscope()

const partnerStore = usePartnerStore()
const partner = computed(() => partnerStore.partners.find((partner) => partner.id === partnerId))
const partnerUser = computed(() => partner.value?.users.find((user) => user.type === 'partner'))
const otherUsers = computed(() => partner.value?.users.filter((user) => user.type !== 'partner').slice(0, 3))
</script>
