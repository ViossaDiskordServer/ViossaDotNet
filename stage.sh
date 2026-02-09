#!/bin/bash

#
# Deployment script to be run remotely on push to master at https://github.com/ViossaDiskordServer/ViossaDotNet/
# Stages static content in a folder immediately for testing. run ./deploy.sh to convert main site.
# Usage: sh ./stage.sh SOURCE_DIR
#

SOURCE_DIR=$1


source ~/.bashrc # make sure NPM commands etc are available 
cd "$SOURCE_DIR"
git fetch --all && git branch "backup-$(date +'%s')" 

npm i -g pnpm && pnpm setup && pnpm i -g turbo \
	&& git checkout -f origin/main \
	&& pnpm i && npx turbo build