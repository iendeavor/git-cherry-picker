export default {
  methods: {
    putQuery(object) {
      const q = window.btoa(encodeURIComponent(JSON.stringify(object)));

      if (this.$route.query.q === q) return;

      this.$router.replace({ query: { q } });
    },

    getQuery() {
      if (this.$route.query.q)
        return JSON.parse(decodeURIComponent(window.atob(this.$route.query.q)));
      else return null;
    },
  },
};
