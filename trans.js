// dojo.provide("plugd.trans"); (make me work with a build layer)
;(function(){
	
	// common in plugd base.js
	var d = dojo, place = d.place;
	
	d.extend(d.NodeList, {
	
		prepend: function(/* String */tag){
			// summary: Prepend some markup to each of the matched Nodes
			//
			// example:
			//	dojo.query("a.link").prepend("<img src='foo.png'>");
			//
			return this.forEach(function(n){ // dojo.NodeList
				place(tag, n, "first");
			})
		},
	
		content: function(content){
			// summary: set or get the content of the matched Nodes. 
			//
			// content: String?
			//		If passed, set the content of the nodes to this.
			//
			// returns: dojo.NodeList
			//		Either a `StashedNodeList` with an array of content (getter)
			//		or the original NodeList after the new content is set (setter)
			//
			// example:
			//	|	dojo.query("div").content("<p>replaced!</p>");
			//
			// example:
			//	|	dojo.query("div").content().forEach(function(inner){ ... }).end().forEach(...);
			//
			return content ? // dojo.NodeList
				// either set this content so each of the matched nodes
				this.forEach(function(n){
					n.innerHTML = content;
				}) 
				// or return a new array of the contents
				: this._stash(this.map(function(n){
					return n.innerHTML;
				}))
		},
		
		before: function(content){
			// summary: Create some complex DOM and insert it before the matched elements
			//		(shorthand for `dojo.place` on this list)
			//
			// content: String|DomNode
			//		A string ID of a node, Complex DOM string, or DomNode reference
			//		to place around the matched nodes.
			//
			// example:
			//	|	dojo.query("a").before("<span>a link:</span>");
			//
			return this.forEach(function(n){ // dojo.NodeList
				place(content, n, "before");
			})
		},
		
		after: function(content){
			// summary: 
			//		Create some complex DOM and insert it after the matched elements
			//		(shorthand for `dojo.place` on this list)
			//
			// content: String|DomNode
			//		A string ID of a node, Complex DOM string, or DomNode reference
			//		to place around the matched nodes.
			//
			// example:
			//	|	dojo.query("td + td").after("<td>new col after second</td>");
			//
			return this.forEach(function(n){ // dojo.NodeList
				place(content, n, "after")
			})
		},
		
		replace: function(content){
			// summary: 
			//		Create some complex DOM and replace the matched nodes with this content
			//		see: `NodeList.content` to only set the content of the matched node. This
			//		is destructive to the list.
			//
			// content: String|DomNode
			//		A string ID of a node, Complex DOM string, or DomNode reference
			//		to place around the matched nodes.
			//
			// example:
			//	|	dojo.query("#bar").replace("<div")
			//
			return this.map(function(n){ // dojo.NodeList
				return place(content, n, "replace")
			});
		}
		
	});
		
})();