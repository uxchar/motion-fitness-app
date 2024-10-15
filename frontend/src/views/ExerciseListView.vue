<script setup>
import ExerciseDatabase from "@/components/ExerciseDatabase.vue";
</script>

<template>
  <h1 class="text-center mb-20">Exercise List</h1>
  <button
    class="flex bg-violet-500 hover:bg-violet-700 text-white p-2 rounded mt-7 mx-auto mb-20"
  >
    <RouterLink to="/workout"> Finish Adding Exercises </RouterLink>
  </button>
  <ExerciseDatabase />
</template>

<style scoped></style>
