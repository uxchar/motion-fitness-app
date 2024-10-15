<script setup>
import { useWorkoutStore } from "@/stores/workoutStore";
import { ref, onMounted, computed } from "vue";

const workoutStore = useWorkoutStore();
// Initialize exercises and selectedExercises
const exercises = ref([]);
const searchQuery = ref("");
const selectedTarget = ref("");
const selectedEquipment = ref("");

const url = "http://localhost:3000/api/data";

// Use onMounted to fetch data after the component is mounted
onMounted(async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    exercises.value = result;
    console.log(result);
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }
});
const addToWorkout = (exercise) => {
  console.log(exercise);
  workoutStore.addExercise(exercise);
  console.log(workoutStore);
};

const uniqueTargets = computed(() => {
  return [...new Set(exercises.value.map((exercise) => exercise.target))];
});
const uniqueEquipment = computed(() => {
  return [...new Set(exercises.value.map((exercise) => exercise.equipment))];
});

const filteredExercises = computed(() => {
  let filtered = exercises.value.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  if (selectedTarget.value) {
    filtered = filtered.filter(
      (exercise) => exercise.target === selectedTarget.value
    );
  }
  if (selectedEquipment.value) {
    filtered = filtered.filter(
      (exercise) => exercise.equipment === selectedEquipment.value
    );
  }
  return filtered;
});
</script>

<template>
  <div class="flex flex-col justify-center items-center min-h-screen p-6">
    <div class="mb-16">
      <input
        class="pl-2 border-2 border-black"
        type="text"
        v-model="searchQuery"
        placeholder="Search exercises"
      />
    </div>
    <h2 class="my-4">Filter by Body Part Target:</h2>
    <div class="flex flex-wrap m-4 gap-4">
      <button
        class="bg-black text-white rounded-full ... px-4 py-2"
        v-for="target in uniqueTargets"
        :key="target"
        @click="selectedTarget = target"
      >
        {{ target }}
      </button>
      <button @click="selectedTarget = ''">Show All</button>
    </div>
    <h2 class="my-4">Filter by Equipment:</h2>
    <div class="flex flex-wrap m-4 gap-4">
      <button
        class="bg-black text-white rounded-full ... px-4 py-2"
        v-for="equipment in uniqueEquipment"
        :key="equipment"
        @click="selectedEquipment = equipment"
      >
        {{ equipment }}
      </button>
      <button @click="selectedEquipment = ''">Show All</button>
    </div>
    <ul>
      <li v-for="exercise in filteredExercises" :key="exercise.id">
        <!-- Display fetched exercises from the API -->
        <div
          class="flex flex-col items-center border border-gray-300 p-4 rounded-lg w-full max-w-sm my-10"
        >
          <div class="font-semibold text-lg mb-2">{{ exercise.name }}</div>
          <div class="text-gray-600 mb-1">
            Muscle Group: {{ exercise.target }}
          </div>
          <div class="text-gray-600 mb-1">
            Equipment: {{ exercise.equipment }}
          </div>
          <button
            class="bg-black text-white rounded-full ... px-4 py-2 mt-4"
            @click="addToWorkout(exercise)"
          >
            Add to Workout
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
