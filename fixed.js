dojo.require("dijit._base.place");
(function(){
	
	var pos = "position", d = dojo, 
		prop = d.isIE < 7 ? "absolute" : "fixed";

	d.declare("dojo.FixedNode", null, {
		// summary: A supplemental position:fixed widget, though 
		//		allows for options sliding to maintain position.
		//
		// slide: Boolean
		//		Does the node slide to it's natural offset, or
		//		simply stay fixed?
		slide: false,
		
		// timeout: Integer
		//		Delay before (if at all) any animation takes place
		//		to slide the node to it's ending position.
		timeout: 200,
		
		constructor: function(params, node){
			// summary: Setup this widget
			//
			// params: Object?
			// 		Object mixed into each instance to override provided
			//		defaults and functions
			// node: DomNode
			//		A Node to make fixed, or to apply this widget-try to. 
			d.mixin(this, params);
			if(d.isIE || this.slide){
				if(!d.isIE){ d.style(node, pos, "absolute"); }
				this._xy = d._abs(this.node = d.byId(node));
				d.connect(window, "onscroll", this, "_onscroll");
			}
		},
		
		_onscroll: function(/* Event */e){
			// summary: Event handler for window.onscroll. Calls _doScroll
			//		immediately or on a delay depending on the slide:"" attribute.
			if(this.slide && this._timeout){ return; }
			if(this.slide){
				this._anim && this._anim.stop();
				this._timeout = setTimeout(d.hitch(this, "_doscroll"), this.timeout);
			}else{
				this._doscroll(e);
			}
		},
		
		_doscroll: function(e){
			// summary: Place the node where it needs to be, either animated or 
			//		as efficiently as possible; 
			var vp = dijit.getViewport(),
				slide = this.slide,
				end = (vp.t + this._xy.y) + (slide ? null : "px");
			
			this._anim = d[(slide ? "anim" : "style")](this.node, {
				top: end
			});
			if(slide){ this._timeout = null; }
		}
	
	});	
	
	d.extend(d.NodeList, {
		fixed: function(args){
			// summary: Turn this list of nodes into position:fixed nodes
			//		as per `dojo.FixedNode` API
			return this.instantiate("dojo._FixedNode", args);
		}
	});
	
})();