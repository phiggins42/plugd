;(function(){
	
	var d = dojo, NodeList = d.NodeList
	
	d.extend(NodeList, {
	
		children: function(/* String? */tag){
			// summary: Return a new `dojo.NodeList` of children 
			//		of the nodes in this current list. 
			//		
			// tag: String?
			//		A selector to match for children, defaults to *
			
			return this._stash(this.query(tag || "*")); // dojo.NodeList
		},
	
		parents: function(){
			// summary: Retrusn a new `dojo.NodeList` of the parent nodes
			//		of the nodes in this current list. 
			
			var nl = this._stash(new NodeList());
			this.forEach(function(n){
				nl.push(n.parentNode);
			})
			return nl; // dojo.NodeList
		},
		
		_stash: function(/* dojo.NodeList */nl){
			// summary: Stash this NodeList on the next NodeList returned
			//  	so .end() has somewhere to go.
			//
			// example:
			//	|	dojo.extend(dojo.NodeList, {
			//	|		interesting: function(){
			//	|			var nl = this._stash(new dojo.NodeList();
			//	|			// do something interesting to make a new list
			//	|			return nl;
			//	|		}
			//	|	})	;
			//	
			nl.__lastNL = this;
			return nl; // dojo.NodeList
		},
		
		end: function(){
			// summary: Break out of this current depth of chaining, returning
			//		to the last most sequential NodeList
			//
			// example:
			//	|	dojo.query("a")
			//	|		.wrap("div")
			//	|			// connect click to the divs
			//	|			.onclick(function(e){ .. }))
			//	|		.end()
			//	|		// jump back to the anchors
			//  |		.style(...)
			//
			return this.__lastNl || this; // dojo.NodeList
		}
		
	});
		
})();