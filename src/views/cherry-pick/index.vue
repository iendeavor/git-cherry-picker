<template lang="pug">
  v-container
    v-row
      v-col
        v-row.d-flex.flex-column
          v-col.d-flex.justify-center
            b Base

          v-col
            v-text-field( :disabled="$chronos.baseOwner.$sending" v-model="baseOwner" label="Owner" @change="handleChangeBaseOwner" )

          v-col
            v-select( :disabled="$chronos.baseRepo.$sending" :loading="$chronos.baseRepo.$receiving" v-model="baseRepo" label="Repo" :items="baseRepos" clearable @change="handleChangeBaseRepo" )

          v-col
            v-select( :disabled="$chronos.baseBranch.$sending" :loading="$chronos.baseBranch.$receiving" v-model="baseBranch" label="Branch" :items="baseBranches" clearable @change="handleChangeBaseBranch")

      v-col.d-flex.align-between( cols="12" md="2" )
        v-row.d-flex.d-md-none
          v-col.d-flex.justify-center.align-start.pb-0
            v-icon mdi-arrow-up
          v-col.d-flex.justify-center.pt-0
            v-btn( :disabled="$chronos.$pending" @click="swapBaseAndCompare" )
              v-icon mdi-swap-vertical
        v-row.flex-column.d-none.d-md-flex
          v-col.d-flex.justify-center.align-start.pb-0
            v-icon mdi-arrow-left
          v-col.d-flex.justify-center.pt-0
            v-btn( :disabled="$chronos.$pending" @click="swapBaseAndCompare" )
              v-icon mdi-swap-horizontal

      v-col
        v-row.d-flex.flex-column
          v-col.d-flex.justify-center
            b Compare

          v-col
            v-text-field( :disabled="$chronos.compareOwner.$sending" v-model="compareOwner" label="Owner" @change="handleChangeCompareOwner" )

          v-col
            v-select( :disabled="$chronos.compareRepo.$sending" :loading="$chronos.compareRepo.$receiving" v-model="compareRepo" label="Repo" :items="compareRepos" clearable @change="handleChangeCompareRepo" )

          v-col
            v-select( :disabled="$chronos.compareBranch.$sending" :loading="$chronos.compareBranch.$receiving" v-model="compareBranch" label="Branch" :items="compareBranches" clearable @change="handleChangeCompareBranch")

    v-timeline.mx-auto( v-if="compareCommits.length" dense )
      v-timeline-item( v-for="commit of compareCommits" :key="commit.sha" small fill-dot dark color="#1E1E1E" )
        v-card( shadowed  )
          v-card-title {{ commit.title }}
          v-card-text(v-for="(text, index) of commit.message.split('\\n')" :key="index") {{ text }}
          v-card-text
            div
              span {{ commit.authorName }}
              span &nbsp;-&nbsp;
              a(:href="'mailto:' + commit.authorEmail") {{ commit.authorEmail }}
            i {{ commit.sha }}
</template>

<script>
import { getRepos, getBranches, getCommits } from "@/service";

export default {
  name: "cherry-pick",

  data() {
    return {
      baseOwner: "",
      baseRepo: undefined,
      baseBranch: undefined,
      baseRepos: [],
      baseBranches: [],
      baseCommits: [],

      compareOwner: "",
      compareRepo: undefined,
      compareBranch: undefined,
      compareRepos: [],
      compareBranches: [],
      compareCommits: [],
    };
  },

  chronos() {
    return [
      ["baseOwner", "baseRepo"],
      ["baseRepo", "baseBranch"],
      ["baseBranch", "baseCommits"],
      ["compareOwner", "compareRepo"],
      ["compareRepo", "compareBranch"],
      ["compareBranch", "compareCommits"],
    ];
  },

  methods: {
    handleChangeBaseOwner() {
      if (this.baseOwner === "") return;

      const owner = this.baseOwner;
      const promise = getRepos({ owner });
      promise.then(response => {
        this.baseRepos = response.map(item => ({
          text: item.name,
          value: this.$store.state.host === "github" ? item.name : item.id,
        }));
      });

      this.$chronos.$load("baseOwner", promise);
    },

    handleChangeCompareOwner() {
      if (this.compareOwner === "") return;

      const owner = this.compareOwner;

      const promise = getRepos({ owner });
      promise.then(response => {
        this.compareRepos = response.map(item => ({
          text: item.name,
          value: this.$store.state.host === "github" ? item.name : item.id,
        }));
      });

      this.$chronos.$load("compareOwner", promise);
    },

    handleChangeBaseRepo() {
      if (this.baseRepo === undefined) return;

      const owner = this.baseOwner;
      const repo = this.baseRepo;

      const promise = getBranches({ owner, repo });
      promise.then(response => {
        this.baseBranches = response.map(item => ({
          text: item.name,
          value: item.name,
        }));
      });

      this.$chronos.$load("baseRepo", promise);
    },

    handleChangeCompareRepo() {
      if (this.compareRepo === undefined) return;

      const owner = this.compareOwner;
      const repo = this.compareRepo;

      const promise = getBranches({ owner, repo });
      promise.then(response => {
        this.compareBranches = response.map(item => ({
          text: item.name,
          value: item.name,
        }));
      });

      this.$chronos.$load("compareRepo", promise);
    },

    handleChangeBaseBranch() {
      if (this.baseRepo === undefined) return;

      const owner = this.baseOwner;
      const repo = this.baseRepo;
      const branch = this.baseBranch;

      const promise = getCommits({ owner, repo, branch });
      promise.then(response => {
        this.baseCommits = response;
      });

      this.$chronos.$load("baseBranch", promise);
    },

    handleChangeCompareBranch() {
      if (this.compareRepo === undefined) return;

      const owner = this.compareOwner;
      const repo = this.compareRepo;
      const branch = this.compareBranch;

      const promise = getCommits({ owner, repo, branch });
      promise.then(response => {
        this.compareCommits = response;
      });

      this.$chronos.$load("compareBranch", promise);
    },

    swapBaseAndCompare() {
      const owner = this.baseOwner;
      const repo = this.baseRepo;
      const branch = this.baseBranch;
      const repos = this.baseRepos;
      const branches = this.baseBranches;

      this.baseOwner = this.compareOwner;
      this.baseRepo = this.compareRepo;
      this.baseBranch = this.compareBranch;
      this.baseRepos = this.compareRepos;
      this.baseBranches = this.compareBranches;

      this.compareOwner = owner;
      this.compareRepo = repo;
      this.compareBranch = branch;
      this.compareRepos = repos;
      this.compareBranches = branches;
    },
  },
};
</script>
