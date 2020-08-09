import store from "../store";
import { REPOSITORY_HOST } from "../config";
import * as GitHub from "./github";

let Git = GitHub;

store.watch(
  state => [state.host, state.auth.token],
  () => {
    if (store.state.host === REPOSITORY_HOST.github) {
      Git = GitHub;
    }

    const config = {
      token: store.state.auth.token
    };
    Git.setup(config);
  },
  { immediate: true }
);

export const getRepos = ({ owner }) => {
  if (store.state.host === REPOSITORY_HOST.github) {
    return Git.getRepos({ owner });
  }
};

export const getCommits = ({ owner, repo }) => {
  if (store.state.host === REPOSITORY_HOST.github) {
    return Git.getCommits({ owner, repo });
  }
};

export const getBranches = ({ owner, repo }) => {
  if (store.state.host === REPOSITORY_HOST.github) {
    return Git.getBranches({ owner, repo });
  }
};
