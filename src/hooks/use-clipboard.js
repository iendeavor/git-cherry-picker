export default {
  methods: {
    $copy(e, text) {
      const textarea = document.createElement("textarea");
      e.target.parentElement.appendChild(textarea);
      textarea.value = text;
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      document.execCommand("copy");
      e.target.parentElement.removeChild(textarea);
      this.$emit("alert", "success", "Copied");
    },
  },
};
