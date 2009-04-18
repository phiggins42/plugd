dojo.provide("plugd.exportNS");
// this is used to make MooJo
(function(d){
	
	d.exportNS = function(origin, target){
		// summary: Export all the public members of one namespace safely into 
		//		some other object.
		//
		// origin: Object
		//		Some object to export to another.
		//
		// target: Object
		//		The object to extend with our new members.
		//	
		// example:
		//	|	dojo.exportNS(dojo, dojo.global);
		//	|	query("> li").addClass("bar");
		//

		for(var i in origin){
			// should we check hasOwnProperty?
			if(!target[i] && /^_/.test(i) && !(origin[i] === target)){
				target[i] = origin[i];
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