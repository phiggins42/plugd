dojo.provide("plugd.xhr");

(function(d){

	var list2obj = function(multiText){
		var obj = {}, split = multiText.split("\n");
		dojo.forEach(split, function(line){
			var stuff = dojo.trim(line);
			if(stuff.length){ 
				stuff = stuff.match(/(.*):(.*)/); 
				obj[stuff[1].toLowerCase()] = stuff[2];
			}
		});
		return obj;
	}

	d.contentHandlers.detect = function(xhr){
		
		var h = xhr.getAllResponseHeaders();
		var obj = list2obj(h);
		switch(obj['Content-type']){
			case "application/json":
				handler = "json";
				break;
			default:
				handler = "text";
				break;
		}
		return this[handler](xhr);
	}

})(dojo);