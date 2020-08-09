<template lang="pug">
  v-container( fluid )
    v-row
      v-col( cols="6" )
        v-text-field( v-model="sourceOwner" label="Source Owner" @change="handleChangeSourceOwner" )

      v-col( cols="6" )
        v-select( :disabled="!!isLoading.sourceRepo" :loading="!!isLoading.sourceRepo" v-model="sourceRepo" label="Source Repo" :items="sourceRepos" clearable )

    v-row
      v-col( cols="6" )
        v-text-field( v-model="targetOwner" label="Target Owner" @change="handleChangeTargetOwner" )

      v-col( cols="6" )
        v-select( :disabled="!!isLoading.targetRepo" :loading="!!isLoading.targetRepo" v-model="targetRepo" label="Target Repo" :items="targetRepos" clearable )
</template>

<script>
export default {
  name: "cherry-pick",

  data() {
    return {
      sourceOwner: "",
      sourceRepo: undefined,
      sourceRepos: [],
      targetOwner: "",
      targetRepo: undefined,
      targetRepos: [],
      isLoading: { sourceRepo: 0, targetRepo: 0 }
    };
  },

  methods: {
    async handleChangeSourceOwner() {
      if (this.sourceOwner === "") return;

      const owner = this.sourceOwner;
      ++this.isLoading.sourceRepo;
      await this.$store.dispatch("fetchRepos", { owner });
      --this.isLoading.sourceRepo;
      if (this.sourceOwner === owner) this.updateSourceRepos();
    },
    async handleChangeTargetOwner() {
      if (this.targetOwner === "") return;

      const owner = this.targetOwner;
      ++this.isLoading.targetRepo;
      await this.$store.dispatch("fetchRepos", { owner });
      --this.isLoading.targetRepo;
      if (this.targetOwner === owner) this.updateTargetRepos();
    },

    updateSourceRepos() {
      this.sourceRepos = (
        this.$store.state.repo.repos[this.sourceOwner] || []
      ).map(item => ({
        text: item.name,
        value: item.name
      }));
    },
    updateTargetRepos() {
      this.targetRepos = (
        this.$store.state.repo.repos[this.targetOwner] || []
      ).map(item => ({
        text: item.name,
        value: item.name
      }));
    }
  }
};
</script>
