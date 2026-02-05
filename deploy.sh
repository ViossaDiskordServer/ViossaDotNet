#!/bin/bash

#
# Deployment script to be run remotely on push to master at https://github.com/ViossaDiskordServer/ViossaDotNet/
#
# Usage: sh ./deploy.sh SOURCE_DIR STATIC_DIRECTORY
#

pwd
cd $1/apps/vdn-static/ || exit 

npx turbo build \
    && cp -r ./dist/* $2
