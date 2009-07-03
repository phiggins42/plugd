dojo.provide("plugd.trigger");
(function(d){

	var isfn = d.isFunction,
	
		triggerEvent = function(node, event){
			// summary: Helper for `dojo.trigger`, which handles the DOM cases. We should never
			// be here without a nodeNode reference and a string eventname.
			node = d.byId(node); 
			event = event && event.slice(0, 2) == "on" ? event.slice(2) : event;
			if(d.doc.createEvent){
				var evObj = d.doc.createEvent("HTMLEvents");
				evObj.initEvent(event, true, true);
				node.dispatchEvent(evObj);
			}else if(d.doc.createEventObject){
				node.fireEvent("on" + event);
			}
		},
	
		triggerObject = function(){
			// summary: Helper for `dojo.trigger`, which handles the Object cases.
			return d.hitch.apply(d, arguments)();
		}
	;
	
	d.trigger = function(obj, event){
		// summary: Trigger some event whose origin is `node`
		//
		// obj: String|DomNode|Object|Function
		//		An ID, or DomNode reference, from which to trigger the event.
		//		If an Object, fire the `event` in the scope of this object.
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
		// example:
		//	|	dojo.trigger(obj, "method");
		//
		// example:
		//	|	dojo.trigger(d.global, function(){ /* stuff */ });
		//

		return (isfn(obj) || isfn(event) || isfn(obj[event])) ? 
			triggerObject.apply(d, arguments) : triggerEvent(obj, event);
	};
	
	// adapt for dojo.query:
	d.NodeList.prototype.trigger = d.NodeList._adaptAsForEach(triggerEvent);
	
	// if the node.js module is available, extend trigger into that.
	if(d._Node && !d._Node.prototype.trigger){
		d.extend(d._Node, {
			trigger: function(ev){
				// summary:
				//		Fire some some event originating from this node.
				//		Only available if both the trigger and node plugin 
				//		are enabled. 
				//
				// ev: String
				//		Some string event name to fire. eg: "onclick", "submit"
				//
				// example:
				//	|	dojo.node("someAnchorId").trigger("click");
				triggerEvent(this, ev);
				return this;
			}
		});
	}
	
})(dojo);