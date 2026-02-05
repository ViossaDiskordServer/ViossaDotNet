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

cp -r $SOURCE_DIR/apps/vdn-static/dist/* "$STATIC_DIR" || { echo "Can't copy static dist 😓 - code $?"; exit; } 
cp -r $SOURCE_DIR/apps/vdb-backend/dist/* "$BACKEND_DIR" || { echo "Can't copy backend dist 😓 - code $?"; exit; } 
