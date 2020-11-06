<template lang="pug">
  v-select( v-bind="$attrs" v-on="$listeners" :disabled="owner === null || repo === null" :value="value" label="Branch and tag" :items="branchAndTags" clearable @change="handleChange" @click:clear="handleChange" :loading="loading !== 0")
</template>

<script>
import { getBranches, getTags } from "@/service";

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
      tags: [],
      loading: 0,
    };
  },

  computed: {
    filedsAboutBranch() {
      return [this.owner, this.repo];
    },

    branchAndTags() {
      return [...this.branches, ...this.tags].sort((a, b) =>
        a.text.localeCompare(b.text),
      );
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
          this.tags = [];
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
        await getTags({ owner, repo, page: 1, perPage: 100 })
          .then(response => {
            if (this.owner !== owner) return;
            if (this.repo !== repo) return;
            this.tags = response.map(item => ({
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
