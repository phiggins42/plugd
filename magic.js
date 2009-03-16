dojo.provide("plugd.magic");
dojo.require("plugd.base");
(function(d){
		
	d.import = function(/* String|Array */module, callback){
		// summary: require a module, or modules, and register an addOnload
		//		function when they become ready.
		//
		// module: String|Array
		//		A String module name, or array or string module names,
		//		to require.
		//
		// callback: Function?
		//		An optional function to register after these `dojo.require` 
		//		calls have been issued. 
		//
		// example:
		//	As a synonym for `dojo.require`:
		//	|	dojo.import("dojo.dnd.Mover");
		//
		// example:
		//	As an enhanced dojo.require, using an Array:
		//	|	dojo.import(["dojo.dnd.Mover", "dijit.Dialog"]);
		//
		// example:
		//	Load a module, and register a `dojo.addOnLoad` function
		//	|	dojo.import("dojo.NodeList-fx", function(){
		//	|		dojo.query(".hidden").fadeIn().play();
		//	|	});
		//
		// example:

		d.forEach(d.isArray(module) ? module : [module], d.require, d);
		d.isFunction(callback) && d.addOnLoad(callback);
	}

	d.dfdImport = function(/* String|Array */modules){
		// summary: An enhanced verison of `dojo.import`
		//		which returns and `dojo.Deferred` (for those familar with it).
		//
		// tags: IO Packages
		//
		// modules: String|Array
		//		A module or list of modules to load, just as `dojo.import` would expect.
		//
		// example:
		//	|	dojo.dfdImport("dojo.behavior").addCallback(function(){
		//	|		dojo.behavior.add({ /* stuff */ })
		//	|	});
		var dfd = new d.Deferred();
		d.import(modules, d.hitch(dfd, "callback"));
		return dfd; // dojo.Deferred
	}

	//>>excludeStart("superMagic", kwArgs.superMagic == "on")
	d._addMagic = function(){
		// summary: Mix every public function in the `dojo` namespace into the
		//		global $ variable either a) when djConfig.conflict is true or
		//		to be called manually after any custom modules are added to 
		//		the `dojo` namespace.
		//	
		// example:
		//	|	dojo.import("some.module", dojo._addMagic); // which adds dojo.fakeFunction
		//
		for(var i in d){
			// if is isn't there, isn't private, and is a function:
			if(!$[i] && !(/^_/.test(i)) && d.isFunction(d[i])){
				$[i] = d[i]; // map it
			}
		}
	}
	d.config.conflict && d._addMagic(); 
	//>>excludeStop("superMagic");
	
})(dojo);