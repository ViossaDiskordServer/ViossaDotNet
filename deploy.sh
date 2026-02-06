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
which pm2 || pnpm i pm2 -g  || { echo "😓 PM2 missing and can't install - run 'pnpm i pm2 -g'  code $?"; exit; } 
cd $SOURCE_DIR || { echo "😓 can't cd - code $?"; exit; } 
pnpm i || { echo "😓 can't pnpm i - $?"; exit; } 
npx turbo build || { echo "😓 build failed - code $?"; exit; } 

mkdir -p $STATIC_DIR || { echo "😓 Can't mkdir $STATIC_DIR  - code $?"; exit; } 
mkdir -p $BACKEND_DIR || { echo "😓 Can't mkdir $BACKEND_DIR - code $?"; exit; } 
cp -r $SOURCE_DIR/apps/vdn-static/dist/* "$STATIC_DIR" || { echo "😓 Can't copy static dist - code $?"; exit; } 
cp -r $SOURCE_DIR/apps/vdb-backend/dist/* "$BACKEND_DIR" || { echo "😓 Can't copy backend dist - code $?"; exit; } 
cd $BACKEND_DIR || { echo "😓 can't cd - code $?"; exit; } 

pm2 start .