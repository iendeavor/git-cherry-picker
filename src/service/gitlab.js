import { error } from "@/helper";
import AxiosConstructor from "axios";

const Axios = AxiosConstructor.create();
export const setup = ({ token }) => {
  Axios.defaults.baseURL = "https://gitlab.com/api/v4";
  Axios.defaults.headers.common["PRIVATE-TOKEN"] = token;
};

export const getRepos = ({ owner, page, perPage }) => {
  const uri = `groups/${encodeURIComponent(owner)}/projects`;
  const params = {};
  if (page !== undefined) params.page = page;
  if (perPage !== undefined) params.per_page = perPage;

  return Axios.get(uri, { params })
    .then(async response => {
      const nextPage = response.headers["x-next-page"];
      if (nextPage)
        return response.data.concat(
          await getRepos({ owner, page: nextPage, perPage }),
        );

      return response.data;
    })
    .catch(err => {
      error(err);
      return [];
    });
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
  const uri = `projects/${repo}/repository/commits`;
  const params = {};
  if (branch !== undefined) params.ref_name = branch;
  if (since !== undefined) params.since = since;
  if (until !== undefined) params.until = until;
  if (all !== undefined) params.all = all;
  if (page !== undefined) params.page = page;
  if (perPage !== undefined) params.per_page = perPage;

  return Axios.get(uri, { params })
    .then(response => {
      return response.data.map(commit => ({
        sha: commit.id,
        authorName: commit.author_name,
        authorEmail: commit.author_email,
        title: commit.title,
        message: commit.message.replace(commit.title, "").trim(),
        createdAt: commit.created_at,
      }));
    })
    .catch(err => {
      error(err);
      return [];
    });
};

export const getBranches = ({ repo, page, perPage }) => {
  const uri = `projects/${repo}/repository/branches`;
  const params = {};
  if (page !== undefined) params.page = page;
  if (perPage !== undefined) params.per_page = perPage;

  return Axios.get(uri, { params })
    .then(async response => {
      const nextPage = response.headers["x-next-page"];
      if (nextPage)
        return response.data.concat(
          await getBranches({ repo, page: nextPage, perPage }),
        );

      return response.data;
    })
    .catch(err => {
      error(err);
      return [];
    });
};
