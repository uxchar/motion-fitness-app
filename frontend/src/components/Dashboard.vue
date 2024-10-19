<script setup>
import { ref, onMounted } from "vue";
import { PhCheckCircle, PhDotsThreeOutlineVertical } from "@phosphor-icons/vue";
import { useAuthStore } from "@/stores/authStore";
import { format } from "date-fns";

const authStore = useAuthStore();
const workouts = ref([]);
const userId = 1;
const username = "User";

const params = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer {token}",
  },
};

const options = {
  method: "DELETE",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const fetchWorkouts = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/workouts/${userId}`,
      params
    );
    const data = await response.json();
    workouts.value = data;
    console.log(data);
  } catch (error) {
    console.error("Error fetching workouts:", error);
  }
};

const deleteWorkout = async (workoutId) => {
  try {
    console.log(workoutId);

    const response = await fetch(
      `http://localhost:3000/workouts/${userId}/${workoutId}`,
      options
    );
    response.status = "Delete successful";
  } catch (error) {
    console.error("Error deleting workout:", error);
  }
};

const formatDate = (timestamp) => {
  return format(new Date(timestamp), "PPpp");
};

onMounted(() => {
  if (authStore.token != null) {
    fetchWorkouts();
  } else {
    console.log("not logined");
  }
});
</script>

<template>
  <div v-if="authStore.token">
    <h2 class="text-4xl font-medium mt-2.5 mb-10">Hello {{ username }}</h2>
    <div class="flex flex-col gap-6 justify-between">
      <div>
        <h3>Average Workout Time</h3>
        <span class="text-2xl font-bold mt-1">1 hr 18 mins</span>
      </div>
      <div>
        <h3>Workouts Completed</h3>
        <span class="text-2xl font-bold mt-1">{{ workouts.length }}</span>
      </div>
    </div>
    <h2 class="mt-32 mb-4">Your Workout History</h2>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
      v-if="workouts.length"
    >
      <!-- Loop through each workout -->
      <div
        v-for="workout in workouts"
        :key="workout.workout_id"
        class="mb-6 p-4 bg-zinc-950 text-zinc-50 rounded-lg"
      >
        <!-- Display the workout date -->
        <div class="flex justify-between">
          <span class="text-sm mb-3">
            {{ formatDate(workout.start) }}
          </span>
          <div class="dropdown dropdown-end">
            <PhDotsThreeOutlineVertical
              :size="16"
              color="#fafafa"
              weight="fill"
              tabindex="0"
              role="button"
            />
            <ul
              tabindex="0"
              class="dropdown-content menu bg-gray-400 text-black rounded-box z-[1] w-52 p-2 shadow"
            >
              <li><a>Edit</a></li>
              <li @click="deleteWorkout(workout.workout_id)">
                <a>Delete</a>
              </li>
            </ul>
          </div>

          <!-- <button @click="deleteWorkout()">
          <img
            src="./icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
            alt=""
          />
        </button> -->
        </div>

        <!-- Loop through each exercise -->
        <div
          class="mb-4"
          v-for="exercise in workout.exercises"
          :key="exercise.exercise_name"
        >
          <div class="font-bold mb-1.5 capitalize">
            {{ exercise.exercise_name }}
          </div>

          <!-- Loop through each set for the exercise -->
          <div
            class="flex gap-5 items-center"
            v-for="set in exercise.sets"
            :key="set.set_number"
          >
            <div class="w-12 text-sm">Set {{ set.set_number }}</div>
            <div class="w-16 text-sm">{{ set.reps }} reps</div>
            <div class="w-24 text-sm">{{ set.weight }} lbs</div>
            <div v-if="set.complete">
              <PhCheckCircle :size="16" color="#fafafa" weight="fill" />
            </div>
            <div v-else class="w-6 h-6"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="p-4">
    <p>Must login to see workouts</p>
  </div>
</template>
