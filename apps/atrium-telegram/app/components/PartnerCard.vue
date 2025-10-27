<template>
  <ActiveCard class="h-full">
    <Section class="p-0! h-full">
      <div class="relative">
        <img
          :src="partnerUser?.avatarUrl ?? undefined"
          alt=""
          class="aspect-square w-full rounded-lg duration-200"
        >

        <div class="absolute top-4 left-4">
          <UBadge
            color="neutral"
            variant="solid"
            size="lg"
            class="px-3 rounded-xl bg-default text-default motion-preset-pop"
            :label="`${partner.priceLevel} уровень цен`"
          />
        </div>

        <div
          v-if="agreementProgress <= 15"
          class="absolute top-4 left-0 right-0 w-full"
        >
          <div class="mx-4 px-2 py-1 bg-default rounded-lg flex flex-row items-center gap-1.5">
            <UIcon
              name="i-lucide-scroll-text"
              class="shrink-0 size-5 text-error motion-preset-seesaw motion-preset-wobble-sm"
            />

            <UProgress
              v-model="agreementProgress"
              size="md"
              color="neutral"
              :ui="{
                indicator: 'bg-error!',
                base: 'bg-error/25',
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
              />
            </UAvatarGroup>
          </div>
        </div>
      </div>

      <div class="min-h-20 h-full px-4 pb-4 flex flex-col gap-2.5">
        <UBadge
          :color="partner.balance >= 0 ? 'neutral' : 'error'"
          variant="soft"
          size="md"
          class="rounded-lg justify-center font-semibold"
          :label="`Баланс ${new Intl.NumberFormat().format(partner.balance)} ₽`"
        />

        <h3 class="text-sm/4 font-bold">
          {{ partner.legalEntity?.name }}
        </h3>

        <p class="text-sm/4 text-muted line-clamp-6">
          {{ partner.city }}
        </p>
      </div>
    </Section>
  </ActiveCard>
</template>

<script setup lang="ts">
import type { PartnerWithData } from '~/stores/partner'
import { getAgreementProgressPercentLeft } from '#shared/utils/helpers'

const { partner } = defineProps<{
  partner: PartnerWithData
}>()

const partnerUser = computed(() => partner.users.filter((user) => user.type === 'partner')[0])
const otherUsers = computed(() => partner.users.filter((user) => user.type !== 'partner'))

const minimalAgreement = computed(() => partner.legalEntity?.agreements.filter((agreement) => agreement.isActive).toSorted((a, b) => new Date(a.willEndAt ?? '').getTime() - new Date(b.willEndAt ?? '').getTime())[0])

const agreementProgress = computed(() => getAgreementProgressPercentLeft(minimalAgreement.value?.concludedAt, minimalAgreement.value?.willEndAt))
</script>
