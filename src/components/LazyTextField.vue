<template lang="pug">
  v-text-field( v-bind="$attrs" v-on="innerListeners" v-model="innerValue" @blur="handleBlur" )
</template>

<script>
export default {
  name: "lazy-input",

  props: {
    value: String,
  },

  data() {
    return {
      innerValue: "",
    };
  },

  computed: {
    innerListeners() {
      return Object.keys(this.$listeners)
        .filter(key => key !== "input")
        .filter(key => key !== "change")
        .reduce((listeners, key) => {
          listeners[key] = this.$listeners[key];
          return listeners;
        }, {});
    },
  },

  watch: {
    value: {
      immediate: true,
      handler() {
        if (this.innerValue === this.value) return;
        this.innerValue = this.value;
      },
    },
  },

  methods: {
    handleBlur() {
      if (this.innerValue === this.value) return;

      this.$emit("input", this.innerValue);
      this.$emit("change", this.innerValue);
    },
  },
};
</script>
