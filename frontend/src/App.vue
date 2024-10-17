<script setup>
import { RouterLink, RouterView } from "vue-router";
import NavBar from "@/components/NavBar.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header>
      <RouterLink to="/login" class="flex flex-col items-end space-y-1 p-4">
        <span class="text-lg bg-black text-white px-4 py-2">Login</span>
      </RouterLink>
    </header>
    <main class="flex-1 p-5 mb-32">
      <RouterView />
    </main>
    <div class="flex justify-center py-2 w-full fixed bottom-0 left-0 z-50">
      <NavBar />
    </div>
  </div>
</template>

<style scoped></style>
