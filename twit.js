dojo.provide("plugd.twit");
dojo.require("dojo.string");
dojo.require("plugd.script");
(function(d, nl){
	
	var urlRe = new RegExp("([A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+)","g"),
		// quick function to try to match url's in text and replace with anchors
		replaceLinks = function(str){
			return str
				// replace direct url's in the tweet
				.replace(urlRe, function(m){
					return "<a href='" + m + "' target='_blank'>" + m + "</a>";
				})
				// and replace the @replies and references with links
				.replace(/@([\w]+)/g, function(a,m){
					return "<a href='http://twitter.com/" + m + "'>@" + m + "</a>";
				})
				// and hash tags? where does the link point to get this?
			//	.replace(/#(\w+)/g, function(a, m){
			//		return "<a href='http://search.twitter.com/?q=" + m + "'>#" + m + "</a>";
			//	})
			;
		},
		nop = function(t){ return t; },
		
		defaults = {
			// the username to pass:
			user:"phiggins",
			// the number of items to accept
			count:7,
			// the template to use
			template:"<p>${user.name}: ${text}</p>",
			replaceLinks: true,
			// other options are: friends_timeline, public_timeline
			// with some hacking, http://apiwiki.twitter.com/REST-API-Documentation
			// becomes very useful.
			timeline: "user_timeline"
		}
	;

	d.twit = function(n, args){
		// summary:
		//		Make a node into a selection of tweets for a passed username.
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
		//			|		+ name
		//			|		+ profile_image_url	
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
		//			Set false to disable auto-linking.
		//
		//	+	timeline: String?
		//			The timeline to request. Defaults to "user_timeline", and requires
		//			no authentication. It is possible to create authenticated requests
		//			though requires special considerations.
		//			
		//			(see Twitter API)[http://apiwiki.twitter.com/REST-API-Documentation]

		n = d.byId(n);
		
		var opts = d.mixin({}, defaults, args), // mix the defaults in here

			// build up the url string:
			url = "http://twitter.com/status/" + opts.timeline + "/" + opts.user + ".json" +
				"?count=" + opts.count  + "&callback=?",
			
			// handle the replacelinks option
			fix = opts.replaceLinks ? replaceLinks : nop
		;
				
		// fire!
		d.addScript(url, function(data){
			d.forEach(data, function(item){
				// process the items in the response:
				item.text = fix(item.text);
				d.place(d.string.substitute(opts.template, item), n, opts.position);
			});
		}); 

	}
	
	// mix the twit function into `dojo.NodeList`, making it available to `dojo.query`
	nl.prototype.twit = nl._adaptAsForEach(d.twit);

	// make dojo.parser recognize dojoType="dojo.Twitter" as a synonym for dojo.twit(node, { args })
	d.Twitter = function(args, n){ 
		//	summary: 
		//		A Class which allows a node to have a dojoType and custom attributes.	
		//		see `dojo.twit` for full overview. 
		//
		//	description:
		//		A Class which allows a node to have a dojoType and custom attributes.
		//		Works identically to `dojo.twit`(node, args), though the `template` member is
		//		ignored. In the case of declaritive use, the innerHTML of the sourceNodeRef (n)
		//		is used as the template.
		//	
		//	args: Object?
		//		Defaults to override
		//
		
		n = d.byId(n);
		d.twit(n, d.mixin(args, { template: n.innerHTML })); 
		d.empty(n);
	}
	// mix in the defaults into the Twitter.prototype, 
	// making the parser read them from the srcNodeRef
	d.extend(d.Twitter, defaults); 
	
})(dojo, dojo.NodeList);