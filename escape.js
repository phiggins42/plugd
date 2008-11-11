(function(d){

	// html-entities plugin:
	
	var dre = /&\w+;/g,
		ere = /.{1}/g,

		_encodeChar = function(ch){
			return ch in d._encoding ? "&" + d._encoding[ch] + ";" : ch;	
		},

		_decodeFrag = function(frag){
			return frag in d._reverse ? d._reverse[frag] : frag;
		}
	;

	d.mixin(d,{

		_encoding:{
			// an encoding map. 
			"<":"lt", ">":"gt", '"':"quot", "&":"amp", "©":"copy"
		},
		
		_reverse:{},
				
		_encode: function(/* String */str){
			// summary: convert a string of markup into printable characters
			return str.replace(ere, _encodeChar)
		},
		
		_decode: function(str){
			return str.replace(dre, _decodeFrag);
		},
		
		html_entities: function(str, decode){
			// FIXME: how would you determine if you needed to encode or decode? str.match(/&\w+/)?
			return d[(!decode ? "_encode" : "_decode")](str);
		}

	});
	
	d._setupReverse = function(){
		// setup the reverse map:
		for(var i in d._encoding){
			d._reverse["&" + d._encoding[i] + ";"] = i + "";
		}
	}
	// call it once, and if anyone adds to the _encoding map, they must call it again:
	d._setupReverse();
	
})(dojo);
