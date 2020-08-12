<template lang="pug">
  v-container
    v-row.mx-auto
      v-col.py-0( cols="12" sm )
        v-row.d-flex.flex-column
          v-col.d-flex.justify-center.py-0
            b Base

          owner-repo-commit(v-model="baseCommits")

      v-col( sm="1" )

      v-col.py-0( cols="12" sm )
        v-row.d-flex.flex-column
          v-col.d-flex.justify-center.py-0
            b Compare

          owner-repo-commit(v-model="compareCommits")

    v-row
      v-col.py-0
        v-card.mb-2.pa-3( v-for="commit of diffCommits" :key="commit.sha" )
          h4.mb-2 {{ commit.title }}
          div( v-if="commit.message" v-for="(text, index) of commit.message.split('\\n')" :key="index") {{ text }}
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
    };
  },

  computed: {
    diffCommits() {
      return this.filterDiffShas(this.compareCommits);
    },
  },

  methods: {
    filterDiffShas(commits) {
      const baseShaSet = new Set(this.baseCommits.map(commit => commit.sha));
      const compareShaSet = new Set(
        this.compareCommits.map(commit => commit.sha),
      );
      const diffShaSet = new Set(
        Array.from(compareShaSet.values()).filter(
          sha => baseShaSet.has(sha) === false,
        ),
      );
      return commits.filter(commit => diffShaSet.has(commit.sha));
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
