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
      token: store.state.token,
    };
    Git.setup(config);
  },
  { immediate: true },
);

export const getRepos = ({ owner, page, perPage }) => {
  return Git.getRepos({ owner, page, perPage });
};

export const getCommits = ({
  repo,
  branch,
  since,
  until,
  all,
  page,
  perPage,
}) => {
  return Git.getCommits({
    repo,
    branch,
    since,
    until,
    all,
    page,
    perPage,
  });
};

export const getBranches = ({ owner, repo, page, perPage }) => {
  return Git.getBranches({ owner, repo, page, perPage });
};
