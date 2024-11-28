import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";

export const useTemplateStore = defineStore("templateStore", {
  state: () => ({
    selectedTemplateExercises:
      JSON.parse(localStorage.getItem("selectedTemplateExercises")) || [],
    templateActive: localStorage.getItem("templateActive") || false,
    dateCreated: localStorage.getItem("dateCreated") || null,
    name: "",
    note: "",
    templates: [],
    currentTemplate: null,
  }),
  actions: {
    // Load template from local storage
    loadFromLocalStorage() {
      const storedExercises = JSON.parse(
        localStorage.getItem("selectedTemplateExercises")
      );
      if (storedExercises) {
        this.selectedTemplateExercises = storedExercises;
      }
    },

    // Save template to local storage
    saveToLocalStorage() {
      localStorage.setItem(
        "selectedTemplateExercises",
        JSON.stringify(this.selectedTemplateExercises)
      );
    },

    // Start create template
    startTemplate() {
      this.templateActive = true;
      this.dateCreated = new Date();
      localStorage.setItem("templateActive", true);
      localStorage.setItem("dateCreated", this.dateCreated);
    },

    // Finish template and send to backend
    saveTemplate() {
      const authStore = useAuthStore();
      const url = `${import.meta.env.VITE_API_URL}`;
      this.templateActive = false;
      const templateData = {
        exercises: this.selectedExercises,
        dateCreated: this.dateCreated,
      };

      fetch(`${url}/template/${authStore.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(templateData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Template data sent to server:", data);
          this.resetWorkout();
        })
        .catch((error) => {
          console.error("Error sending template data:", error);
        });
    },

    // Add exercise to workout
    addExercise(newExercise) {
      const exercise = this.selectedTemplateExercises.find(
        (exercise) => exercise.id === newExercise.id
      );
      if (exercise) {
        alert("Exercise already exists in the active template");
        return;
      } else {
        this.selectedTemplateExercises.push({
          ...newExercise,
          sets: [],
        });
        this.saveToLocalStorage();
      }
    },

    // Remove exercise from template
    removeExercise(exerciseId) {
      this.selectedTemplateExercises = this.selectedTemplateExercises.filter(
        (exercise) => exercise.id != exerciseId
      );
      this.saveToLocalStorage();
    },

    // Add set to exercise
    addSetToExercise(exerciseId, newSet) {
      const exercise = this.selectedTemplateExercises.find(
        (exercise) => exercise.id === exerciseId
      );
      if (exercise) {
        newSet.set_number = exercise.sets.length + 1;
        exercise.sets.push(newSet);
        this.saveToLocalStorage();
      }
    },

    setCurrentTemplate(template) {
      this.currentTemplate = template;
    },

    // Remove set from exercise
    removeSet(exerciseId, setNumber) {
      const exercise = this.selectedTemplateExercises.find(
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

    cancelTemplate() {
      this.selectedExercises = [];
      this.name = "";
      this.note = "";
      this.dateCreated = false;
      this.templateActive = false;

      localStorage.removeItem("selectedExercises");
      localStorage.removeItem("dateCreated");
      localStorage.removeItem("templateActive");
    },

    // Update a template on the server
    async updateTemplate(updatedTemplate) {
      const authStore = useAuthStore();
      const url = `${import.meta.env.VITE_API_URL}`;

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(updatedTemplate),
      };

      try {
        const response = await fetch(
          `${url}/templates/${authStore.userId}/${updatedTemplate.template_id}`,
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

    // Delete a template from the server
    deleteTemplate(templateId) {
      const url = `${import.meta.env.VITE_API_URL}`;

      const options = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      const removeTemplate = async () => {
        const authStore = useAuthStore();

        await fetch(
          `${url}/templates/${authStore.userId}/${templateId}`,
          options
        );

        this.templates = this.templates.filter(
          (template) => template.template_id !== templateId
        );
      };

      if (templateId) {
        removeTemplate();
      }
    },
  },
});
