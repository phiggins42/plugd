dojo.provide("plugd.plugin");
(function(d){
	
	// setup the alias:
	d.fn = d.NodeList.prototype;
	
	d.plugin = function(pluginNamespace, fn, way){
		// summary: 
		//		Define a function to exist on both the `dojo` namespace
		//		and as a `dojo.query` plugin.
		//
		// pluginNamespace: String
		//		The name of the plugin to use. In development, a warning will
		//		be thrown if attempting to register a plugin twice. After build,
		//		(in special cases) no such warning is provided. 
		//
		// fn: Function
		//		The plugin function. Must be defined with (at least) a signature
		//		of `function(node){}`, node being in the first position. Any further
		//		arguments are optional.
		//
		// way: String?
		//		Defines which "way" to attached this function `fn` to `dojo.NodeList` 
		//		(the return of a `dojo.query`). Defaults to "_adaptAsForEach", a typical
		//		plugin pattern of simply running some function for each node in the list.
		//
		// example:
		//	|	var defaults = { option1: "default" };
		//	|	dojo.plugin("something", function(node, args){
		//	|		node = dojo.byId(node);
		//	|		var options = dojo.mixin({}, defaults, args);
		//	|		// do something to node	
		//	|	});
		//	|
		//	|	dojo.something("id", {});
		//	|	// or
		//	|	dojo.query(".nodes").something({});


		//>>excludeStart("safetyFirst", kwArgs.noWarnings == "on");
		// leave safety in optionally, build with noWarnings=on to disable check
		if(d[pluginNamespace]){
			console.warn("cowardly won't clobber '" + pluginNamespace + "' method");
			return fn; // Function
		}
		//>>excludeEnd("safetyFirst");
	
		var f = d[pluginNamespace] = fn;
		d.fn[pluginNamespace] = d.NodeList[way || "_adaptAsForEach"](f);
	
		return f; // Function
	}

})(dojo);