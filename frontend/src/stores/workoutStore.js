import { defineStore } from "pinia";

export const useWorkoutStore = defineStore("workoutStore", {
  state: () => ({
    selectedExercises: [],
    startTime: null,
    finishTime: null,
    workoutActive: false,
  }),
  actions: {
    startWorkout() {
      this.workoutActive = true;
      this.startTime = new Date();
    },
    finishWorkout() {
      this.workoutActive = false;
      this.selectedExercises = [];
      this.finishTime = new Date();
    },
    resetWorkout() {
      this.selectedExercises = [];
      this.startTime = null;
      this.finishTime = null;
      this.workoutActive = false;
    },
    addExercise(exercise) {
      this.selectedExercises.push({
        ...exercise,
        sets: [],
      });
    },
    addSetToExercise(exerciseId, newSet) {
      const exercise = this.selectedExercises.find(
        (exercise) => exercise.id === exerciseId
      );
      if (exercise) {
        newSet.set_number = exercise.sets.length + 1;
        exercise.sets.push(newSet);
      }
    },
    removeExercise(exerciseId) {
      this.selectedExercises = this.selectedExercises.filter(
        (exercise) => exercise.id != exerciseId
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
      }
      exercise.sets.forEach((set, index) => {
        set.set_number = index + 1;
      });
    },
  },
});
