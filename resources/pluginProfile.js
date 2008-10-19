dependencies = {

	// this removes any consle.log/debug statements
	stripConsole: "normal",
	
	// this removes some silly options from base.js
	silly:"off",
	
	// this removes some redundant code from base.js
	redundant:"off",

	// this removes some aliases
	compat:"off",
	
	// disable dojo.conflict() usage (off disables)
	conflict:"on",
	
	// create each of the plugins as a standalone js,
	// this way, the build will provide compressed
	// and uncompressed versions of each file for us:
	layers:[
		{
			// our base plugin file (in case we grow)
			name:"../plugins/base.js",
			dependencies:[
				"plugins.base"
			]
		}
	],
	
	// define the prefix for this namespace (which is only
	// used by provide()/require() as we only use Base Dojo)
	prefixes: [
		[ "plugins", "../plugins" ]
	]
}
