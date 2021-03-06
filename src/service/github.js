import { error } from "@/helper";
import AxiosConstructor from "axios";

const Axios = AxiosConstructor.create();
export const setup = ({ token }) => {
  Axios.defaults.baseURL = "https://api.github.com";
  Axios.defaults.headers.common["Authorization"] = `token ${token}`;
};

export const getRepos = ({ owner, page = 1, perPage = 30 }) => {
  const uri = `users/${owner}/repos`;
  const params = {
    page,
    per_page: perPage,
  };

  return Axios.get(uri, { params })
    .then(async response => {
      if (response.data.length === 30)
        return response.data.concat(await getRepos({ owner, page: page + 1 }));
      return response.data;
    })
    .catch(err => {
      error(err);
      return [];
    });
};

export const getCommits = ({
  owner,
  repo,
  branch,
  since,
  until,
  page,
  perPage,
}) => {
  const uri = `repos/${owner}/${repo}/commits`;
  const params = {};
  if (branch !== undefined) params.sha = encodeURIComponent(branch);
  if (since !== undefined) params.since = since;
  if (until !== undefined) params.until = until;
  if (page !== undefined) params.page = page;
  if (perPage !== undefined) params.per_page = perPage;

  return Axios.get(uri, { params })
    .then(response => {
      return response.data.map(commit => ({
        sha: commit.sha,
        createdAt: commit.commit.author.date,
        authorName: commit.commit.author.name,
        authorEmail: commit.commit.author.email,
        title: commit.commit.message.split("\n")[0],
        message: commit.commit.message
          .split("\n")
          .slice(1)
          .join("\n")
          .trim(),
      }));
    })
    .catch(err => {
      error(err);
      return [];
    });
};

export const getBranches = ({ owner, repo }) => {
  const uri = `repos/${owner}/${repo}/branches`;
  return Axios.get(uri)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      error(err);
      return [];
    });
};

export const getTags = () => {
  throw Error("Not implemented");
};
