;(function(){
	
	var d = dojo, NodeList = d.NodeList
	
	d.extend(NodeList, {
	
		prepend: function(/* String */tag){
			// summary: Prepend some markup to each of the matched Nodes
			//
			// example:
			//	dojo.query("a.link").prepend("<img src='foo.png'>");
			//
			return this.forEach(function(n){
				n.innerHTML = tag + n.innerHTML;
			})
		},
	
		content: function(content){
			return content ?
				// either set this content so each of the matched nodes
				this.forEach(function(n){
					n.innerHTML = content;
				}) 
				// or return a new array of the contents
				: this._stash(this.map(function(n){
					return n.innerHTML;
				}))
		},
	
		children: function(/* String? */tag){
			// summary: Return a new `dojo.NodeList` of children 
			//		of the nodes in this current list. 
			//		
			// tag: String?
			//		A selector to match for children, defaults to *
			
			return this._stash(this.query(tag || "*")); // dojo.NodeList
		},
	
		parent: function(){
			// summary: Retrusn a new `dojo.NodeList` of the parent nodes
			//		of the nodes in this current list. 
			
			var nl = this._stash(new NodeList());
			this.forEach(function(n){
				nl.push(n.parentNode);
			})
			return nl; // dojo.NodeList
		}
		
	});
		
})();