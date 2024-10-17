<script setup>
import { useWorkoutStore } from "@/stores/workoutStore";
import { ref, onMounted, computed } from "vue";
import { PhPlusCircle } from "@phosphor-icons/vue";

const workoutStore = useWorkoutStore();
const authStore = useAuthStore();
// Initialize exercises and selectedExercises
const exercises = ref([]);
const searchQuery = ref("");
const selectedTarget = ref("");
const selectedEquipment = ref("");
const isAuth = ref("");

const url = "http://localhost:3000/api/data";

// Use onMounted to fetch data after the component is mounted
onMounted(async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else if (response.ok && authStore.token) {
      isAuth = true;
      const result = await response.json();
      exercises.value = result;
      console.log(result);
    }
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }
});
const addToWorkout = (exercise) => {
  console.log(exercise);
  if (workoutStore.workoutActive === false) {
    alert(
      "Cannot add exercise, there is currently no active workout in progress."
    );
  } else {
    workoutStore.addExercise(exercise);
  }
  console.log(workoutStore);
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
// https://vuejs.org/guide/essentials/computed.html

//All exercises are mapped over and Set prevents duplicates, returning array with unique values
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
  <div v-if="isAuth">
    <div
      v-if="!workoutStore.workoutActive"
      role="alert"
      class="alert alert-error"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Workout must be in progress to add exercises.</span>
    </div>
    <h1 class="text-4xl font-medium mt-10 mb-10 md:text-center">
      Exercise List
    </h1>

    <div class="flex flex-col justify-center items-center min-h-screen p-6">
      <div class="mb-6 w-full max-w-lg">
        <input
          type="text"
          placeholder="Search exercises"
          v-model="searchQuery"
          class="h-12 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-100 dark:border-gray-600 dark:placeholder-gray-500 dark:text-grey dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <h2 class="my-1">Filter by Body Part Target:</h2>
      <div class="flex flex-wrap m-4 gap-4 justify-center">
        <button
          class="bg-black text-white rounded-full px-3 py-1"
          v-for="target in uniqueTargets"
          :key="target"
          @click="selectedTarget = target"
        >
          {{ target }}
        </button>
        <button @click="selectedTarget = ''">Show All</button>
      </div>

      <h2 class="my-1">Filter by Equipment:</h2>
      <div class="flex flex-wrap m-4 gap-4 justify-center">
        <button
          class="bg-black text-white rounded-full px-3 py-1"
          v-for="equipment in uniqueEquipment"
          :key="equipment"
          @click="selectedEquipment = equipment"
        >
          {{ equipment }}
        </button>
        <button @click="selectedEquipment = ''">Show All</button>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-20"
      >
        <div
          v-for="exercise in filteredExercises"
          :key="exercise.id"
          class="flex items-center border border-gray-300 p-4 rounded-lg w-full"
        >
          <div class="w-24 mr-4 font-bold text-sm">
            {{ exercise.name.toUpperCase() }}
          </div>
          <div class="flex flex-col gap-1 flex-grow">
            <div class="text-sm">{{ exercise.target }}</div>
            <div class="text-sm">{{ exercise.equipment }}</div>
          </div>
          <button @click="addToWorkout(exercise)">
            <PhPlusCircle :size="36" color="#0c0a09" weight="fill" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="p-4"><p>Must login to view exercises list</p></div>
</template>
