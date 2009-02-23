// dojo.provide("plugd.script");
;(function(d){

	// one-time lookups / vars:
	var h = dojo.doc.getElementsByTagName("head")[0], 
		ev = d.isIE ? "onreadystatechange" : "onload"
	;
		
	d.addScript = function(src, callback){
		// summary: A simplified version of `dojo.io.script.get`. Handle's cross-domain loading of
		// 		resources that may not otherwise be provided as JSONP and meant entirely to be 
		//		consumed upon loading.
		//
		// src: String
		//		The URL of a script to inject into this page
		//
		// callback: Function?
		//		Optional callback function to execute on completion of the script. No failure 
		//		can be trapped. A timeout could easily be incorporated. 
		//
		// example:
		//	|		dojo.addScript("http://example.com/js.js", function(e){ /* js.js is ready */ });
		//
		var s = d.create("script", { 
			src: src, type: "text/javascript"
		}, h);
		
		var c = d.connect(s, ev, function(e){
			// loaded is the non-cached version, complete indicates cached. readystate fires for both. 
			// sane folks are just 'load'. go figure. 
			if( e.type == "load" || (d.isIE && s.readyState == "complete" || s.readyState == "loaded") ){
				d.disconnect(c);
				callback && callback.call(e);
			}
		});
	}
	
})(dojo);