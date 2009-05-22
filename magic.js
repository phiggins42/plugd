dojo.provide("plugd.magic");
dojo.require("plugd.base");
(function(d){
		
	d.dfdLoad = function(){
		// summary: A version of `dojo.load` that returns a `dojo.Deferred` for those familar
		// 		with that syntax. It is important to OMIT the callback function in the parameters
		//
		//	example:
		//	|	var req = dojo.dfdLoad("dijit.Dialog", "dijit.form.Button");
		//	|	req.addCallback(function(){ ... })
		//
		//	example:
		//	Allows .addErrBack() too
		//	|	dojo.dfdLoad("dijit.NotThere").addErrBack(function(){ ... })
		//

		var dfd = new d.Deferred(), a = d._toArray(arguments);
		a.push(dojo.hitch(dfd, 'callback'));
		try{
			d.load.apply(d, a);
		}catch(e){
			dfd.errback(e);
		}
		return dfd;
	}

	//>>excludeStart("superMagic", kwArgs.superMagic == "off")
	d._addMagic = function(){ return;
		// summary: Mix every public function in the `dojo` namespace into the
		//		global $ variable either a) when djConfig.conflict is true or
		//		to be called manually after any custom modules are added to 
		//		the `dojo` namespace.
		//	
		// example:
		//	|	dojo.load("some.module", dojo._addMagic); // which adds dojo.fakeFunction
		//
		for(var i in d){
			// if a) it isn't there, 2) isn't private, and c) is a function:
			if(!$[i] && !(/^_/.test(i)) && d.isFunction(d[i])){
				$[i] = d[i]; // map it
			}
		}
	}
	d.config.conflict && d._addMagic(); 
	//>>excludeEnd("superMagic");
	
})(dojo);