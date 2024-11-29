<script setup>
import { onMounted } from "vue";
import { PhDotsThreeOutlineVertical } from "@phosphor-icons/vue";
import CreateTemplateModal from "@/components/CreateTemplateModal.vue";
import { useTemplateStore } from "@/stores/templateStore";
import { useAuthStore } from "@/stores/authStore";

const templateStore = useTemplateStore();
const authStore = useAuthStore();

onMounted(() => {
  if (authStore.token != null) {
    templateStore.getPreviousTemplates();
  }
});

const formatDate = (timestamp) => {
  return format(new Date(timestamp), "PPpp");
};
</script>

<template>
  <div v-if="authStore.token">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-4xl font-medium">Your Templates</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="template in templateStore.templates"
        :key="template.template_id"
        class="p-6 bg-gray-900 text-white rounded-lg shadow"
      >
        <h3 class="text-xl font-semibold">{{ template.template_name }}</h3>
        <p class="text-gray-400">{{ template.template_note }}</p>
        <p class="text-gray-500 text-sm">{{ template.date_created }}</p>
        <div
          class="mb-4"
          v-for="exercise in template.exercises"
          :key="exercise.exercise_name"
        >
          <div class="font-bold mb-1.5 capitalize">
            {{ exercise.exercise_name }}
          </div>

          <div
            class="flex gap-5 items-center"
            v-for="set in exercise.sets"
            :key="set.set_number"
          >
            <div class="w-12 text-sm">Set {{ set.set_number }}</div>
            <div class="w-16 text-sm">{{ set.reps }} reps</div>
            <div class="w-24 text-sm">{{ set.weight }} lbs</div>
          </div>
        </div>
      </div>
    </div>

    <CreateTemplateModal />
  </div>
  <div v-else class="p-4">
    <p>Must login to see templates</p>
  </div>
</template>
