import Vue from "vue";
import Vuex from "vuex";

import repo from "./repo";
import { REPOSITORY_HOST } from "@/config";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    host: window.localStorage.getItem("host") || REPOSITORY_HOST.github,
    token: window.localStorage.getItem("token") || "",
  },
  mutations: {
    setHost(state, { host }) {
      state.host = host;
      window.localStorage.setItem("host", host);
    },
    setToken: (state, { token }) => {
      state.token = token;
      window.localStorage.setItem("token", token);
    },
  },
  actions: {},
  modules: {
    repo,
  },
});
