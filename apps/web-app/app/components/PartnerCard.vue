<template>
  <ActiveCard padding="none" class="flex flex-col gap-2.5 group">
    <div class="relative">
      <img
        :src="partnerUser?.avatarUrl ?? undefined"
        alt=""
        class="aspect-square w-full rounded-lg duration-200"
        :class="{ 'opacity-75 grayscale group-hover:grayscale-0 group-hover:opacity-100': imagesMode === 'grayscale' }"
      >

      <div class="absolute top-4 left-4">
        <UBadge
          color="neutral"
          variant="solid"
          size="lg"
          class="rounded-lg"
          :label="`${partner.priceLevel} уровень цен`"
        />
      </div>

      <div
        class="absolute top-4 left-0 right-0 w-full opacity-0 group-hover:opacity-100 duration-200"
        :class="[
          agreementProgress <= 15 && 'opacity-100',
        ]"
      >
        <div class="mx-4 px-2 py-1 bg-default rounded-lg flex flex-row items-center gap-1.5">
          <UIcon
            name="i-lucide-scroll-text"
            class="shrink-0 size-5 text-primary"
            :class="[
              agreementProgress <= 15 && '!text-error motion-preset-seesaw motion-preset-wobble-sm',
            ]"
          />

          <UProgress
            v-model="agreementProgress"
            size="md"
            color="secondary"
            :ui="{
              indicator: agreementProgress <= 15 && '!bg-error',
            }"
          />
        </div>
      </div>

      <div class="absolute bottom-4 right-4">
        <div class="flex flex-row justify-end">
          <UAvatarGroup :max="3" size="md">
            <UAvatar
              v-for="user in otherUsers"
              :key="user.id"
              :src="user?.avatarUrl ?? undefined"
              alt=""
              class="group-hover:scale-110 duration-200"
              :class="{ 'opacity-75 grayscale group-hover:grayscale-0 group-hover:opacity-100': imagesMode === 'grayscale' }"
            />
          </UAvatarGroup>
        </div>
      </div>
    </div>

    <div class="min-h-20 h-full px-4 pb-2 flex flex-col gap-2.5">
      <h3 class="text-sm/4 font-bold">
        {{ partner.legalEntity?.name }}
      </h3>

      <p class="text-sm/4 text-muted line-clamp-4">
        {{ partner.city }}
      </p>
    </div>
  </ActiveCard>
</template>

<script setup lang="ts">
import type { PartnerWithData } from '~/stores/partner'

const { partner } = defineProps<{
  partner: PartnerWithData
}>()

const { imagesMode } = useApp()

const partnerUser = computed(() => partner.users.filter((user) => user.type === 'partner')[0])
const otherUsers = computed(() => partner.users.filter((user) => user.type !== 'partner'))

const minimalAgreement = computed(() => partner.legalEntity?.agreements.filter((agreement) => agreement.isActive).toSorted((a, b) => new Date(a.willEndAt ?? '').getTime() - new Date(b.willEndAt ?? '').getTime())[0])

const agreementProgress = computed(() => getAgreementProgressPercentLeft(minimalAgreement.value?.concludedAt, minimalAgreement.value?.willEndAt))
</script>
