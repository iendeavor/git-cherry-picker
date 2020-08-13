<template lang="pug">
  v-container( fluid )
    v-row.d-flex.align-center
      v-col
        v-select( label="Set Repository Host" v-model="host" :items="repositoryHostList" :success-messages="successMessages.host" @change="setHost" )

      v-col
        v-text-field( :disabled="host === null" :label="`Set ${upperFirst($store.state.host) || ''} Token`" v-model="token" @change="setToken" :success-messages="successMessages.token" :placeholder="$store.state.token ? '****' : ''" type="password" )
</template>

<script>
import { REPOSITORY_HOST_LIST } from "@/config/index";

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
      return REPOSITORY_HOST_LIST.map(host => ({
        text: host,
        value: host,
      }));
    },
  },
  methods: {
    setToken() {
      this.$store.commit("setToken", { token: this.token });
      this.$store.commit("restore");
      this.token = "";
      this.successMessages.token = ["Saved"];
      setTimeout(() => {
        this.successMessages.token = [];
      }, 1000);
    },

    setHost() {
      this.$store.commit("setHost", { host: this.host });
      this.$store.commit("restore");
      this.successMessages.host = ["Saved"];
      setTimeout(() => {
        this.successMessages.host = [];
      }, 1000);
    },

    upperFirst(str) {
      if (typeof str !== "string") return str;
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
};
</script>

<style lang="scss">
.v-icon {
  margin-right: 0;
}
</style>
