<template lang="pug">
  v-container
    v-row( v-if="!$store.state.token" )
      v-alert.mx-auto.pa-2.ma-0( type="error" )
        p.mb-0 Please set a host and token first.

    v-row.mx-auto
      v-col.py-0
        v-row.d-flex.align-center
          v-col.d-flex.justify-center( cols="1" )
            v-btn( icon @click="linkOwner = !linkOwner" )
              v-icon mdi-link

          template( v-if="linkOwner" )
            v-col
              owner( v-model="baseOwner" )

          template( v-else )
            v-col( cols="5" )
              owner( v-model="baseOwner" )

            v-col( cols="1" )

            v-col( cols="5" )
              owner( v-model="compareOwner" )

        v-row.d-flex.align-center
          v-col.d-flex.justify-center( cols="1" )
            v-btn( icon @click="linkRepo = !linkRepo" )
              v-icon mdi-link

          template( v-if="linkRepo" )
            v-col
              repo( v-model="baseRepo" :owner="baseOwner" )

          template( v-else )
            v-col( cols="5" )
              repo( v-model="baseRepo" :owner="baseOwner" )

            v-col( cols="1" )

            v-col( cols="5" )
              repo( v-model="compareRepo" :owner="linkOwner ? baseOwner : compareOwner" )

        v-row.d-flex.align-center
          v-col( cols="1" )

          v-col( cols="5" )
            branch( v-model="baseBranch" :owner="baseOwner" :repo="baseRepo" )

          v-col.d-flex.justify-center( cols="1" )
            v-btn( icon @click="swapBranch" )
              v-icon mdi-swap-horizontal-bold

          v-col( cols="5" )
            branch( v-model="compareBranch" :owner="linkOwner ? baseOwner : compareOwner" :repo="linkRepo ? baseRepo : compareRepo" )

          v-col( cols="1" )

    v-row
      v-col.d-flex.justify-center
        picked-sha-sheet( v-model="sortedPickedShas" :deleteSha="deleteSha" )

    v-progress-linear( v-if="loading !== 0" indeterminate color="primary" )

    v-row
      v-col.py-0
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
import Owner from "../../components/Owner";
import Repo from "../../components/Repo";
import Branch from "../../components/Branch";
import commitsMixin from "./commits";
import PickedShaSheet from "./picked-sha-sheet";
import useQuery from "../../hooks/use-query";

export default {
  name: "cherry-pick",

  components: {
    Owner,
    Repo,
    Branch,
    PickedShaSheet,
  },

  mixins: [commitsMixin, useQuery],

  data() {
    return {
      linkOwner: true,
      baseOwner: null,
      compareOwner: null,

      linkRepo: true,
      baseRepo: null,
      compareRepo: null,

      baseBranch: null,
      compareBranch: null,

      baseCommits: [],
      compareCommits: [],

      pickedShas: [],
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

    sortedPickedShas() {
      const sortedPickedShas = [];

      for (const commit of this.diffCommits) {
        if (this.pickedShas.includes(commit.sha)) {
          sortedPickedShas.push(commit.sha);
        }
      }

      return sortedPickedShas.reverse();
    },

    fieldsAboutBaseCommits() {
      return [this.baseOwner, this.baseRepo, this.baseBranch];
    },

    fieldsAboutCompareCommits() {
      return [this.compareOwner, this.compareRepo, this.compareBranch];
    },

    searchResult() {
      return JSON.stringify([
        this.baseOwner,
        this.baseRepo,
        this.baseBranch,
        this.compareOwner,
        this.compareRepo,
        this.compareBranch,
        this.linkOwner,
        this.linkRepo,
      ]);
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

    fieldsAboutBaseCommits: {
      immediate: true,
      deep: true,
      async handler([owner, repo, branch]) {
        ++this.loading;
        this.baseCommits = await this.getCommits(owner, repo, branch);
        --this.loading;
      },
    },

    fieldsAboutCompareCommits: {
      immediate: true,
      deep: true,
      async handler([owner, repo, branch]) {
        ++this.loading;
        this.compareCommits = await this.getCommits(owner, repo, branch);
        --this.loading;
      },
    },

    baseOwner: {
      immediate: true,
      handler() {
        if (this.linkOwner) {
          this.compareOwner = this.baseOwner;
        }
      },
    },

    baseRepo: {
      immediate: true,
      handler() {
        if (this.linkRepo) {
          this.compareRepo = this.baseRepo;
        }
      },
    },

    searchResult: {
      handler() {
        const object = {
          baseOwner: this.baseOwner,
          baseRepo: this.baseRepo,
          baseBranch: this.baseBranch,
          compareOwner: this.compareOwner,
          compareRepo: this.compareRepo,
          compareBranch: this.compareBranch,
          linkOwner: this.linkOwner,
          linkRepo: this.linkRepo,
        };

        this.putQuery(object);
      },
    },
  },

  created() {
    const q = this.getQuery();
    if (q) {
      this.linkOwner = q.linkOwner;
      this.linkRepo = q.linkRepo;
      this.baseOwner = q.baseOwner;
      this.baseRepo = q.baseRepo;
      this.baseBranch = q.baseBranch;
      this.compareOwner = q.compareOwner;
      this.compareRepo = q.compareRepo;
      this.compareBranch = q.compareBranch;
    }
  },

  methods: {
    swapBranch() {
      const branch = this.compareBranch;
      this.compareBranch = this.baseBranch;
      this.baseBranch = branch;
    },

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

    deleteSha(sha) {
      this.pickedShas = this.pickedShas.filter(_sha => _sha !== sha);
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
