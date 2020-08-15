<template lang="pug">
  v-select( :disabled="owner === null" :value="value" label="Repo" :items="repos" clearable @change="handleChange" @click:clear="handleChange" :loading="loading" )
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
      loading: false,
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

        this.loading = true;

        const owner = this.owner;
        await getRepos({ owner })
          .then(response => {
            if (this.owner === owner)
              this.repos = response.map(item => ({
                text: item.name,
                value:
                  this.$store.state.host === "github" ? item.name : item.id,
              }));
          })
          .catch(error => {
            console.error(error);
          });

        this.loading = false;
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
