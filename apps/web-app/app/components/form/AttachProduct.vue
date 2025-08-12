<template>
  <UForm
    :validate="createValidator(attachProductToMenuCategorySchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField :label="$t('app.menu.product')" name="productId">
      <USelectMenu
        v-model="selectedProduct"
        :items="preparedProducts"
        :placeholder="$t('common.select')"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Вариации" name="variations">
      <USelectMenu
        v-model="selectedVariants"
        :items="availableVariants"
        :placeholder="$t('common.select')"
        multiple
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UButton
      type="submit"
      variant="solid"
      color="secondary"
      size="xl"
      block
      class="mt-3"
      :label="$t('common.add')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { AttachProductToMenuCategory } from '#shared/services/menu'
import type { FormSubmitEvent } from '@nuxt/ui'
import { attachProductToMenuCategorySchema } from '#shared/services/menu'

const { categoryId } = defineProps<{
  categoryId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const productStore = useProductStore()
const menuStore = useMenuStore()

const productInCategory = computed(() => productStore.products.filter((p) => p.categories.some((c) => c.menuCategoryId === categoryId)))
const availableProducts = computed(() => productStore.products.filter((p) => !productInCategory.value.some((c) => c.id === p.id)))
const preparedProducts = computed(() => availableProducts.value.map((p) => ({ label: p.name, value: p.id })))
const selectedProduct = ref<{ label: string, value: string }>()

const availableVariants = computed(() => selectedProduct.value ? productStore.products.find((p) => p.id === selectedProduct.value?.value)?.variants.map((v) => ({ label: `${v.name}, ${v.gross} ${menuStore.currencySign} / ${v.tags.map((t) => t.name).join(', ')}`, value: v.id })) : [])
const selectedVariants = ref<{ label: string, value: string }[]>([])

const state = ref<AttachProductToMenuCategory>({
  categoryId,
  productId: '',
  productVariantsId: [],
})

watch(selectedProduct, () => {
  state.value.productId = selectedProduct.value?.value || ''
})

watch(selectedVariants, () => {
  state.value.productVariantsId = selectedVariants.value.map((v) => v.value)
})

async function onSubmit(event: FormSubmitEvent<AttachProductToMenuCategory>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/menu/category/id/${categoryId}/product`, {
      method: 'POST',
      body: event.data,
    })

    await Promise.all([
      productStore.update(),
      menuStore.update(),
    ])

    actionToast.success(toastId, t('toast.category-updated'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
