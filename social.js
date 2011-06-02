define(["dojo", "dojo/fx/easing"], function(dojo, ease){
    
    var d = dojo;
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
				d.anim(n, { marginTop:opts.top }, 320, ease.backOut);
			});
			
			d.connect(n, "mouseleave", function(){
				d.anim(n, { marginTop:0 }, 500, ease.bounceOut);
			});

		});
		
	}
	
	d.NodeList.prototype.social = d.NodeList._adaptAsForEach(d.social);

	return d;
	
});

