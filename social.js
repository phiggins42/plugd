// experimental: don't use yet
dojo.provide("plugd.social");
dojo.require("dojo.fx.easing");
(function(d){

	var defaults = {
		top:-18
	};

	d.social = function(n, args){
		
		n = d.byId(n);
		
		var opts = d.mixin({}, defaults, args),
			size = n.className.match(/size([0-9]+)/)[1]
		;

		switch(size){
			case "24" : opts.top = -6; break;
			case "32" : opts.top = -13; break;
		}
		
		d.query("li", n).forEach(function(n){

			d.connect(n, "mouseenter", function(){
				d.anim(n, { marginTop:opts.top }, 320, d.fx.easing.backOut);
			});
			
			d.connect(n, "mouseleave", function(){
				d.anim(n, { marginTop:0 }, 500, d.fx.easing.bounceOut);
			});

		});
		
	}
	
	d.NodeList.prototype.social = d.NodeList._adaptAsForEach(d.social);
	
})(dojo);

dojo.addOnLoad(function(){

	dojo.query(".social").social();

});


