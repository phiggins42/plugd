;(function(){
	
	var d = dojo, NodeList = d.NodeList
	
	d.extend(NodeList, {
	
		children: function(tag){
			return this._stash(this.query(tag || ">*"));
		},
	
		parents: function(){
			var nl = this._stash(new NodeList());
			this.forEach(function(n){
				nl.push(n.parentNode);
			})
			return nl; // dojo.NodeList
		},
		
		_stash: function(nl){
			nl.__lastNL = this;
			return nl;
		},
		
		end: function(){
			return this.__lastNl || this;
		}
		
	});
		
})();