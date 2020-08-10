<template lang="pug">
  v-alert( :value="visible" transition="scale-transition" :icon="icon")
    template
      slot
</template>

<script>
export default {
  props: {
    icon: {
      default: null,
      type: String
    },
    timeout: {
      default: 1000,
      type: Number
    }
  },

  data() {
    return {
      visible: false
    };
  },

  methods: {
    alert() {
      this.visible = true;

      setTimeout(() => {
        this.visible = false;
      }, this.timeout);
    }
  }
};
</script>
