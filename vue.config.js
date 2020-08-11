const Dotenv = require("dotenv-webpack");

module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "/git-cherry-picker/" : "/",
  configureWebpack: {
    plugins: [new Dotenv()],
  },
  transpileDependencies: ["vuetify"],
};
