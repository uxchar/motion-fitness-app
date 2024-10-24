<script setup>
import { ref, onMounted } from "vue";
import { PhPlusCircle } from "@phosphor-icons/vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();

// initialize exercises with independent sets for each exercise
// Hard coded data for now until implementation
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
  <div v-if="authStore.token">
    <div class="flex w-full justify-between items-center">
      <h2 class="text-4xl font-medium mt-2.5 mb-10">Your Templates</h2>
    </div>

    <div
      v-for="template in templates"
      :key="template.id"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 w-full"
    >
      <div
        class="flex flex-col items-center bg-zinc-950 text-zinc-50 rounded-lg py-14"
      >
        <p class="font-semibold text-lg">{{ template.templateName }}</p>
        <p class="text-zinc-400">{{ template.templateNote }}</p>
        <p class="text-zinc-400">{{ template.dateCreated }}</p>
      </div>
    </div>
  </div>
  <div v-else class="p-4"><p>Must login create templates</p></div>
</template>
