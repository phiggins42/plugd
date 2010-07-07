dojo.provide("plugd.NodeList-data");
(function(d){
	
	var dataCache = {}, x = 0, dataattr = "data-dojoid", nl = d.NodeList;
	
	d._data = function(node, key, value){
		// summary: stash or get some arbitrary data on/from `node`. 
		//
		// description:
		//		Stash or get some arbirtrary data on/from `node`. This private _data function is
		//		exposed publicly on `dojo.NodeList`, eg: as the result of a `dojo.query` call.
		//		DIFFERS from jQuery.data in that when used as a getter, the entire list is ALWAYS
		//		returned. EVEN WHEN THE LIST IS length == 1
		//
		// node: String|DomNode 
		//		The node to associate data with
		//
		// key: Object?|String?
		//		If an object, act as a setter and iterate over said object setting data items as defined.
		//		If a string, and `value` present, set the data for defined `key` to `value`
		//		If a string, and `value` absent, act as a getter, returning the data associated with said `key`
		//
		// value: Anything?
		//		The value to set for said `key`, provided `key` is a string (and not an object)
		//
		// example:
		//		Set a key `bar` to some data, then retrieve it.
		//	|	dojo.query(".foo").data("bar", "touched");
		//	|	var touched = dojo.query(".foo").data("bar");
		//
		// example:
		//		Get all the data items for a given node. 
		//	|	var list = dojo.query(".foo").data();
		//	|	var first = list[0];
		//
		// example:
		//		Set the data to a complex hash. Overwrites existing keys with new value
		//	|	dojo.query(".foo").data({ bar:"baz", foo:"bar" });
		//		Then get some random key:
		//	|	dojo.query(".foo").data("foo"); // returns `bar`
		//
		//	returns: Object|Anything|Nothing
		//		When used as a setter via `dojo.NodeList`, a NodeList instance is returned 
		//		for further chaning. When used as a getter via `dojo.NodeList` an ARRAY
		//		of items is returned. The items in the array correspond to the elements
		//		in the original list. This is true even when the list length is 1, eg:
		//		when looking up a node by ID (#foo)
		
		var n = d.byId(node), pid = d.attr(n, dataattr), r;
		
		if(!pid){
			pid = "pid" + (x++);
			d.attr(node, dataattr, pid);
		}
		
		if(!dataCache[pid]){ dataCache[pid] = {}; }
		
		// API discrepency: calling with only a node returns the whole object. $.data throws
		if(arguments.length == 1){
			r = dataCache[pid];
		}
		
		if(typeof key == "string"){
			// either getter or setter, based on `value` presence
			if(arguments.length > 2){
				dataCache[pid][key] = value;
			}else{
				r = dataCache[pid][key];
			}
		}else{
			// must be a setter, mix `value` into data hash
			// API discrepency: using object as setter works here
			r = d._mixin(dataCache[pid], key); 
		}
		
		return r; // Object|Anything|Nothing
	};
	
	d._removeData = function(node, key){
		d._data(node, key, null);
	};
	
	nl.prototype.data = nl._adaptWithCondition(d._data, function(a){
		return a.length == 0 || a.length == 1 && (typeof a[0] == "string"); 
	});
	
	nl.prototype.removeData = nl._adaptAsForEach(d._removeData);
	
})(dojo);