dojo.provide("plugd.feature._WebForms");
dojo.require("plugd.feature");
(function(d){

    var test = d.feature.test, doc = d.doc, f = doc.createElement("input"), docElement = doc.documentElement, smile = ":)";
    
    d.forEach('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '), function(t){
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types: 
        //   http://miketaylr.com/code/input-type-attr.html
        // spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
        test("form-" + t, !!(t in f), true, true);
    });
    
    d.forEach('search tel url email datetime date month week time datetime-local number range color'.split(' '), function(t){
        test("input-" + t, function(prop){
            
            f.setAttribute('type', prop);
            var bool = f.type !== 'text';

            // chrome likes to falsely purport support, so we feed it a textual value
            // if that doesnt succeed then we know there's a custom UI
            if (bool){  

                f.value = smile;

                if (/^range$/.test(f.type) && f.style.WebkitAppearance !== undefined){

                  docElement.appendChild(f);

                  // Safari 2-4 allows the smiley as a value, despite making a slider
                  bool =  doc.defaultView.getComputedStyle && 
                          doc.defaultView.getComputedStyle(f, null).WebkitAppearance !== 'textfield' && 

                          // mobile android web browser has false positive, so must
                          // check the height to see if the widget is actually there.
                          (f.offsetHeight !== 0);

                  docElement.removeChild(f);

                } else if (/^(search|tel)$/.test(f.type)){
                  // spec doesnt define any special parsing or detectable UI 
                  //   behaviors so we pass these through as true

                  // interestingly, opera fails the earlier test, so it doesn't
                  //  even make it here.

                } else if (/^(url|email)$/.test(f.type)) {

                  // real url and email support comes with prebaked validation.
                  bool = f.checkValidity && f.checkValidity() === false;

                } else {
                  // if the upgraded input compontent rejects the :) text, we got a winner
                  bool = f.value != smile;
                }
            }

            return !!bool;
            
        }, true, true);
        
    });

})(dojo);