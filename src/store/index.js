import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";
import repo from "./repo";
import { REPOSITORY_HOST } from "../config";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    host: REPOSITORY_HOST.github
  },
  mutations: {},
  actions: {},
  modules: {
    auth,
    repo
  }
});
