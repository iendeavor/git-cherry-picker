import Vue from "vue";

import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import App from "./App.vue";
import VueChronos from "vue-chronos";

import "./assets/index.scss";

Vue.config.productionTip = false;

Vue.use(VueChronos);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount("#app");
