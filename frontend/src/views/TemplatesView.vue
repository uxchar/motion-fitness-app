<script setup>
import { onMounted } from "vue";
import { useTemplateStore } from "@/stores/templateStore";
import { useAuthStore } from "@/stores/authStore";
import { format } from "date-fns";
import CreateTemplateModal from "@/components/CreateTemplateModal.vue";
import EditTemplateModal from "@/components/EditTemplateModal.vue";

const templateStore = useTemplateStore();
const authStore = useAuthStore();

onMounted(() => {
  if (authStore.token != null) {
    templateStore.getPreviousTemplates();
  }
});

const formatDate = (timestamp) => {
  if (!timestamp) {
    return "Pending...";
  }

  const date = new Date(timestamp);
  return isNaN(date) ? "Invalid Date" : format(date, "PPpp");
};

const openModal = (template) => {
  templateStore.currentTemplate = template;
};
</script>

<template>
  <div v-if="authStore.token">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-4xl font-medium">Your Templates</h2>
    </div>

    <!-- Template grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="template in templateStore.templates"
        :key="template.template_id"
        class="p-6 bg-zinc-900 text-white rounded-lg shadow cursor-pointer hover:shadow-lg transition-all duration-300"
        @click="openModal(template)"
      >
        <h3 class="text-xl font-semibold">{{ template.template_name }}</h3>
        <p class="text-gray-400">{{ template.template_note }}</p>
        <p class="text-gray-500 text-sm">
          Created: {{ formatDate(template.date_created) }}
        </p>
      </div>
    </div>

    <!-- Modals -->
    <CreateTemplateModal />
    <EditTemplateModal />
  </div>

  <div v-else class="p-4">
    <p>Must login to see templates</p>
  </div>
</template>
