<template lang="pug">
  v-select( :disabled="owner === null || repo === null" :value="value" label="Branch" :items="branches" clearable @change="handleChange" @click:clear="handleChange" :loading="loading !== 0")
</template>

<script>
import { getBranches } from "@/service";

export default {
  props: {
    value: {
      required: true,
    },

    owner: {
      required: true,
    },

    repo: {
      required: true,
    },
  },

  data() {
    return {
      branches: [],
      loading: 0,
    };
  },

  computed: {
    filedsAboutBranch() {
      return [this.owner, this.repo];
    },
  },

  watch: {
    filedsAboutBranch: {
      immediate: true,
      deep: true,
      async handler() {
        if (this.owner === null || this.repo === null) {
          this.handleChange();
          this.branches = [];
          return;
        }

        ++this.loading;

        const owner = this.owner;
        const repo = this.repo;
        await getBranches({ owner, repo })
          .then(response => {
            if (this.owner !== owner) return;
            if (this.repo !== repo) return;
            this.branches = response.map(item => ({
              text: item.name,
              value: item.name,
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
