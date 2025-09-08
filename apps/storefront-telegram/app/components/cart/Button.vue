<template>
  <UButton
    block
    variant="solid"
    color="secondary"
    :ui="{
      base: 'px-4 py-2 h-14',
    }"
  >
    <div class="w-full flex flex-row items-center justify-between text-lg">
      <div class="flex flex-row gap-2 items-center">
        <UIcon name="i-lucide-shopping-basket" class="size-6" />
        <p>{{ $t('app.cart.title') }}</p>
      </div>
      <p>
        1850 ₽
      </p>
    </div>
  </UButton>
</template>
