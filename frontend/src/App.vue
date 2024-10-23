<script setup>
import { RouterLink, RouterView } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import { useAuthStore } from "@/stores/authStore";
import { ref } from "vue";

const authStore = useAuthStore();
authStore.loadToken();

const logout = () => {
  authStore.logout();
};
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header>
      <div v-if="!authStore.token">
        <RouterLink to="/login" class="flex flex-col items-end space-y-1 p-4">
          <span class="text-lg bg-black text-white px-4 py-2 rounded-md"
            >Login</span
          >
        </RouterLink>
      </div>
      <div v-else>
        <div class="flex flex-col items-end space-y-1 p-4">
          <button @click="logout" class="flex flex-col items-end space-y-1 p-4">
            <span class="text-lg bg-black text-white px-4 py-2 rounded-md"
              >Logout</span
            >
          </button>
        </div>
      </div>
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
