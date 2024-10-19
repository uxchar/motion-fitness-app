import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    logout() {
      this.token = null;
      localStorage.removeItem("token");
      router.push("/login");
    },
    loadToken() {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        this.token = savedToken;
      }
    },
  },
});
