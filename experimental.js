dojo.require("dijit.dijit");
;(function(){
	
	var d = dojo, dij = dijit;
	
	d._nop = function(){
		// summary: A global null-op function to reused in all null operations situations requiring a function
		//
		// example:
		// |	my.workAround = dojo.isIE ? function(){ /* janky */ } : dojo._nop;
		//
	}
	
	d._nopReturn = function(){
		// summary: A global no-op function, like `dojo._nop`, but for use 
		//		in `dojo.NodeList` no-op situations where the context needs
		//		to be returned for forther chaining.
		//
		// example:
		//	Create a safe-NodeList function for an IE-specific issue
		//	|	dojo.extend(dojo.NodeList, {
		//	|		janky: dojo.isIE ? function(){ /* workaround */ } : d._nopReturn
		//	|	});
		return this; // Anything
	}
	
	d.extend(d.NodeList, {
		
		widget: function(){
			// summary: Get a list of widget's from the nodes, retuning a new 
			//		NodeList of the widget's .domNode property.
			//	
			// example:
			//	|	dojo.query("[dojoType]").widget().forEach(..).end();
			var nl = new d.NodeList();
			this.forEach(function(n){
				nl.push(dij.getEnclosingWidget(n).domNode);
			});
			return nl;
		}
	});
	
})();