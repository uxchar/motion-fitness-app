<script setup>
import { ref } from "vue";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const email = ref("");
const password = ref("");

const login = (event) => {
  event.preventDefault();

  const params = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.value, password: password.value }),
  };

  fetch("http://localhost:3000/login", params)
    .then((response) => {
      if (response.headers.get("content-type")?.includes("application/json")) {
        return response.json();
      } else {
        return response.text();
      }
    })
    .then((data) => {
      console.log(data);
      cookies.set("token", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg w-80">
      <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
      <form>
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
          @click="login()"
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
