module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "/git-cherry-picker/" : "/",
  transpileDependencies: ["vuetify"],
};
