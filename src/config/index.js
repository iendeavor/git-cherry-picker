export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const REPOSITORY_HOST = Object.freeze({
  github: "github",
  gitlab: "gitlab"
});
