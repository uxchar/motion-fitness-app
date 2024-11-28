<script setup>
import { ref, onMounted } from "vue";
import { PhCheckCircle, PhDotsThreeOutlineVertical } from "@phosphor-icons/vue";
import { useAuthStore } from "@/stores/authStore";
import { format } from "date-fns";
import EditWorkoutModal from "./EditWorkoutModal.vue";
import { useWorkoutStore } from "@/stores/workoutStore";

const workoutStore = useWorkoutStore();
const authStore = useAuthStore();
const username = "Chauncey";

const isModalOpen = ref(false);

const formatDate = (timestamp) => {
  return format(new Date(timestamp), "PPpp");
};

// Open the modal when a workout is selected for editing
const openModal = (workout) => {
  workoutStore.setCurrentWorkout(workout);
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

onMounted(() => {
  if (authStore.token != null) {
    workoutStore.getPreviousWorkouts();
  }
});
</script>

<template>
  <div v-if="authStore.token">
    <h2 class="text-5xl font-medium mb-10">Hello {{ username }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <h3>Average Workout Time</h3>
        <span class="text-2xl font-bold mt-1">1 hr 18 mins</span>
      </div>
      <div>
        <h3>Workouts Completed</h3>
        <span class="text-2xl font-bold mt-1">{{
          workoutStore.workouts.length
        }}</span>
      </div>
      <div>
        <h3>Most Frequent Exercise</h3>
        <span class="text-2xl font-bold mt-1 capitalize">{{
          workoutStore.favoriteExercise
        }}</span>
      </div>
    </div>

    <h2 class="mt-32 mb-4 text-lg font-medium">Your Workout History</h2>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full transition"
    >
      <div
        v-for="workout in workoutStore.workouts"
        :key="workout.workout_id"
        class="mb-6 p-4 bg-zinc-900 text-zinc-50 rounded-lg hover:bg-gray-300 hover:text-zinc-900 hover:shadow-slate-600 hover:shadow-md"
      >
        <div class="flex justify-between">
          <span class="text-sm mb-3">{{ formatDate(workout.start) }}</span>
          <div class="dropdown dropdown-end">
            <PhDotsThreeOutlineVertical
              :size="16"
              color="#949494"
              weight="fill"
              tabindex="0"
              role="button"
            />
            <ul
              tabindex="0"
              class="dropdown-content menu bg-zinc-900 text-zinc-50 rounded-box w-52 p-2 shadow"
            >
              <li @click="openModal(workout)"><a>Edit</a></li>
              <li @click="workoutStore.deleteWorkout(workout.workout_id)">
                <a>Delete</a>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="mb-4"
          v-for="exercise in workout.exercises"
          :key="exercise.exercise_name"
        >
          <div class="font-bold mb-1.5 capitalize">
            {{ exercise.exercise_name }}
          </div>

          <div
            class="flex gap-5 items-center"
            v-for="set in exercise.sets"
            :key="set.set_number"
          >
            <div class="w-12 text-sm">Set {{ set.set_number }}</div>
            <div class="w-16 text-sm">{{ set.reps }} reps</div>
            <div class="w-24 text-sm">{{ set.weight }} lbs</div>
            <div v-if="set.complete">
              <PhCheckCircle :size="16" color="#e13d3d" weight="fill" />
            </div>
            <div v-else class="w-6 h-6"></div>
          </div>
        </div>
      </div>
    </div>

    <EditWorkoutModal v-if="isModalOpen" @close="closeModal" />
  </div>

  <div v-else class="p-4">
    <p>Must login to see workouts</p>
  </div>
</template>
