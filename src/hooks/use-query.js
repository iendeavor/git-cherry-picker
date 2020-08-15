export default {
  methods: {
    putQuery(object) {
      const q = btoa(JSON.stringify(object));

      if (this.$route.query.q === q) return;

      this.$router.replace({ query: { q } });
    },

    getQuery() {
      if (this.$route.query.q) return JSON.parse(atob(this.$route.query.q));
      else return null;
    },
  },
};
