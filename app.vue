<script setup lang="ts">
</script>

<template>
  <UApp>
    <ClientOnly>
      <main class="h-full">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </main>
    </ClientOnly>
  </UApp>
</template>

<style lang="css">
html, body, #__nuxt {
  height: 100%;
}
</style>
