dojo.require("dijit._base.place");
;(function(){
	
	var pos = "position", d = dojo, 
		prop = d.isIE < 7 ? "absolute" : "fixed";

	d.declare("dojox.FixedNode", null, {
	
		slide: false,
		timeout: 200,
		
		constructor: function(params, node){
			if(d.isIE || this.slide){
				if(!d.isIE){ d.style(node, pos, "absolute"); }
				this._xy = d._abs(this.node = d.byId(node));
				d.connect(window, "onscroll", this, "_onscroll");
			}
		},
		
		_onscroll: function(e){
			if(this.slide && this._timeout){ return; }
			if(this.slide){
				this._anim && this._anim.stop();
				this._timeout = setTimeout(d.hitch(this, "_doscroll", this.timeout));
			}else{
				this._doscroll(e);
			}
		},
		
		_doscroll: function(e){
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
		setFixed: function(args){
			return this.instantiate("dojox.FixedNode", args);
		}
	});
	
})();