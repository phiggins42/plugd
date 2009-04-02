dojo.provide("plugd.trigger");
(function(d){
	
	d.trigger = function(node, event){
		// summary: Trigger some event whose origin is `node`
		//
		// node: String|DomNode
		//		An ID, or DomNode reference, from which to trigger the event
		// 
		// event: String
		//		The name of the event to trigger. Can be any DOM level 2 event
		//		and can be in either form: "onclick" or "click" for instance.
		//
		// example: 
		//	|	dojo.connect(node, "onclick", function(e){ /* stuff */ });
		//	|	// later:
		//	|	dojo.trigger(node, "onclick");
		//
		// example:
		//	|	// or from within dojo.query:
		//	|	dojo.query("a").onclick(function(){}).trigger("onclick");
		//

		node = d.byId(node);
		event = event.slice(0,2) == "on" ? event.slice(2) : event;
		if(d.doc.createEvent){
			var evObj = d.doc.createEvent("HTMLEvents");
			evObj.initEvent(event, true, true);
			node.dispatchEvent(evObj);
		}else if(d.doc.createEventObject){
			node.fireEvent("on" + event);
		}
	};
	
	d.NodeList.prototype.trigger = d.NodeList._adaptAsForEach(d.trigger);
	
})(dojo);