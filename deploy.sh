#!/usr/bin/env sh

# abort on errors
set -e

# update version
yarn version

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git checkout -b main
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:iendeavor/git-cherry-picker.git main:gh-pages

cd -

git push origin main --follow-tags
