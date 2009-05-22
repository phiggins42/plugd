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
		
		dojo.query("li", n).forEach(function(n){

			dojo.connect(n, "mouseenter", function(){
				dojo.anim(n, { marginTop:opts.top }, 320, dojo.fx.easing.backOut);
			});
			
			dojo.connect(n, "mouseleave", function(){
				dojo.anim(n, { marginTop:0 }, 500, dojo.fx.easing.bounceOut);
			});

		});
		
	}
	
	d.NodeList.prototype.social = d.NodeList._adaptAsForEach(d.social);
	
})(dojo);

dojo.addOnLoad(function(){

	dojo.query(".social").social();

});


