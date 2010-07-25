dojo.provide("plugd.feature");
/*=====
	
	dojo.feature = function(test, omitClass){
		// summary: Returns a boolean, synchronously, to test something.
		//
		// test: String|Array
		//		A string key of something to test. Test must be added via
		//		`dojo.feature.test` of the same key.
		//		If an array, all conditions in the array/features must pass.
		//		Each item in the array is to be a string test name.
		//
		// omitClass: Boolean?
		//		Optionally skip adding a class for a feature test. 
		//		Mostly useful when immediately running a test
		//		from `dojo.feature` test by passing the `now` parameter,
		//		to ensure the test is run and a class is _never_ added.
		//		
		// example:
		//	|	if(dojo.feature("opacity")){  }
		//
		// example:
		//	|	if(dojo.feature(["opacity", "css3", "placeholder"])){
		//	|		// enviroment has opacity, css3 and input placeholder=""
		//	|	}
		//
		// returns: Boolean
		//		Or undefined if no test has been created for a given testname
		return true;
	}
	
	dojo.feature.test = function(test, testcb, now, omitClass){
		// summary: Add a test condition to this enviroment. key is the testname, 
		//
		// testcb: Function|Boolean
		//		If a function, will be run once ever to do a test. the return of
		//		this function kills the function and returns a boolean.
		//
		// now: Boolean?
		//		Immediately force the execution of this test
		//
		// omitClass: Boolean?
		//		Useful when passing a `now` boolean. Causes the test to run and
		//		skip the addition of a class name to the HTML element
		//
		// example:
		//	|	d.feature.test("opacity", function(){
		//	|		// add a node. calculate some styles. determine in here if
		//	|		// this enviorment supports "opacity", whatever the hell that means
		//	|		return true;
		//	|	});
		//
		// example:
		//	Possible to just set a boolean for the test if you've already run it
		//	though no class name will be applied to the `html` element. 
		//	|	d.feature.test("js-runs", true); 
		//
		// example:
		//	Force the immediate processing of a passed test: d.feature("somethingfun")
		//	will always return false, but only execute once, immediately upon registration
		//	passing a function will trigger `html` class name addition
		//	|	d.feature.test("somethingfun", function(){ return false; }, true);
		//
		// example:
		//	Test something, execute it immediately and skip the addition of "something" or "no-something" to the element:
		//	|	d.feature.test("something", function(){ return true; }, true, true);
		//	|	if(d.feature("something")){ 
		//	|		// no everyone can use 'something', but there will never be a classname added
		//	|	}
		return true; // LikeABoolean		
	};
	
	dojo.feature.all = function(omitClass){
		// summary: run all registered tests immediately, applying classnames and whatnot
		// omitClass: Boolean?
		//		Passed along to the test running, to avoid adding a class to the html element for the test
	};
	
	dojo.feature.list = function(){
		// summary: Get a list of the tests that have been registered, despite having run or not.
		// returns: Array
	};
	
=====*/
(function(d){
	
	var tests = {}, 
		htmlelm = d.doc.documentElement,
		feature = d.feature = function(test, omitClass){
		
			// multi means all must pass to be true:
			if(d.isArray(test)){ 
				return d.every(test, function(t){
					return feature(t, omitClass)
				}); 
			}
		
			// single test consideration:
			if(tests[test] !== true || tests[test] !== false){
				if(d.isFunction(tests[test])){
					tests[test] = !!tests[test]();
					// add a class name to the `html` element for CSS uses
					!omitClass && d.addClass(htmlelm, (!tests[test] ? "no-" : "") + test); 
				}
			}
		
			// always return something:
			return tests[test];
		}
	;
	
	feature.test = function(test, testcb, now, omitClass){
		tests[test] = testcb;
		return now && feature(test, omitClass); // LikeABoolean
	};
	
	feature.all = function(omitClass){
		for(var i in tests){ feature(i, omitClass) }
	};
	
	feature.list = function(){
		var ret = []; 
		for(var i in tests){ ret.push(i); }
		return ret; // Array
	}
	
	d.config.hasNoJsClass && d.removeClass(htmlelm, "no-js"); // but this requires people to know something ahead of time
	
	// run all tests onLoad if set to
	d.config.detectOnLoad && d.ready(d.feature, "all"); // FIXME: detectOnLoad doesn't pass along omitClass
	// ponder making the tests an obj, eg: d.feature.test("blah", { test: function(){}, omitClass:true }); ?
	
})(dojo);