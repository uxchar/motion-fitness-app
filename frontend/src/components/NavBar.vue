<script setup>
import { PhBicycle, PhTrendUp, PhPlus, PhBarbell } from "@phosphor-icons/vue";
</script>

<template>
  <nav
    class="floating-nav flex justify-around w-5/6 bg-neutral-900 p-2 rounded-full shadow-xl"
  >
    <RouterLink
      to="/"
      class="flex flex-col items-center space-y-1 hover:bg-sky-700 rounded-3xl py-2 px-4"
    >
      <PhTrendUp :size="32" weight="fill" color="white" />
      <span class="btn">Dashboard</span>
    </RouterLink>

    <RouterLink
      to="/templates"
      class="flex flex-col items-center space-y-1 hover:bg-sky-700 rounded-3xl py-2 px-4"
    >
      <PhPlus :size="32" weight="fill" color="white" />
      <span class="btn">Templates</span>
    </RouterLink>

    <RouterLink
      to="/workout"
      class="flex flex-col items-center space-y-1 hover:bg-sky-700 rounded-3xl py-2 px-4"
    >
      <PhBicycle :size="32" weight="fill" color="white" />
      <span class="btn">Workout</span>
    </RouterLink>

    <RouterLink
      to="/exercises"
      class="flex flex-col items-center space-y-1 hover:bg-sky-700 rounded-3xl py-2 px-4"
    >
      <PhBarbell :size="32" weight="fill" color="white" />
      <span class="btn">Exercises</span>
    </RouterLink>
  </nav>
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
