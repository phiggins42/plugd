dojo.provide("plugd.debugging");
//
// summary: 
//		A largely untested series of duck-puntching checks for common Base Dojo functions
//		never ever ever let this into production enviroment. You will be flogged. Repeatedly.
//
//		simply include this script immediately following dojo.js and the behavior is applied. 
//
//		COULD HAVE ADVERSE SIDE EFFECTS. use with caution. Also, again, don't use in PRODUCTION. 
//
//		ever.
//
//		pass `simpleWarnings:true` to a djConfig to disable slightly [more] expensive tracing information.
// 
//      a debugging flag to allow this to slip into a built version. 
//      pass extradebug=true as build param/profile option to leave this code in a built environment.
//
//>>excludeStart("extradebug", !kwArgs.extradebug);
;(function(d){
	
	var c = console, warn = !d.config.simpleWarnings ? function(){
		// wrap around the console.warn function to provide extra help
		var a = d._toArray(arguments);
		a.push("[called by:", arguments.callee.caller.caller, "]");
		c.warn.apply(c, a);
	} : function(){
		// or just relay the call if simpleWarnings was set
		c.warn.apply(c, arguments);
	};

	var db = d.byId;
	d.byId = function(id){
		if(!id){
			warn("byId: called without an ID. returning undefined.");
			return id;
		}
		var n = db.apply(d, arguments);
		if(!n){
			warn("byId: called with argument, but got nothing back.");
		}
		return n;
	};

//	var dc = d.connect;
//	d.connect = function(target){
//		// summary: A ducked `dojo.connect` checking some common mistakes in usage.
//	
//		if(!target || !d.byId(target) || target !== d.global){
//			warn("binding to global. did you mean to? do so explicitly. you passed:", target);
//		}
//		
//		// run as normal
//		return dc.apply(d, arguments);
//	};

	var ds = d.style, laststyletarget, stylecount;
	d.style = function(node, props, third){
		// summary: a ducked `dojo.style` checking common mistakes in usage. 
		
		var n = db(node);
		if(!n){
			warn("called dojo.style() with null node, or unfound id. passed:", node, "found: ", n);
		}
		
		if(third && n == laststyletarget && typeof props == "string" && arguments.callee.caller !== ds){
			stylecount++;
			warn("calling sequential dojo.style calls. not using an {} hash?", stylecount, "times.");
		}else{
			stylecount = 1;
		}
		
		laststyletarget = n;
		
		// run as normal.
		return ds.apply(d, arguments);
	};
	
	var dq = d.query;
	d.query = function(selector, context){
		if(!selector){
			warn("query: called without a CSS selector or node reference");
			return new d.NodeList;
		}
		
		if(arguments.length > 1 && (!context || !db(context))){
		    // plugd base.js ducks around dojo.query, breaking this arguments.length check
		    if(!plugd.base) warn("query: you passed a context but it was null or unfound")
		}
		
		var list = dq.apply(d, arguments);
		if(!list.length){
			warn("query: selector call: ", selector, " returned 0 results.");
		}
		
		return list;
	};
	
	var dr = d.addOnLoad;
	d.ready = d.addOnLoad = function(fn){
		if(!d.isFunction(fn)){
			warn("ready: you must pass a function reference to dojo.addOnLoad/ready");
		}
		return dr.apply(d, arguments);
	};
	

	var dp = d.publish;
	d.publish = function(t, a){
		if(!t){
			warn("publish: you MUST specify a topic to publish on. MAKING NULL STRING.");
			t = "";
		}
		
		if(typeof t !== "string"){
			warn("publish: only string topics allowed. you sent:", t);
		}
		
		var args = a;
		if(!d.isArrayLike(args)){
			warn("publish: requires an ARRAY of arguments. DOING SO FOR YOU. THIS IS CHANGING BEHAVIOR!!!");
			args = [args];
		}
		
		return dp.call(d, t, a);
	};
	
	d.forEach(["addClass", "removeClass", "toggleClass"], function(meth){
	    var m = d[meth];
	    d[meth] = function(n, clsname){
	        var node = db(n);
	        if(!node || !n){
	            warn(meth, ": must pass a node|id reference. you tried", n);
	        }
	        return m.apply(d, arguments);
	    }
	});
	
	// auto-duck the array utilities. do so last so we can use them unhindered above.
	d.forEach(["forEach", "filter", "map", "some", "every"], function(meth){
		var m = d[meth];
		d[meth] = function(ar, cb, scope){
			if(!ar || !ar.length){
				warn(meth, ": called on an empty/null array", ar);
			}		 
			if(arguments.length > 2 && (!scope || !dojo.isObject(scope))){
				warn(meth, ": passed a context, but it was falsy");
			}			 
			return m.apply(d, arguments);
		};
	});

	
})(dojo);
//>>excludeEnd("extradebug");