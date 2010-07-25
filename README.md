# plugd

Yet another [http://dojotoolkit.org Dojo] namespace: _plugd_ is a collection of useful functionality built on and 
around Base `dojo.js` ... also known as Dojo: the missing APIs. 

PlugD requires Dojo 1.3 or higher. PlugD 0.0.3 supports Dojo 1.2.x. No promise of varied versions is made. Head always works against 
Dojo's trunk, though there may be slight inconsistencies attempting to pair Plugd > 1.5 with a Dojo < 1.5 ...
 
## About

These are experiments in extensions on Base Dojo (and probably more specifically dojo.query). 

They are new, partially untested (though just common sense variations on existing Dojo functionality), and do many things 
Dojo would not. For instance, with _plugd_ base you can write Dojo code like:

    $("p.baz")
        .appendTo("body")
        .addClass("bar")
        .onclick(function(e){
           e.target.innerHTML = "Wow, JavaScript"; 
        })
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
 
And the following methods are added to `dojo.NodeList` (what you get back from calling `dojo.query(selector)` (or `$(selector)` after 
running `dojo.conflict()`):

  * .wrap()
  * .show(), .hide(), .toggle()
  * .val()
  * .append()
  * .appendTo()
  * .create()
  * .animate()
  * .destroy()
  * .hover()
  * .end() (and stash() for private use)

As well as optionally overloading _dojo.query_ to act as a DOM-Creation function instead of just a CSS3 Selector querying engine:

    dojo.query("<a href='foo.html'>bar</a>")
        .appendTo("body")
        .addClass("baz") 
        .onclick(function(e){ ... })
    ;

... and that's just all in Base Plugd! There are other modules for HTML escaping, form overlaying, 
and other visual tricks. You can download just `base.js`, or clone the whole _plugd_ namesapce into your Dojo 
tree for all unit tests and code!

## Getting Started

Starting with _plugd_ is easy. You need Dojo, and the `base.js` file from the project.

Load them into a page:

    <script src="http://ajax.googleapis.com/ajax/libs/dojo/1.5/dojo/dojo.xd.js"></script>
    <script src="base.js"></script>

If you are new to Dojo, the [http://sitepen.com/labs/guides/?guide=DojoQuickStart SitePen QuickStart] is an excellent 
starting point for learning about Base functionality and Dojo patterns. 

Also -- because this is merely an extension of [http://dojotoolkit.org Dojo], the entire Dojo Toolkit 
ibrary of functionality is available by issuing a simple call: `dojo.require("some.Module");` - all 
the [http://dojotoolkit.org/key-links tutorials] and [http://dojocampus.org community articles] out there 
relating to Dojo > 1.0 are applicable. 

There is *nothing* that cannot be accomplished with Dojo, regardless of which API style you prefer. Start small and build up 
to what you need. 

## How can I help?

To start, try it out! Plop `base.js` into any Dojo-enabled page and play around with the API's provded. If something doesn't 
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
