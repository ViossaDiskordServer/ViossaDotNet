#!/bin/bash

#
# Deployment script to be run remotely on push to master at https://github.com/ViossaDiskordServer/ViossaDotNet/
#
# Usage: sh ./deploy.sh SOURCE_DIR STATIC_DIR BACKEND_DIR
#

SOURCE_DIR=$1
STATIC_DIR=$2
BACKEND_DIR=$3

pwd
npm i -g pnpm && pnpm setup 
pnpm i -g pm2
cd $SOURCE_DIR
pnpm i
turbo build

mkdir -p $STATIC_DIR
mkdir -p $BACKEND_DIR
cp -r $SOURCE_DIR/apps/vdn-static/dist/* "$STATIC_DIR"
cp -r $SOURCE_DIR/apps/vdb-backend/dist/* "$BACKEND_DIR"
cd $BACKEND_DIR

pm2 start .