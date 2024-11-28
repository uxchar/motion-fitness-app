import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/templates",
      name: "templates",

      component: () => import("../views/TemplatesView.vue"),
    },
    {
      path: "/workout",
      name: "workout",

      component: () => import("../views/WorkoutView.vue"),
    },
    {
      path: "/exercises",
      name: "exercises",

      component: () => import("../views/ExerciseListView.vue"),
    },
    {
      path: "/create-exercise",
      name: "create-exercise",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/CreateExerciseView.vue"),
    },
  ],
});

export default router;
