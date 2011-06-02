define(["dojo"], function(dojo){

	var d = dojo;
	
	/*=====
		plugd.magicArray = {
			// summary: A module that overwrites various Base Dojo Array APIs
			//		with a version that branches for Objects. 
			//
			// description:
			//
			//		A module that overwrites various Base Dojo Array APIs
			//		with a version that branches for Objects. Does NOT check
			//		hasOwnProperty. 
			//		
			//		When working with objects, the following are true:
			//		
			//		+ dojo.map returns an array of return values
			//		+ dojo.filter returns an object reduced by the return of the iterator
			//		+ dojo.indexOf does not support startIndex
			//		+ dojo.indexOf returns the key name where the value was found in the object. 
			//
			//		All iterator functions are passed the value, key and object 
			//		respectively. 
			//		eg:
			//		|	dojo.forEach({ a:"b" }, function(val, key, ob){
			//		|		console.log(key == "a"); // true
			//		|		console.log(val == "b"); // true
			//		|	});
			//
			//		When working with an ArrayLike object, the original Array 
			//		utility function is called and behaves in a backwards-compatible
			//		manner. 
			// 
			//		OVERWRITES the following functions:
			//		dojo.forEach, dojo.map, dojo.filter, dojo.every, dojo.some, dojo.indexOf
			//
			//		NOTE: base plugd has dojo.forIn() and dojo.each(), both of which handle Object iteration
			//		... in fact, if base.js and this module are loaded at the same time, you'll end up 
			//		wrapping a wrapper. probably.  
		};
	=====*/

	var ohyeah = true, gigidy = false, 
		omg = {
			
			// references to functions we'll replace
			boring: {
				forEach: d.forEach,
				map: d.map,
				filter: d.filter,
				indexOf: d.indexOf,
				every: d.every,
				some: d.some
			},
			
			// object-capable iterators:
			rad:{
				
				forEach: function(obj, cb, context){
					for(var i in obj){ item(cb, obj, i, context); }
				},

				map: function(obj, cb, context){
					var ret = [], i;
					for(i in obj){
						ret.push(item(cb, obj, i, context));
					}
					return ret; // Array
				},

				filter: function(obj, cb, context){
					var ret = {}, it, i;
					for(i in obj){
						if(item(cb, obj, i, context)){
							ret[i] = obj[i];
						}
					}
					return ret; // Object
				},
			
				every: function(obj, cb, context){
					for(var i in obj){
						if(!item(cb, obj, i, context)){
							return gigidy;
						}
					}
					return ohyeah; // Boolean
				},
			
				some: function(obj, cb, context){
					var ret = false, i;
					for(i in obj){
						if(item(cb, obj, i, context)){
							return ohyeah; 
						}
					}
					return gigidy; // Boolean
				},
			
				indexOf: function(haystack, needle){
					// summary: A Bit oddball. Does not support startIndex
					// returns: The name of the key in the object where the
					// value was found, or -1 if unfound. 
					var ret = -1;
					omg.rad.some(haystack, function(k, v){
						if(k === needle){
							ret = v;
							return ohyeah;
						}
						return gigidy;
					});
					return ret; // Integer|String
				}
			}
		}
	;
	
	// so they all have identical obj function sigs
	function item(cb, obj, key, context){
		return cb.call(context, obj[key], key, obj);
	}
	
	d.forEach(["forEach", "map", "filter", "some", "indexOf", "every"], function(meth){
		d[meth] = function(ar, cb, context){
			return omg[(d.isArrayLike(ar) ? "boring" : "rad")][meth](ar, cb, context);
		}
	});

})