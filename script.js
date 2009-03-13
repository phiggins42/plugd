dojo.provide("plugd.script");
;(function(d){

	// one-time lookups / vars:

	var h = d.doc.getElementsByTagName("head")[0], 
		// readystate notes:
		// loaded is the non-cached version, complete indicates cached. readystate fires for both. 
		// sane folks are just 'load'. go figure. 
		ev = d.isIE ? "onreadystatechange" : "load",
		re = /complete|loaded/
	;
		
	d.addScript = function(src, callback, preserve){
		// summary: A simplified version of `dojo.io.script.get`. Handle's cross-domain loading of
		//		resources that may not otherwise be provided as JSONP and meant entirely to be 
		//		consumed upon loading.
		//
		// src: String
		//		The URL of a script to inject into this page. Can be local or cross-domain. 
		//
		// callback: Function?
		//		Optional callback function to execute on completion of the script. No failure 
		//		can be trapped. A timeout could easily be incorporated. The event which triggered
		//		the success is passed to the callback. 
		//
		// preserve: Boolean?
		//		If true, the newly created script tag will be left in the DOM after having completed.
		//		If false (default) the script will be removed from the DOM.
		//
		// example:
		//	|		dojo.addScript("http://example.com/js.js", function(e){ /* js.js is ready */ });
		//
		// example:
		//	|		dojo.addScript("foo.js", dojo.hitch(this, "handler"));
		//
		// example: 
		//	|		dojo.addScript(dojo.moduleUrl("dijit", "Dialog.js"), function(e){
		//	|			// only Dialog.js onload, not it's require() calls. use `dojo.require` + `dojo.addOnLoad`
		//	|		});
		//
		var s = d.create("script", { src: src }, h),
			c = d.connect(s, ev, function(e){
				if(e.type == "load" || re.test(s.readyState)){
					d.disconnect(c);
					callback && callback.call(s, e);
					if(!preserve){ h.removeChild(s); }
				}
			})
		;
	}
	
})(dojo);