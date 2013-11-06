TEST_LOCATION="http://localhost/scrapedown/"
LIVE_LOCATION="http://psd.github.com/scrapedown/"

all::	index.html test.html

init::	dependencies

#
#  run tests
#
test::
	@-mkdir -p extensions
	mocha test/run.js

#
#  build documentation
#
index.html:	index.sh bookmarklet
	./index.sh bookmarklet > $@

test.html:	index.sh test-bookmarklet
	./index.sh test-bookmarklet > $@

#
#  build bookmarklets
#
bookmarklet:	bookmarklet.js Makefile
	( echo "javascript:\\c" ; sed -e "s+location = '+location='$(LIVE_LOCATION)+" < bookmarklet.js | uglifyjs ) > $@

test-bookmarklet:	bookmarklet.js Makefile
	( echo "javascript:\\c" ; sed -e "s+location = '+location='$(TEST_LOCATION)+" -e "s/nocache = ''/nocache='?nocache='+Math.random()/" < bookmarklet.js | uglifyjs ) > $@

#
#  dependencies
#
#  TBD: move to npm, it's more than a little bit naughty these are global installs
#
dependencies:
	npm install -g uglify-js
	npm install -g mocha
	npm install should

#
#  prune back to source code
#
clean::
	rm -f bookmarklet test-bookmarklet index.html test.html
