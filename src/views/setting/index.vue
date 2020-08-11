<template lang="pug">
  v-container( fluid )
    v-row.d-flex.align-center
      v-col.d-flex.justify-center( cols="1" )
        alert( ref="tokenAlert" icon="mdi-check")
      v-col( cols="11" )
        v-text-field( label="Setup Token" v-model="token" @change="setToken" placeholder="********" type="password" )

    v-row.d-flex.align-center
      v-col.d-flex.justify-center( cols="1" )
        alert( ref="hostAlert" icon="mdi-check")
      v-col( cols="11" )
        v-select( label="Setup Host" v-model="host" :items="repositoryHostList" @change="setHost" )
</template>

<script>
import { REPOSITORY_HOST } from "@/config/index";
import Alert from "@/components/alert";

export default {
  components: {
    Alert,
  },
  data() {
    return {
      token: "",
      host: this.$store.state.host,
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
      this.$refs.tokenAlert.alert();
    },
    setHost() {
      this.$store.commit("setHost", { host: this.host });
      this.$store.commit("reset");
      this.$refs.hostAlert.alert();
    },
  },
};
</script>

<style lang="scss">
.v-icon {
  margin-right: 0;
}
</style>
