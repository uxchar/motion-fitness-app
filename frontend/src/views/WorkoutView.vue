<script setup>
import { ref } from "vue";
import { useWorkoutStore } from "@/stores/workoutStore";
import { PhXCircle } from "@phosphor-icons/vue";

const workoutStore = useWorkoutStore();
const date = new Date();
const formattedDate = date.toLocaleDateString();
const userId = 1;

const startWorkout = () => {
  workoutStore.startWorkout();
  console.log("Workout started at:", workoutStore.startTime);
};

const finishWorkout = () => {
  workoutStore.finishWorkout();
  console.log("Workout finished at:", workoutStore.finishTime);

  const duration =
    (new Date(workoutStore.finishTime) - new Date(workoutStore.startTime)) /
    1000 /
    60;
  console.log("Workout Time:", duration, "minutes");

  const workoutData = {
    exercises: workoutStore.selectedExercises,
    startTime: workoutStore.startTime,
    finishTime: workoutStore.finishTime,
  };

  fetch(`http://localhost:3000/workout/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(workoutData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
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
};

const removeSet = (exerciseId, setNumber) => {
  workoutStore.removeSet(exerciseId, setNumber);
};

const removeExercise = (exercise) => {
  workoutStore.removeExercise(exercise.id);
  console.log(workoutStore);
};
</script>

<template>
  <div v-if="isAuth">
    <div class="min-h-screen">
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

      <!-- render exercises and buttons only if workout is active -->
      <div v-if="workoutStore.workoutActive">
        <div
          v-for="exercise in workoutStore.selectedExercises"
          :key="exercise.id"
          class="mb-12"
        >
          <div class="flex justify-between items-center gap-2.5 mt-12 mb-6">
            <div>
              <span class="font-bold">{{ exercise.name.toUpperCase() }}</span>
            </div>
            <button
              class="p-2 bg-black text-white"
              @click="removeExercise(exercise)"
            >
              Remove Exercise
            </button>
          </div>

          <!-- for each set added to exercises, set up form for each set -->
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
                  >Weight(lbs)</label
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

          <button
            class="w-full mt-2 bg-zinc-700 hover:bg-zinc-900 text-white p-2 rounded"
            @click="addSet(exercise.id)"
          >
            Add New Set
          </button>
        </div>
      </div>

      <div v-if="workoutStore.workoutActive">
        <button
          @click="addNewExercise()"
          class="flex bg-zinc-800 hover:bg-zinc-950 text-white p-2 rounded mt-7 mx-auto mb-20"
        >
          <RouterLink to="/exercises"> Add New Exercise </RouterLink>
        </button>
      </div>
    </div>
  </div>
  <div v-else class="p-4"><p>Must login create active workout</p></div>
</template>

<style scoped>
/* Adjust layout for mobile screens */
@media (max-width: 640px) {
  .w-16 {
    width: 50px;
  }
  .w-20 {
    width: 60px;
  }
  .w-24 {
    width: 80px;
  }
}
</style>
