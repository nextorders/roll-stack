<template>
  <header class="z-40 h-16 sticky flex items-center justify-between border-b border-default bg-default/75 backdrop-blur px-4 sm:px-6 gap-1.5">
    <div class="flex items-center gap-1.5 min-w-0">
      <UButton
        icon="i-lucide-menu"
        color="neutral"
        variant="outline"
        size="lg"
        class="visible lg:hidden"
        @click="isNavbarOpened = true"
      />

      <UModal v-model:open="isModalOpened" class="relative mr-auto group">
        <UButton
          :label="$t('storefront.search-placeholder')"
          icon="i-lucide-search"
          color="neutral"
          variant="outline"
          size="lg"
        />

        <template #content>
          <UCommandPalette
            v-model="value"
            :groups="groups"
            :placeholder="$t('storefront.search-placeholder')"
            class="h-80"
          />
        </template>
      </UModal>

      <UColorModeButton
        color="neutral"
        variant="outline"
        size="lg"
      />
    </div>

    <div class="flex items-center shrink-0 gap-3">
      <CartButton />
    </div>
  </header>
</template>

<script setup lang="ts">
const { isNavbarOpened } = useApp()

const menuStore = useMenuStore()

const isModalOpened = ref(false)

const groups = computed(() => [
  {
    id: 'products',
    items: menuStore.getProductsForSearch().map((product) => {
      return {
        label: product.name,
        suffix: product.category.name,
        onSelect: () => {
          isModalOpened.value = false
          navigateTo(`/catalog/${product.category.slug}/${product.slug}`)
        },
      }
    }),
  },
])
const value = ref({})
</script>
