<template lang="pug">
  v-app
    navigation
    v-main.grey.lighten-4
      v-alert( :value="alertVisible" :color="alertColor" transition="scale-transition" )
        div {{ alertMessage }}
      router-view( @v-alert="alert" )
</template>

<script>
import Navigation from "./views/Navigation";

export default {
  name: "app",

  components: {
    Navigation,
  },

  data() {
    return {
      alertVisible: false,
      alertColor: null,
      alertMessage: null,
    };
  },

  methods: {
    alert(type, message) {
      console.log("handle");
      this.alertVisible = true;
      this.alertMessage = message;
      this.alertColor = "green";
      setTimeout(() => {
        this.alertVisible = false;
      }, 1000);
    },
  },
};
</script>
