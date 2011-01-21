dojo.provide("plugd.log");
(function(d){
    
/*=====
    dojo.extend(dojo.NodeList, {
        log: function(){
            // summary: Execute a `console.log` from within this NodeList.
            // example:
            //      dojo.query("a").log("links:").onclick(function(){}).log("after onclick registered");
        },
        warn: function(){
            // summary: Execute a `console.warn` from within this NodeList. 
        }
    });
=====*/
    
    d.forEach(["log", "warn", "error", "debug", "profile", "profileEnd"], function(api){
        d.NodeList.prototype[api] = function(){
            //>>excludeStart("plugdLogNoOp", kwArgs.noNodeListLogging);
            var a = d._toArray(arguments); 
            a.push(this);
            console[api].apply(console, a);
            //>>excludeEnd("plugLogNoOp");
            return this;
        }
    });
    
})(dojo);