<template lang="pug">
  v-container
    v-row.mx-auto
      v-col.py-0( cols="12" sm )
        v-row.d-flex.flex-column
          v-col.d-flex.justify-center.py-0
            b Base

          owner-repo-commit(v-model="baseCommits" @loading="() => ++loading" @unloading="() => --loading")

      v-col( sm="1" )

      v-col.py-0( cols="12" sm )
        v-row.d-flex.flex-column
          v-col.d-flex.justify-center.py-0
            b Compare

          owner-repo-commit(v-model="compareCommits" @loading="() => ++loading" @unloading="() => --loading")

    v-row
      v-col.py-0
        v-progress-linear( v-if="loading !== 0" indeterminate color="primary" )
        v-card.mt-2.pa-3( v-for="commit of diffCommits" :key="commit.sha" )
          h4.mb-2 {{ commit.title }}
          div.pl-4( v-if="commit.message" v-for="(text, index) of commit.message.split('\\n')" :key="index") {{ text }}
          div
            span {{ commit.authorName }}
            span &nbsp;-&nbsp;
            a(:href="'mailto:' + commit.authorEmail") {{ commit.authorEmail }}
          i.d-flex.d-sm-none {{ commit.sha.slice(0, 8) }}
          i.d-none.d-sm-flex {{ commit.sha }}
</template>

<script>
import OwnerRepoCommit from "./owner-repo-commit";

export default {
  name: "cherry-pick",

  components: {
    OwnerRepoCommit,
  },

  data() {
    return {
      baseCommits: [],
      compareCommits: [],
      loading: 0,
    };
  },

  computed: {
    diffCommits() {
      return this.compareCommits.filter(
        compareCommit => this.sameShaSet.has(compareCommit.sha) === false,
      );
    },

    sameShaSet() {
      return new Set(
        [].concat(this.exactSameCommitShas, this.cherryPickedCommitShas),
      );
    },

    exactSameCommitShas() {
      return this.getExactSameCommits(
        this.baseCommits,
        this.compareCommits,
      ).map(commit => commit.sha);
    },

    cherryPickedCommitShas() {
      return this.getCherryPickedCommits(
        this.baseCommits,
        this.compareCommits,
      ).map(commit => commit.sha);
    },
  },

  methods: {
    getExactSameCommits(baseCommits, compareCommits) {
      const baseShaSet = new Set(baseCommits.map(commit => commit.sha));
      return compareCommits.filter(commit => baseShaSet.has(commit.sha));
    },

    getCherryPickedCommits(baseCommits, compareCommits) {
      const getRe = sha => new RegExp(`cherry picked from commit ${sha}`);
      const pickedShaSet = new Set(
        compareCommits
          .filter(compareCommit => {
            const re = getRe(compareCommit.sha);
            return baseCommits.some(baseCommit => re.test(baseCommit.message));
          })
          .map(compareCommit => compareCommit.sha),
      );
      return compareCommits.filter(commit => pickedShaSet.has(commit.sha));
    },
  },
};
</script>

<style lang="scss">
.v-timeline-item__divider {
  width: 20px;
}

.v-card {
  width: 100%;
}
</style>
