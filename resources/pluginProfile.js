dependencies = {
	
	// this removes some silly options from base.js
	silly: "off",
	
	// this removes some redundant code from base.js
	redundant: "off",
	
	// this removes some aliases, mostly deemed usedless.
	compat: "off",
	
	// disable dojo.conflict() usage (off disables)
	conflict: "on",
	
	// set to "on" to make djConfig.conflict moot, and always call dojo.conflict() once
	autoConflict: "off", 
	
	// set to "off" to disable dojo.query("<div><p></p></div>") capabilities
	// (slight performance hit for having it "on")
	magicQuery: "on",
	
	// set to "off" to disable populating the $ with every public dojo function.
	// if "on", and the magic.js module is included, functions like $.xhr(), $.byId(),
	// $.hitch() and all other base Dojo API's are available. (requires conflict:true)
	superMagic: "on",
	
	// standard build options:
	version:"1.3.0-p",
	layerOptimize:"shrinksafe.keepLines",
	optimize:"shrinksafe",
	stripConsole:"normal",
	action:"clean,release",
	
	// create each of the plugins as a standalone js,
	// this way, the build will provide compressed
	// and uncompressed versions of each file for us:
	layers:[
		// WARNING: dojo.js produced from this build will include plugd
		//		base functionality (as per this profile). Comment
		//		this layer out to disable.
		{
			name:"dojo.js",
			dependencies:[
				"plugd.base"
			]
		},
		{
			// our base plugin file (in case we grow)
			name:"../plugd/base.js",
			dependencies:[
				"plugd.base"
			]
		},
		{
			// make the twit plugin standalone (requires plugd.script and dojo.string)
			name:"../plugd/twit.js",
			dependencies:[
				"plugd.twit"
			]
		}
	],
	
	// define the prefix for this namespace (which is only
	// used by provide()/require() as we only use Base Dojo)
	prefixes: [
		// uncomment if you need these namespaces. add your own as needed
		// [ "dijit", "../dijit" ],
		// [ "dojox", "../dojox" ],
		[ "plugd", "../plugd" ]
	]
}
