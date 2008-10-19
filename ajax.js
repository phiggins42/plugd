//dojo.provide("plugins.ajax");
;(function(){
	
	var d = dojo
	
	;
	
	d.extend(d.NodeList, {
	
		_xhr: function(method, args, callback){
			var dfd = d.xhr(method, args);
			if(callback){
				dfd.addCallback(callback);
			}
			return this;
		},
		
		load: function(location, callback){
			return this._xhr("GET", { url: location }, callback);
		},
		
		post: function(location, callback){
			return this._xhr("POST", { url:location }, callback);
		}
		
	});
	
})();