import { defineStore, storeToRefs } from "pinia";
import { useAuthStore } from "./authStore";

export const useWorkoutStore = defineStore("workoutStore", {
  state: () => ({
    selectedExercises:
      JSON.parse(localStorage.getItem("selectedExercises")) || [],
    startTime: localStorage.getItem("startTime") || null,
    finishTime: localStorage.getItem("finishTime") || null,
    workoutActive: localStorage.getItem("workoutActive") || false,
    workouts: [],
    favoriteExercise: null,
    currentWorkout: null,
  }),
  actions: {
    getPreviousWorkouts() {
      const authStore = useAuthStore();

      const params = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer {authStore.token}`,
        },
      };
      const fetchWorkouts = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/workouts/${authStore.userId}`,
            params
          );
          const data = await response.json();
          this.workouts = data.workouts;
          this.favoriteExercise = data.favoriteExercise.exercise_name;
        } catch (error) {
          console.error("Error fetching workouts:", error);
        }
      };
      fetchWorkouts();
    },
    startWorkout() {
      this.workoutActive = true;
      this.startTime = new Date();
      localStorage.setItem("workoutActive", true);
      localStorage.setItem("startTime", this.startTime);
    },
    finishWorkout() {
      const authStore = useAuthStore();
      this.workoutActive = false;
      this.finishTime = new Date();

      const workoutData = {
        exercises: this.selectedExercises,
        startTime: this.startTime,
        finishTime: this.finishTime,
      };

      fetch(`http://localhost:3000/workout/${authStore.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer {authStore.token}`,
        },
        body: JSON.stringify(workoutData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Workout data sent to server:", data);
          this.resetWorkout();
        })
        .catch((error) => {
          console.error("Error sending workout data:", error);
        });
    },

    deleteWorkout() {
      const options = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      const removeWorkout = async (workoutId) => {
        const authStore = useAuthStore();

        try {
          const response = await fetch(
            `http://localhost:3000/workouts/${authStore.userId}/${workoutId}`,
            options
          );
          response.status = "Delete successful";
        } catch (error) {
          console.error("Error deleting workout:", error);
        }
      };
      removeWorkout();
    },
    resetWorkout() {
      this.selectedExercises = [];
      this.startTime = null;
      this.finishTime = null;
      this.workoutActive = false;

      localStorage.removeItem("selectedExercises");
      localStorage.removeItem("startTime");
      localStorage.removeItem("finishTime");
      localStorage.removeItem("workoutActive");
    },
    setCurrentWorkout(workout) {
      this.currentWorkout = workout;
    },

    addExercise(newExercise) {
      const exercise = this.selectedExercises.find(
        (exercise) => exercise.id === newExercise.id
      );
      if (exercise) {
        alert("Exercise already exist in active workout");
        return;
      } else {
        this.selectedExercises.push({
          ...newExercise,
          sets: [],
        });
        localStorage.setItem(
          "selectedExercises",
          JSON.stringify(this.currentWorkout)
        );
      }
    },
    addSetToExercise(exerciseId, newSet) {
      const exercise = this.selectedExercises.find(
        (exercise) => exercise.id === exerciseId
      );
      if (exercise) {
        newSet.set_number = exercise.sets.length + 1;
        exercise.sets.push(newSet);
        localStorage.setItem(
          "selectedExercises",
          JSON.stringify(this.selectedExercises)
        );
      }
    },
    removeExercise(exerciseId) {
      this.selectedExercises = this.selectedExercises.filter(
        (exercise) => exercise.id != exerciseId
      );
      localStorage.setItem(
        "selectedExercises",
        JSON.stringify(this.selectedExercises)
      );
    },
    removeSet(exerciseId, setNumber) {
      const exercise = this.selectedExercises.find(
        (exercise) => exercise.id === exerciseId
      );
      if (exercise) {
        exercise.sets = exercise.sets.filter(
          (set) => set.set_number != setNumber
        );
        exercise.sets.forEach((set, index) => {
          set.set_number = index + 1;
        });
        localStorage.setItem(
          "selectedExercises",
          JSON.stringify(this.selectedExercises)
        );
      }
    },
    async updateWorkout(updatedWorkout) {
      const authStore = useAuthStore();

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(updatedWorkout),
      };

      try {
        console.log(authStore.userId, updatedWorkout.workout_id);
        const response = await fetch(
          `http://localhost:3000/workouts/${authStore.userId}/${updatedWorkout.workout_id}`,
          options
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Workout updated successfully", data);
      } catch (error) {
        console.error("Error updating workout:", error);
      }
    },
  },
});
