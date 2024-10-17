<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();

const email = ref("");
const password = ref("");
const authStore = useAuthStore();

const params = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const login = async () => {
  try {
    const response = await fetch("http://localhost:3000/login", {
      ...params,
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    const data = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (response.ok && data.token) {
      // If the response is OK and we have a token, save the token and update the store
      localStorage.setItem("token", data.token);
      authStore.setToken(data.token);

      // Redirect the user to the dashboard or any other page after login
      router.push("/");
    } else {
      // Log an error message if credentials are invalid or token is missing
      console.error("Login failed:", data.message || "No token provided");
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg w-80">
      <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="username">Email</label>
          <input
            type="text"
            v-model="email"
            id="email"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="password"
            >Password</label
          >
          <input
            type="password"
            v-model="password"
            id="password"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
