dojo.require("dijit.dijit");
;(function(){
	
	var d = dojo, dij = dijit;
	
	d.extend(d.NodeList, {
		widget: {
			
			dom: function(){
				// get a list of widget's from the nodes
				//	
				// ex: dojo.query("[dojoType]").widget.dom().forEach(..).end();
				var nl = new d.NodeList();
				this.forEach(function(n){
					nl.push(dij.getEnclosingWidget(n));
				});
				return nl;
			}
		}
	});
	
})();