A bookmarkelet to glean the contents of a web page as markdown.

Try it out from http://psd.github.com/scrapedown

There are other [similar things](http://fuckyeahmarkdown.com/) out there, but this aims to be open source and run client-side.

Includes code derived from the original [Readability bookmarklet](https://code.google.com/p/arc90labs-readability/), released under the Apache 2.0 licence.

Uses [domchristie/to-markdown](https://github.com/domchristie/to-markdown) to convert the simplified HTML into Markdown.

## Caveats
* Currently doesn't work with https pages (needs https hosting for the scripts).
* Readability works when it works. Might be nice to also support selecting portions of a page.
* Uses multiple scripts, guess the goal should be to build it into one script, eventually.
