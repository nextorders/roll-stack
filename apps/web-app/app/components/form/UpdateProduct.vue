<template>
  <UForm
    :validate="createValidator(updateProductSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField :label="$t('common.title')" name="name">
      <UInput
        v-model="state.name"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('common.description')" name="description">
      <UTextarea
        v-model="state.description"
        :rows="8"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('common.slug')" name="slug">
      <UInput
        v-model="state.slug"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField label="Теги" name="tags">
      <USelectMenu
        v-model="selectedTags"
        :items="availableTags"
        :placeholder="$t('common.select')"
        multiple
        size="xl"
        class="w-full"
      />
    </UFormField>

    <div class="mt-3 flex flex-row gap-3">
      <UButton
        type="submit"
        variant="solid"
        color="secondary"
        size="xl"
        block
        :label="$t('common.update')"
      />

      <UTooltip :text="$t('app.delete.product.button')">
        <UButton
          variant="soft"
          color="error"
          size="xl"
          icon="i-lucide-trash-2"
          class="aspect-square justify-center"
          @click="onDelete"
        />
      </UTooltip>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { UpdateProduct } from '~~/shared/services/product'
import { updateProductSchema } from '~~/shared/services/product'

const { productId, redirectTo } = defineProps<{
  productId: string
  redirectTo: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const router = useRouter()
const actionToast = useActionToast()

const menuStore = useMenuStore()
const productStore = useProductStore()
const product = computed(() => productStore.products.find((product) => product.id === productId))

const availableTags = computed(() => productStore.tags.map((t) => ({ label: t.name, value: t.id })))
const selectedTags = ref<{ label: string, value: string }[]>(product.value?.tags.map((t) => ({ label: t.name, value: t.id })) ?? [])

const state = ref<Partial<UpdateProduct>>({
  name: product.value?.name,
  description: product.value?.description,
  slug: product.value?.slug,
  tagsId: selectedTags.value.map((t) => t.value),
})

watch(selectedTags, () => {
  state.value.tagsId = selectedTags.value.map((t) => t.value)
})

async function onSubmit(event: FormSubmitEvent<UpdateProduct>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/product/id/${productId}`, {
      method: 'PATCH',
      body: event.data,
    })

    await Promise.all([
      productStore.update(),
      menuStore.update(),
    ])

    actionToast.success(toastId, t('toast.product-updated'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}

async function onDelete() {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/product/id/${productId}`, {
      method: 'DELETE',
    })

    await Promise.all([
      productStore.update(),
      menuStore.update(),
    ])

    actionToast.success(toastId, t('toast.product-deleted'))
    emit('success')

    router.push(redirectTo)
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
