//dojo.provide("plugd.base");
;(function(){
		
	// first, some simple aliases
	var d = dojo, 
		place = d.place,
		style = d.style,
		
		// shrinksafe loves this
		display = "display",
		visibility = "visibility",
		
		// used for the "smart" show()/hide()/toggle()
		speedMap = {
	
			"slow"    : 1800,
			"fast"    : 420,
	
			//>>excludeStart("sillyness", kwArgs.silly == "off");
			// these are just to be silly:
			"granny"  : 7600,
			"racecar" : 200,
			"snail"   : 1200,
			"rocket"  : 100,
			"peller"  : 3500,
			// this is "public API" bewlow, down here so we can build-exclude 
			// the above silly-ness and not worry about the comma breaking 
			// after build.
			//>>excludeEnd("sillyness");
	
			"mild"    : 900
		},
		
		// so djConfig.keepLayout is a Boolean, and defaults to false
		// which is display:none vs true which is visibility:hidden
		useLayout 	  = d.config.keepLayout || false,
		
		// define some constants, for our re-use and the benefit of shrinksafe
		styleProperty = useLayout ? visibility : display,
		hideProperty  = useLayout ? "hidden" : "none",
		
		// also, djConfig.useBlock will set display:block for the visible state
		//	if not using keepLayout. Otherwise, display:"" will be used.	
		showProperty  = useLayout ? "visible" : (d.config.useBlock ? "block" : ""),
		
		_getDuration = function(arg){
			return (arg in speedMap) ? speedMap[arg] : speedMap.fast;
		},
		
		// these too are for ShrinkSafe's benefit. 
		NodeList = d.NodeList,
		mirror = NodeList.prototype,
		creationNode,
		
		// for dojo.generateId
		globalId, id_count = 0, base = "djid_"
	;
	
	// namespace-polluting functions:
	d.generateId = function(/* String? */b){
		// summary: Generate an ID for a domNode, ensuring the id does not
		//		exist previously in the DOM.
		//
		// description:
		//		Generates a unique ID, ensuring the id returned does not 
		//		exist in the DOM at the time of execution. A unique number 
		//		is appended to some string, and checked for uniqueness.
		//
		//	b: String?
		//		An optional base string to use for the id prefix. Defaults
		//		to `djid_`
		//
		// example:
		//	|	var id = dojo.generateId(); // djid_1
		//
		// example:
		//	|	var id = dojo.generateId("my_"); // my_2
		//
		// example:
		//	| dojo.create("div", { id: dojo.generateId() })
		//
		do{ globalId = (b || base) + (++id_count) }
		while(d.byId(globalId))
		return globalId;
	}
	
	d.show = function(/* String|DomNode */n, /* String? */arg){
		// summary: Put some node in a visible state
		// arg: a String to tell which speed to use
		//		officially supported: "slow", "fast", "mild"
		if(!arg){
			style(n, styleProperty, showProperty);
		}else{
			// we have an arg!
			if(d.isString(arg)){
				// "fast" and "slow" seem good, default to "fast", use fade
				style(n, "opacity", 0)
				d.show(n)
				d.anim(n, { opacity: 1 }, _getDuration(arg));
			}
		}// else{ fail silently! }
	};
	
	d.hide = function(/* String|DomNode */n, /* String? */arg){
		// summary: Put some node in a hidden state
		// arg: a String to tell which speed to use
		//		officially supported: "slow", "fast", "mild"
		if(!arg){
			style(n, styleProperty, hideProperty);
		}else{
			// we have an arg!
			if(d.isString(arg)){
				// "fast" and "slow" seem good, default to "fast", use fade
				style(n, "opacity", 1);
				d.anim(n, { opacity: 0 }, _getDuration(arg), null, d.hitch(d, "hide", n));
			}
		}// else{ fail silently! }
	};
	
	d.wrap = function(/* String|DomNode */n, /* String */nodeType){
		// summary: Wrap a node in some other created node
		//
		// n: String|DomNode
		//		The node to wrap
		//
		// nodeType: String
		//		The type of element to wrap the node in.
		//		eg: "div", "a", "li"
		// 
		// example:
		//		Wrap a div around a span with id="bar":
		//	|	var adiv = dojo.wrap("bar", "div");
		//
		// returns: DomNode
		//		the newly created node. 
		//
		var element = d.create(nodeType);
		place(element, n, "before");
		place(n, element, "first");
		return element;
	}
	
	d.toggle = function(/* String|DomNode */n, /* String? */speed){
		// summary: Toggle the visibility state of a passed node
		//
		// n: DomNode
		//		The node, or string ID of a node, to toggle.
		//
		// speed: String
		//		One of "slow", "fast", or "mild"
		//
		// example:
		// 	dojo.toggle("someId");
		//
		// example:
		// 	dojo.toggle("someId", "fast");
		//alert("no n?");
		n = d.byId(n);
		d[(n.style[styleProperty] == hideProperty ? "show" : "hide")](n, speed);	
	}
	
	d._createFrom = function(/* String */frag){
		// summary: Creates an element from a String DOM Fragment with the
		//		caveat you are only able to create one top-level item, 
		//		which will be returned from this call. This is a private 
		//		function, meant to assist `dojo.create`
		//
		if(!creationNode){ creationNode = d.create('div') } 
		creationNode.innerHTML = frag;
		// removing leaves it in limbo. You are expected to place this somewhere
		// ... doing this to prevent two sequential create() calls from destroying
		// the generated DOM from the first.
		return creationNode.removeChild(creationNode.firstChild); // DomNode
	}
	
	d.create = function(/* String */nodeType, /* Object? */attrs){
		// summary: Creates an element, optionally setting any number
		//		of attributes. Important to note, there is not cross-browser
		//		sanity checking going on during the creation. This will
		//		fail violently if you attempt to do something that needs
		//		extra attention to browser detection (eg: enc-type forms)
		//
		// nodeType: String
		//		The type of node to create. Something like "div", "a", "ul",
		//		or a valid DOM structure like: "<div class='bar'></div>" 
		//
		// attrs: Object?
		//		An object-hash (property bag) of attributes
		//		to set on the newly created node.
		//		Supports anything `dojo.attr` can handle.
		//
		// example:
		//	Create a [div class="bar"], then place it in a node with id="someId"
		//	|	var div = dojo.create("div", { className:"bar" });
		//	|	dojo.place(div, "someId", "first");
		//
		// example: 
		//	Same as before, but with valid Dom:
		// | 	var div = dojo.create("<div class='bar'></div>");
		// | 	dojo.place(div, dojo.body());
		//
		// example:
		//	Just create an anchor:
		//	| var anchor = dojo.create("a");
		//
		// example:
		//  Create an anchor with a title, href and onclick handler:
		// |	var anchor = dojo.create("a",{
		// |		href:"foo.php", title:"A Link",
		// |		onclick:function(e){
		// |			// define click event
		// |		}
		// |	});
		//
		var n = nodeType.charAt(0) == "<" ? 
			d._createFrom(nodeType) : d.doc.createElement(nodeType);
		if(attrs){ d.attr(n, attrs); }
		return n; // DomNode
	}
	
	// wrap them into dojo.NodeList
	d.extend(NodeList, {
		
		show: function(/* String? */speed){
			// summary: Makes this list of nodes visible.
			// 
			// description:
			//		Makes this list of nodes visible, using the CSS property
			//		`display` to affect the state by default, and allowing
			//		optionally to use the `visibility` property, to retain layout.
			//
			//		defining djConfig.keepLayout = true enables `visibility`, defaults
			//		to false, meaning `display`. 
			//
			// speed: String?
			//		If omitted, showing is done immediately. If a String is passed,
			//		uses a default duration supplied in the speedMap. Valid parameters
			//		are: "fast", "slow", and "mild" (defaults to "fast", 
			//		"racecar" is faster than "fast", but only supported in silly-mode)
			//		
			// example:
			// 	Show all list-items in a list with id="foo" visible:
			// | dojo.query("#foo li").show();
			
			return this.forEach(function(n){
				d.show(n, speed);
			}); // dojo.NodeList
		},
		
		hide: function(/* String? */speed){
			// summary: Makes this list of nodes invisible.
			// 
			// description:
			//		Makes this list of nodes invisible, using the CSS property
			//		`display` to affect the state by default, and allowing
			//		optionally to use the `visibility` property, to retain layout.
			//
			//		defining djConfig.keepLayout = true enables `visibility`, defaults
			//		to false, meaning `display`. 
			//
			// speed: String?
			//		If omitted, hiding is done immediately. If a String is passed,
			//		uses a default duration supplied in the speedMap. Valid parameters
			//		are: "fast", "slow", and "mild" (defaults to "fast", 
			//		"racecar" is faster than "fast")
			//		
			//		hide() is called after the animation. 
			//
			// example:
			// 	Hide all list-items in a list with id="foo" visible:
			// | dojo.query("#foo li").hide();
			
			return this.forEach(function(n){
				d.hide(n, speed); 
			});
		},
		
		toggle: function(/* String? */speed){
			// summary: Toggle this list of nodes by calling show() or hide() 
			// 		to invert their state.
			return this.forEach(function(n){
				d.toggle(n, speed);
			}); // dojo.NodeList
		},
		
		create: function(/* String */tagName){
			// summary: Create a new element for each of the nodes in this list
			//		returning a new NodeList of the newly selected nodes.
			//		The returned list is a stashed-NodeList, and will return 
			//		from and .end() call back to the original NodeList.
			//
			//	tagName: String
			//		A type of node to create. eg: "div", "a", "li"
			//
			//	TODO: implement attrs? why?
			//
			// example:
			//	dojo.query("li.tooltip")
			//		.create("div")
			//			.appendTo("ul#bar")
			//			.addClass("tooltip")
			//		.end()
			//		.removeClass("tooltip")
			//		.onclick(function(e){
			//			// handle click for the node
			//		})
			//		.hover(function(e){
			//			// or just use .toggle(), hmmm.
			//			var action = e.type == "mouseover" ? "show" : "hide";
			//			dojo.query("div.tooltip", e.target)[action]();
			//		})
			//	;
			return this._stash(this.map(function(){
				return d.create(tagName);
			})); // dojo.NodeList
		},
		
		// no need for combine or chain, we'll let you make choppy animations, too:
		// no callbacks, this is all async
		
		animate: function(/* Object */props, /* Integer? */duration, /* Function? */easing, /* Function? */onEnd){
			// summary: Animate the CSS properties passed on all nodes in this list, using
			//		the same API as `dojo.anim`, assuming this node as the target.
			//
			// description:
			// 		Animate the CSS properties passed on all nodes in this list. 
			//		This is lower-performing than the Animations provided by 
			//		`dojo.NodeList-fx` as it doesn't do the work of creating a 
			//		combined animation, but rather simply creates and plays 
			//		the animations immediately. If the performance is an issue,
			//		include `dojo.NodeList-fx`, and use the `.animateProperty()` method (or 
			//		any of the others provided, like .fadeOut, .fadeIn, etc)
			//	
			//		Also with this implementation you loose callbacks of any kind, 
			//		though it would be trivial to implement simple `onEnd` handling, 
			//		so maybe worth considering. 
			//		
			//		This also differs in the sense `.animate()` returns this instance 
			//		of the NodeList, thus allowing further chaining, whereas 
			//		`.anim` and the other FX from `dojo.NodeList-fx` return the 
			//		resulting `dojo._Animation` instance, and does not chain.. 
			//
			// props: Object
			//		A Property-bag of CSS styles to animate. See `dojo.animateProperty`
			//		for the supported syntax. This object would reprasent the `properties:` 
			//		object you pass to `dojo.animateProperty`, and has many options.
			//	
			// duration: Integer?
			//		Time in MS to run the Animation
			//
			// easing: Function?
			// 		The easing function used to modify the Line
			//
			// onEnd: Function
			//		A function to call when the animation sequence is complete.
			//
			// example:
			//		Fade in all spans with class="hidden"
			//	|	dojo.query("span.hidden").animate({ opacity: 1 });
			//
			// example:
			//		Adjust the font-size and margin-left properties of a list, and remove
			//		the class "done":
			//	|	dojo.query("#foo ul > li").animate({
			//	|		fontSize:{ end:15, unit:"pt" },
			//	|		marginLeft:100
			//	|	}).removeClass("done");
			
			return this.forEach(function(n, i, a){
				// we could _toArray and slice, huh?
				var anim = d.anim(n, props, duration, easing);
				if(onEnd && i == a.length - 1){
					d.connect(anim, "onEnd", onEnd);
				}
			}, this); // dojo.NodeList
		},
		
		// i've always liked $(...).wrap()
		wrap: function(/* String */nodeType, /* newList? */newList){
			// summary: Wrap a list of nodes in a nodeType, returning this NodeList, or
			//		a new `dojo.NodeList` of the newly created elements by setting a parameter
			//
			// description:
			//		So this makes the most sense in the single-node list, but applies
			//		and works by creating an element for each node in the list, and 
			//		wrapping it in the created node. 
			//
			// nodeType: String
			//		An element to create. eg: "div", "li", "a", etc. 
			//		No cross-browser magic going on in here, so be careful with
			//		tables and related elements. 
			//
			// newList: Boolean?
			//		If true, a new NodeList is returned from this call.
			//		If false, null, or omitted this NodeList is returned
			//
			// example:
			//		Wrap an additional DIV element around all DIVs with class="foo",
			//		and connect a function to the click event to the wrapper node:
			//
			//	|	dojo.query("div.foo").wrap("div").onclick(function(e){
			//	|		console.log('clicked', e.target); 
			//	|	});
			//
			//	returns: A NodeList of the wrapping elements or This same NodeList
			//
			var nl = new NodeList();
			this.forEach(function(n){
				nl.push(d.wrap(n, nodeType));
			});
			return !newList ? this : this._stash(nl); // dojo.NodeList
		},
		
		appendTo: function(/* String|DomNode */selector){
			// summary: Append each of the nodes in this list to some other node.
			// 
			// description:
			//		Append each of the nodes in this list to some other node defined
			//		by a passed selector or node reference. Only the first result 
			//		of the selector query will be used.
			//
			
			var aplace = d.query(selector);
			if(aplace.length >= 0){
				this.forEach(function(n){
					place(n, aplace[0]);
				});
			}
			// Fails silently, too - hooray for convenience 
			return this; // dojo.NodeList
		},
		
		append: function(/* String|DomNode */selector, /* Boolean? */clone){
			// summary: Append some found node to this NodeList.
			//
			// descrtiption:
			//		Append some found node to this NodeList, optionally
			//		cloning the found node and appending to each of the nodes.
			//		If not cloning, the found node will be added to the last
			//		element in this list, which could be a single-element list
			//		anyway. 
			//		
			var refNode = d.query(selector);
			if(refNode.length >= 0){
				refNode = refNode[0];
				// FIXME: do we want to optionally return a list of the appended clones?
				this.forEach(function(n){
					place((clone ? d.clone(refNode) : refNode), n);
				});
			}
			return this; // dojo.NodeList
		},
		
		//>>excludeStart("redundant", kwArgs.redundant == "off");
		// PUT ALL REDUNDANT FUNCTIONS HERE, as we'll play with them in dev mode, and provide a way
		// to leave them, but remove them in production intentionally. set redundant="on" in profile
		
		// there is an .ophan already, I only ever use this when I know what I meant.
		destroy: function(){
			// summary: Destroy all the elements in this list
			this.forEach(d._destroyElement);
			return true; // Boolean
		},
				
		// END REDUNDANT REMOVAL, make sure there is one after this always we intend to keep
		// as to not break with a stray comma after exlude block removal.
		
		first: function(callback, thisObj){
			//	summary:
			//		Call some function, but only on the first element in this NodeList,
			//		and without raising an exception if the NodeList is empty.
			//
			// example:
			// | dojo.query(".foo").first(function(){ .. });
			
			// FIXME: should the args match "dojo.hitch" ? 
			//		first(this, "foo") // this.foo() in scope of this
			//		first(function(){}) // anon in global
			//		first(this, this.foo) // this.foo() in scope of this
			//		first(foo, this.foos) // this.foos() in scope of foo
			
			if(this.length) {
				callback.call(thisObj || dojo.global, this[0]);
			}
			return this; // dojo.NodeList 
		},
		
		last: function(callback, thisObj){
			//	summary:
			//		Call some function, but only on the last element in the NodeList,
			//		and without raising an exception if the NodeList is empty
			if(this.length) {
				callback.call(thisObj || dojo.global, this[this.length - 1]);
			}
			return this; // dojo.NodeList 
		},
		
		//>>excludeEnd("redundant")
				
		//>>excludeStart("compat", kwArgs.compat == "off")
		
		// a way to mark we've included the compat code for unit tests
		__compatMode: true,
		// these api's are identical i think
		each: mirror.forEach, // no. each sets the context to the node. not 1:1
		css: mirror.style, // yes. 
		bind: mirror.connect, // no .unbind(), can't disconnect() from NodeList
		// this seems silly, NodeList is just and Array ...
		get: function(/* Integer */index){
			// summary: Return an actual DomNode (rather than a list) at some 
			//		index in this selector
			if(index == undefined){ index = 0 }
			return this[index]; // DomNode
		}, // use .at()
		//>>excludeEnd("compat");

		// now I'm just making stuff up, this may or may not be the API:
		val: function(/* String? */value){
			// summary: Get or set a list of values of this list.
			//
			// set: String?
			//		If passed, will set all the matched elements 
			//		to this new value
			//	
			//		If omitted, will return an Array of new values,
			//		or in the case of a single-element list, will
			//		just return the string value of the node.
			//
			//	see: `dojo.attr`
			var v, a = "value";
			if(value){
				return this.attr(a, value)
			}else{
				v = this.attr(a);
				return (v.length == 1) ? v[0] : v;
			}
		},
		
		// this is a fun one, and down here to avoid comma issues:
		hover: function(/* Function */over, /* Function? */out){
			// summary: Registers functions for this list of nodes to be run
			//		when the mouse enters and leaves the related node
			//
			// over: Function
			//		The function to call when the mouse enters the node
			//
			// out: Function? 
			//		The optional function to call when the mouse leaves the node.
			//
			//		If omitted, the over function is called and assumed to delegate
			//		between the event types (e.type)
			//
			// example:
			//	Add the class "over" to an li, and remove it when not hovered
			//	| 	dojo.query("#myList li")
			//	|		.hover(
			//	|			function(e){
			//	|				dojo.addClass(e.target,"over")
			//	|			},
			//	|			function(e){
			//	|				dojo.removeClass(e.target,"over")	
			//	|			}
			//	|		);
			//
			// example:
			//	Same as before, but with one function:
			//	|	dojo.query("#myList li")
			//	|		.hover(function(e){ 
			//	|			var over = (e.type == "mouseover");
			//	|			dojo[(over ? "addClass" : "removeClass")](e.target, "over");
			//	| 		});
			//
			return this.onmouseenter(over).onmouseleave(out || over) // dojo.NodeList
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
			nl.__last = this;
			return nl; // dojo.NodeList
		},
		
		end: function(){
			// summary: Break out of this current depth of chaining, returning
			//		to the last most sequential NodeList (or this NodeList if no
			//		previous NodeList was stashed)
			//
			// example:
			//	|	dojo.query("a")
			//	|		.wrap("div", true)
			//	|			// connect click to the divs
			//	|			.onclick(function(e){ .. }))
			//	|			.addClass("onADiv")
			//	|		.end()
			//	|		// jump back to the list of anchors
			//  |		.style(...)
			//
			return this.__last || this; // dojo.NodeList
		}		
		
	});
	
	//>>excludeStart("magicQuery", kwArgs.magicQuery == "off");
	var oldQuery = d.query;
	d.query = function(/* String|DomNode */query, /* String?|DomNode? */scope){
		// Summary: overloads the normal dojo.query to include dom-creation 
		// 		capabilitites. can be removed all together by setting magicQuery="off"
		//		in the build profile. Otherwise, enables one to transparently use dojo.query
		//		as a dom-lookup function as well as a dom creation function, and is 
		//		offered as a convenience (with significant performance hits). 
		//
		//	example:
		//	| dojo.query("<div class='foo'>bar</div>").removeClass("foo").appendTo("#baz");
		//
		var c = d.isString(query) && query.charAt(0) == "<";
		return oldQuery(c ? d.create(query) : query, scope)
	}
	//>>excludeEnd("magicQuery");
	
	//>>excludeStart("noConflict", kwArgs.conflict == "off");
	d.conflict = function(){
		// summary: Create our $:
		$ = d.mixin(function(){ return d.mixin(d.query.apply(this, arguments), $.fn); }, { fn: {} });
		$.fn.ready = d.addOnLoad;
		// FIXME: d.global[bling] would be cool. d.conflict("pete");
		//	pete(".hasClass").wrap("span");
	}
	// set djConfig = { conflict:true } to enable auto-bling
	if(d.config.conflict){ d.conflict(); }
	//>>excludeEnd("noConflict");

})();