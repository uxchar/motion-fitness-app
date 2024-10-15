<script setup>
import { ref } from "vue";

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
  <div class="flex justify-between">
    <h2 class="mb-10 text-2xl font-bold">Templates</h2>
    <button>
      <RouterLink
        to="/create-template"
        class="bg-blue-500 hover:bg-blue-700 text-white p-4 rounded"
        >Create Template</RouterLink
      >
    </button>
  </div>

  <div
    v-for="template in templates"
    :key="template.id"
    class="mb-8 p-6 bg-white-100 bg-slate-300 rounded-md w-1/4"
  >
    <div class="flex flex-col items-center">
      <p class="font-semibold text-lg">{{ template.templateName }}</p>
      <p class="text-gray-500">{{ template.templateNote }}</p>
      <p class="text-gray-500">{{ template.dateCreated }}</p>
    </div>
  </div>
</template>
