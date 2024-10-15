<script setup>
import Exercise from "@/components/unused/Exercise.vue";

const date = new Date();
const formattedDate = date.toLocaleDateString();
</script>

<template>
  <div class="overflow-y-auto">
    <div class="flex justify-between mb-10">
      <h1 class="text-3xl">Create Template</h1>
      <button class="bg-red-500 hover:bg-red-700 text-white p-4 rounded">
        Cancel Template
      </button>
    </div>

    <span id="workout-name">{{ formattedDate }}</span>
    <Exercise />
  </div>

  <RouterLink
    to="/templates"
    class="bg-blue-500 hover:bg-blue-700 text-white p-4 rounded"
    >Finish Template</RouterLink
  >
</template>

<style scoped></style>
