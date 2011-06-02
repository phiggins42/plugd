define(["dojo"], function(dojo){
	
	var d = dojo, clsCache = {},
		create = d.layout = function(part){
			
			// do some mangling:
			var dtype = part.type, kids = part.children;
			if(!clsCache[dtype]){ clsCache[dtype] = d.getObject(dtype); }

			// use the id as the id wether or not srcNodeRef with that id 
			// exists or not:
			part.props = part.props || {};
			if(part.id){ part.props.id = part.id; }
			
			// create the instance from the cached function
			var c = clsCache[dtype], main = new c(part.props, part.id);

			// process the children recursively
			kids && d.forEach(kids, function(kid){
				create(kid).placeAt(main);
			});

			return main; // dijit._Widget
		}
	;
	
/*===== 
	d.layout = function(def){
		// summary: Create a Layout from a passed definition
		//
		// description:
		//		Create a Layout from a passed definition.
		//		The definition is an object with several key members. 
		//		On the root level a `type` must be provided. each type 
		//
		//
		// def: Object
		//		The layout definition.
		//
		// example:
		//	Create a single ContentPane from a node with id="home"
		//	|	dojo.layout({ type:"dijit.layout.ContentPane", id:"home" });
		//
		return create(def); // dijit._Widget
	}
=====*/

	return d;
	
});