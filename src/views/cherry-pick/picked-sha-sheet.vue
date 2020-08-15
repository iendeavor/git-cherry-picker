<template lang="pug">
  v-bottom-sheet( v-model="visible" inset )
    template( v-slot:activator="{ attrs, on }" )
      v-btn( dark @click="visible = !visible" ) View Selected

    v-snackbar( v-model="successSnackbar" top timeout="1000" ) Copied

    v-list( max-height="300" style="overflow: scroll;" )
      v-subheader.d-flex.justify-space-between( style="position: sticky;" )
        div Selected Shas
        v-btn( :disabled="shas.length === 0" icon color="blue lighten-2" @click="handleClickCopy" )
          v-icon mdi-content-copy

      v-list-item( v-for="sha of shas" :key="sha" )
        v-list-item-content {{ sha }}
        v-btn( icon color="red lighten-2" @click="deleteSha(sha)" )
          v-icon mdi-delete
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
      successSnackbar: false,
    };
  },

  methods: {
    handleClickCopy(event) {
      this.$copy(event, this.shas.join("\\n"));
      this.successSnackbar = true;
    },
  },
};
</script>
