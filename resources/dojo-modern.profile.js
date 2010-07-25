dependencies = {
	
	version:"1.5.0-modernizr",
	action:"release",
	releaseName:"modernizr",
	
	layers: [
		{
			
			// must be literally `dojo.js`, but can be renamed.
			// to use module system you must define a basePath and modulePaths
			name: "dojo.js",
			dependencies: [
				// plugd APIs
				"plugd.feature",
				"plugd.feature._Modernizr",
			]
		}
	],
	
	prefixes: [
		[ "plugd", "../plugd" ]
	]
}
