dojo.provide("plugd.magic");
dojo.require("plugd.base");
(function(d){
	
	d.load = function(){
		// summary: require a module, or modules, and register an addOnload
		//		function when they become ready.
		//
		// example:
		//	As a synonym for `dojo.require`:
		//	|	dojo.load("dojo.dnd.Mover");
		//
		// example:
		//	As an enhanced dojo.require:
		//	|	dojo.load("dojo.dnd.Mover", "dijit.Dialog");
		//
		// example:
		//	Load a module, and register a `dojo.addOnLoad` function
		//	|	dojo.load("dojo.NodeList-fx", function(){
		//	|		dojo.query(".hidden").fadeIn().play();
		//	|	});

		var a = d._toArray(arguments), 
			f = a.length && !d.isString(a[a.length-1]) ? a.pop() : null;

		d.forEach(a, d.require, d);
		f && d.addOnLoad(f);
	}

	//>>excludeStart("superMagic", kwArgs.superMagic == "on")
	d._addMagic = function(){ return;
		// summary: Mix every public function in the `dojo` namespace into the
		//		global $ variable either a) when djConfig.conflict is true or
		//		to be called manually after any custom modules are added to 
		//		the `dojo` namespace.
		//	
		// example:
		//	|	dojo.import("some.module", dojo._addMagic); // which adds dojo.fakeFunction
		//
		for(var i in d){
			// if a) it isn't there, 2) isn't private, and c) is a function:
			if(!$[i] && !(/^_/.test(i)) && d.isFunction(d[i])){
				$[i] = d[i]; // map it
			}
		}
	}
	d.config.conflict && d._addMagic(); 
	//>>excludeStop("superMagic");
	
})(dojo);