import store from "@/store";
import * as GitHub from "./github";
import * as GitLab from "./gitlab";

const hostToService = {
  github: GitHub,
  gitlab: GitLab,
};
let Git = GitHub;

store.watch(
  state => [state.host, state.token],
  () => {
    Git = hostToService[store.state.host];

    if (Git === undefined) return;
    const config = { token: store.state.token };
    Git.setup(config);
  },
  { immediate: true },
);

export const getRepos = ({ owner, page, perPage }) => {
  return Git.getRepos({ owner, page, perPage });
};

export const getCommits = ({
  owner,
  repo,
  branch,
  since,
  until,
  all,
  page,
  perPage,
}) => {
  return Git.getCommits({
    owner,
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

export const getTags = ({ owner, repo, page, perPage }) => {
  return Git.getTags({ owner, repo, page, perPage });
};
