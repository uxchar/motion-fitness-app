<script setup>
import { useWorkoutStore } from "@/stores/workoutStore";
import { useAuthStore } from "@/stores/authStore";
import { ref, onMounted, computed } from "vue";
import {
  PhPlusCircle,
  PhCheckCircle,
  PhArrowCircleLeft,
} from "@phosphor-icons/vue";
import { useRouter } from "vue-router";

const workoutStore = useWorkoutStore();
const authStore = useAuthStore();
const router = useRouter();

const exercises = ref([]);
const searchQuery = ref("");
const selectedTarget = ref("");
const selectedEquipment = ref("");

const url = `${import.meta.env.VITE_API_URL}`;

onMounted(async () => {
  try {
    const response = await fetch(`${url}/api/data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else if (response.ok && authStore.token != null) {
      const result = await response.json();
      exercises.value = result;
    }
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }
});

const addToWorkout = (exercise) => {
  if (!workoutStore.workoutActive) {
    alert(
      "Cannot add exercise, there is currently no active workout in progress."
    );
    return;
  }

  if (isExerciseAdded(exercise)) {
    workoutStore.removeExercise(exercise.id);
  } else {
    workoutStore.addExercise(exercise);
  }
};

// Check if an exercise is added to the workout
const isExerciseAdded = (exercise) => {
  return workoutStore.selectedExercises.some(
    (clickedExercise) => clickedExercise.id === exercise.id
  );
};

// Filter and toggle logic
const toggleTarget = (target) => {
  selectedTarget.value = selectedTarget.value === target ? "" : target;
};

const toggleEquipment = (equipment) => {
  selectedEquipment.value =
    selectedEquipment.value === equipment ? "" : equipment;
};

// Unique targets and equipment filters
const uniqueTargets = computed(() => {
  return [...new Set(exercises.value.map((exercise) => exercise.target))];
});

const uniqueEquipment = computed(() => {
  return [...new Set(exercises.value.map((exercise) => exercise.equipment))];
});

// Filter exercises based on search query, target, and equipment
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
  <div v-if="authStore.token">
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
    <RouterLink to="/workout">
      <button
        class="fixed top-4 left-4 bg-red-500 text-black p-2 rounded-full shadow-lg hover:bg-red-600 transition"
      >
        <PhArrowCircleLeft :size="34" weight="bold" />
      </button>
    </RouterLink>
    <h1 class="text-4xl font-medium mt-10 mb-10 md:text-center">
      Exercise List
    </h1>

    <!-- Search bar -->
    <div class="flex flex-col justify-center items-center p-6">
      <div class="mb-6 w-full max-w-lg">
        <input
          type="text"
          placeholder="Search exercises"
          v-model="searchQuery"
          class="h-12 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-stone-100 dark:border-gray-600 dark:placeholder-gray-500 dark:text-grey dark:focus:ring-red-500 dark:focus:border-red-500"
        />
      </div>

      <!-- Body target filter -->
      <h2 class="my-1">Filter by Body Part Target:</h2>
      <div class="flex flex-wrap m-4 gap-4 justify-center">
        <button
          class="px-3 py-1 rounded-full"
          v-for="target in uniqueTargets"
          :key="target"
          @click="toggleTarget(target)"
          :class="{
            'bg-red-500 text-white': selectedTarget === target,
            'bg-gray-300 text-zinc-900': selectedTarget !== target,
          }"
        >
          {{ target }}
        </button>
      </div>

      <!-- Equipment filter -->
      <h2 class="my-1">Filter by Equipment:</h2>
      <div class="flex flex-wrap m-4 gap-4 justify-center">
        <button
          class="px-3 py-1 rounded-full"
          v-for="equipment in uniqueEquipment"
          :key="equipment"
          @click="toggleEquipment(equipment)"
          :class="{
            'bg-red-500 text-white': selectedEquipment === equipment,
            'bg-gray-300 text-zinc-900': selectedEquipment !== equipment,
          }"
        >
          {{ equipment }}
        </button>
      </div>

      <!-- Exercise list -->
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

          <!-- Toggle icon between plus and check -->
          <button @click="addToWorkout(exercise)">
            <PhPlusCircle
              v-if="!isExerciseAdded(exercise)"
              :size="36"
              color="#0c0a09"
              weight="fill"
            />
            <PhCheckCircle v-else :size="36" color="#FD3F3F" weight="fill" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="p-4">
    <p>Must login to view exercises list</p>
  </div>
</template>
