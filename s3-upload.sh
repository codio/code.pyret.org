#!/bin/bash
set -x

s3_assets_access_key=$1
s3_assets_access_secret=$2
git_hash=$(git rev-parse HEAD)

upload() {
  node uploadToS3.js pyret/${git_hash} build/web "${s3_assets_access_key}" "${s3_assets_access_secret}"
}

upload
echo ${git_hash}
