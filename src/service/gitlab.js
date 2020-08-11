import { error } from "@/helper";
import Axios from "axios";

export const setup = ({ token }) => {
  Axios.defaults.baseURL = "https://gitlab.com/api/v4";
  Axios.defaults.headers.common["PRIVATE-TOKEN"] = token;
};

export const getRepos = ({ owner, page = 1, perPage = 30 }) => {
  const uri = `groups/${encodeURIComponent(owner)}/projects`;
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

export const getCommits = ({ repo }) => {
  const uri = `projects/${repo}/repository/commits`;
  return Axios.get(uri)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      error(err);
      return [];
    });
};

export const getBranches = ({ repo }) => {
  const uri = `projects/${repo}/repository/branches`;
  return Axios.get(uri)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      error(err);
      return [];
    });
};
