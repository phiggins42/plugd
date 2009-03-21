dojo.provide("plugd.escape");
// html-entities plugin:
(function(d){
	
		// two regexp functions to replace a character with an encoded entity
	var ere = /.{1}/g,
		_encodeChar = function(ch){
			return ch in d._encoding ? "&" + d._encoding[ch] + ";" : ch;	
		},
		
		// or to replace an entity match 
		dre = /&\w+;/g,
		_decodeFrag = function(frag){
			return frag in d._reverse ? d._reverse[frag] : frag;
		}
	;

	d.mixin(d,{

		// _encoding: Object
		//		An encoding map. Mix into this object and call `dojo._setupReverse`
		//		to extend the encoding/decoding scope. object is hash of key/pairs
		//		of characters and their html entity without the & or ; 
		//		Includes a minimal set of encoding entities to solve simple cases.
		_encoding:{
			"<":"lt", ">":"gt", '"':"quot", "&":"amp", "©":"copy"
		},
		
		// _reverse: Object
		//		The reverse encoding map. populated by `dojo._encoding` map,
		//		but only after `dojo._setupReverse` is called.
		_reverse:{},
				
		_encode: function(/* String */str){
			// summary: convert a string of markup into printable characters
			return str.replace(ere, _encodeChar) // String
		},
		
		_decode: function(str){
			// summary: convert an html-entity encoded string into raw markup
			return str.replace(dre, _decodeFrag);
		},
		
		html_entities: function(/* String */str, /* Boolean? */decode){
			// summary: 
			//		Convert some string into html-printable characters.
			//		Can be extended by mixing into `dojo._encoding`
			//
			// decode: Boolean?
			//		If passed, an attempt to re-encode some valid encoded string
			//		into pure text.
			//
			// example:
			//	|	var n = dojo.byId('someId');
			//	|	var str = dojo.html_entites(n.innerHTML);
			//	|	dojo.byId("aPreNode").innerHTML = str;

			// FIXME: how would you determine if you needed to encode or decode? str.match(/&\w+/)? or not.
			return d[(!decode ? "_encode" : "_decode")](str);
		}

	});
	
	d._setupReverse = function(){
		// summary: setup the reverse map for `dojo.html_entities`
		//
		// description:
		//		setup the reverse map for `dojo.html_entities`. 
		// 		call it once, and if anyone adds to the `dojo._encoding` map, they must call it again:
		//
		for(var i in d._encoding){
			d._reverse["&" + d._encoding[i] + ";"] = i + "";
		}
	}
	d._setupReverse();
	
})(dojo);
