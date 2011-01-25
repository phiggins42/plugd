# plugd

Yet another [http://dojotoolkit.org Dojo] namespace: _plugd_ is a collection of useful functionality built on and 
around Base `dojo.js` ... also known as Dojo: the missing APIs. 

_plugd_ requires Dojo 1.3 or higher. _plugd_ 0.0.3 supports Dojo 1.2.x. No promise of varied versions is made. Head always works against 
Dojo's trunk, though there may be slight inconsistencies attempting to pair _plugd_ > 1.5 with a Dojo < 1.5 ...
 
## About

These are experiments in extensions on Base Dojo (and probably more specifically dojo.query), and do many things 
Dojo would not. For instance, with _plugd_ base you can write Dojo code like:

    $("div.baz")
        .appendTo("body")
        .addClass("bar")
        .onclick(function(e){
           e.target.innerHTML = "Wow, JavaScript"; 
        })
        .query("bar").grab("file.html")
    ;

... while retaining the full capabilities of Dojo library. Start with the ~29k `dojo.js`, add 1k of additional 
_plugd_ magic and viola -- All the simple API's, plus the additional potential progressive power of an entire library of 
professional-grade JavaScript utilities. 

The API's found in _plugd_ are loosely based on "my favorite bits of [http://jquery.com jQuery]" ... this is **not** 
meant to be a 'compatibility shim' of any kind, it is simply the addition of functions and helpers to [http://dojotoolkit.org Dojo Base]. 

Added magic.

_plugd_ adds several convenience functions, all located in the _dojo_ namespace. For instance, by loading `base.js` into 
a page, the following new Dojo API's are made available:

  * dojo.show(), dojo.hide(), dojo.toggle()
  * dojo.conflict()
  * dojo.wrap()
  * dojo.create()
  * dojo.load()
  * dojo.qw()
  * dojo.unique(), dojo.generateId()
  * dojo.load()
  * dojo.pub(), dojo.sub()
  * dojo.forIn(), dojo.each(), dojo.all(), dojo.any(), dojo.reduce()
  * dojo.compose()
  * dojo.delay(), dojo.defer()
  * dojo.now()
  * dojo.debounce(), dojo.throttle()
 
And the following methods are added to `dojo.NodeList` (what you get back from calling `dojo.query(selector)` (or `$(selector)` after 
running `dojo.conflict()`):

  * .wrap()
  * .show(), .hide(), .toggle()
  * .append()
  * .appendTo()
  * .create()
  * .grab()
  * .size()
  * .animate()
  * .destroy()
  * .selectable()
  * .hover(), .hoverClass()
  * .end() (and stash() for private use)

As well as optionally overloading _dojo.query_ to act as a DOM-Creation function instead of just a CSS3 Selector querying engine:

    dojo.query("<a href='foo.html'>bar</a>")
        .appendTo("body")
        .addClass("baz") 
        .onclick(function(e){ ... })
    ;

... and that's just all in Base _plugd_! There are other modules for HTML escaping, form overlaying, 
and other visual tricks. You can download just `base.js`, or clone the whole _plugd_ namespace into your Dojo 
tree for all unit tests and code!

## Getting Started

Starting with _plugd_ is easy. You need Dojo, and the `base.js` file from the project.

Load them into any page:

    <script>var djConfig = { conflict:true }; // enables $</script>
    <script src="http://ajax.googleapis.com/ajax/libs/dojo/1.5/dojo/dojo.xd.js"></script>
    <script src="http://github.com/phiggins42/plugd/raw/master/base.js"></script>
    <script>
        dojo.ready(function(){
            alert("dojo and plugd are both LOADED. enjoy!");
        });
    </script>

If you are new to Dojo, the [http://sitepen.com/labs/guides/?guide=DojoQuickStart SitePen QuickStart] is an excellent 
starting point for learning about Base functionality and Dojo patterns. 

Also -- because this is merely an extension of [http://dojotoolkit.org Dojo], the entire Dojo Toolkit 
library of functionality is available by issuing a simple call: `dojo.require("some.Module");` - all 
the [http://dojotoolkit.org/key-links tutorials] and [http://dojocampus.org community articles] out there 
relating to Dojo > 1.0 are applicable. 

There is *nothing* that cannot be accomplished with Dojo, regardless of which API style you prefer. Start small and build up 
to what you need. 

## How can I help?

To start, try it out! Plop `base.js` into any Dojo-enabled page and play around with the API's provided. If something doesn't 
work as you'd expect, or some convenient function is missing, mention it in the issue tracker. This is a very young project, 
and is a great place to show off your (d)HTML-foo! 

All contributions must be covered under a [http://dojofoundation.org/about/cla Foundation CLA] to ensure IP cleanliness 
and to enable any of these functions to be potentially merged into Dojo itself. We won't know the true usefulness and 
stability of these functions without you, so play around, and leave some feedback.

## Got a plugin?

Propose it in the tracker! We'd love to collect a great deal of these small !JavaScript plugins building on Base Dojo -- if 
you have something designed with little to no external dependencies, we'd love to see it! Let us know.

## License

_plugd_ is 100% original work, and is available under the same dual New BSD / Academic Free License as Dojo - you are free
to use it under the same [http://dojotoolkit.org/license terms and conditions] of the "real" Dojo Project. 

## Additional Modules

In addition to the stable collection of functions in {{{base.js}}}, the _plugd_ namespace holds a collection of
small utility modules. Below is an overview:

  * block.js - block parts of a page. deprecated, would use dojox.widget.Standby in official Dojo repository
  * changedojo.js - modify the behavior of the Dojo namespace to become a function aliased to dojo.query
  * connectlive.js - a poor implementation of live/delegated events. deprecated, Dojo 1.6 will have an official implementation
  * crash.js - make IE crash. 
  * debugging.js - AOP advice around common Dojo APIs providing verbose debugging messages about usage.
  * escape.js - html encode and decode utilities. 
  * experimental.js - the name says it all, stay away from here.
  * exportNS.js - provides a function to export one namespace to another. Used for MooJo, which exports dojo.* onto window.*
  * feature.js - experimental feature detection framework, moved to [http://github.com/phiggins42/has.js has.js]. 
  * fixed.js - experimental position:fixed with animation
  * hover.js - provides preloading hover image states
  * keys.js - provides Object.keys and Object.vals as dojo.keys(Object) and dojo.vals(Obj) respectively
  * layout.js - create rich UI layouts from a standard JSON definition
  * magic.js - experimental. adds a Deferred-based dojo.require() and exportNS functionality
  * magicArray.js - if your iterators were too fast, and you want forIn variants of stock Array functions, use this.
  * menu.js - simple CSS ul > li type hover menu
  * node.js - provides dojo.node(id) giving access to Dojo API's and DOM Node attributes directly.
  * NodeList-data.js - provides a basic version of $().data with more cowbell, available in Dojo 1.6
  * PeriodicUpdater.js - a Class-like object mimicking Prototype's PeriodicUpdater
  * plugin.js - simple plugin registration API. not recommended. 
  * script.js - provides dojo.addScript, a simple JSONP/script injection mechanism. See dojo.io.script for robust
  * social.js - deprecated, experimental animated hovering social icon set
  * trans.js - provides basic functions available in dojo.NodeList-* in official repository
  * trigger.js - trigger DOM or functional events. experimental.
  * twit.js - sample twitter badge for reading and rendering a timeline
  * xhr.js - deprecated experimental content-handler detection
  
Each individual module is generally very small, and **heavily** commented. Dive in and experiment. 