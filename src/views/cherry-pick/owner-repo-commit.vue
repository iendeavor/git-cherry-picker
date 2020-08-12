<template lang="pug">
  v-row.d-flex.flex-column
    v-col.py-0
      v-text-field( :disabled="$chronos.owner.$sending" v-model="owner" label="Owner" @change="handleChangeOwner" )
    v-col.py-0
      v-select( :disabled="$chronos.repo.$sending" :loading="$chronos.repo.$receiving" v-model="repo" label="Repo" :items="repos" clearable @change="handleChangeRepo" )
    v-col.py-0
      v-select( :disabled="$chronos.branch.$sending" :loading="$chronos.branch.$receiving" v-model="branch" label="Branch" :items="branches" clearable @change="handleChangeBranch")
</template>

<script>
import { getRepos, getBranches, getCommits } from "@/service";

export default {
  props: {
    commits: {
      required: true,
      type: Array,
    },
  },

  model: {
    prop: "commits",
    event: "change",
  },

  data() {
    return {
      owner: "",
      repo: undefined,
      branch: undefined,
      repos: [],
      branches: [],
    };
  },

  chronos() {
    return [
      ["owner", "repo"],
      ["repo", "branch"],
    ];
  },

  methods: {
    handleChangeOwner() {
      if (this.owner === "") return;

      const owner = this.owner;

      const promise = getRepos({ owner });
      promise.then(response => {
        this.repos = response.map(item => ({
          text: item.name,
          value: this.$store.state.host === "github" ? item.name : item.id,
        }));
      });

      this.$chronos.$load("owner", promise);
    },

    handleChangeRepo() {
      this.branches = [];

      if (this.repo === undefined) return;

      const owner = this.owner;
      const repo = this.repo;

      const promise = getBranches({ owner, repo });
      promise.then(response => {
        this.branches = response.map(item => ({
          text: item.name,
          value: item.name,
        }));
      });

      this.$chronos.$load("repo", promise);
    },

    handleChangeBranch() {
      this.$emit("change", []);

      if (this.branch === undefined) return;

      const owner = this.owner;
      const repo = this.repo;
      const branch = this.branch;

      const promise = getCommits({ owner, repo, branch });
      promise.then(response => {
        this.$emit("change", response);
      });

      this.$chronos.$load("branch", promise);
    },
  },
};
</script>
