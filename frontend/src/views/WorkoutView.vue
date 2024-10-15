<script setup>
import { ref } from "vue";
import { useWorkoutStore } from "@/stores/workoutStore";

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
  <div class="min-h-screen">
    <div class="flex justify-between">
      <h1 class="text-3xl mb-10">Active Workout</h1>
    </div>

    <div class="flex justify-between">
      <span id="workout-name">{{ formattedDate }}</span>
      <button
        @click="startWorkout()"
        class="bg-green-500 hover:bg-green-700 text-white p-2 rounded"
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
        <div class="flex flex-col gap-2.5 mb-5">
          <div>
            <label class="text-black">Exercise Name:</label>
            {{ exercise.name }}
          </div>
          <button
            class="p-4 bg-black text-white"
            @click="removeExercise(exercise)"
          >
            Remove Exercise
          </button>
        </div>

        <!-- for each set added to exercises, set up form for each set -->
        <div v-for="set in exercise.sets" :key="set.set_number" class="mb-2">
          <p class="text-black">Set {{ set.set_number }}</p>
          <div class="flex flex-row justify-between items-center space-x-4">
            <div class="flex flex-col w-1/4">
              <label class="text-black">Set Type</label>
              <select
                v-model="set.set_type"
                class="border rounded bg-white text-black p-2"
              >
                <option selected value="warmup">Warmup</option>
                <option value="failure">Failure</option>
                <option value="dropset">Dropset</option>
                <option value="regular">Regular</option>
              </select>
            </div>

            <div class="flex flex-col w-1/6">
              <label class="text-black">Reps</label>
              <input
                v-model="set.reps"
                type="number"
                min="0"
                class="border rounded bg-white text-black p-2"
              />
            </div>

            <div class="flex flex-col w-1/6">
              <label class="text-black">Weight (lbs)</label>
              <input
                v-model="set.weight"
                type="number"
                min="0"
                class="border rounded bg-white text-black p-2"
              />
            </div>

            <div class="flex flex-col w-1/8">
              <label class="text-black mb-4 text-center">Complete?</label>
              <input v-model="set.complete" type="checkbox" class="p-2" />
            </div>

            <div class="flex flex-col w-1/8">
              <label class="text-black mb-4 text-center">Delete?</label>
              <input
                @click="removeSet(exercise.id, set.set_number)"
                type="checkbox"
                class="p-2"
              />
            </div>
          </div>
        </div>

        <button
          class="bg-stone-500 hover:bg-stone-700 text-white p-2 rounded"
          @click="addSet(exercise.id)"
        >
          Add New Set
        </button>
      </div>
    </div>

    <div v-if="workoutStore.workoutActive">
      <button
        @click="addNewExercise()"
        class="flex bg-violet-500 hover:bg-violet-700 text-white p-2 rounded mt-7 mx-auto mb-20"
      >
        <RouterLink to="/exercises"> Add New Exercise </RouterLink>
      </button>
    </div>
  </div>
</template>
