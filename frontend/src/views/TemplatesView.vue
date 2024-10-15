<script setup>
import { ref } from "vue";
import { PhPlusCircle } from "@phosphor-icons/vue";

// initialize exercises with independent sets for each exercise
const templates = ref([
  {
    id: Math.random(),
    templateName: "Leg Day",
    templateNote: "Only on Thursday",
    dateCreated: "10-1-24",
  },
  {
    id: Math.random(),
    templateName: "Chest Day",
    templateNote: "Only on Monday",
    dateCreated: "10-3-24",
  },
]);

const addNewTemplate = () => {
  templates.value.push({
    id: Math.random(),
    templateName: "",
    templateNote: "",
    dateCreated: Date.now(),
  });
};
</script>

<template>
  <div class="flex h-28 w-full justify-between items-center">
    <h2 class="text-4xl font-medium mt-2.5 mb-10">Your Templates</h2>
    <button>
      <!-- <RouterLink> -->
      <PhPlusCircle :size="32" color="#0c0a09" weight="fill" />
      <!-- </RouterLink> -->
    </button>
  </div>

  <div
    v-for="template in templates"
    :key="template.id"
    class="mb-6 p-4 bg-zinc-950 text-zinc-50 rounded-lg w-full"
  >
    <div class="flex flex-col items-center">
      <p class="font-semibold text-lg">{{ template.templateName }}</p>
      <p class="text-zinc-400">{{ template.templateNote }}</p>
      <p class="text-zinc-400">{{ template.dateCreated }}</p>
    </div>
  </div>
</template>
