<script setup>
import { useWorkoutStore } from "@/stores/workoutStore";

const workoutStore = useWorkoutStore();

const closeModal = () => {
  workoutStore.currentWorkout = null;
};

const saveChanges = () => {
  workoutStore.updateWorkout(workoutStore.currentWorkout);

  closeModal();
};
</script>
<template>
  <!-- Modal overlay with higher z-index to ensure it covers everything -->
  <div
    v-if="workoutStore.currentWorkout"
    class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
  >
    <!-- Modal content -->
    <div
      class="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative mx-4 overflow-y-auto max-h-[90vh] z-60"
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

      <!-- Title -->
      <h2 class="text-2xl font-semibold mb-4 text-center">Edit Workout</h2>

      <!-- Workout form -->
      <div
        v-for="(exercise, index) in workoutStore.currentWorkout.exercises"
        :key="index"
        class="mb-6"
      >
        <h3 class="text-lg font-semibold mb-2">{{ exercise.exercise_name }}</h3>

        <div
          v-for="(set, setIndex) in exercise.sets"
          :key="setIndex"
          class="mb-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Reps input -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Reps</label
              >
              <input
                v-model="set.reps"
                type="number"
                min="1"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Weight input -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Weight (lbs)</label
              >
              <input
                v-model="set.weight"
                type="number"
                min="0"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Complete checkbox -->
            <div class="col-span-1 md:col-span-2 flex items-center mt-2">
              <input
                v-model="set.complete"
                type="checkbox"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-700">Complete</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Save and Cancel buttons -->
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
