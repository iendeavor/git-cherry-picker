<template lang="pug">
  v-container( fluid )
    v-row.d-flex.align-center
      v-col
        v-text-field( label="Setup Token" v-model="token" @change="setToken" :success-messages="successMessages.token" placeholder="********" type="password" )

      v-col
        v-select( label="Setup Host" v-model="host" :items="repositoryHostList" :success-messages="successMessages.host" @change="setHost" )
</template>

<script>
import { REPOSITORY_HOST } from "@/config/index";

export default {
  data() {
    return {
      token: "",
      host: this.$store.state.host,
      successMessages: {
        token: [],
        host: [],
      },
    };
  },
  computed: {
    repositoryHostList() {
      return Object.keys(REPOSITORY_HOST).map(key => ({
        text: key,
        value: REPOSITORY_HOST[key],
      }));
    },
  },
  methods: {
    setToken() {
      this.$store.commit("setToken", { token: this.token });
      this.$store.commit("reset");
      this.token = "";
      this.successMessages.token = ["Saved"];
      setTimeout(() => {
        this.successMessages.token = [];
      }, 1000);
    },
    setHost() {
      this.$store.commit("setHost", { host: this.host });
      this.$store.commit("reset");
      this.successMessages.host = ["Saved"];
      setTimeout(() => {
        this.successMessages.host = [];
      }, 1000);
    },
  },
};
</script>

<style lang="scss">
.v-icon {
  margin-right: 0;
}
</style>
