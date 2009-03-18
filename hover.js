// dojo.provide("plugd.hover"); // this is a feature, not a bug ...
//
//	A Simple Hover-State plugin, managing the src of an Image for rollover 
//
;(function(d, $){

	var p, cacheImage = function(/* String */src){
		// summary: A Function to place a new image instance in the DOM to preload it off-screen
		// 		Though is privately scoped here, so is of no use to you as a developer :P
		//
		// example:
		// |	cacheImage("images/bar.png");
		
		if(!p){
			// if we don't have a cache node, make it
			p = d.byId("imageCache") || d.create('div');
			// then set it offscreen, in the dom, with an id
			$(p)
				.attr("id", "imageCache")
				.style({
					position:"absolute",
					top:"-9999px"
				})
				.place("body")
			;
		}
		
		// now create the image, and set the src
		var img = d.doc.createElement('img');
		d.attr(img, "src", src);
		// stash it in the hidden node so it loads
		d.place(img, p);
		
	}

	// make the "plugin":
	d.extend(d.NodeList, {
		
		rollOver: function(/* Object? */args){
			// summary: Set up some simple hover behavior for an image
			//
			// description: 
			//		A small plugin to add a hover-state to an existing
			//		image in the dom. When the node is hovered, the src=""
			//		attribute is replaced, and restored upon leaving.
			//
			//		The alternate src="" value is stored on the node's
			//		rel="" attribute. This image is pre-loaded to avoid 
			//		any unnecessary flickering as a result of a new src=""
			//		image being downloaded.
			//
			// args: Object?
			//		Unused, but will hold any options to be passed to all
			//		hover instances in the future.
			//
			// returns: dojo.NodeList
			//		For further chaining.
			//
			// example:
			//	With following markup:
			// |	<img src="foo.png" rel="foo_over.png" />
			//
			//	Specify a query, and call .rollOver()
			// |	dojo.query("img").rollOver();
			
			
			return this.forEach(function(n){ // dojo.NodeList
				
					// grab the new url via the rel="" attribute
				var hoverImg = d.attr(n, "rel"),
				
					// make a partial function calling dojo.attr(n, "src")
					// if we call attr() we get the src, attr("something.png")
					//	will set the source. shorthand, and shrinksafe will
					// 	reduce it even more.
					attr = d.partial(d.attr, n, "src"),
					
					// get the src now, to restore later
					oldImg = attr()
				;
				
				// cache the new image in some node, so there is no flicker when they hover
				cacheImage(hoverImg);
				
				$(n)
					// setup the behavior to set the src="" attribute based on an event:
					.onmouseenter(function(){ attr(hoverImg) })
					.onmouseleave(function(){ attr(oldImg) })
				;

//	This is arguably a faster way to do the above. No NodeList instantiation needed, etc, but more bytes:
//	
//				d.connect(n, "onmouseenter", function(){
//					// on enter, set the src to the rel image
//					attr(hoverImg);
//				});
//				
//				d.connect(n, "onmouseleave", function(){
//					// on leave, set the src to the original image
//					attr(oldImg)
//				});	
				
			}); 
		}
		
	});

})(dojo, dojo.query);
