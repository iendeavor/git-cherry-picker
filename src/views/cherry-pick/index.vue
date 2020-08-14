<template lang="pug">
  v-container
    v-row( v-if="!$store.state.token" )
      v-alert.mx-auto.pa-2.ma-0( type="error" )
        p.mb-0 Please set a host and token first.

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
      v-col
        v-textarea(
          ref="sortedPickedShas"
          :value="sortedPickedShas.join('\\n')"
          label="Picked Shas (oldest first)"
          rows="1"
          auto-grow
          prepend-icon="mdi-content-copy"
          @click:prepend="handleClickCopy"
          append-icon="mdi-close"
          @click:append="handleClickClear"
          :success-messages="successMessages.copy"
          )

    v-row
      v-col.py-0
        v-progress-linear( v-if="loading !== 0" indeterminate color="primary" )
        v-card.mt-2.pa-3( v-for="commit of diffCommits" :key="commit.sha" @click="pickCommit(commit)" :class="{ grey: pickedShas.includes(commit.sha) }" )
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
      pickedShas: [],
      loading: 0,
      successMessages: {
        copy: [],
      },
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

    sortedPickedShas() {
      const sortedPickedShas = [];

      for (const commit of this.diffCommits) {
        if (this.pickedShas.includes(commit.sha)) {
          sortedPickedShas.push(commit.sha);
        }
      }

      return sortedPickedShas.reverse();
    },
  },

  watch: {
    diffCommits: {
      deep: true,
      handler() {
        const diffShas = new Set(this.diffCommits.map(commit => commit.sha));
        this.pickedShas = this.pickedShas.filter(sha => diffShas.has(sha));
      },
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

    pickCommit(commit) {
      const index = this.pickedShas.indexOf(commit.sha);
      if (index > -1) {
        this.pickedShas.splice(index, 1);
      } else {
        this.pickedShas.push(commit.sha);
      }
    },

    handleClickCopy() {
      if (this.sortedPickedShas.length === 0) return;

      const textarea = this.$refs.sortedPickedShas.$el.querySelector(
        "textarea",
      );
      textarea.select();
      document.execCommand("copy");
      document.getSelection().removeAllRanges();

      this.successMessages.copy.push("Copied!");
      setTimeout(() => {
        this.successMessages.copy = [];
      }, 1000);
    },

    handleClickClear() {
      this.pickedShas = [];
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
  cursor: pointer;
}
</style>
