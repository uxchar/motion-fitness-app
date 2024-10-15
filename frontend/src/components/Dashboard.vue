<script setup>
import { ref, onMounted } from "vue";

const workouts = ref([]);
const userId = 1;
const username = "Johnny";

// Fetch workout data from the backend API
const fetchWorkouts = async () => {
  try {
    const response = await fetch(`http://localhost:3000/workouts/${userId}`);
    const data = await response.json();
    workouts.value = data;
  } catch (error) {
    console.error("Error fetching workouts:", error);
  }
};

// const url = `http://localhost:3000/workouts/${userId}/${workoutId}`;
// const options = {
//   method: "DELETE",
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// };
// const deleteWorkout = () => {
//   try {
//     const response = fetch(url, options);
//     const data = response.json();
//     workouts.value = data;
//   } catch (error) {
//     console.error("Error deleting workout:", error);
//   }
// };

onMounted(() => {
  fetchWorkouts();
});
</script>

<template>
  <div v-if="workouts.length" class="p-4">
    <h2 class="text-xl font-bold mb-4">{{ username }}'s Workout History</h2>

    <!-- Loop through each workout -->
    <div
      v-for="workout in workouts"
      :key="workout.workout_id"
      class="mb-6 p-4 bg-gray-100 rounded-lg"
    >
      <!-- Display the workout date -->
      <div class="flex justify-between">
        <h3 class="text-lg font-semibold mb-2">
          Workout on {{ workout.workout_date }}
        </h3>
        <button @click="deleteWorkout()">
          <img
            src="./icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
            alt=""
          />
        </button>
      </div>

      <!-- Loop through each exercise -->
      <div v-for="exercise in workout.exercises" :key="exercise.exercise_name">
        <strong>{{ exercise.exercise_name }}</strong>
        <ul>
          <!-- Loop through each set for the exercise -->
          <li v-for="set in exercise.sets" :key="set.set_number">
            Set {{ set.set_number }}: {{ set.reps }} reps @ {{ set.weight }} lbs
            ({{ set.complete ? "Complete" : "Incomplete" }})
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div v-else class="p-4">
    <p>Loading workout history...</p>
  </div>
</template>
