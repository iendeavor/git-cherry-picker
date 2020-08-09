let getRepos = () => {};
let getBranches = () => {};
let getCommits = () => {};

import("../service")
  .then(module => {
    getRepos = module.getRepos;
    getBranches = module.getBranches;
    getCommits = module.getCommits;
  })
  .catch(err => {
    console.error(err);
  });

export default {
  state: {
    repos: {},
    commits: {},
    branches: {}
  },
  mutations: {
    setRepos: (state, { owner, repos }) => {
      state.repos[owner] = repos;
    },
    setCommits: (state, { owner, repo, commits }) => {
      state.commits[`${owner}/${repo}`] = commits;
    },
    setBranches: (state, { owner, repo, branches }) => {
      state.branches[`${owner}/${repo}`] = branches;
    }
  },
  actions: {
    fetchRepos: async ({ state, commit }, { owner }) => {
      if (state.repos[owner]) return;

      const payload = {
        owner,
        repos: await getRepos({ owner })
      };
      commit("setRepos", payload);
    },
    fetchBranches: async ({ commit }, { owner, repo }) => {
      const payload = {
        owner,
        repo,
        repose: await getBranches({ owner, repo })
      };
      commit("setBranches", payload);
    },
    fetchCommits: async ({ commit }, { owner, repo }) => {
      const payload = {
        owner,
        repo,
        repose: await getCommits({ owner, repo })
      };
      commit("setCommits", payload);
    }
  }
};
