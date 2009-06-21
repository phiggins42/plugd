#!/bin/sh
#
#	A Build script to create an optimized plugd release
#

cd ../../util/buildscripts/

# hide the "useless" warning about a release version. docs cover this.
mv build_notice.txt _build_notice.txt
touch build_notice.txt

# all the build options are defined in `pluginProfile.js`
./build.sh profileFile=../../plugd/resources/pluginProfile.js action=clean,release "$@"

# restore build_notice
mv _build_notice.txt build_notice.txt
