dojo.provide("plugd.exportNS");
// this is used to make MooJo
(function(d){
	
	d.exportNS = function(origin, target, prefix){
		// summary: Export all the public members of one namespace safely into 
		//		some other object.
		//
		// origin: Object
		//		Some object to export to another.
		//
		// target: Object
		//		The object to extend with our new members.
		//	
		// prefix: String?
		//		A string to prefix to the global name 
		//
		// example:
		//	|	dojo.exportNS(dojo, dojo.global);
		//	|	query("> li").addClass("bar");
		//
		// example:
		//	|	dojo.exportNS(dojo, window, "$");
		//	|	$query("> li").addClass("bar");
		//

		prefix = prefix || "";
		for(var i in origin){
			// should we check hasOwnProperty?
			if(!target[(prefix + i)] && /^_/.test(i) && !(origin[i] === target)){
				target[(prefix + i)] = origin[i];
			}
		}
	};

	//>>excludeStart("autoConflict", kwArgs.autoConflict == "on");
	if(d.config.conflict){
	//>>excludeEnd("autoConflict");	

		// Turn on an automatic global export of dojo.* API's into window.* either by 
		// 
		d.exportNS(d, d.global);
		
	//>>excludeStart("autoConflict", kwArgs.autoConflict == "on");	
	}
	//>>excludeEnd("autoConflict");
	
})(dojo);