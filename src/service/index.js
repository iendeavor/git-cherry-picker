import store from "@/store";
import { REPOSITORY_HOST } from "@/config";
import * as GitHub from "./github";
import * as GitLab from "./gitlab";

let Git = GitHub;

store.watch(
  state => [state.host, state.token],
  () => {
    if (store.state.host === REPOSITORY_HOST.github) {
      Git = GitHub;
    } else if (store.state.host === REPOSITORY_HOST.gitlab) {
      Git = GitLab;
    }

    const config = {
      token: store.state.token
    };
    Git.setup(config);
  },
  { immediate: true }
);

export const getRepos = ({ owner }) => {
  return Git.getRepos({ owner });
};

export const getCommits = ({ owner, repo }) => {
  return Git.getCommits({ owner, repo });
};

export const getBranches = ({ owner, repo }) => {
  return Git.getBranches({ owner, repo });
};
