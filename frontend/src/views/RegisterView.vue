<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmedPassword = ref("");

const params = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const url = `${import.meta.env.VITE_API_URL}`;

const register = async () => {
  //   console.log(errorAlert.value);
  if (password.value !== confirmedPassword.value) {
    console.log("Passwords do not match.");
    throw new Error("Password do not match");
  }
  const response = await fetch(`${url}/register`, {
    ...params,
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value,
    }),
  });
  const data = await response.json();
  console.log("Response data:", data);
  if (data) {
    console.log("User registered successfully.");
    router.push("/login");
  } else {
    console.log("error");
  }
};
</script>

<template>
  <!-- <div role="alert" class="alert alert-warning">
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
  </div> -->
  <div class="max-h-screen flex items-center justify-center bg-gray-100">
    <div class="">
      <div class="text-center mb-8 text-4xl font-black">
        <span>Motion</span>
      </div>
      <div class="bg-white p-8 rounded-lg w-80 mb-10">
        <h2 class="text-2xl font-bold mb-4 text-center">Register</h2>
        <form @submit.prevent="register">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="name"
              >First Name:</label
            >
            <input
              type="text"
              v-model="name"
              id="name"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>
          <div class="">
            <label class="block text-gray-700 mb-2" for="email">Email</label>
            <input
              type="text"
              v-model="email"
              id="email"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500"
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
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="confirmedPassword"
              >Confirm Password</label
            >
            <input
              type="password"
              v-model="confirmedPassword"
              id="confirmedPassword"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Register
          </button>
        </form>
        <div class=""></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
