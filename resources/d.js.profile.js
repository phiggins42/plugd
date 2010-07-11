dependencies = {
	
	version:"1.5.0-djs",
	action:"release",
	releaseName:"d",
	
	scopeMap: '[["dojo","d"], ["dijit", "dj"], ["dojox", "dx"]]',
	
	layers: [
		{
			
			// must be literally `dojo.js`, but can be renamed.
			// to use module system you must define a basePath and modulePaths
			name: "dojo.js",
			
			dependencies: [
			
				// fun and useful:
				"dojo.back",
				"dojo.behavior",
				"dojo.cookie",
				
				// NodeList addons 
				"dojo.NodeList-traverse",
				"dojo.NodeList-manipulate",
				"dojo.NodeList-fx",
				
				"dojo.fx.easing",
				
				// plugd APIs
				"plugd.base",
				"plugd.script",
				
				// the magic d().map vs d.map()
				"plugd.changedojo"
			]
		}
	],
	
	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ]
	]
}
