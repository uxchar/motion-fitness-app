<script setup>
import { ref, onMounted } from "vue";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useAuthStore } from "@/stores/authStore";
import { PhXCircle } from "@phosphor-icons/vue";
import { useRouter } from "vue-router";

const router = useRouter();
const workoutStore = useWorkoutStore();
const authStore = useAuthStore();

const date = new Date();
const formattedDate = date.toLocaleDateString("en-US", {
  timeZone: "America/New_York",
});

onMounted(() => {
  workoutStore.loadFromLocalStorage();
});

const startWorkout = () => {
  workoutStore.startWorkout();
  console.log("Workout started at:", workoutStore.startTime);
};

const finishWorkout = () => {
  workoutStore.finishWorkout();
  console.log("Workout finished at:", workoutStore.finishTime);
};

const cancelWorkout = () => {
  workoutStore.resetWorkout();
  console.log("Workout reset");
};

const newSet = ref({
  set_number: 1,
  set_type: "",
  reps: 0,
  weight: 0,
  complete: false,
});

const addSet = (exerciseId) => {
  workoutStore.addSetToExercise(exerciseId, {
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

  workoutStore.saveToLocalStorage();
};

const removeSet = (exerciseId, setNumber) => {
  workoutStore.removeSet(exerciseId, setNumber);
  workoutStore.saveToLocalStorage();
};

const removeExercise = (exercise) => {
  workoutStore.removeExercise(exercise.id);
  workoutStore.saveToLocalStorage();
  console.log(workoutStore);
};
</script>

<template>
  <div v-if="authStore.token">
    <div>
      <div class="flex justify-between">
        <h1 class="text-4xl font-medium mt-2.5 mb-10">Active Workout</h1>
      </div>

      <div class="flex justify-between">
        <span id="workout-name">{{ formattedDate }}</span>
        <button
          @click="startWorkout()"
          class="bg-green-500 hover:bg-green-700 text-zinc-50 p-2 rounded"
          v-if="!workoutStore.workoutActive"
        >
          Start Workout
        </button>
        <button
          @click="finishWorkout()"
          class="bg-orange-500 hover:bg-orange-700 text-white p-2 rounded"
          v-if="workoutStore.workoutActive"
        >
          Finish Workout
        </button>
        <button
          @click="cancelWorkout()"
          class="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
          v-if="workoutStore.workoutActive"
        >
          Cancel Workout
        </button>
      </div>

      <!-- Render exercises and buttons only if workout is active -->
      <div v-if="workoutStore.workoutActive">
        <div
          v-for="exercise in workoutStore.selectedExercises"
          :key="exercise.id"
          class="mb-12"
        >
          <div class="flex justify-between items-center gap-2.5 mt-12 mb-6">
            <div>
              <span class="font-bold capitalize">{{ exercise.name }}</span>
            </div>
            <button
              class="p-2 bg-black text-white"
              @click="removeExercise(exercise)"
            >
              Remove Exercise
            </button>
          </div>

          <!-- For each set added to exercises, set up form for each set -->
          <div v-for="set in exercise.sets" :key="set.set_number" class="mb-2">
            <div class="flex flex-row justify-between items-center gap-4">
              <!-- Set number -->
              <div class="w-0.5">
                <span class="text-black">{{ set.set_number }}</span>
              </div>

              <!-- Input fields with labels -->
              <div class="flex flex-col w-20">
                <label class="text-black text-sm text-center">Type</label>
                <select
                  v-model="set.set_type"
                  class="border rounded bg-gray-100 text-black p-1 text-center"
                >
                  <option selected value="warmup">W</option>
                  <option value="failure">F</option>
                  <option value="dropset">D</option>
                  <option value="regular">R</option>
                </select>
              </div>

              <div class="flex flex-col w-20">
                <label class="text-black text-sm text-center">Reps</label>
                <input
                  v-model="set.reps"
                  type="number"
                  min="0"
                  class="border rounded bg-gray-100 text-black p-1 text-center"
                />
              </div>

              <div class="flex flex-col w-24">
                <label class="text-black text-sm text-center"
                  >Weight (lbs)</label
                >
                <input
                  v-model="set.weight"
                  type="number"
                  min="0"
                  class="border rounded bg-gray-100 text-black p-1 text-center"
                />
              </div>

              <!-- Align checkbox and delete icon -->
              <div class="flex items-center w-16 justify-between">
                <div class="flex items-center">
                  <input
                    v-model="set.complete"
                    type="checkbox"
                    class="checkbox"
                  />
                </div>

                <PhXCircle
                  @click="removeSet(exercise.id, set.set_number)"
                  :size="24"
                  color="#fd4949"
                  weight="fill"
                  class="cursor-pointer"
                />
              </div>
            </div>
          </div>

          <!-- New set button -->
          <button
            class="w-full mt-2 bg-zinc-700 hover:bg-zinc-900 text-white p-2 rounded"
            @click="addSet(exercise.id)"
          >
            Add New Set
          </button>
        </div>
      </div>

      <!-- Can only add exercises if a workout is active -->
      <div v-if="workoutStore.workoutActive">
        <button
          class="flex bg-zinc-800 hover:bg-zinc-950 text-white p-2 rounded mt-7 mx-auto mb-20"
        >
          <RouterLink to="/exercises"> Add New Exercise </RouterLink>
        </button>
      </div>
    </div>
  </div>
  <div v-else class="p-4"><p>Must login create active workout</p></div>
</template>
