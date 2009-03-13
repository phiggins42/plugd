dependencies = {
	
	// this removes some silly options from base.js
	silly: "off",
	
	// this removes some redundant code from base.js
	redundant: "off",
	
	// this removes some aliases
	compat: "off",
	
	// disable dojo.conflict() usage (off disables)
	conflict: "on",
	
	// set to "off" to disable dojo.query("<div><p></p></div>") capabilities
	// (slight performance hit for having it "on")
	magicQuery: "on",
	
	// standard build options:
	version:"1.3.0-p",
	layerOptimize:"shrinksafe.keepLines",
	optimize:"shrinksafe",
	stripConsole: "normal",
	
	// create each of the plugins as a standalone js,
	// this way, the build will provide compressed
	// and uncompressed versions of each file for us:
	layers:[
		// uncomment if you want to roll a dojo.js with plugins included
//		{
//			name:"dojo.js",
//			dependencies:[
//				"plugd.base"
//			]
//		},
		{
			// our base plugin file (in case we grow)
			name:"../plugd/base.js",
			dependencies:[
				"plugd.base"
			]
		},
		{
			// make the twit plugin standalone (requires plugd.script)
			name:"../plugd/twit.js",
			dependencies:[
				"plugd.twit"
			]
		}
	],
	
	// define the prefix for this namespace (which is only
	// used by provide()/require() as we only use Base Dojo)
	prefixes: [
		[ "plugd", "../plugd" ]
	]
}
