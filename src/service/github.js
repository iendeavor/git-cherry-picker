import { error } from "../helper";
import Axios from "axios";

export const setup = ({ token }) => {
  Axios.defaults.baseURL = "https://api.github.com";
  Axios.defaults.headers.common["Authorization"] = `token ${token}`;
};

export const getRepos = ({ owner, page = 1, perPage = 30 }) => {
  const uri = `users/${owner}/repos`;
  const params = {
    page,
    per_page: perPage
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

export const getCommits = ({ owner, repo }) => {
  const uri = `repos/${owner}/${repo}/commits`;
  return Axios.get(uri)
    .then(response => {
      return response.data;
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
