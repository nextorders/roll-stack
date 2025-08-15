<template>
  <div class="fixed inset-0 flex overflow-hidden">
    <main class="flex flex-col min-w-0 min-h-svh lg:not-last:border-r lg:not-last:border-default flex-1">
      <slot />
    </main>
  </div>

  <USlideover
    v-model:open="isNavbarOpened"
    side="left"
    class="md:max-w-86"
  >
    <template #header>
      <div class="flex flex-row items-center">
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="outline"
          @click="isNavbarOpened = false"
        />

        <NavigationHeader />
      </div>
    </template>

    <template #body>
      <Navigation />
    </template>
  </USlideover>
</template>

<script setup lang="ts">
const { isNavbarOpened } = useApp()
</script>
