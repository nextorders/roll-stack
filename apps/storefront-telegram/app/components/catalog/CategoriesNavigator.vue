<template>
  <div
    class="transition-all duration-200 ease-in-out"
    :class="[
      isCategoriesButtonShown ? 'ml-2 w-14 aspect-square' : 'w-0',
    ]"
  >
    <UButton
      v-if="isCategoriesButtonShown"
      variant="outline"
      color="neutral"
      size="xl"
      class="motion-preset-slide-left motion-duration-500"
      icon="i-lucide-list-end"
      :ui="{
        base: 'size-14 ring-default',
        leadingIcon: 'size-6 mx-auto',
      }"
      @click="handleClick()"
    />
  </div>

  <UDrawer v-model:open="isDrawerOpened">
    <template #content>
      <div class="p-4 pb-20 flex flex-col gap-5 overflow-y-auto hide-scroll">
        <h2 class="text-xl/6 font-semibold">
          Категории
        </h2>

        <div class="flex flex-col gap-0">
          <UButton
            v-for="category in menuStore.menu?.categories"
            :key="category.id"
            variant="ghost"
            color="neutral"
            size="lg"
            class="px-0 motion-preset-slide-left"
            :class="[
              visibleCategory === category.slug
                ? 'font-semibold text-primary'
                : '',
            ]"
            :label="category.name"
            @click="handleScroll(category.slug)"
          />
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
const { vibrate } = useFeedback()
const { isCategoriesButtonShown, isNavigationShown } = useNavigation()
const { scrollToCategory, visibleCategory } = useCatalog()

const menuStore = useMenuStore()

const isDrawerOpened = ref(false)

watch(isDrawerOpened, () => {
  isNavigationShown.value = !isDrawerOpened.value
})

function handleScroll(slug: string) {
  vibrate()
  scrollToCategory(slug)
  isDrawerOpened.value = !isDrawerOpened.value
}

function handleClick() {
  vibrate()
  isDrawerOpened.value = !isDrawerOpened.value
}
</script>
