<?php
	
	// for this to work, the file api.html needs to be writable locally. pass a "?build" to
	// this url to trigger the generation. otherwise, work live from here. No JS ends up 
	// in the output. api.css gets inlined in the output, making api.html standalone. 
	
	$head = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
		"http://www.w3.org/TR/html4/strict.dtd">
	<html>
		<head>
			<title>Dojo Toolkit Base API Overview</title>
		
		';

	$foot = '</body></html>';

	if(!empty($_POST['body'])){
		
		$head .= "<style type='text/css'>" . file_get_contents("api.css") ."</style></head><body>";
		$page = $head . $_POST['body'] . "<div class='note'><p>Dojo " . $_POST['version'] . 
			" Docs generated " . date("Y-m-d") . "</p></div>" . $foot;
		file_put_contents("./api.html", stripslashes($page));
		die;
		
	}
	
	print $head;
	
?>

		<link rel="stylesheet" href="api.css">

		<script type="text/javascript" src="../../dojo/dojo.js"></script>
		<script src="../base.js"></script>

		<script type="text/javascript">
			dojo.conflict();
			dojo.load("dojo.fx",function(){
				
 				// a list of things to ignore in the dojo namespace (either useless, or handled specially)
				var ignore = ["keys", "NodeList", "fx", "fx.easing", "prototype"],
					useful_privates = ["_toArray", "_Animation", "_Line"]
				

				// a hash map of methods -> category
				var tags = {
					"Effects" : [
						"anim", "animateProperty", "fadeIn", "fadeOut", "animate", "fx.chain", "fx.combine", 
						"_Animation", "_Line"
					],
					
					"Ajax" : [
						"xhr", "xhrGet", "xhrPost", "xhrPut", "xhrDelete", "rawXhrPut", "rawXhrPost"
					],
					
					"Language-Helpers" : [
						"isArray", "isFunction", "isString", "isObject", "isArrayLike", "unique", "eval", "isAlien", "trim", "Deferred", "_toArray"
					],
					
					"Arrays" : [
						"forEach", "indexOf", "map", "concat", "some", "every", "lastIndexOf", "qw", "filter", "splice", "slice"
					],
					
					"Event-System" : [
						"connect", "publish", "subscribe", "pub", "sub", "unsubscribe", "disconnect", 
						"fixEvent", "stopEvent", "connectPublisher",
					],
					
					"NodeList-Events" : [
						"onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseover", "onmouseout", "onblur", 
						"onfocus", "onclick", "onchange", "onload", "onmousedown", "onmouseup", "onsubmit", "onerror", "onkeydown",
						"onkeypress", "onkeyup", "hover"
					],
					
					"NodeList-Misc" : [
						"at", "first", "last", "end", "_stash"
					],
					
					"Objects-OO" : [
						"mixin", "declare", "extend", "delegate", "hitch", "partial", "setObject", "getObject", "exists", "instantiate"
					],
					
					"Package-System" : [
						"require", "provide", "load", "requireLocalization", "requireIf", "dfdLoad",
						"moduleUrl", "requireAfterIf", "registerModulePath", "platformRequire",
						"addOnLoad", "loaded", "unloaded", "loadInit", "addOnUnload", "addOnWindowUnload", "windowUnloaded",
					],
					
					"DOM-Manipulation" : [
						"create", "wrap", "place", "byId", "query", "empty", "destroy", "generateId", "clone",
						"body", "append", "appendTo", "addContent", "adopt", "orphan"
					],
										
					"DOM-Attributes" : [
						"hasAttr", "removeAttr",
						"setSelectable", "isDescendant", "val", "attr", "coords", "marginBox", "contentBox"
					],
					
					"Colors" : [
						"Color", "colorFromArray", "colorFromString", "blendColors", "colorFromRgb", "colorFromHex"
					],
					
					"Styles-CSS" : [
						"style", "addClass", "removeClass", "toggleClass", "hasClass", "getComputedStyle", "boxModel", "show", "hide", "toggle",
						"hoverClass"
					],
					
					"JSON" : [
						"fromJson", "toJson", "toJsonIndentStr", "formToObject", "queryToObject", "formToQuery", "formToJson", "objectToQuery"
					],
					
					"Miscellaneous" : [
						"experimental", "deprecated", "config", "version", "locale", "baseUrl"
					],
					
					"Advanced-Scope" : [
						"conflict", "withDoc", "withGlobal", "setContext", "doc", "global"
					], 
					
					"Sniffing" : [
						"isBrowser", "isFF", "isKhtml", "isMoz", "isMozilla", "isIE", "isOpera", "isBrowser", "isQuirks",
						"isWebKit", "isChrome"
					]
				}

				var getSig = function(fn){
					// makup up a function signature for this object
					if(!dojo.isFunction(fn)){ return "<span class='sig'>" + (typeof fn).toLowerCase() + "</span>"; }
					return "<span class='sig'>" + fn.toString().replace(/function\s+/, "").split(")")[0] + ")" + "</span>";

				}
				
				var deslash = function(str){
					return str.replace(/-/g, " ");
				}
								
				var getTag = function(key){
					// find the first matching function name in the tagMap
					for(var i in tags){
						if(dojo.indexOf(tags[i], key) >= 0){
							return i;
						}
					}
					return "Unknown-Tag";
				}
				
				var getUl = function(tag){
					// find the UL within a <div> with this tag's id, or make it. 
					// return the UL node
					return $("#" + tag + " ul")[0] || $("<fieldset id='" +tag+ "'><div class='box'><legend>" + deslash(tag) + "</legend><ul></ul></div></fieldset>")
						.appendTo("#container").query("ul")[0];
				}
				
				for(var i in dojo){
					// scan the public dojo API, skipping stuff in the ignore list
					if( (!i.match(/^_/) || dojo.indexOf(useful_privates, i) >= 0) 
						&& dojo.indexOf(ignore, i) == -1
					){
						var ul = getUl(getTag(i));
						$("<li>d."+ i + getSig(dojo[i]) + "</li>").appendTo(ul)//.hoverClass("showApi");
					}else{
					//	console.log("skipping", i);
					}
				}
				
				for(var i in dojo.NodeList.prototype){
					// setup dojo.query API's
					if(!i.match(/^_/)){
						var ul = getUl(getTag(i));
						$("<li>$('.nodes')." + i + getSig(dojo.NodeList.prototype[i]) + "</li>").appendTo(ul)//.hoverClass("showApi");
					}
				}
				
				var tul = getUl("Effects");
				for(var i in dojo.fx){
					$("<li>d.fx." + i + getSig(dojo.fx[i]) + "</li>").appendTo(tul)//.hoverClass("showApi");
				}


				if(dojo.exists("dojo.fx.easing")){
					tul = getUl("FX-Easing");
					for(var i in dojo.fx.easing){
						$("<li>d.fx.easing." + i + "</li>").appendTo(tul)//.hoverClass("showApi");
					}
				}
				
				tul = getUl("Key-Constants");
				for(var i in dojo.keys){
					$("<li>" + i + "</li>").appendTo(tul);
				}
				
				// stolen from demos/faces/src.js
				(function(id, d){
					// don't ever let me see you doing this outside of a demo situation. there has
					// got to be a better way.
					id = d.byId(id);
					d.query("> fieldset", id).sort(function(a,b){
						var q = "ul > li", al = d.query(q, a).length, bl = d.query(q, b).length;
						return al < bl ? 0 : al > bl ? 1 : -1;
					}).forEach(function(n){
						id.appendChild(n);
					});
				})("container", dojo);
				
				$("#container > fieldset").forEach(function(n){

					var id = n.id;
					var mySize = dojo.query(n).query("li").length;
					
					$("<li><a href='#" + id + "'>" + deslash(id) + "</a> (" + mySize + ")</li>").appendTo("#nav");

					console.log(mySize, n.id || n);
					
				}).wrap("div", true).addClass("dijitInline"); // .style("float","left");
				
				window.location.href.indexOf("build") >= 0 && setTimeout(function(){
					dojo.xhrPost({ 
						url:"api-gen.php",
						content: { body: dojo.body().innerHTML, version: dojo.version.toString() },
						load: function(response){
							console.log('complete', response);
							window.location.href = "./api.html";
						}
					});
				}, 1000);
			});
		</script>
	
	<body>
		<fieldset id="top"><div>
			<legend>Dojo API CheatSheet</legend>
				<ul id="nav">
					<li><a href="#top">Top</a></li>
				</ul>
			</div>
		</fieldset>
		
		<div id="container"></div>
	</body>

</html>
