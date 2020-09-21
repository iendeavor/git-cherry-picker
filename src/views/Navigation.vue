<template lang="pug">
  v-app-bar(app dark)
    nav.d-flex.justify-space-between
      ol
        li(v-for="route of routes" :key="route.path")
          router-link.home( v-if="route.path === '/'" :to="route.path" )
            v-icon mdi-home
          router-link( v-else :to="route.path" ) {{ route.name }}
      ol
        li
          a(href="https://github.com/iendeavor/git-cherry-picker" target="_blank")
            v-icon mdi-github
        li v{{ version }}
</template>

<script>
import pkg from "@/../package.json";
import { routes } from "@/router";
export default {
  computed: {
    routes() {
      return routes;
    },
    version() {
      return pkg.version;
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  width: 100%;

  & > ol {
    display: flex;
    flex-direction: row;
    align-items: center;
    list-style-type: none;
    padding: 0;

    & > li {
      display: flex;
      align-items: center;
      padding: 0 5px 0 0;

      &:not(:last-child)::after {
        content: "|";
        padding: 5px;
      }

      & > a,
      & > a:visited {
        color: whitesmoke;
        font-weight: 800;
        text-decoration: none;
      }

      & > a.router-link-exact-active.home[href="#/"],
      & > a.router-link-active:not([href="#/"]),
      & > a:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
