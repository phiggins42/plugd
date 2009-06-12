dojo.provide("plugd.trans");
dojo.require("plugd.base");
dojo.require("dojo.NodeList-traverse");

//>> add build exclude for dojo.js
(function(){
	// common in plugd base.js
	var d = dojo, 
//>>	
		place = d.place;
	
	d.extend(d.NodeList, {
		
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
					place(content, n, "only")
				}) 
				// or return a new array of the contents
				: this.map(function(n){
					return n.innerHTML;
				})._stash(this)
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
			//	|	dojo.query("#bar").replace("<div>gone</div>")
			//
			return this.map(function(n){ // dojo.NodeList
				return place(content, n, "replace")
			});
		}
		
		// functions have moved to dojo.NodeList-trans		
	});

//>> dojo.js build exclude	
})();
//>>