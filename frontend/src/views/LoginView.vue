<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();

const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const errorAlert = ref(false);

const params = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const login = async () => {
  console.log(errorAlert.value);

  const response = await fetch("http://localhost:3000/login", {
    ...params,
    body: JSON.stringify({ email: email.value, password: password.value }),
  });

  const data = await response.json();

  console.log("Response data:", data);

  if (response.ok && data.token) {
    // If the response is OK and we have a token, save the token and update the store
    authStore.setUserId(data.userId);
    authStore.setToken(data.token);

    // Redirect the user to the dashboard or any other page after login
    router.push("/");
  } else {
    errorAlert.value = true;
    console.log("error");
  }
};
</script>

<template>
  <div
    :key="errorAlert"
    v-if="errorAlert === true"
    role="alert"
    class="alert alert-warning"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <span>Warning: Invalid email address or password!</span>
  </div>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg w-80">
      <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="email">Email</label>
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
          class="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Login
        </button>
      </form>
      <p class="mt-6">
        New User? Create an account
        <RouterLink to="/register"
          ><span class="font-bold text-blue-500">here</span></RouterLink
        >.
      </p>
    </div>
  </div>
</template>

<style scoped></style>
