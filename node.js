dojo.provide("plugd.node");
// summary: The `Node` Module. Provides dojo._Node, and dojo.node

(function(d){
		
	d._Node = function(){
		// summary: 
		//		A private Class-like object which is decorated onto each node
		//		that passes through `dojo.node`, providing a variety of API's to act
		//		on the returned node transparently. 
		//
		// description:
		//		A private Class-like object which is decorated onto each node
		//		that passes through `dojo.node`, providing a variety of API's to act
		//		on the returned node transparently.
		//
		//		THIS API SHOULD NOT BE USED DIRECTLY. This is a sibling [private] function
		//		to `dojo.node`, which will return an instance of this Class.
		//	
		// example:
		//		Adds a `setColor` method to all Nodes passed through `dojo.node`. 
		//	|	dojo.extend(dojo._Node, {
		//	|		setFontColor: function(color){ return this.style("color", color); }
		//	|	});
		//
	};
	
	var mix = d._mixin;
	d.extend(d._Node, {
		
		// Animations
		fadeOut: function(/* Object? */props){
			// summary: 
			//		Fade out this node. Accepts any `dojo.Animation` args
			//
			// example:
			//	|	dojo.node("foo").fadeOut();
			
			this._anim = d.fadeOut(mix({ node: this }, props)).play();
			return this; // dojo._Node
		},
		
		fadeIn: function(/* Object? */props){
			// summary:
			//		Fade in this node. Accepts any `dojo.Animation` args
			//
			// example:
			//	|	dojo.node("foo").fadeIn();
			
			this._anim = d.fadeIn(mix({ node: this }, props)).play();
			return this; // dojo.Node
		},
		
		animate: function(props){
			// summary:
			//		Animate one (or many) CSS properties of this node. Accepts identical paramters to
			//		`dojo.animateProperty`, though omitting the `node:` member (assumed to be this node)
			//
			// example:
			//	|	dojo.node("bar").animate({ properties:{ opacity:0.2, padding:30 }});
			
			this._anim = d.animateProperty(mix({ node: this }, props)).play();
			return this; // dojo.Node
		},
		
		// DOM operations. 
		css: function(key, val){
			// summary: 
			//		CSS Style getter/setter
			//
			// example:
			//		Return the opacity value for node with id="someId"
			//	|	dojo.node("someId").css("opacity")
			// 
			// example:
			//		Set the opacity value for node with id="someId"
			//	|	dojo.node("someId").css("opacity", 1);
			//
			// example:
			//		Set multiple styles with an object hash
			//	|	dojo.node("someId").css({ opacity:1, padding:"5px" })
			
			if(val === undefined && !d.isObject(key)){
				return d.style(this, key); // String
			}else{
				d.style(this, key, val);
				return this; // dojo._Node
			}
		},
		
		place: function(location, position){
			// summary: 
			//		Place this node somewhere in the DOM. Follow's `dojo.place` syntax
			// 
			// example:
			//	|	dojo.node("someId").place("anotherId", "before");
			
			d.place(this, location, position);
			return this; // dojo._Node
		},
		
		attr: function(key, val){
			// summary: 
			//		Attribute getter/setter. Syntax identical to `dojo.attr`
			
			if(val === undefined){
				return d.attr(this, key); // Anything
			}else{
				d.attr(this, key, val);
				return this; // dojo._Node
			}
		},
		
		empty: function(){
			// summary: 
			//		Empty this node of all content safely.
			//
			// example:
			//	|	dojo.node("foo").empty();
			
			d.empty(this);
			return this; // dojo._Node
		},
		
		destroy: function(){
			// summary: 
			//		Destroy this node, and cleanup event connections.
			
			d.forEach(this._connects, d.disconnect);
			d.destroy(this);
			
		},
		
		clone: function(){
			// summary:
			//		Clone this node, returning a new instance of the decorated Node.
			
			var n = d.clone(this);
			return d.node(n); // dojo._Node
		},
		
		// NodeList operations
		find: function(selector){
			// summary:
			//		Run CSS query locating nodes found within this node.
			//
			// description:
			//		Run CSS query locating nodes found within this node. Returns an instance
			//		of a `dojo.NodeList`. Calling `.end` on the NodeList will return the original
			//		node (dojo._Node instance) to allow continued chaining on the parent.
			//
			// example:
			//		Find all LI's within a node byId:
			//	|	dojo.node("someUL").find("li").forEach(..);
			 
			return d.query(selector, this)._stash(this); // dojo.NodeList
		},
		
		toList: function(){
			// summary:
			//		Promote this Node instance into a single-item `dojo.NodeList`
			//
			// example:
			//	|	var n = dojo.node("foo");
			//	|	n.toList().map(function(node){ });
			//	|	n.toList().onclick(function(e){}).end().innerHTML = "<p>Hi!</p>";
			//		
			// returns: dojo.NodeList
			
			return d.query(this)._stash(this);
		},
		
		// events:
		_connects:[],
		
		connect: function(){
			// summary:
			//		Connect some event to this node. Follows `dojo.connect` syntax, assuming this node
			//		as the target.
			//
			// description:
			//		Connect some event to this node. Follows `dojo.connect` syntax, assuming this node
			//		as the target. This differs slightly from `dojo.connect` in that the `dojo._Node` 
			//		instance is returned from the operation rather than a handle to the connection (used for
			//		`dojo.disconnect`). `dojo._Node` maintains its own .disconnect method, which allows for
			//		only removing events by name. 
			//		
			// example:
			//		Connect a click event to an anonymous function:
			//	|	dojo.node("foo").connect("onclick", function(e){ ... })
			//
			// example:
			//		Connect a submit event to a namespaced function:
			//	|	dojo.node("someForm").connect("onsubmit", someObj, "someMethod");
			//	|	// calls someObj.someMethod() in scope of someObj
			//
			// example:
			//		Connect a click event to an anonymous function setting the scope to `someObj`
			//	|	dojo.node("someThing").connect("onclick", someObj, function(e){ ... });
			
			var a = d._toArray(arguments);
			a.unshift(this);
			
			this._connects.push(d.connect.apply(this, a));
			return this;
		},
		
		disconnect: function(ev){
			// summary:
			//		Disconnect the events attached to this node by event name.
			// 
			// example:
			//		Connect and disconnect an onclick event:
			//	|	dojo.node("foo").connect("onclick", function(e){ ... }).disconnect("onclick");
			
			d.forEach(this._connects, function(handle){
				if(ev == handle || handle[1] == ev || handle[1] == "on" + ev){
					d.disconnect(handle);
				}
			});
			return this;
		},
		 
		setSelectable: function(sel){
			// summary: 
			//		Toggle the selectable state of this node.
			// 
			// sel: Boolean?
			//		Force selectable if set. Defaults to off.
			 
			d.setSelectable(this, sel);
			return this;
		},
		
		coords: function(includeScroll){
			// summary:
			//		Get the coordinate information for this node. Identical to `dojo.coords(someId)` in syntax.
			return d.coords(this, includeScroll);
		},
		
		// does anyone care?
		// marginBox: function(size){
		//	return d.marginBox(this, size);	
		//},
		// contentBox: function(size){
		//	return d.contentBox(this, size);	
		//},
		
		// CSS class stuff
		hasClass: function(className){
			// summary:
			//		Return true or false if this node has the passed `className`
			//
			// example:
			//	|	var n = dojo.node("blah");
			//	|	if(n.hasClass("bar")){ ... }
			
			return d.hasClass(this, className);
		},
		
		addClass: function(className){
			// summary:
			//		Add a class to this node. 
			//
			// example:
			//	|	dojo.node("bar").addClass("foo").hasClass("foo"); // returns true
			
			d.addClass(this, className);
			return this;
		},
		
		toggleClass: function(className, force){
			// summary: 
			//		Toggle the passed className of this node. 
			//
			// force: Boolean?
			//		If passed a truthy value, toggleClass acts as `dojo.addClass` would.
			
			d.toggleClass(this, className, force);
			return this;
		},
		
		removeClass: function(className){
			// summary: 
			//		Remove the passed className from this node's classes.
			//
			// example:
			//		dojo.node("foo").removeClass("bar");
				
			d.removeClass(this, className);
			return this;
		}
		
	});
	
	d.node = function(/* String|DomNode */id, /* Document */doc){
		// summary: 
		//		Find a node by it's ID, returning an enhanced version
		//		of a plain DOM element.
		// 
		// description:
		//		Find a node by it's ID, returning an enhanced version
		//		of a plain DOM element. The enhanced wrapped is a `dojo._Node`,
		//		and contains many `dojo.NodeList` like methods for manipulating
		//		the found node by chaining. 
		//
		//		FAILS VIOLENTLY if built with noDebug="true" in build profile, otherwise
		//		does a basic sanity check around the node-finding. Returns either 
		//		the enhanced Node instance or undefined if not found.
		//
		//		BOTH enhanced methods and native DOM properties are available in this node.
		//		eg: the .addClass method is "magic", whereas items like .innerHTML and .id are
		//		available direcly as the native setter/getter ways.
		//
		//		Extensions can be added by mixing functions into `dojo._Node.fn`. Returning
		//		`this` from each function ensures further chaining is possible, though in
		//		some cases actual values need to be returned (eg: node.hasClass(), node.coords())
		//
		//		Caching of the `dojo.node` return is HIGHLY recommended, as this magic doesn't
		//		come for free. If continually using the same node instance for multiple operations, 
		//		save the return as a variable and reuse that.
		//
		//		The `dojo._Node` functions are nearly identical to `dojo.NodeList` functions as well
		//		as their namespaced `dojo` counterparts. eg: dojo.toggleClass(node, "class"), node.toggleClass('class'),
		//		and dojo.query(".nodes").toggleClass('class') all toggle the class(es) of matched node(s)
		//		in an identical manner.
		//
		// example:
		//		
		//	|	var n = dojo.node("foo");
		//	|	if(n.hasClass("bar")){
		//	|		n.connect("mouseenter", function(e){ ... }).style.top = "10px";
		//	|	} 
		//	
		// example:
		//	| d.node("foo").empty().innerHTML = "<p>Hi!</p>";
		//
		var n = d.byId(id, doc);
		
		//>>excludeStart("nodebug", kwArgs.noDebug);
		if(n){ 
		//>>excludeEnd("nodebug");
			// fixme: check if the n/id is already a dojo._Node instance?
			n.constructor = d._Node;
			mix(n, d._Node.prototype);
		//>>excludeStart("nodebug", kwArgs.noDebug);
		}
		//>>excludeEnd("nodebug");
		
		return n; // DomNode
	};
	
	//>>excludeStart("autoConflict", kwArgs.autoConflict == "on")
	if(d.config.conflict){
	//>>excludeEnd("autoConflict");
		// setup the double-bling in conflict mode.
		d.global["$$"] = d.node;
	//>>excludeStart("autoConflict", kwArgs.autoConflict == "on")	
	}
	//>>excludeEnd("autoConflict");
	
})(dojo);