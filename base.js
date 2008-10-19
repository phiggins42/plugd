;(function(){
	//d.provide("plugins.base");
		
	// first, some simple aliases
	var d = dojo, 
		
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
		mirror = NodeList.prototype
	;
	
	// namespace-polluting functions:
	d.show = function(/* String|DomNode */n, /* String? */arg){
		// summary: Put some node in a visible state
		// arg: a String to tell which speed to use
		//		officially supported: "slow", "fast", "mild"
		if(!arg){
			d.style(n, styleProperty, showProperty);
		}else{
			// we have an arg!
			if(d.isString(arg)){
				// "fast" and "slow" seem good, default to "fast", use fade
				d.style(n, "opacity", 0)
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
			d.style(n, styleProperty, hideProperty);
		}else{
			// we have an arg!
			if(d.isString(arg)){
				// "fast" and "slow" seem good, default to "fast", use fade
				d.style(n, "opacity", 1);
				d.anim(n, { opacity: 0 }, _getDuration(arg), null, d.hitch(d, "hide", n));
			}
		}// else{ fail silently! }
	};
	
	d.wrap = function(n, nodeType){
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
		var element = d.doc.createElement(nodeType);
		d.place(element, n, "before");
		d.place(n, element, "first");
		return element;
	}
	
	// wrap them into dojo.NodeList
	d.extend(NodeList, {
		
		show: function(/* String? */arg){
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
			// arg: String?
			//		If omitted, showing is done immediately. If a String is passed,
			//		uses a default duration supplied in the speedMap. Valid parameters
			//		are: "fast", "slow", "granny" and "racecar" (defaults to "fast", 
			//		"racecar" is faster than "fast")
			//		
			// example:
			// 	Show all list-items in a list with id="foo" visible:
			// | dojo.query("#foo li").show();
			
			return this.forEach(function(n){
				d.show(n, arg);
			}); // dojo.NodeList
		},
		
		hide: function(/* String? */arg){
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
			// arg: String?
			//		If omitted, hiding is done immediately. If a String is passed,
			//		uses a default duration supplied in the speedMap. Valid parameters
			//		are: "fast", "slow", "granny" and "racecar" (defaults to "fast", 
			//		"racecar" is faster than "fast")
			//		
			//		hide() is called after the animation omitting this arg to set
			//		the display or visibility property after the effect
			//
			// example:
			// 	Hide all list-items in a list with id="foo" visible:
			// | dojo.query("#foo li").hide();
			
			// so older users of show() keep backwards compatibility
			return this.forEach(function(n){
				d.hide(n, arg); 
			});
		},
		
		toggle: function(arg){
			// summary: Toggle this list of nodes by calling show() or hide() 
			// 		to invert their state.
			return this.forEach(function(n){
				d[(n.style[styleProperty] == hideProperty ? "show" : "hide")](arg);
			}); // dojo.NodeList
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
					d.connect(anim, "onEnd", this, onEnd);
				}
			}, this); // dojo.NodeList
		},
		
		// i've always liked $(...).wrap()
		wrap: function(/* String */nodeType){
			// summary: Wrap a list of nodes in a nodeType, returning a new `dojo.NodeList`
			//		of the newly created elements.
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
			// example:
			//		Wrap an additional DIV element around all DIVs with class="foo",
			//		and connect a function to the click event to the wrapper node:
			//
			//	|	dojo.query("div.foo").wrap("div").onclick(function(e){
			//	|		console.log('clicked', e.target); 
			//	|	});
			//
			//	returns: A new NodeList of the wrapping elements.
			//
			var nl = new NodeList();
			this.forEach(function(n){
				nl.push(d.wrap(n, nodeType));
			});
			return nl; // dojo.NodeList
		},
		
		appendTo: function(/* String|DomNode */selector){
			// summary: Append each of the nodes in this list to some other node.
			// 
			// description:
			//		Append each of the nodes in this list to some other node defined
			//		by a passed selector or node reference. Only the first result 
			//		of the selector query will be used.
			//
			
			var place = d.query(selector);
			if(place.length >= 0){
				place = place[0];
				this.forEach(function(n){
					d.place(n, place);
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
				this.forEach(function(n){
					d.place((clone ? d.clone(refNode) : refNode), n);
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
		
		// this seems silly, NodeList is just and Array ...
		get: function(/* Integer */index){
			// summary: Return an actual DomNode (rather than a list) at some 
			//		index in this selector
			if(index == undefined){ index = 0 }
			return this[index]; // DomNode
		},
		
		// END REDUNDANT REMOVAL, make sure there is one after this always we intend to keep
		// as to not break with a stray comma after exlude block removal.
		
		//>>excludeEnd("redundant")
				
		//>>excludeStart("compat", kwArgs.compat == "off")
		
		// a way to mark we've included the compat code for unit tests
		__compatMode: true,
		// these api's are identical i think
		each: mirror.forEach, // no. each sets the context to the node. not 1:1
		css: mirror.style, // yes. 
		bind: mirror.connect, // no .unbind(), can't disconnect() from NodeList
		// now I'm just making stuff up, this may or may not be the API:
		val: function(/* String? */set){
			// summary: Get or set a list of values of this list.
			//	see: `dojo.attr` 
			return this.attr("value", set); 
		},
		//>>excludeEnd("compat");
		
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
			//	|			var over = (e.type == "mouseenter");
			//	|			dojo[(over ? "addClass" : "removeClass")](e.target, "over");
			//	| 		});
			//
			return this.onmouseenter(over) // doesn't fail silently.
				.onmouseleave(out ? out : over) // dojo.NodeList
		}
		
	});
	
	//>>excludeStart("noConflict", kwArgs.conflict == "off");
	d.conflict = function(){
		// summary: Create our $
		$ = d.mixin(function(){ return d.mixin(d.query.apply(this, arguments), $.fn); }, { fn: {} });
		$.fn.ready = d.addOnLoad;
	}
	// set djConfig = { bling:true } to enable auto-bling
	if(d.config.bling){ d.conflict(); }
	//>>excludeEnd("noConflict");

})();