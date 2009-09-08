dojo.provide("plugd.keys");
// super magic dojo.keys overload
(function(d){
	
	// dojo.keys is an object hash of contstants like dojo.keys.ENTER
	// save them to restore in a moment
	var k = d.keys; // d._mixin({}, dojo.keys);

	// overload the dojo.keys ns
	d.keys = function(obj){
		var ret = [];
		for(var i in obj){
			ret.push(i);
		}
		return ret;
	}
	
	// for fun
	d.vals = function(obj){
		var ret = [];
		for(var i in obj){
			ret.push(obj[i]);
		}
		return ret;
	}
	
	// restore the cloned keymap onto the new function
	d.mixin(d.keys, k);
	
})(dojo);