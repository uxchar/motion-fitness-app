<script setup>
import { ref, defineEmits } from "vue";

// initialize exercises with independent sets for each exercise
const exercises = ref([
  {
    id: Math.random(),
    exerciseName: "",
    sets: [
      {
        id: Math.random(),
        set_type: "",
        reps: 0,
        weight: 0,
        complete: false,
      },
    ],
  },
]);

//emit data from child to parent for posting to database
const emit = defineEmits(["updateWorkout"]);

const workoutDatatoParent = () => {
  emit("updateWorkout", exercises.value);
};

// function to add a new set to a specific exercise
const addNewSet = (exercise) => {
  exercise.sets.push({
    id: Math.random(),
    set_type: "",
    reps: 0,
    weight: 0,
    complete: false,
  });
};

// function to delete a specific set from an exercise
// look into exercise sets and find the set clicked by using id
// remove set from exercise
const deleteSet = (exercise, setId) => {
  exercise.sets = exercise.sets.filter((set) => set.id != setId);
};
// function to add a new exercise
const addNewExercise = () => {
  exercises.value.push({
    id: Date.now() + Math.random(),
    exerciseName: "",
    sets: [
      {
        id: Date.now() + Math.random(),
        set_type: "",
        reps: 0,
        weight: 0,
        complete: false,
      },
    ],
  });
};
</script>

<template>
  <div v-for="exercise in exercises" :key="exercise.id" class="mb-12">
    <div class="flex flex-col gap-2.5 mb-5">
      <label class="text-black">Exercise Name:</label>
      <input
        v-model="exercise.exerciseName"
        type="text"
        class="border rounded bg-white text-black p-2"
        placeholder="Enter Exercise Name"
      />
    </div>

    <!-- Loop through sets specific to this exercise -->
    <div v-for="(set, index) in exercise.sets" :key="set.id" class="mb-2">
      <p class="text-black">Set {{ index + 1 }}</p>
      <div class="flex flex-row justify-between items-center space-x-4">
        <!-- Set type -->
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

        <!-- reps -->
        <div class="flex flex-col w-1/6">
          <label class="text-black">Reps</label>
          <input
            v-model="set.reps"
            type="number"
            min="0"
            class="border rounded bg-white text-black p-2"
          />
        </div>

        <!-- weight -->
        <div class="flex flex-col w-1/6">
          <label class="text-black">Weight (lbs)</label>
          <input
            v-model="set.weight"
            type="number"
            min="0"
            class="border rounded bg-white text-black p-2"
          />
        </div>

        <!-- complete checkbox -->
        <div class="flex flex-col w-1/8">
          <label class="text-black mb-4 text-center">Complete?</label>
          <input v-model="set.complete" type="checkbox" class="p-2" />
        </div>

        <!-- delete set checkbox -->
        <div class="flex flex-col w-1/8">
          <label class="text-black mb-4 text-center">Delete?</label>
          <input
            @click="deleteSet(exercise, set.id)"
            type="checkbox"
            class="p-2"
          />
        </div>
      </div>
    </div>

    <!-- Add New Set button for this exercise -->
    <button
      class="bg-stone-500 hover:bg-stone-700 text-white p-2 rounded"
      @click="addNewSet(exercise)"
    >
      Add New Set
    </button>
  </div>

  <!-- Add New Exercise button -->
  <button
    @click="addNewExercise()"
    class="flex bg-violet-500 hover:bg-violet-700 text-white p-2 rounded mt-7 mx-auto mb-20"
  >
    Add New Exercise
  </button>
</template>

<style scoped></style>
