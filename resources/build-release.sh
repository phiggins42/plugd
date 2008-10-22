#!/bin/sh

cd ../../util/buildscripts/
mv build_notice.txt _build_notice.txt
touch build_notice.txt
./build.sh layerOptimize=shrinksafe.keepLines profileFile=../../plugins/resources/customBase.js action=clean,release version=1.2.0
mv _build_notice.txt build_notice.txt
