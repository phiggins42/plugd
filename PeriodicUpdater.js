dojo.provide("plugd.PeriodicUpdater");
(function(d){
	
	d.declare("dojo.PeriodicUpdater", null, {
		// summary: A Class used to control the periodic updating of some node
		//		
		// description:
		//		A Class used to control the periodic updating of some node.
		//
		// example:
		//	|	var it = new dojo.PeriodicUpdater({
		//	|		url:"/foo.php"
		//	|	}, "someNodeId");

		// url: String
		//		The url to fetch
		url:"",

		// method: String
		//		A HTTP verb to use for this transfer. One of "get", "post", etc. see: `dojo.xhr`
		method:"get",

/*======
		// xhrArgs: Object?
		//		An optional object to mix into the XHR request. url and load functions are not
		//		capable of being overridden, but any other standard `dojo.xhr` argument is.
		xhrArgs:null,
=====*/

		// autoStart: Boolean
		//		Does this updater start upon instantiation? True/False
		autoStart:true,

		// position: String
		//		A string to pass to `dojo.place` indicating the position within (or around)
		//		the target node to place the newly returned content. Defaults to "only", adding
		//		the content to the node directly. Valid parameters are "only", "replace", "first", "last",
		//		"before", and "after" 
		position:"only", // passed to dojo.place. 

		// interval: Integer
		//		Time (in ms) to lapse before firing a new request.
		interval:5000,

		constructor:function(/* Object */args, /* String|DomNode */node){
			// mix defaults, start maybe:
			d.mixin(this, args);
			this.node = d.byId(node);
			this.autoStart && this.start();
		},

		start: function(){
			// summary: Start this instance cycling
			//		if `autoStart` is true, updating will begin after first interval time
			//
			// example:
			//	|	var p = new dojo.PeriodicUpdater({ autoStart:false }).start();

			if(this.timer){ return; }
			this.timer = setTimeout(d.hitch(this, "_sendxhr"), this.interval);
		},

		stop: function(){
			// summary: Stop this instance from cycling
			//
			// example:
			//	Stop updates after 400 seconds
			// 	| 	var p = new dojo.PeriodicUpdater({...});
			//	|	setTimeout(dojo.hitch(p, "stop"), 400 * 1000);
			clearTimeout(this.timer);
			delete this.timer;
			return this;
		},

		_sendxhr: function(){
			// summary: triggers the XHR request
			d.xhr(this.method.toUpperCase(), d.mixin(this.xhrArgs || {},{
				url: this.url,
				load: d.hitch(this, "_setData")
			}), true /* hasbody? */);
		},

		_setData: function(/* String */data){
			// summary: The function to actually set the content to the node. 
			//		`filterData` function is called as a preprocessing step.
			// data:
			//		Response data from the XHR Request (success only)
			var fd = this.filterData(data),
				nd = d.place(fd, this.node, this.position);
				
			this.processNode(nd);
			this.stop().start();
			
		},
		
		processNode: function(/* DomNode */node){
			// summary: Post-update callback for this cycle. Passed a reference to the
			// 	node most recently placed in the DOM;
			// node: DomNode
			//		The newly created/placed node reference
		},

		filterData:function(data){
			// summary: public filter for data. adjust the string before placing in the node
			//		Override to have more granular control over the pre-processing of the
			//		XHR response.
			//
			// data: String
			//		The string response from the Current XHR Request. 
			//
			// returns: String|DomNode
			//		Filter function MUST return either valid DOM string to be created or 
			//		do a custom creation and return the top-level domNode (such as instantiating
			//		a widget, and returning it's .domNode member)
			//	
			// example:
			//	Create an updater that filters the content to be always lower case:
			//	|	new dojo.PeriodicUpdater({ 
			//	|		url:"foo.php",
			//	|		filterData:function(data){
			//	|			return data.toLowerCase();
			//	|		}
			//	|	}, "someId");
			//
			// 
			return data;
		}
	});
	
})(dojo);