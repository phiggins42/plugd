(function(d){

	var cache = {}, connected = {},
		_liveHandler = function(e){
			// summary: Handles all the delegated clicks.
			var t = e && e.type;
			// only look through the selectors for this event
			if(t && cache[t]){
				var n = e.target, 
					nl = d.query(n), 
					a = arguments
				;
				// go over each selector
				for(var i in cache[t]){
					// :( this makes me horribly sad:
					if(nl.filter(i).length || (e.bubbles && d.query(i + " *").indexOf(n) >= 0)){
						d.forEach(cache[t][i], function(fn){
							fn.apply(n, a);
						});
					}
				}
			}
		}
	;
	
	d.connectLive = function(selector, event, fn, method){
		// summary: Delegates and event to nodes matching selector
		//
		// example:
		//	|	dojo.connectLive("a.external", "onclick", function(e){
		//	|		// if something clicked and is an anchor with class='external'
		//	|		// this will execute;
		//	|	})

		// do the hitch syntax thing:
		if(fn && method){
			fn = d.hitch(fn, method);
		}
		
		// normalize the event
		event = event && event.slice(0, 2) == "on" ? event.slice(2) : event
		if(!cache[event]){
			cache[event] = {};
		}
		
		// create an array to hold functions to call when this selector matches
		if(!cache[event][selector]){
			cache[event][selector] = [];
		}
		cache[event][selector].push(fn);

		// connect a delegated 
		if(!connected[event]){
			// fixme: some stuff needs to be on dojo.body()
			connected[event] = d.connect(d.body(), event, _liveHandler); 
		}
		
		return [selector, event, fn];
	}
	
	d.disconnectLive = function(handle){
		
		var event = handle[1], selector = handle[0], fn = handle[2];
		if(cache[event] && cache[event][selector]){
			d.forEach(cache[event][selector], function(f, i, a){
				if(fn == f){
					a.splice(i, 1);
				}
				console.log(a.length);
			});
		}
		
		console.log(event, cache[event], connected[event]);
	}

})(dojo);