dojo.provide("plugd.parser");
// the html5 dojo-parser. only use if you can take the performance hit.
dojo.require("dojo.parser");
(function(d){
	
	var p = d.parser, op = p.parse, da = "data-", dt = "dojoType";
	d.parser.parse = function(rootNode, care){
		// summary: Identical to `dojo.parser.parse`, though defaults to
		//		the html5 data-* validation acceptance. Disable this
		//		magic by passing the `care` attribute. 
		if(!care){ 
			// find data-dojoType, and adjust to dojoType in this rootNode 
			d.query("[" + da + dt + "]", rootNode).forEach(function(n){
				dojo.attr(n, dt, dojo.attr(n, da + dt));
			});
		}
		return op.call(p, rootNode);
	}
	
})(dojo);