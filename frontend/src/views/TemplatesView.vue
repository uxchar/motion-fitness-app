<script setup>
import { ref } from "vue";
import { PhDotsThreeOutlineVertical } from "@phosphor-icons/vue";
import CreateTemplateModal from "@/components/CreateTemplateModal.vue";
import { useTemplateStore } from "@/stores/templateStore";

const templateStore = useTemplateStore();

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
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-4xl font-medium">Your Templates</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="template in templates"
        :key="template.id"
        class="p-6 bg-gray-900 text-white rounded-lg shadow"
      >
        <h3 class="text-xl font-semibold">{{ template.templateName }}</h3>
        <p class="text-gray-400">{{ template.templateNote }}</p>
        <p class="text-gray-500 text-sm">{{ template.dateCreated }}</p>
      </div>
    </div>

    <CreateTemplateModal />
  </div>
</template>
