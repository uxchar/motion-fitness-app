import { defineStore } from "pinia";
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
    // Fetch previous workouts for the dashboard
    getPreviousWorkouts() {
      const authStore = useAuthStore();
      const url = `${import.meta.env.VITE_API_URL}`;

      const params = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      };

      const fetchWorkouts = async () => {
        try {
          const response = await fetch(
            `${url}/workouts/${authStore.userId}`,
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

    // Load workout from local storage
    loadFromLocalStorage() {
      const storedExercises = JSON.parse(
        localStorage.getItem("selectedExercises")
      );
      if (storedExercises) {
        this.selectedExercises = storedExercises;
      }
    },

    // Save workout to local storage
    saveToLocalStorage() {
      localStorage.setItem(
        "selectedExercises",
        JSON.stringify(this.selectedExercises)
      );
    },

    // Start workout
    startWorkout() {
      this.workoutActive = true;
      this.startTime = new Date();
      localStorage.setItem("workoutActive", true);
      localStorage.setItem("startTime", this.startTime);
    },

    // Finish workout and send to backend
    finishWorkout() {
      const authStore = useAuthStore();
      const url = `${import.meta.env.VITE_API_URL}`;
      this.workoutActive = false;
      this.finishTime = new Date();

      const workoutData = {
        exercises: this.selectedExercises,
        startTime: this.startTime,
        finishTime: this.finishTime,
      };

      fetch(`${url}/workout/${authStore.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authStore.token}`,
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

    // Add exercise to workout
    addExercise(newExercise) {
      const exercise = this.selectedExercises.find(
        (exercise) => exercise.id === newExercise.id
      );
      if (exercise) {
        alert("Exercise already exists in the active workout");
        return;
      } else {
        this.selectedExercises.push({
          ...newExercise,
          sets: [],
        });
        this.saveToLocalStorage();
      }
    },

    // Remove exercise from workout
    removeExercise(exerciseId) {
      this.selectedExercises = this.selectedExercises.filter(
        (exercise) => exercise.id != exerciseId
      );
      this.saveToLocalStorage();
    },

    // Add set to exercise
    addSetToExercise(exerciseId, newSet) {
      const exercise = this.selectedExercises.find(
        (exercise) => exercise.id === exerciseId
      );
      if (exercise) {
        newSet.set_number = exercise.sets.length + 1;
        exercise.sets.push(newSet);
        this.saveToLocalStorage();
      }
    },

    // Remove set from exercise
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
        this.saveToLocalStorage();
      }
    },

    // Cancel workout
    cancelWorkout() {
      this.selectedExercises = [];
      this.startTime = null;
      this.finishTime = null;
      this.workoutActive = false;

      localStorage.removeItem("selectedExercises");
      localStorage.removeItem("startTime");
      localStorage.removeItem("finishTime");
      localStorage.removeItem("workoutActive");
    },

    // Set the current workout (for editing)
    setCurrentWorkout(workout) {
      this.currentWorkout = workout;
    },

    // Update a workout on the server
    async updateWorkout(updatedWorkout) {
      const authStore = useAuthStore();
      const url = `${import.meta.env.VITE_API_URL}`;

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
        const response = await fetch(
          `${url}/workouts/${authStore.userId}/${updatedWorkout.workout_id}`,
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

    // Delete a workout from the server
    deleteWorkout(workoutId) {
      const url = `${import.meta.env.VITE_API_URL}`;

      const options = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      const removeWorkout = async () => {
        const authStore = useAuthStore();

        await fetch(
          `${url}/workouts/${authStore.userId}/${workoutId}`,
          options
        );

        this.workouts = this.workouts.filter(
          (workout) => workout.workout_id !== workoutId
        );
      };

      if (workoutId) {
        removeWorkout();
      }
    },
  },
});
