<template lang="pug">
  v-container( fluid )
    v-row
      v-col
        v-row.d-flex.flex-column
          v-col.d-flex.justify-center
            b Source

          v-col
            v-text-field( :disabled="$chronos.sourceOwner.$sending" v-model="sourceOwner" label="Owner" @change="handleChangeSourceOwner" )

          v-col
            v-select( :disabled="$chronos.sourceRepo.$sending" :loading="$chronos.sourceRepo.$receiving" v-model="sourceRepo" label="Repo" :items="sourceRepos" clearable @change="handleChangeSourceRepo" )

          v-col
            v-select( :disabled="$chronos.sourceBranch.$sending" :loading="$chronos.sourceBranch.$receiving" v-model="sourceBranch" label="Branch" :items="sourceBranches" clearable )

      v-col.d-flex.align-center( cols="2" )
        v-row
          v-col.d-flex.justify-center( cols="12" )
            v-btn( :disabled="$chronos.$pending" @click="swapSourceAndTarget" )
              v-icon mdi-swap-horizontal

      v-col
        v-row.d-flex.flex-column
          v-col.d-flex.justify-center
            b Target

          v-col
            v-text-field( :disabled="$chronos.targetOwner.$sending" v-model="targetOwner" label="Owner" @change="handleChangeTargetOwner" )

          v-col
            v-select( :disabled="$chronos.targetRepo.$sending" :loading="$chronos.targetRepo.$receiving" v-model="targetRepo" label="Repo" :items="targetRepos" clearable @change="handleChangeTargetRepo" )

          v-col
            v-select( :disabled="$chronos.targetBranch.$sending" :loading="$chronos.targetBranch.$receiving" v-model="targetBranch" label="Branch" :items="targetBranches" clearable )
</template>

<script>
import { getRepos, getBranches } from "@/service";

export default {
  name: "cherry-pick",

  data() {
    return {
      sourceOwner: "",
      sourceRepo: undefined,
      sourceBranch: undefined,
      sourceRepos: [],
      sourceBranches: [],

      targetOwner: "",
      targetRepo: undefined,
      targetBranch: undefined,
      targetRepos: [],
      targetBranches: []
    };
  },

  chronos() {
    return [
      ["sourceOwner", "sourceRepo"],
      ["sourceRepo", "sourceBranch"],
      ["targetOwner", "targetRepo"],
      ["targetRepo", "targetBranch"]
    ];
  },

  methods: {
    handleChangeSourceOwner() {
      if (this.sourceOwner === "") return;

      const owner = this.sourceOwner;
      const promise = getRepos({ owner });
      promise.then(response => {
        this.sourceRepos = response.map(item => ({
          text: item.name,
          value: this.$store.state.host === "github" ? item.name : item.id
        }));
      });

      this.$chronos.$load("sourceOwner", promise);
    },

    handleChangeTargetOwner() {
      if (this.targetOwner === "") return;

      const owner = this.targetOwner;

      const promise = getRepos({ owner });
      promise.then(response => {
        this.targetRepos = response.map(item => ({
          text: item.name,
          value: this.$store.state.host === "github" ? item.name : item.id
        }));
      });

      this.$chronos.$load("targetOwner", promise);
    },

    handleChangeSourceRepo() {
      if (this.sourceRepo === undefined) return;

      const owner = this.sourceOwner;
      const repo = this.sourceRepo;

      const promise = getBranches({ owner, repo });
      promise.then(response => {
        this.sourceBranches = response.map(item => ({
          text: item.name,
          value: item.name
        }));
      });

      this.$chronos.$load("sourceRepo", promise);
    },

    handleChangeTargetRepo() {
      if (this.targetRepo === undefined) return;

      const owner = this.targetOwner;
      const repo = this.targetRepo;

      const promise = getBranches({ owner, repo });
      promise.then(response => {
        this.targetBranches = response.map(item => ({
          text: item.name,
          value: item.name
        }));
      });

      this.$chronos.$load("targetRepo", promise);
    },

    swapSourceAndTarget() {
      const owner = this.sourceOwner;
      const repo = this.sourceRepo;
      const branch = this.sourceBranch;
      const repos = this.sourceRepos;
      const branches = this.sourceBranches;

      this.sourceOwner = this.targetOwner;
      this.sourceRepo = this.targetRepo;
      this.sourceBranch = this.targetBranch;
      this.sourceRepos = this.targetRepos;
      this.sourceBranches = this.targetBranches;

      this.targetOwner = owner;
      this.targetRepo = repo;
      this.targetBranch = branch;
      this.targetRepos = repos;
      this.targetBranches = branches;
    }
  }
};
</script>
