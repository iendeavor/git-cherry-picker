<template lang="pug">
  v-app
    navigation
    v-main.grey.lighten-4
      router-view
</template>

<script>
import Navigation from "./views/Navigation";

export default {
  name: "app",

  components: {
    Navigation,
  },
};
</script>
