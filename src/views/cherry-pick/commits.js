import { getCommits } from "@/service";
import dayjs from "dayjs";

export default {
  methods: {
    async getCommits(owner, repo, branch) {
      if (owner === null || repo === null || branch === null) {
        return [];
      }

      const promise = getCommits({
        owner,
        repo,
        branch,
        since: dayjs().subtract(6, "month"),
        page: 1,
        perPage: 100,
      });

      return promise.then(response => {
        return response;
      });
    },
  },
};
