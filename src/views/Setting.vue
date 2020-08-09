<template lang="pug">
  v-container( fluid )
    v-row.d-flex.align-center
      v-col( cols="11" )
        v-text-field( label="Setup Token" v-model="token" @change="setToken" )
      v-col.d-flex.justify-center( cols="1" )
        v-alert( :value="tokenAlertVisible" transition="scale-transition" icon="mdi-check")
</template>

<script>
export default {
  data() {
    return {
      token: "",
      tokenAlertVisible: false
    };
  },
  methods: {
    setToken() {
      this.$store.commit("setToken", { token: this.token });
      this.$store.commit("reset");
      this.token = "";
      this.tokenAlertVisible = true;
      setTimeout(() => (this.tokenAlertVisible = false), 1000);
    }
  }
};
</script>

<style lang="scss">
.v-icon {
  margin-right: 0;
}
</style>
