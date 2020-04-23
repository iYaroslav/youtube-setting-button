#!/bin/bash -e

if [[ -z "$(git status --untracked-files=no --porcelain)" ]]; then
  version=`yarn version --patch | awk '/New version:/ {print $4}'`
  echo "Version incremented to ${version}"
  yarn publish --new-version ${version} --access public
  npm publish --access public
  gh-pages -d example/build
  silent=`git push origin`
  silent=`git push origin --tags`
else
  echo 'Commit changes before deploy!'
fi
