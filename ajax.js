//dojo.provide("plugd.ajax");
;(function(d){

	d.mixin(d._contentHandlers,{
		"query-html" : function(data, io){
			io.nodes.forEach(function(n){
				console.log(n);
				n.innerHTML = data;
			})
		}	
	});
	
	d.extend(d.NodeList, {
			// experimental: DO NOT USE
		xhr: function(method, args, callback){
			var dfd = d.xhr(method, args);
			if(callback){
				dfd.addCallback(this, callback);
			}
			return this; // dojo.NodeList
		},
		
		load: function(location, callback){
			return this.xhr("GET", { // dojo.Defered
				url: location,
				handleAs:"query-html", 
				nodes: this
			}, callback);
		},
		
		post: function(location, callback){
			return this.xhr("POST", { url:location }, callback); // dojo.NodeList
		}
		
	});
	
})(dojo);