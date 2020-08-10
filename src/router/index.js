import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/cherry-pick",
    name: "Cherry Pick",
    // route level code-splitting
    // this generates a separate chunk (cherry-pick.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "cherry-pick" */ "@/views/cherry-pick/index.vue"
      )
  },
  {
    path: "/setting",
    name: "Setting",
    // route level code-splitting
    // this generates a separate chunk (setting.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "setting" */ "@/views/setting/index.vue")
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
