<template lang="pug">
  v-bottom-sheet( v-model="visible" inset )
    template( v-slot:activator="{ attrs, on }" )
      v-btn( dark @click="visible = !visible" ) View Selected

    v-list
      v-subheader.d-flex.justify-space-between
        div Selected Shas
        v-btn( :disabled="shas.length === 0" icon color="blue lighten-2" @click="handleClickCopy" )
          v-icon mdi-content-copy

      v-list-item( v-for="sha of shas" :key="sha" )
        v-list-item-content {{ sha }}
        v-btn( icon color="red lighten-2" @click="deleteSha(sha)" )
          v-icon mdi-delete

    v-snackbar( v-model="copySnackbar" ) Copied.
      template(v-slot:action="{ attrs }")
        v-btn( @click="copySnackbar = false" color="blue" text ) Dismiss
</template>

<script>
import useClipboard from "@/hooks/use-clipboard";

export default {
  name: "picked-sha-sheet",

  model: {
    prop: "shas",
    event: "change",
  },

  mixins: [useClipboard],

  props: {
    shas: Array,
    deleteSha: Function,
  },

  data() {
    return {
      visible: false,
      alertMessage: "",
      copySnackbar: false,
    };
  },

  methods: {
    handleClickCopy(event) {
      this.$copy(event, this.shas.join("\\n"));
      this.copySnackbar = true;
    },
  },
};
</script>

<style lang="scss">
.v-dialog.v-bottom-sheet {
  overflow-y: auto;
}
</style>
