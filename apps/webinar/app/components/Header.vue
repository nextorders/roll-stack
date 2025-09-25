<template>
  <UContainer class="mt-10 flex flex-col md:flex-row gap-y-6 items-center justify-between">
    <HeaderLogo />

    <div class="shrink-0">
      <div class="flex flex-row gap-2">
        <UColorModeButton size="xl" />
        <UButton
          to="https://t.me/SLFranchiseBot"
          size="xl"
          color="neutral"
          variant="ghost"
          icon="simple-icons:telegram"
        />
        <UButton
          to="https://vk.com/franshizasushi"
          size="xl"
          color="neutral"
          variant="ghost"
          icon="simple-icons:vk"
        />
      </div>
    </div>
  </UContainer>
</template>
