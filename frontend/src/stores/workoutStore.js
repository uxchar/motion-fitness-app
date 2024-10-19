import { defineStore } from "pinia";

export const useWorkoutStore = defineStore("workoutStore", {
  state: () => ({
    selectedExercises:
      JSON.parse(localStorage.getItem("selectedExercises")) || [],
    startTime: localStorage.getItem("startTime") || null,
    finishTime: localStorage.getItem("finishTime") || null,
    workoutActive: localStorage.getItem("workoutActive") || false,
  }),
  actions: {
    startWorkout() {
      this.workoutActive = true;
      this.startTime = new Date();

      localStorage.setItem("workoutActive", true);
      localStorage.setItem("startTime", this.startTime);
    },
    finishWorkout() {
      this.workoutActive = false;
      this.finishTime = new Date();

      const workoutData = {
        exercises: this.selectedExercises,
        startTime: this.startTime,
        finishTime: this.finishTime,
      };

      const userId = 1;

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
          console.log("Workout data sent to server:", data);
          this.resetWorkout();
        })
        .catch((error) => {
          console.error("Error sending workout data:", error);
        });
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
    addExercise(exercise) {
      this.selectedExercises.push({
        ...exercise,
        sets: [],
      });
      localStorage.setItem(
        "selectedExercises",
        JSON.stringify(this.selectedExercises)
      );
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
  },
});
