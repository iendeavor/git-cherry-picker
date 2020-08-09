import { IS_PRODUCTION } from "../config";

export default {
  state: {
    token: IS_PRODUCTION ? null : process.env.TEST_TOKEN
  },
  mutations: {
    setToken: (state, { token }) => {
      state.token = token;
    }
  },
  actions: {}
};
