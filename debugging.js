dojo.provide("plugd.debugging");
//>>excludeStart("extradebug", kwArgs.extradebug);
;(function(d){
	// summary: A largely untested series of duck-puntching checks for common Base Dojo functions
	//		never ever ever let this into production enviroment. You will be flogged. 

	var db = d.byId;
	d.byId = function(id){
		if(!id){
			console.warn("called dojo.byId without an ID. returning undefined.")
		}
		return db.apply(d, arguments);
	}

	var dc = d.connect;
	d.connect = function(target){
		// summary: A ducked `dojo.connect` checking some common mistakes in usage.
	
		if(!target || !d.byId(target) || target !== d.global){
			console.warn("binding to global. did you mean to? do so explicitly. you passed:", target);
		}
		
		// run as normal
		return dc.apply(d, arguments);
	};

	var ds = d.style, laststyletarget;
	d.style = function(node, props){
		// summary: a ducked `dojo.style` checking common mistakes in usage. 
		
		var n = db(node);
		if(!n){
			console.warn("called dojo.style() with null node.");
		}
		
		if(n == laststyletarget && typeof props == "string"){
			console.warn("calling sequential dojo.style calls. are you using an {} hash?")
		}
		laststyletarget = n;
		
		// run as normal.
		return ds.apply(d, arguments);
	}
	
	var dq = d.query;
	d.query = function(selector){
		var list = dq.apply(d, arguments);
		if(!list.length){
			console.warn("selector call: ", selector, " returned 0 results.")
		}
		return list;
	}
	
	var dr = d.addOnLoad;
	d.ready = d.addOnLoad = function(fn){
		if(!d.isFunction(fn)){
			console.warn("you must pass a function reference to dojo.addOnLoad/ready");
		}
		return dr.apply(d, arguments);
	}
	
	// auto-duck the array utilities
	d.forEach(["forEach", "filter", "map", "some", "every"], function(meth){
		var m = d[meth];
		d[meth] = function(ar, cb, scope){
			if(!ar || !ar.length){
				console.warn("calling dojo." + meth + "() on an empty/null array", ar);
			}		 
			if(scope !== undefined && !scope){
				console.warn("passed a context to dojo." + meth +"(), but it was falsy");
			}			 
			return m.apply(d, arguments);
		}
	});

})(dojo);
//>>excludeEnd("extradebug");