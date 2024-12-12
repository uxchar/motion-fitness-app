<script setup>
import { ref } from "vue";
import { useTemplateStore } from "@/stores/templateStore";
import { onMounted } from "vue";

const templateStore = useTemplateStore();

const closeModal = () => {
  templateStore.closeTemplateModal();
};

const openModal = () => {
  templateStore.openTemplateModal();
};

const saveTemplate = () => {
  templateStore.saveTemplate();
  closeModal();
};

onMounted(() => {
  templateStore.loadFromLocalStorage();
});

const newSet = ref({
  set_number: 1,
  set_type: "",
  reps: 0,
  weight: 0,
  complete: false,
});

const addSet = (exerciseId) => {
  templateStore.addSetToExercise(exerciseId, {
    set_number: newSet.value.set_number,
    set_type: newSet.value.set_type,
    reps: newSet.value.reps,
    weight: newSet.value.weight,
    complete: newSet.value.complete,
  });

  newSet.value = {
    set_number: newSet.value.set_number + 1,
    set_type: "",
    reps: 0,
    weight: 0,
    complete: false,
  };

  templateStore.saveToLocalStorage();
};

const removeSet = (exerciseId, setNumber) => {
  templateStore.removeSet(exerciseId, setNumber);
  templateStore.saveToLocalStorage();
};

const removeExercise = (exercise) => {
  templateStore.removeExercise(exercise.id);
  templateStore.saveToLocalStorage();
  console.log(templateStore);
};
</script>

<template>
  <div>
    <!-- Button to open the modal -->
    <button
      @click="openModal"
      class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 mt-4 rounded-lg"
    >
      Create New Template
    </button>

    <!-- Modal overlay -->
    <div
      v-if="templateStore.isTemplateModalOpen"
      class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
    >
      <!-- Modal content -->
      <div
        class="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg relative mx-4 overflow-y-auto max-h-[70vh] z-60"
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

        <!-- Modal Title -->
        <h2 class="text-2xl font-semibold mb-4 text-center">
          Create New Template
        </h2>

        <!-- Template Details -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700"
            >Template Name</label
          >
          <input
            v-model="templateStore.templateName"
            type="text"
            placeholder="Enter template name"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700">Note</label>
          <textarea
            v-model="templateStore.note"
            placeholder="Add any notes (optional)"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows="4"
          ></textarea>
        </div>

        <!-- Exercises Section -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Exercises</h3>
          <div
            v-for="exercise in templateStore.selectedTemplateExercises"
            :key="exercise.id"
            class="mb-6 border rounded-lg p-4"
          >
            <div class="flex justify-between items-center mb-4">
              <input
                v-model="exercise.name"
                type="text"
                placeholder="Exercise Name"
                class="w-2/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                @click="removeExercise(exercise.id)"
                class="text-red-600 hover:text-red-800"
              >
                Remove Exercise
              </button>
            </div>

            <!-- Sets Section -->
            <div
              v-for="set in exercise.sets"
              :key="set.set_number"
              class="mb-4 mt-7 flex items-center gap-4"
            >
              <span class="w-8 text-center">{{ set.set_number }}</span>
              <select
                v-model="set.set_type"
                class="p-1 border rounded bg-gray-100 text-black"
              >
                <option value="warmup">Warmup</option>
                <option value="regular">Regular</option>
                <option value="failure">Failure</option>
                <option value="dropset">Dropset</option>
              </select>
              <div class="flex flex-col -mt-5">
                <label for="rep">Reps</label>
                <input
                  v-model="set.reps"
                  type="number"
                  min="0"
                  class="w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
              </div>
              <div class="flex flex-col -mt-5">
                <label for="weight">Weight</label>

                <input
                  v-model="set.weight"
                  type="number"
                  min="0"
                  class="w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
              </div>
              <button
                @click="removeSet(exercise.id, set.set_number)"
                class="text-red-600 hover:text-red-800"
              >
                Remove Set
              </button>
            </div>

            <!-- Add Set Button -->
            <button
              @click="addSet(exercise.id)"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded-lg"
            >
              Add Set
            </button>
          </div>

          <!-- Add Exercise Button -->
          <button
            class="flex bg-zinc-800 hover:bg-zinc-950 text-white p-2 rounded mt-7 mx-auto mb-20"
          >
            <RouterLink to="/exercises"> Add Exercise </RouterLink>
          </button>
        </div>

        <!-- Save and Cancel buttons -->
        <div class="mt-6 flex justify-end space-x-4">
          <button
            @click="saveTemplate"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Template
          </button>
          <button
            @click="closeModal"
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Prevent body scrolling when the modal is open */
body {
  overflow: hidden;
}
</style>
