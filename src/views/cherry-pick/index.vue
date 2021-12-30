<template lang="pug">
  v-container
    v-row( v-if="!$store.state.token" )
      v-alert.mx-auto.pa-2.ma-0( type="error" )
        p.mb-0 Please set a host and token first.

    v-row.d-flex.justify-center
      v-col( cols="12" md="5" )
        h4.d-flex.justify-center Base

        owner( v-model="baseOwner" )

        repo( v-model="baseRepo" :owner="baseOwner" )

        branch-and-tag( v-model="baseBranch" :owner="baseOwner" :repo="baseRepo" )

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

        v-btn( @click="swapBranch" text )
          v-icon.black--text mdi-swap-vertical
          span Swap Branch


      v-col( cols="12" md="5" )
        h4.d-flex.justify-center Compare

        owner.d-none.d-md-flex( v-if="linkOwner" :disabled="linkOwner" v-model="baseOwner" )
        owner( v-else v-model="compareOwner" )

        repo.d-none.d-md-flex( v-if="linkRepo" :disabled="linkRepo" v-model="baseRepo" :owner="linkOwner ? baseOwner : compareOwner" )
        repo( v-else v-model="compareRepo" :owner="linkOwner ? baseOwner : compareOwner" )

        branch-and-tag( v-model="compareBranch" :owner="linkOwner ? baseOwner : compareOwner" :repo="linkRepo ? baseRepo : compareRepo" )

    v-expansion-panels
      v-expansion-panel.mb-5.grey
        v-expansion-panel-header.py-0
          v-row.align-center.mr-1
            v-col.ml-2( cols="1" )
              v-icon mdi-filter-outline
            v-col
              div Filter by additional options
        v-expansion-panel-content
          v-row.align-center.mr-1
            v-col( cols="6" )
              v-menu(
                ref="sinceMenu"
                v-model="others.sinceMenu"
                transition="scale-transition"
                :close-on-content-click="false"
                offset-y
              )
                template(v-slot:activator="{ on, attrs }")
                  v-text-field(
                    v-model="since"
                    label="Since"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  )
                v-date-picker( v-model="since" @input="others.sinceMenu = false" color="grey" )
            v-col( cols="6" )
              v-menu(
                ref="untilMenu"
                v-model="others.untilMenu"
                transition="scale-transition"
                :close-on-content-click="false"
                offset-y
              )
                template(v-slot:activator="{ on, attrs }")
                  v-text-field(
                    v-model="until"
                    label="Until"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    clearable
                    placeholder="Now"
                  )
                v-date-picker( v-model="until" @input="others.untilMenu = false" color="grey" )

    v-progress-linear( v-if="loading !== 0" indeterminate color="primary" )

    v-snackbar( v-model="copySnackbar" ) Copied.
      template(v-slot:action="{ attrs }")
        v-btn( @click="copySnackbar = false" color="blue" text ) Dismiss

    v-expansion-panels
      v-expansion-panel.mb-5.grey
        v-expansion-panel-header.py-0
          v-row.align-center.mr-1
            v-col( cols="1" )
              v-btn( @click.stop="lock" icon )
                v-icon( v-if="locking" ) mdi-lock
                v-icon( v-else ) mdi-lock-open-outline
            v-col
              div Selected Shas (Oldest First)
            v-col.d-flex.align-center.justify-end( cols="2" )
              v-chip( @click.stop="copyShas($event, sortedPickedShas.map(sha => 'git cherry-pick -x ' + sha).join('\\n'))" label outlined )
                v-icon mdi-content-copy
        v-expansion-panel-content
          div(v-for="sha of sortedPickedShas" style="font-family: monospace;") git cherry-pick -x {{ sha }}

    v-expansion-panels( accordion hover )
      v-expansion-panel( v-for="commit of diffCommits" :key="commit.sha" )
        v-expansion-panel-header.py-0(v-if="hiddenShas.has(commit.sha) === false")
          v-row.align-center.mr-1
            v-col( cols="1" )
              v-btn( :disabled="locking" :class="{ grey: pickedShas.includes(commit.sha) }" @click.stop="pickCommit(commit)" icon )
                v-icon mdi-check
            v-col
              div {{ commit.title }}
              sub
                span {{ commit.authorName }} &nbsp;
                span.grey--text committed {{ format(commit.createdAt) }}
            v-col.d-flex.align-center.justify-end
              v-chip.rounded-tr-0.rounded-br-0( label outlined )
                span.sha.font-weight-bold {{ commit.sha.slice(0, 8) }}
              v-chip.rounded-0( @click.stop="copyShas($event, commit.sha)" label outlined )
                v-icon mdi-content-copy
              v-chip.rounded-tl-0.rounded-bl-0( @click.stop="toggleHiddenCommit($event, commit)" label outlined )
                v-icon mdi-eye-off
        v-expansion-panel-content
          div.pl-4( v-if="commit.message" v-for="(text, index) of commit.message.split('\\n')" :key="index") {{ text }}
          a(:href="'mailto:' + commit.authorEmail") {{ commit.authorEmail }}

    template(v-if="loading === 0 && hiddenCommits.length")
      .mb-5
      div Hidden Commits
      v-expansion-panels
        v-expansion-panel.grey( v-for="commit of sortedHiddenCommits" :key="commit.sha" )
          v-expansion-panel-header.py-0
            v-row.align-center.mr-1
              v-col( cols="1" )
              v-col
                div {{ commit.title }}
                sub
                  span {{ commit.authorName }} &nbsp;
                  span.grey--text committed {{ format(commit.createdAt) }}
              v-col.d-flex.align-center.justify-end
                v-chip.rounded-tr-0.rounded-br-0( label outlined )
                  span.sha.font-weight-bold {{ commit.sha.slice(0, 8) }}
                v-chip.rounded-0( @click.stop="copyShas($event, commit.sha)" label outlined )
                  v-icon mdi-content-copy
                v-chip.rounded-tl-0.rounded-bl-0( @click.stop="toggleHiddenCommit($event, commit)" label outlined )
                  v-icon mdi-eye
          v-expansion-panel-content
            div.pl-4( v-if="commit.message" v-for="(text, index) of commit.message.split('\\n')" :key="index") {{ text }}
            a(:href="'mailto:' + commit.authorEmail") {{ commit.authorEmail }}

</template>

<script>
import Owner from "../../components/Owner";
import Repo from "../../components/Repo";
import BranchAndTag from "../../components/BranchAndTag";
import commitsMixin from "./commits";
import PickedShaSheet from "./picked-sha-sheet";
import useQuery from "../../hooks/use-query";
import useClipboard from "@/hooks/use-clipboard";
import { format } from "timeago.js";
import dayjs from "dayjs";

const reproduceFields = [
  "baseOwner",
  "baseRepo",
  "baseBranch",
  "compareOwner",
  "compareRepo",
  "compareBranch",
  "linkOwner",
  "linkRepo",
  "since",
  "until",
  "hiddenCommits",
];

export default {
  name: "cherry-pick",

  components: {
    Owner,
    Repo,
    BranchAndTag,
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

      since: dayjs()
        .subtract(1, "month")
        .format("YYYY-MM-DD"),
      until: null,

      locking: false,
      pickedShas: [],
      loading: 0,

      hiddenCommits: [],

      copySnackbar: false,

      others: {
        sinceMenu: false,
        untilMenu: false,
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

    hiddenShas() {
      return new Set(this.hiddenCommits.map(commit => commit.sha));
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

    sortedHiddenCommits() {
      const sortedPickedCommits = [];

      for (const commit of this.diffCommits.slice().reverse()) {
        if (this.hiddenShas.has(commit.sha)) {
          sortedPickedCommits.push(commit);
        }
      }

      return sortedPickedCommits.reverse();
    },

    fieldsAboutBaseCommits() {
      return [
        this.baseOwner,
        this.baseRepo,
        this.baseBranch,
        this.since,
        this.until,
      ];
    },

    fieldsAboutCompareCommits() {
      return [
        this.linkOwner ? this.baseOwner : this.compareOwner,
        this.linkRepo ? this.baseRepo : this.compareRepo,
        this.compareBranch,
        this.since,
        this.until,
      ];
    },

    query() {
      return JSON.stringify(reproduceFields.map(field => this[field]));
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
        const oldForm = JSON.stringify(this.fieldsAboutBaseCommits);
        const commits = await this.getCommits(owner, repo, branch, {
          since: this.since,
          until: this.until,
        });
        if (oldForm === JSON.stringify(this.fieldsAboutBaseCommits)) {
          this.baseCommits = commits;
        }
        --this.loading;
      },
    },

    fieldsAboutCompareCommits: {
      immediate: true,
      deep: true,
      async handler([owner, repo, branch]) {
        ++this.loading;
        const oldForm = JSON.stringify(this.fieldsAboutCompareCommits);
        const commits = await this.getCommits(owner, repo, branch, {
          since: this.since,
          until: this.until,
        });
        if (oldForm === JSON.stringify(this.fieldsAboutCompareCommits)) {
          this.compareCommits = commits;
        }
        --this.loading;
      },
    },

    query: {
      handler() {
        const query = reproduceFields.reduce((query, field) => {
          query[field] = this[field];
          return query;
        }, {});

        this.putQuery(query);
      },
    },
  },

  created() {
    const query = this.getQuery();
    if (query) {
      for (const field of reproduceFields) {
        this[field] = query[field];
        if (field === "hiddenCommits") this[field] = query[field] || [];
      }
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

    lock() {
      this.locking = !this.locking;
    },

    copyShas(event, content) {
      if (!content) return;

      this.$copy(event, content);
      this.copySnackbar = true;
    },

    toggleHiddenCommit(_, commit) {
      const index = this.hiddenCommits.findIndex(
        value => value.sha === commit.sha,
      );
      if (index === -1) {
        this.hiddenCommits.push(commit);
      } else {
        this.hiddenCommits.splice(commit, 1);
      }

      this.pickedShas = this.pickedShas.filter(sha => sha !== commit.sha);
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

.sha {
  font-family: monospace;
}
</style>
