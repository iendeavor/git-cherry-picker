import Vue from "vue";
import Vuex from "vuex";

import repo from "./repo";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    host: null,
    token: null,
  },
  mutations: {
    restore(state) {
      state.host = window.localStorage.getItem("host");
      state.token = window.localStorage.getItem(`${state.host}-token`);
    },
    setHost(state, { host }) {
      state.host = host;
      window.localStorage.setItem("host", host);
    },
    setToken: (state, { token }) => {
      state.token = token;
      window.localStorage.setItem(`${state.host}-token`, token);
    },
  },
  actions: {},
  modules: {
    repo,
  },
});
