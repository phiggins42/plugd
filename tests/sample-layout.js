dojo.require("plugd.layout");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.layout.TabContainer");

// sample:
var layout = {
	id:"mainpane",
	type:"dijit.layout.BorderContainer",
	props:{
		style:"width:100%; height:100%"
	},
	children:[
		{
			type:"dijit.layout.ContentPane",
			props:{
				region:"top",
				style:"height:100px",
				content:"<h1>This is the heading<h1>"
			}
		},
		{
			type:"dijit.layout.AccordionContainer",
			props:{
				region:"left",
				style:"width:100px"
			},
			children:[
				{
					type:"dijit.layout.ContentPane",
					props:{
						title:"Pane 1",
						href:"_snippet.html"
					}
				},
				{
					type:"dijit.layout.ContentPane",
					props:{
						title:"Pane 2",
						selected:true,
						href:"_snippet.html"
					}
				}
			]
		},
		{
			type:"dijit.layout.ContentPane",
			props:{
				region:"center",
				content:"<p>Center Pane</p>"
			}
		}
	]
};

dojo.ready(function(){
	// make it. chain it even.
	var main = dojo.layout(layout).placeAt(dojo.body());
	main.startup();
	
	setTimeout(function(){
		
		dojo.xhrGet({
			url:"remote-layout.json",
			handleAs:"json",
			load:function(layout){
				main.destroyRecursive();
				main = dojo.layout(layout).placeAt(dojo.body());
				main.startup();
			}
		});
		
	}, 5000);
});
