import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    logout() {
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
