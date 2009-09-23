dojo.provide("plugd.base");
;(function(d){

	// first, some simple aliases
	var	place = d.place,
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
		_each = NodeList._adaptAsForEach,
		
		// for dojo.generateId
		globalId, 
		id_count = 0, 
		
		// because IE is insane:
		_jankyEvent = /enter|over/
	;

	// namespace-polluting functions:
	d.unique = function(/* Function */testFn, /* String? */b){
		// summary: 
		//		Return a unique string ID for something, based on a passed uniqueness test
		//		function. Anything that returns a truthy value will suffice. 
		//	
		// testFn: Function
		// 		A function which _must_ return a truthy value indicating the uniqueness
		//		of some item. The intended string id is passed to this function continually
		//		until a falsy value is returned. The first failed string is returned to the
		//		original caller, and is unique to whichever scope the caller intended.
		//
		// b: String?
		//		An optional base to use as the prefix of the ID. defaults to "djid_"
		//
		// example:
		//	Find the next availble DOM id:
		//	| var someId = dojo.unique(dojo.byId);
		//
		// example:
		//	Find the next available DOM id, prefixed with "customID":
		//	| var myId = dojo.unique(dojo.byId, "customID");
		//
		// example:
		//	Find the next available unique member in the `my` namespace prefixed with __priv:
		//	|	var key = d.unique(function(t){ return my[t] }, "__priv");
		//
		// example:
		//	Ensure some Dijit's ID does not exist:
		//	|	var newDijitId = d.unique(dijit.byId, "dijit_auto");
		//	|	new dijit.Dialog({ id: newDijitId, title:"Random" });
		//
		do{ globalId = (b || "djid_") + (++id_count); }
		while(testFn(globalId));
		return globalId; // String
	}

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
		return d.unique(d.byId, b); // String
	}
	
	d.load = function(){
		// summary:
		//		Require a module, or modules, and register an addOnload
		//		function when they become ready.
		//
		// example:
		//		As a synonym for `dojo.require`:
		//	|	dojo.load("dojo.dnd.Mover");
		//
		// example:
		// 		As a synonym for `dojo.addOnLoad`
		//	|	dojo.load(function(){ /* document ready */ });
		//
		// example:
		//		As an enhanced `dojo.require`:
		//	|	dojo.load("dojo.dnd.Mover", "dijit.Dialog");
		//
		// example:
		//		Load a module, and register a `dojo.addOnLoad` function
		//	|	dojo.load("dojo.NodeList-fx", function(){
		//	|		dojo.query(".hidden").fadeIn().play();
		//	|	});

		var a = d._toArray(arguments), l = a.length,
			f = l && !d.isString(a[l - 1]) ? a.pop() : null;

		d.forEach(a, d.require, d);
		f && d.addOnLoad(f);
	}
	
	d.show = function(/* String|DomNode */n, /* String? */arg){
		// summary: Put some node in a visible state
		//
		// n: String|DomNode
		//		A string ID or DomNode to show
		//
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
	}
	
	d.hide = function(/* String|DomNode */n, /* String? */arg){
		// summary: Put some node in a hidden state
		//
		// n: String|DomNode
		//		A string ID or DomNode to show
		//
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
	}
	
	d.wrap = function(/* String|DomNode */n, /* String */nodeType){
		// summary: Wrap a node in some other newly created node
		//
		// description:
		//
		//		Wrap some passed node in a nodeType (or semi-complex markup).
		//		The node being wrapped must be in the DOM at the time of
		//		wrapping in order to know where to position the new node
		//		in the DOM. If you desire to 'wrap' a non detached from
		//		the DOM, you must do it manually. 
		//		
		//		In the event of complex markup, wrap will place the passed
		//		node as the .firstChild of the newly created node. 
		//	
		// n: String|DomNode
		//		The node to wrap
		//
		// nodeType: String
		//		The type of element to wrap the node in.
		//		eg: "div", "a", "li", "span", "<div class='thing'></div>"
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
		return element; // DomNode
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
		// |	dojo.toggle("someId");
		//
		// example:
		// |	dojo.toggle("someId", "fast");

		n = d.byId(n);
		d[(n.style[styleProperty] == hideProperty ? "show" : "hide")](n, speed);
	}
	
	d.qw = function(/* String? */str){
		// summary: Convert a string into an array, treating any number of
		//		spaces as the separator. 
		//
		// str: String?
		//		The string to split. If null, false, or otherwise 
		//		empty, an empty array is returned.
		//
		// example:
		// |	var ar = dojo.qw("the quick brown fox");
		// |	console.log(ar[0]); // "the"
		//
		// example:
		//		Multiple Whitespace treated as one:
		// |	dojo.qw("a  b  c    d").length; // 4
		//
		return str ? d.map(str.split(/\ +/), d.trim) : []; // Array
	}
	
	d.create = function(nodeType, attrs, refNode, pos){
		// summary: Creates an element, optionally setting any number
		//		of attributes. Important to note, there is not cross-browser
		//		sanity checking going on during the creation. This will
		//		fail violently if you attempt to do something that needs
		//		extra attention to browser detection (eg: enc-type forms)
		//
		// nodeType: String
		//		The type of node to create. Something like "div", "a", "ul",
		//		or a valid DOM structure like: "<div class='bar'></div>". 
		//		With Dojo versions < 1.3, a simple markup creation process
		//		is used. >= 1.3, `dojo._toDom` is substititued.  
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
		//	|	var div = dojo.create("<div class='bar'></div>");
		//	|	dojo.place(div, dojo.body());
		//
		// example:
		//	Just create an anchor:
		//	|	var anchor = dojo.create("a");
		//
		// example:
		//  Create an anchor with a title, href and onclick handler:
		//	|	var anchor = dojo.create("a",{
		//	|		href:"foo.php", title:"A Link",
		//	|		onclick:function(e){
		//	|			// define click event
		//	|		}
		//	|	});
		//
		var n = nodeType.charAt(0) == "<" ? 
			d._toDom(nodeType) : d.doc.createElement(nodeType);
		if(attrs){ d.attr(n, attrs); }
		if(refNode){ place(n, refNode, pos); }
		return n; // DomNode
	}
	
	/*======
		dojo.pub = function(topic){
			// summary: Alias for `dojo.publish`, though instead of passing an array as
			//		the second argument, all arguments following the [mandatory] topic
			//		argument are passed to the subscribed function.
			//
			// topic: String
			//		The channel to publish on. All following args are passed to subscribed functions
			//		in order.
			//
			// example:
			//	|	dojo.publish("foo", "bar!");
			//
			// example:
			//	|	dojo.publish("foo", ["bar"]) 
			//
			// example: 
			//	|	dojo.publish("foo", { bar:"bar" }, "baz", "bam");
		}
		dojo.sub = function(){
			// summary: Convenience alias to `dojo.subscribe`, pairing with `dojo.pub`
			//		(though `dojo.pub` is an enhanced alias providing additional functionality)
		}
	======*/
	
	d.sub = d.subscribe;
	d.pub = function(){
		var a = d._toArray(arguments);
		d.publish(a.shift(), a);
	}
	
	d.forIn = function(obj, callback, scope){
		// summary:
		//		Iterates over Objects calling a callback function in some scope
		//
		// description:
		//		Iterates over Objects calling a callback function in some scope
		//		The standard for(in) pattern, in a syntax matching `dojo.forEach`
		//
		//		This is a simplifed version of `dojox.lang.functional.forIn`, which 
		//		supports lamda callbacks and whatnot.
		//	
		// obj: Object
		//		An Object to iterate over
		//
		// callback: Function
		//		Called for each item in the Object. Passed the item in the 
		//		object, the index of the object (the key), and the dictionary.
		//
		// scope: Object?
		//		An optional scope in which to exectue the callback. Defaults to
		//		`null`, aka: `dojo.global` (window)
		//
		// example:
		//		As an object iterator
		//	|	dojo.forIn({ a:"b", c:"d" }, function(item, key){
		//	|		console.log("value is:", item); // b, d
		//	|		console.log("key is", key); // a, c
		//	|	}))
		//
		scope = scope || d.global;
		for(var key in obj){
			callback.call(scope, obj[key], key, obj);
		}
	}
	
	d.now = function(){
		// summary: Get a timestamp from NOW. Can be used for XHR timestamps,
		//		or anywhere else a unique timestamp is required.
		//
		// example:
		//	Slightly more convenient than `cacheBust:true`
		//	|	dojo.xhrGet({ url:"foo.php?" + dojo.now() });
		//
		// example:
		//	|	var n = dojo.now();
		//	|	for(var i = 0; i < 100; i++){
		//	|		/* do something expensive, lots */
		//	|	}
		//	|	console.log("took", dojo.now() - n, "ms");
		return +(new Date()); // Number
	}
	
	// wrap them into dojo.NodeList
	d.extend(NodeList, {

/*=====		
		show: function(speed){
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
			//	|	dojo.query("#foo li").show();
			
			return this; // dojo.NodeList
		},

		hide: function(speed){
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
			//	Hide all list-items in a list with id="foo" visible:
			//	|	dojo.query("#foo li").hide();
			
			return this; // dojo.NodeList
		},
		
		toggle: function(speed){
			// summary: Toggle this list of nodes by calling show() or hide() 
			// 		to invert their state.
			return this; // dojo.NodeList
		},
		
		destroy: function(){
			// summary: Destroy all elements of this list. Differs from `dojo.NodeList.orhpan`
			return this; // dojo.NodeList
		},

		selectable: function(selectable){
			// summary: 
			//		Sets these nodes' selectable state based on a passed boolean param.
			//		see: `dojo.setSelectable`
			//
			// selectable: Boolean?
			//		Pass true to allow the nodes to be selectable. False/null to prevent.

			return this; // dojo.NodeList
		},

=====*/

		show: _each(d.show),
		hide: _each(d.hide),
		toggle: _each(d.toggle),
		destroy: _each(d.destroy), 
		selectable: _each(d.setSelectable),
		
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
			//	|	dojo.query("li.tooltip")
			//	|		.create("div")
			//	|			.appendTo("ul#bar")
			//	|			.addClass("tooltip")
			//	|		.end()
			//	|		.removeClass("tooltip")
			//	|		.onclick(function(e){
			//	|			// handle click for the node
			//	|		})
			//	|		.hover(function(e){
			//	|			// or just use .toggle(), hmmm.
			//	|			var action = e.type == "mouseover" ? "show" : "hide";
			//	|			dojo.query("div.tooltip", e.target)[action]();
			//	|		})
			//	|	;
			return this.map(function(){ // dojo.NodeList
				return d.create(tagName);
			})._stash(this); 
		},

/* in Dojo trunk/1.4:		
		clone: function(){
			// summary: Clone the matched nodes, and return a stashed NodeList of the new nodes
			return this.map(function(n){ // dojo.NodeList
				return d.clone(n);
			})._stash(this); 
		},
*/		
		
		// no need for combine or chain, we'll let you make choppy animations, too:
		animate: function(/* Object */props, /* Integer? */duration, /* Function? */easing, /* Function? */onEnd){
			// summary: Animate the CSS properties passed on all nodes in this list, using
			//		the same API as `dojo.anim`, assuming this node as the target.
			//
			// description:
			//		Animate the CSS properties passed on all nodes in this list. 
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
			//		The easing function used to modify the Line
			//
			// onEnd: Function?
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
			
			return this.forEach(function(n, i, a){ // dojo.NodeList
				// we could _toArray and slice, huh?
				var anim = d.anim(n, props, duration, easing);
				if(onEnd && i == a.length - 1){
					d.connect(anim, "onEnd", onEnd);
				}
			}); 
		},

/*		
		wrap: function(nodeType, newList){
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
			//		tables and related elements in Dojo < 1.3. In 1.3+, `dojo._toDom`
			//		is used for complex markup being wrapped.
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
			return !newList ? this : nl._stash(this); // dojo.NodeList
		},
*/		
/* in Dojo 1.4 / NodeList-manipulate		
		appendTo: function(selector){
			// summary: Append each of the nodes in this list to some other node.
			// 
			// description:
			//		Append each of the nodes in this list to some other node defined
			//		by a passed selector or node reference. Only the first result 
			//		of the selector query will be used.
			// selector: String|DomNode
			// example:
			// |	dojo.query("li.clicked").appendTo("ul#someId");
			
			var aplace = d.query(selector);

			return aplace.length ? // dojo.NodeList
				this.forEach(function(n){
					place(n, aplace[0]);
				}) : this; 
				// Fails silently, too - hooray for convenience 
		},
*/
/* in Dojo 1.4 / NodeList-manipulate		
		append: function(selector, clone){
			// summary: Append some found node to this NodeList.
			//
			// description:
			//		Append some found node to this NodeList, optionally
			//		cloning the found node and appending to each of the nodes.
			//		If not cloning, the found node will be added to the last
			//		element in this list, which could be a single-element list
			//		anyway. 
			// selector: String|DomNode
			// clone: Boolean?
			//		Clone the nodes, or simply pass the one element to all
			// example:
			//	|	dojo.query(".bar").append(d.create('div'));
			//
			// example:
			//		If 'magic query' is enabled:
			//	| 	dojo.query(".bar").append("<li>foo!</li>");
			//
			
			var refNode = d.query(selector);
			if(refNode.length){
				refNode = refNode[0];
				// FIXME: do we want to optionally return a list of the appended clones?
				this.forEach(function(n){
					place((clone ? d.clone(refNode) : refNode), n);
				});
			}
			return this; // dojo.NodeList
		},
*/
		
		size: function(boxType){
			// summary: 
			//		Obtain the sizing information for these node(s)
			// 
			// description:
			//		Obtain the sizing information for these node(s) by returning 
			//		the calculated styles. The default returned values are supplied
			//		by `dojo.marginBox`, though can be overridden by the optional `boxType`
			//		parameter. Other box-calculation functions available in Dojo
			//		are `contentBox` and `coords`.
			//
			// boxType: String?
			//		The dojo.* function to use to calculate the size. Defaults to "marginBox",
			//		which calls dojo.marginBox() for this node. 
			//
			// returns: Mixed
			//		Returns either an array of object 
			//
			// example:
			//		Get the size of a single node byId.
			//	|	dojo.query("#onenode").size().w // get just the width member
			//
			// example:
			//		Get an array of objects representing the sizes of each of these nodes:
			//	|	var sizes = dojo.query(".manynodes").size(); 
			//	
			// example:
			//		Determine the contentBox (as opposed to the default "maginBox");
			//	|	dojo.query("#something").size("contentBox").w;

			var s = this.map(function(n){ 
				return d[boxType || "marginBox"](n);
			});
			return s.length == 1 ? s[0] : s; // Array|Object
		},
		
		//>>excludeStart("redundant", kwArgs.redundant == "off");
		// PUT ALL REDUNDANT FUNCTIONS HERE, as we'll play with them in dev mode, and provide a way
		// to leave them, but remove them in production intentionally. set redundant="on" in profile

	/*	FIXME: clarify this. size() returns mixed array or object. 	
		width: function(boxType){
			// summary: 
			//		Get the width of this node. If the matched selectors are multiple nodes,
			//		this function only returns the first match. Use `dojo.NodeList.size` for a more
			//		direct/flexible size calculator.
			//
			// boxType: String?
			//		Optional box calulcation name. See `dojo.NodeList.size`
			//	
			// example:
			//	|	var w = dojo.query(".foo").width();
			//
			// example: 
			//		Like `dojo.NodeList.size`, allows passing an alternate calculation function
			//	|	var w = dojo.query("#foo").width("contentBox");
			
			return this.size(boxType)[0].w; // Number
		},
		
		height: function(boxType){
			// summary: 
			//		Get the width of this node. If the matched selectors are multiple nodes,
			//		this function only returns the first match. Use `dojo.NodeList.size` for a more
			//		direct/flexible size calculator.
			//
			// boxType: String?
			//		Optional box calulcation name. See `dojo.NodeList.size`
			//	
			// example:
			//	|	var w = dojo.query(".foo").height();
			//
			// example: 
			//		Like `dojo.NodeList.size`, allows passing an alternate calculation function
			//	|	var w = dojo.query("#foo").height("contentBox");
			
			return this.size(boxType)[0].h; // Number
		},
	*/		
		// END REDUNDANT REMOVAL, make sure there is one after this always we intend to keep
		// as to not break with a stray comma after exlude block removal.		
		//>>excludeEnd("redundant")

/* In Dojo 1.4 / NodeList-manipulate				
		// now I'm just making stuff up, this may or may not be the API:
		// (it's not. jq .attr always returns a list iirc)
		val: function(value){
			// summary: Get or set a list of values of this list.
			//
			// set: String?
			//		If passed, will set all the matched elements 
			//		to this new value
			//	
			//		If omitted, will return an Array of new values,
			//		or in the case of a single-element list, will
			//		just return the string value of the node.
			//|
			//		see: `dojo.attr`
			var v, a = "value";
			if(value){
				return this.attr(a, value) // dojo.NodeList
			}else{
				v = this.attr(a);
				return v.length === 1 ? v[0] : v; // dojo.NodeList|String
			}
		},
*/		
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
			return this.onmouseenter(over).onmouseleave(out || over) // dojo.NodeList
		},
		
		hoverClass: function(/* String */className){
			// summary: add or remove a passed class name to these nodes
			//
			// className: String
			//		The class string to add or remove based on hover state.
			//	
			// example:
			//	Add 
			//	|	dojo.query("#mylist li").hoverClass("over");
			//

			return this.hover(function(e){ // dojo.NodeList
				d[(_jankyEvent.test(e.type) ? "add" : "remove") + "Class"](this, className);
			});
		}
		
	});
	
	//>>excludeStart("magicQuery", kwArgs.magicQuery == "off");
	
	var oldQuery = d.query;
	d.query = function(/* String|DomNode */query, /* String?|DomNode? */scope){
		// summary: Overloads the normal dojo.query to include dom-creation 
		//		capabilitites. can be removed all together by setting magicQuery="off"
		//		in the build profile. Otherwise, enables one to transparently use dojo.query
		//		as a dom-lookup function as well as a dom creation function, and is 
		//		offered as a convenience (with significant performance hits). 
		//
		//	query:
		//		A DomNode, String CSS selector, or HTML markup to create
		//
		//	scope:
		//		an optional node reference to start the query from.
		//
		//	example:
		//	|	dojo.query("<div class='foo'>bar</div>").removeClass("foo").appendTo("#baz");
		//
		var c = d.isString(query) && query.charAt(0) == "<",
			r = oldQuery(c ? d.create(query) : query, scope);
		// r.selector = query; // maybe nice to add?
		// r.context = scope; // ditto?
		return r; // dojo.NodeList
	}
	
	//>>excludeEnd("magicQuery");
	
	//>>excludeStart("noConflict", kwArgs.conflict == "off");
	
	d.conflict = function(){
		// summary: Creates our global-bling: $
		//
		// description:
		//		A function to call if you wish to map dojo.query to the $ function
		//		globally. Can be called, or set 'conflict:true' as a `djConfig`
		//		parameter.
		//
		// example:
		//	Setup conflict at any time during the page lifecycle (after base.js included):
		//	|	dojo.confict();
		//
		// example:
		//	Setup conflict automatically on page load:
		//	|	var djConfig = { conflict:true };
		//
		// example:
		//	Know if confict is enabled (it is either set by djConfig, and dojo is loaded
		//	or someone has called dojo.conflict())
		//	|	if(dojo.config.conflict){ /* $ is available */ }
		//
		window.$ = d.mixin(function(){ return d.mixin(d.query.apply(this, arguments), $.fn); }, { fn: {} });
		window.$.fn.ready = d.addOnLoad;
		d.config.conflict = true; // set to true so other things can know we're in conflict mode
	}

	//>>excludeStart("autoConflict", kwArgs.autoConflict == "on");
	if(d.config.conflict){ 
	//>>excludeEnd("autoConflict");	
		d.conflict(); 
	//>>excludeStart("autoConflict", kwArgs.autoConflict == "on");	
	}
	//>>excludeEnd("autoConflict");	
	
	//>>excludeEnd("noConflict");

})(dojo);