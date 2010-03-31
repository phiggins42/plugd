dojo.provide("plugd.crash");
dojo.crash = function(x){
	// summary: 
	//		Instantly crash IE6. That'll teach em'
	//
	// description:
	//		Instantly crash IE6. Direct port of: 
	//		http://plugins.jquery.com/project/crash
	//
	//		Super userful.
	//
	// x: Anything?
	//		Just pass anything. Or don't. It will still crash.
	//
	// example:
	//	|	dojo.crash();
	//
	// example:
	//	Passing an argument:
	//	|	dojo.crash("anArgument");
	//
	// example:
	//	Passing an object:
	//	|	dojo.crash({ a:"b" });
	//
	// example:
	//	Passing a number:
	//	|	dojo.crash(1);
	//
	// example:
	//	Passing an array:
	//	|	dojo.crash([1,2,3]);
	//
	// example:
	//	Crashing at the end of an XHR call:
	//	|	dojo.xhrGet({
	//	|		url:"/foo",
	//	|		load: dojo.crash
	//	|	});
	//
	// example:
	//	Crashing onclick:
	//	|	dojo.connect(node, "onclick", dojo, "crash");
	//
	// example:
	//	Alternate onclick crash, using dojo.query()
	//	|	dojo.query(".badlink").onclick(dojo.crash);
	// 
	// example:
	//	Crash randomly:
	//	|	setInterval(function(){
	//	|		if(Math.random() * 100 > 75){
	//	|			dojo.crash();
	//	|		}
	//	|	}, 1000);
	for(x in close);
};