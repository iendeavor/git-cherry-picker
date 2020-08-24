<template lang="pug">
  v-container
    v-row( v-if="!$store.state.token" )
      v-alert.mx-auto.pa-2.ma-0( type="error" )
        p.mb-0 Please set a host and token first.

    v-row.d-flex.justify-center
      v-col( cols="12" md="5" )
        h4 Base

        owner( v-model="baseOwner" )

        repo( v-model="baseRepo" :owner="baseOwner" )

        branch( v-model="baseBranch" :owner="baseOwner" :repo="baseRepo" )

      v-col.d-none.d-md-flex.align-center.justify-space-around.flex-md-column( cols="2" )
        h4

        v-tooltip( bottom )
          template( v-slot:activator="{ on, attrs }" )
            v-btn( icon v-bind="attrs" v-on="on" @click="linkOwner = !linkOwner" )
              v-icon.black--text( :class="{ 'grey--text': !linkOwner, 'text--lighten-1': !linkOwner }" ) mdi-link
          span Sync Owner

        v-tooltip( bottom )
          template( v-slot:activator="{ on, attrs }" )
            v-btn( icon v-bind="attrs" v-on="on" @click="linkRepo = !linkRepo" )
              v-icon.black--text( :class="{ 'grey--text': !linkRepo, 'text--lighten-1': !linkRepo }" ) mdi-link
          span Sync Repo

        v-tooltip( bottom )
          template( v-slot:activator="{ on, attrs }" )
            v-btn( icon v-bind="attrs" v-on="on"  @click="swapBranch" )
              v-icon.black--text mdi-swap-horizontal
          span Swap Branch

      v-col.d-flex.d-md-none.align-center.justify-space-between( cols="12" )
        v-btn( @click="linkOwner = !linkOwner" text )
          v-icon.black--text( :class="{ 'grey--text': !linkOwner, 'text--lighten-1': !linkOwner }" ) mdi-link
          span Sync Owner

        v-btn( @click="linkRepo = !linkRepo" text )
          v-icon.black--text( :class="{ 'grey--text': !linkRepo, 'text--lighten-1': !linkRepo }" ) mdi-link
          span Sync Repo

        v-btn(  @click="swapBranch" text )
          v-icon.black--text mdi-swap-vertical
          span Swap Branch


      v-col( cols="12" md="5" )
        h4 Compare

        owner.d-none.d-md-flex( v-if="linkOwner" :disabled="linkOwner" v-model="baseOwner" )
        owner( v-else v-model="compareOwner" )

        repo.d-none.d-md-flex( v-if="linkRepo" :disabled="linkRepo" v-model="baseRepo" :owner="linkOwner ? baseOwner : compareOwner" )
        repo( v-else v-model="compareRepo" :owner="linkOwner ? baseOwner : compareOwner" )

        branch( v-model="compareBranch" :owner="linkOwner ? baseOwner : compareOwner" :repo="linkRepo ? baseRepo : compareRepo" )

    v-progress-linear( v-if="loading !== 0" indeterminate color="primary" )

    v-snackbar( v-model="copySnackbar" ) Copied.
      template(v-slot:action="{ attrs }")
        v-btn( @click="copySnackbar = false" color="blue" text ) Dismiss

    v-expansion-panels
      v-expansion-panel.mb-5.grey( :disabled="pickedShas.length === 0" )
        v-expansion-panel-header.py-0
          v-row.align-center.mr-2
            v-col( cols="1" )
              v-btn( :disabled="pickedShas.length === 0" @click.stop="copyShas" icon )
                v-icon mdi-content-copy
            v-col( cols="10" )
              div Selected Shas
        v-expansion-panel-content
          div(v-for="sha of pickedShas") {{ sha }}

    v-expansion-panels( accordion hover )
      v-expansion-panel( v-for="commit of diffCommits" :key="commit.sha" )
        v-expansion-panel-header.py-0
          v-row.align-center.mr-2
            v-col( cols="1" )
              v-btn( :class="{ grey: pickedShas.includes(commit.sha) }" @click.stop="pickCommit(commit)" icon )
                v-icon mdi-check
            v-col( cols="10" )
              div {{ commit.title }}
              sub
                span {{ commit.authorName }} &nbsp;
                span.grey--text committed {{ format(commit.createdAt) }}
            v-col( cols="1" )
              span {{ commit.sha.slice(0, 8) }}
        v-expansion-panel-content
          div.pl-4( v-if="commit.message" v-for="(text, index) of commit.message.split('\\n')" :key="index") {{ text }}
          a(:href="'mailto:' + commit.authorEmail") {{ commit.authorEmail }}

</template>

<script>
import Owner from "../../components/Owner";
import Repo from "../../components/Repo";
import Branch from "../../components/Branch";
import commitsMixin from "./commits";
import PickedShaSheet from "./picked-sha-sheet";
import useQuery from "../../hooks/use-query";
import useClipboard from "@/hooks/use-clipboard";
import { format } from "timeago.js";

export default {
  name: "cherry-pick",

  components: {
    Owner,
    Repo,
    Branch,
    PickedShaSheet,
  },

  mixins: [commitsMixin, useQuery, useClipboard],

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

      copySnackbar: false,
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
      return [
        this.linkOwner ? this.baseOwner : this.compareOwner,
        this.linkRepo ? this.baseRepo : this.compareRepo,
        this.compareBranch,
      ];
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

    copyShas(event) {
      this.$copy(event, this.pickedShas.join(" "));
      this.copySnackbar = true;
    },

    format,
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
