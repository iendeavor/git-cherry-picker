<template lang="pug">
  v-select( v-bind="$attrs" v-on="$listeners" :disabled="$attrs.disabled || owner === null" :value="value" label="Repo" :items="repos" clearable @change="handleChange" @click:clear="handleChange" :loading="loading !== 0" )
</template>

<script>
import { getRepos } from "@/service";

export default {
  props: {
    value: {
      required: true,
    },

    owner: {
      required: true,
    },
  },

  data() {
    return {
      repos: [],
      loading: 0,
    };
  },

  watch: {
    owner: {
      immediate: true,
      async handler() {
        if (this.owner === null) {
          this.handleChange();
          this.repos = [];
          return;
        }

        ++this.loading;

        const owner = this.owner;
        await getRepos({ owner })
          .then(response => {
            if (this.owner === owner)
              this.repos = response.map(item => ({
                text:
                  item.name +
                  (item.isUser ? " (user)" : item.isOrg ? " (org)" : ""),
                value:
                  this.$store.state.host === "github" ? item.name : item.id,
              }));
          })
          .catch(error => {
            console.error(error);
          });

        --this.loading;
      },
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
