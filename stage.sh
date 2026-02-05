#!/bin/bash

#
# Deployment script to be run remotely on push to master at https://github.com/ViossaDiskordServer/ViossaDotNet/
# Stages static content in a folder immediately for testing. run ./deploy.sh to convert main site.
# Usage: sh ./stage.sh SOURCE_DIR
#

SOURCE_DIR=$1

cd "$1"|| { echo "Can't cd 😓"; exit; } 
git fetch --all && git branch "backup-$(date +'%s')" && git reset --hard origin/main && npx turbo build