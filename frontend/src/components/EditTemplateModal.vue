<script setup>
import { useTemplateStore } from "@/stores/templateStore";

const templateStore = useTemplateStore();

// Close the modal
const closeModal = () => {
  templateStore.currentTemplate = null;
};

// Save changes
const saveChanges = () => {
  templateStore.updateTemplate(templateStore.currentTemplate);
  closeModal();
};

// Delete template
const deleteTemplate = (templateId) => {
  templateStore.deleteTemplate(templateId);
  closeModal();
};

// Add a new set to an exercise
const addSet = (exercise) => {
  const newSet = {
    set_number: exercise.sets.length + 1,
    set_type: "regular",
    reps: 0,
    weight: 0,
  };
  exercise.sets.push(newSet);
};

// Remove an exercise
const removeExercise = (exerciseIndex) => {
  templateStore.currentTemplate.exercises.splice(exerciseIndex, 1);
};

// Remove a set from an exercise
const removeSet = (exercise, setIndex) => {
  exercise.sets.splice(setIndex, 1);
  // Reassign set numbers to maintain order
  exercise.sets.forEach((set, index) => {
    set.set_number = index + 1;
  });
};
</script>

<template>
  <!-- Modal overlay -->
  <div
    v-if="templateStore.currentTemplate"
    class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
  >
    <!-- Modal content -->
    <div
      class="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg relative mx-4 overflow-y-auto max-h-[70vh]"
    >
      <!-- Close button -->
      <button
        @click="closeModal"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div class="mb-6">
        <button
          @click="saveChanges"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Start Workout
        </button>
      </div>

      <!-- Modal Header -->
      <h2 class="text-2xl font-semibold mb-4 text-center">
        <input
          type="text"
          v-model="templateStore.currentTemplate.template_name"
          class="w-full text-center border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
          placeholder="Template Name"
        />
      </h2>
      <p class="mb-4 text-center text-gray-600">
        <textarea
          v-model="templateStore.currentTemplate.template_note"
          class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Template Note"
        ></textarea>
      </p>

      <!-- Exercise List -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Exercises</h3>
        <div
          v-for="(exercise, exerciseIndex) in templateStore.currentTemplate
            .exercises"
          :key="exercise.id"
          class="mb-6 border rounded-lg p-4"
        >
          <div class="flex justify-between items-center mb-4">
            <input
              type="text"
              v-model="exercise.exercise_name"
              class="w-full mb-2 text-lg font-bold border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 capitalize"
              placeholder="Exercise Name"
            />
            <button
              @click="removeExercise(exerciseIndex)"
              class="text-red-600 hover:text-red-800"
            >
              Remove Exercise
            </button>
          </div>

          <!-- Sets -->
          <div
            v-for="(set, setIndex) in exercise.sets"
            :key="set.set_number"
            class="flex gap-5 items-center mb-2"
          >
            <div class="w-12 text-sm">Set {{ set.set_number }}</div>
            <select
              v-model="set.set_type"
              class="p-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="warmup">Warmup</option>
              <option value="failure">Failure</option>
              <option value="dropset">Dropset</option>
              <option value="regular">Regular</option>
            </select>
            <input
              v-model.number="set.reps"
              type="number"
              min="0"
              class="w-16 p-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Reps"
            />
            <input
              v-model.number="set.weight"
              type="number"
              min="0"
              class="w-24 p-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Weight (lbs)"
            />
            <button
              @click="removeSet(exercise, setIndex)"
              class="text-red-600 hover:text-red-800"
            >
              Remove Set
            </button>
          </div>
          <!-- Add Set Button -->
          <button
            @click="addSet(exercise)"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded-lg"
          >
            Add Set
          </button>
        </div>
      </div>

      <!-- Add Exercise Button -->
      <button
        class="flex bg-zinc-800 hover:bg-zinc-950 text-white p-2 rounded mt-7 mx-auto mb-20"
      >
        <RouterLink to="/exercises"> Add Exercise </RouterLink>
      </button>

      <!-- Footer -->
      <div class="mt-6 flex justify-end space-x-4">
        <button
          @click="saveChanges"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
        <button
          @click="closeModal"
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancel
        </button>
        <button
          @click="deleteTemplate(templateStore.currentTemplate.template_id)"
          class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  overflow: hidden;
}
</style>
