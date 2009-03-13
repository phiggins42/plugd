dojo.provide("plugd.twit");
dojo.require("dojo.string");
dojo.require("plugd.script");
(function(d){
	
	var callcount = 0, // jsonp callback counter

		// quick function to try to match url's in text and replace with anchors
		urlRe = new RegExp("([A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+)","g"),
		replaceLinks = function(str){
			return str.replace(urlRe, function(m){
				return "<a href='" + m + "' target='_blank'>" + m + "</a>";
			})
		},
		nop = function(t){ return t; },
		
		defaults = {
			// the username to pass:
			user:"phiggins",
			// the number of items to accept
			count:7,
			// the template to use
			template:"<p>${user.name}: ${text}</p>",
			replaceLinks: true
		}
	;

	d.twit = function(n, args){
		// summary: Make a node into a selection of tweets for a passed username.
		//
		// n: String|DomNode
		//		An ID or DomNode Reference to use as the root node for these tweets.
		//
		// args: Object?
		//		An object-hash of options. Overrides the defaults: user, count and template.
		//
		//	+	template:
		//			An html string with specially crafted with variables to be substituted. Each
		//			tweet is filtered through this template string, replacing ${key} with the 'key'
		//			item in the data. 
		//
		//			Typical data includes the following variables:
		//			|	* text - the value of the tweet
		//			|	* user - an object passed about the user. Eg: ${user.name} 
		//			|	* created_at - time the tweet was tweeted
		//			|	* source - how the tweet was made. eg: "From web"
		//
		//	+	user: String
		//			The username of the tweeter you wish to include
		//
		//	+	count: Integer?
		//			The number of recent items to fetch.
		//
		//	+ 	position: String?
		//			The position relative to the top node in which to place the new child.
		//			Can be any of `dojo.place` position arguments, such as "first", "last",
		//			"before", "after", "only" or "replace".
		//
		//	+	replaceLinks: Boolean?
		//			
		n = d.byId(n);
		
		var opts = d.mixin({}, defaults, args),

			callback = "__twit" + (callcount++),
			url = "http://twitter.com/status/user_timeline/" + opts.user + ".json" +
				"?count=" + opts.count  + "&callback=" + d._scopeName + ".twit." + callback,

			fix = opts.replaceLinks ? replaceLinks : nop
		;
		
		// stub the callback function onto the twit function:
		d.twit[callback] = function(data){
			d.forEach(data, function(item){
				// process the items in the response:
				d.place(fix(d.string.substitute(opts.template, item)), n, opts.position);
			});
		}
		
		d.addScript(url); 

	}
	
	// mix the twit function into NodeList:
	d.NodeList.prototype.twit = d.NodeList._adaptAsForEach(d.twit);

	// make dojo.parser recognize dojoType="dojo.Twitter" as a synonym for dojo.twit(node, { args })
	d.Twitter = function(args, n){ 
		// summary: A Class which allows a node to have a dojoType and custom attributes.
		//		Works identically to dojo.twit(node, args), though the `template` member is
		//		ignored. In the case of declaritive use, the innerHTML of the sourceNodeRef
		//		is used as the template.
		
		n = d.byId(n);
		d.twit(n, d.mixin(args, { template: n.innerHTML })); 
		d.empty(n);
	}
	d.extend(d.Twitter, defaults);
	
})(dojo);