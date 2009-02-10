#!/bin/sh

cd ../../util/buildscripts/
mv build_notice.txt _build_notice.txt
touch build_notice.txt
./build.sh profileFile=../../plugd/resources/pluginProfile.js action=clean,release
mv _build_notice.txt build_notice.txt
