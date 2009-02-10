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
		}
				
	});
		
})();