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
        v-card.mb-4.px-2.py-2.grey.lighten-2( v-for="commit of compareCommits" :key="commit.sha" )
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
