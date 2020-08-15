<template lang="pug">
  lazy-text-field( :value="value" label="Owner" @change="handleChange" )
</template>

<script>
import LazyTextField from "@/components/LazyTextField.vue";

export default {
  props: {
    value: {
      required: true,
    },
  },

  components: {
    LazyTextField,
  },

  watch: {
    "$store.state.token"() {
      this.handleChange();
    },

    value: {
      immediate: true,
      handler() {
        if (this.value === null) return;
        if (typeof this.value !== "string") return;
        if (this.value !== "") return;
        this.handleChange();
      },
    },
  },

  methods: {
    handleChange(newValue = null) {
      this.$emit("input", newValue);
      this.$emit("change", newValue);
    },
  },
};
</script>
