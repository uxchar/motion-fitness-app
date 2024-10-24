<script setup>
import { PhBicycle, PhTrendUp, PhPlus, PhBarbell } from "@phosphor-icons/vue";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useRoute } from "vue-router";

const workoutStore = useWorkoutStore();
const route = useRoute();
</script>

<template>
  <nav
    v-if="!workoutStore.currentWorkout"
    class="floating-nav flex justify-around sm:w-12/12 md:w-11/12 bg-zinc-950 rounded-full shadow-xl"
  >
    <!-- Dashboard Link -->
    <RouterLink
      to="/"
      class="flex flex-col items-center space-y-1 p-4 rounded-2xl"
      :class="{
        'bg-red-700': route.path === '/',
        'hover:bg-red-700': route.path !== '/',
      }"
    >
      <PhTrendUp :size="20" weight="fill" color="white" />
      <span class="text-xs md:text-sm text-white">Dashboard</span>
    </RouterLink>

    <!-- Templates Link -->
    <RouterLink
      to="/templates"
      class="flex flex-col items-center space-y-1 p-4 rounded-2xl"
      :class="{
        'bg-red-700': route.path === '/templates',
        'hover:bg-red-700': route.path !== '/templates',
      }"
    >
      <PhPlus :size="20" weight="fill" color="white" />
      <span class="text-xs md:text-sm text-white">Templates</span>
    </RouterLink>

    <!-- Workout Link -->
    <RouterLink
      to="/workout"
      class="flex flex-col items-center space-y-1 p-4 rounded-2xl"
      :class="{
        'bg-red-700': route.path === '/workout',
        'hover:bg-red-700': route.path !== '/workout',
      }"
    >
      <PhBicycle :size="20" weight="fill" color="white" />
      <span class="text-xs md:text-sm text-white">Workout</span>
    </RouterLink>

    <!-- Exercises Link -->
    <RouterLink
      to="/exercises"
      class="flex flex-col items-center space-y-1 p-4 rounded-2xl"
      :class="{
        'bg-red-700': route.path === '/exercises',
        'hover:bg-red-700': route.path !== '/exercises',
      }"
    >
      <PhBarbell :size="20" weight="fill" color="white" />
      <span class="text-xs md:text-sm text-white">Exercises</span>
    </RouterLink>
  </nav>

  <div v-else></div>
</template>

<style scoped>
.floating-nav {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
}

.btn {
  @apply text-white text-xs font-bold hover:bg-stone-700 transition duration-300;
}
</style>
