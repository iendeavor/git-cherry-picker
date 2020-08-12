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
import dayjs from "dayjs";

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

  watch: {
    owner: {
      immediate: true,
      handler() {
        if (this.owner === "") return;

        const promise = getRepos({ owner: this.owner });
        promise.then(response => {
          this.repos = response.map(item => ({
            text: item.name,
            value: this.$store.state.host === "github" ? item.name : item.id,
          }));
        });

        this.$chronos.$load("owner", promise);
      },
    },

    repo: {
      immediate: true,
      handler() {
        if (this.repo === undefined) return;

        const promise = getBranches({
          owner: this.owner,
          repo: this.repo,
        });
        promise.then(response => {
          this.branches = response.map(item => ({
            text: item.name,
            value: item.name,
          }));
        });

        this.$chronos.$load("repo", promise);
      },
    },

    branch: {
      immediate: true,
      handler() {
        if (this.branch === undefined) return;

        const promise = getCommits({
          repo: this.repo,
          branch: this.branch,
          since: dayjs().subtract(6, "month"),
          page: 1,
          perPage: 100,
        });
        promise.then(response => {
          this.$emit("change", response);
        });

        this.$chronos.$load("branch", promise);
      },
    },
  },

  methods: {
    handleChangeOwner() {
      this.repos = [];
      this.repo = undefined;
      this.handleChangeRepo();
    },

    handleChangeRepo() {
      this.branches = [];
      this.branch = undefined;
      this.handleChangeBranch();
    },

    handleChangeBranch() {
      this.$emit("change", []);
    },
  },
};
</script>
