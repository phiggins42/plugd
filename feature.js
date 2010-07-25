dojo.provide("plugd.feature");
(function(d){
	
	var tests = {}, htmlelm = d.doc.documentElement;
		
	d.feature = function(test){
		// summary: Returns a boolean, synchronously to test something.
		//
		// test: String|Array
		//		A string get of something to test.
		//		If an array, all conditions in the array must pass
		//		each item in the array is to be a string test name
		//
		// example:
		//	|	if(dojo.feature("opacity")){ /* use png */ }
		//
		// example:
		//	|	if(dojo.feature(["opacity", "css3", "placeholder"])){
		//	|		// enviroment has opacity, css3 and input placeholder=""
		//	|	}
		//
		// returns: Boolean
		//		Or undefined if no test has been created for a given testname
		
		// multi means all must pass to be true:
		if(d.isArray(test)){ return d.every(test, d.feature); }
		
		// single test consideration:
		if(tests[test] !== true || tests[test] !== false){
			if(d.isFunction(tests[test])){
				tests[test] = !!tests[test]();
				// add a class name to the `html` element for CSS uses
				d.addClass(htmlelm, (!tests[test] ? "no-" : "") + test); 
			}
		}
		
		// always return something:
		return tests[test];
	}
	
	d.feature.test = function(test, testcb, now){
		// summary: Add a test condition to this enviroment. key is the testname, 
		// testcb: Function|Boolean
		//		If a function, will be run once ever to do a test. the return of
		//		this function kills the function and returns a boolean.
		// now: Boolean?
		//		Immediately force the execution of this test
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
		
		tests[test] = testcb;
		now && d.feature(test);
	}
	
	d.feature.all = function(){
		// summary: run all registered tests immediately, applying classnames and whatnot
		for(var i in tests){ d.feature(i) }
	};
	
	// one basic test, always: js is always enabled if we've run, clearly.
	d.feature.test("js", function(){ return true; }, true);
	
	// run all tests onLoad if set to
	d.config.detectOnLoad && d.ready(d.feature, "all");
	
})(dojo);