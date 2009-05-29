dojo.provide("plugd.script");
;(function(d){

	// one-time lookups / vars:

	var h = d.doc.getElementsByTagName("head")[0],
		re = /complete|loaded/,
		cbtest = /(\w+)=\?/,
		count = 0
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

		if(cbtest.test(src)){
			// our script was passed some form of callback lamda. fix it. 
			d._getJsonp.apply(this, arguments);
		}else{
			// actual handling of the script addition and onload
			var s = d.create("script", { src: src }, h),
				c = d.connect(s, s.readyState ? "onreadystatechange" : "load", function(e){
					if(e.type == "load" || re.test(s.readyState)){
						d.disconnect(c);
						callback && callback.call(s, e);
						if(!preserve){ h.removeChild(s); }
					}
				})
			;
		}
	}
	
	d._getJsonp = function(src, callback, preserve){
		// summary: 
		//		Small branch of `dojo.addScript` for the x-domain JSONP case. If the url passed to
		//		`dojo.addScript` contains a literal "something=?", the ? is replaced
		//		with a generated callback function, passed as `callback`, and triggered.
		//
		// example:
		//	|	dojo._getJsonp("http://example.com/url.json?callback=?", function(data){
		//	|		// data is whatever the response data was. this is async.
		//	|	});

		// setup the callback information:
		var id = "cb" + (++count);
		d.addScript[id] = callback;
		
		// adjust the src to contain a valid callback param
		src = src.replace(cbtest, function(_, b){ 
			return b + "=" + d._scopeName + ".addScript." + id; 
		});
		
		// add the script, and delete the callback function onload
		d.addScript(src, function(){
			delete d.addScript[id];
		}, preserve);
		
	}
	
})(dojo);