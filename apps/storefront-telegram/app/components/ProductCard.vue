<template>
  <ActiveCard class="!p-0">
    <div class="h-full flex flex-col justify-between gap-2">
      <div class="relative w-full aspect-3/2">
        <ProductImage
          :media="product?.media"
          :lazy="lazy"
          size="md"
        />
      </div>

      <div class="px-3 py-1 flex-1 flex flex-col gap-1">
        <p class="text-sm/4 font-medium">
          {{ product?.name }}
        </p>

        <div class="text-muted text-sm/4">
          <span v-if="!withSingleVariant" class="pr-1 lowercase">{{ $t('app.cart.from') }}</span>
          <span>{{ weightValue }}{{ weightUnit }}</span>
        </div>

        <p class="text-xs/3 font-light line-clamp-3">
          {{ product?.description }}
        </p>
      </div>

      <div class="px-3 pb-3">
        <UButton
          variant="soft"
          color="neutral"
          size="md"
          :trailing-icon="withSingleVariant ? 'i-lucide-plus' : 'i-lucide-arrow-right'"
          class="w-fit hover:bg-muted active:bg-muted"
        >
          <div class="text-base font-medium">
            <span v-if="!withSingleVariant" class="pr-1 lowercase">{{ $t('app.cart.from') }}</span>
            <span>{{ price }}</span>
            <span class="pl-1 text-lg">{{ channelStore.currencySign }}</span>
          </div>
        </UButton>
      </div>
    </div>
  </ActiveCard>
</template>

<script setup lang="ts">
const { productId, categoryId } = defineProps<{
  productId: string
  categoryId: string
  lazy?: boolean
}>()

const { locale } = useI18n()

const channelStore = useChannelStore()
const menuStore = useMenuStore()
const category = computed(() => menuStore.menu?.categories.find((category) => category.id === categoryId))
const product = category.value?.products.find((product) => product.id === productId)

const withSingleVariant = computed<boolean>(() => product?.variants.length === 1)
const smallestVariant = computed(() => product?.variants[0])

const price = computed(() => new Intl.NumberFormat(locale.value).format(smallestVariant.value?.gross ?? 0))
const weightValue = computed(() => smallestVariant.value?.weightValue)
const weightUnit = computed(() => getWeightLocalizedUnit(smallestVariant.value?.weightUnit))
</script>
