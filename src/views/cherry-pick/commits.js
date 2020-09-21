import { getCommits } from "@/service";

export default {
  methods: {
    async getCommits(owner, repo, branch, { since, until }) {
      if (owner === null || repo === null || branch === null) {
        return [];
      }

      const getNextCommits = page =>
        getCommits({
          owner,
          repo,
          branch,
          since,
          until,
          page,
          perPage: 100,
        });

      const commits = [];
      let page = 1;
      let nextCommits = [];
      do {
        nextCommits = await getNextCommits(page++);
        if (nextCommits.length === 0) break;
        commits.splice(commits.length, 0, ...nextCommits);
      } while (nextCommits.length);

      return commits;
    },
  },
};
