#!/bin/bash

#
# Deployment script to be run remotely on push to master at https://github.com/ViossaDiskordServer/ViossaDotNet/
# Stages static content in a folder immediately for testing. run ./deploy.sh to convert main site.
# Usage: sh ./stage.sh SOURCE_DIR
#

SOURCE_DIR=$1

npm i -g pnpm && pnpm setup && pnpm i -g turbo || { echo "Can't install node dependencies 😓 - code $?"; exit; } 
cd "$SOURCE_DIR" || { echo "Can't cd 😓 - code $?"; exit; } 
git fetch --all && git branch "backup-$(date +'%s')" \
&& git checkout -f origin/main \
&& pnpm i && npx turbo build