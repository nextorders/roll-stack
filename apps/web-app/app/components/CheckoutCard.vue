<template>
  <div class="bg-elevated/50 rounded-lg px-4 md:px-6 py-5 space-y-6">
    <div>
      <div class="mb-2 flex flex-row justify-between items-center">
        <div class="flex flex-row gap-3 items-center">
          <img
            :src="`https://avatar.nextorders.ru/${checkout?.phone}?emotion=8`"
            width="40"
            height="40"
            alt=""
            class="size-12 rounded-full"
          >
          <h3 class="text-xl font-semibold">
            {{ checkout?.deliveryMethod === 'pickup' ? $t('storefront.cart.pickup') : $t('storefront.cart.delivery') }}
          </h3>
        </div>

        <div>
          <div v-if="checkout?.status === 'forming'" class="flex flex-row items-center gap-1.5">
            <UIcon name="i-lucide-loader-pinwheel" class="size-5 text-info shrink-0 motion-preset-spin motion-duration-6000" />
            <p class="font-semibold text-info">
              Формируется
            </p>
          </div>
          <div v-if="checkout?.status === 'created'" class="flex flex-row items-center gap-1.5">
            <UIcon name="i-lucide-user-check" class="size-5 text-secondary shrink-0" />
            <p class="font-semibold text-secondary">
              Создана
            </p>
          </div>
        </div>
      </div>

      <p class="font-medium">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal">Код заявки:</span> {{ checkout?.id }}
      </p>
      <p class="font-medium">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal">{{ $t('storefront.checkout.name') }}:</span> {{ checkout?.name }}
      </p>
      <p class="font-medium mb-2">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal">{{ $t('storefront.checkout.phone') }}:</span> {{ checkout?.phone }}
      </p>

      <!-- <p v-if="checkout?.time" class="font-medium">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal">{{ $t('storefront.checkout.time-title') }}:</span> {{ checkout?.timeType === 'ASAP' ? $t('storefront.checkout.as-soon-as-possible') : new Date(checkout?.time).toLocaleString(undefined, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }) }}
      </p> -->

      <div class="font-medium">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal pr-1">{{ $t('storefront.checkout.address.title') }}:</span>
        <p v-if="checkout?.deliveryMethod === 'pickup'" class="inline">
          {{ kitchen?.address }}
        </p>
        <p v-if="checkout?.deliveryMethod === 'delivery'" class="inline">
          <span>{{ checkout.street }}</span>
          <span v-if="checkout?.flat" class="lowercase">, {{ $t('storefront.checkout.address.flat') }} {{ checkout.flat }}</span>
          <span v-if="checkout?.intercom" class="lowercase">, {{ $t('storefront.checkout.address.intercom') }} {{ checkout.intercom }}</span>
          <span v-if="checkout?.entrance" class="lowercase">, {{ $t('storefront.checkout.address.entrance') }} {{ checkout.entrance }}</span>
          <span v-if="checkout?.floor" class="lowercase">, {{ $t('storefront.checkout.address.floor') }} {{ checkout.floor }}</span>
          <span v-if="checkout?.addressNote">. {{ checkout.addressNote }}</span>
        </p>
      </div>

      <p class="font-medium">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal">{{ $t('storefront.checkout.payment-title') }}:</span> {{ paymentMethod?.name }}
      </p>
      <p v-if="checkout?.cashAmount" class="font-medium">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal">{{ $t('storefront.checkout.change-label') }}:</span> {{ checkout?.cashAmount }} ₽
      </p>
      <p v-if="checkout?.note" class="font-medium">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal">{{ $t('storefront.checkout.order-note') }}:</span> {{ checkout?.note }}
      </p>
    </div>

    <div class="flex flex-col gap-3">
      <CheckoutItem
        v-for="item in checkout?.items"
        :key="item.id"
        :item="item"
      />
    </div>

    <div>
      <div class="flex flex-row justify-between">
        <div class="text-neutral-500 dark:text-neutral-400">
          {{ $t('storefront.checkout.cost.products') }}
        </div>
        <div class="tracking-tight text-lg">
          {{ checkout?.itemsPrice }} <span class="text-sm">₽</span>
        </div>
      </div>

      <div v-if="checkout?.deliveryPrice" class="flex flex-row justify-between">
        <div class="text-neutral-500 dark:text-neutral-400">
          {{ $t('storefront.checkout.cost.delivery') }}
        </div>
        <div class="tracking-tight text-lg">
          {{ checkout?.deliveryPrice }} <span class="text-sm">₽</span>
        </div>
      </div>

      <div class="flex flex-row justify-between">
        <div class="text-neutral-500 dark:text-neutral-400">
          Итоговая стоимость
        </div>
        <div class="tracking-tight text-lg">
          {{ checkout?.totalPrice }} <span class="text-sm">₽</span>
        </div>
      </div>
    </div>

    <UButton
      v-if="checkout?.status === 'created'"
      variant="gradient"
      size="xl"
      class="w-full justify-center"
      label="Создать заказ / Отправить на кухню"
      @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
const { id } = defineProps<{
  id: string
}>()

const toast = useToast()
const checkoutStore = useCheckoutStore()

const checkout = computed(() => checkoutStore.checkouts?.find((c) => c.id === id))
const kitchen = computed(() => checkoutStore.kitchens?.find((w) => w.id === checkout.value?.kitchenId))
const paymentMethod = computed(() => checkoutStore.paymentMethods?.find((p) => p.id === checkout.value?.paymentMethodId))

function onClick() {
  toast.add({
    title: 'Не-а',
    description: 'Пока не готово. А так да - заявка создаст заказ и отправит его на кухню.',
    color: 'error',
    icon: 'i-lucide-ban',
    duration: 10000,
  })
}
</script>
