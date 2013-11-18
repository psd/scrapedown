TEST_LOCATION="http://localhost/scrapedown/"
LIVE_LOCATION="http://psd.github.com/scrapedown/"

MOCHA=./node_modules/mocha/bin/mocha
UGLIFY=./node_modules/uglify-js/bin/uglifyjs

all::	index.html test.html

init::	dependencies

#
#  run tests
#
test::
	@-mkdir -p extensions
	$(MOCHA) test/run.js

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
	( echo "javascript:\\c" ; sed -e "s+location = '+location='$(LIVE_LOCATION)+" < bookmarklet.js | $(UGLIFY) ) > $@

test-bookmarklet:	bookmarklet.js Makefile
	( echo "javascript:\\c" ; sed -e "s+location = '+location='$(TEST_LOCATION)+" -e "s/nocache = ''/nocache='?nocache='+Math.random()/" < bookmarklet.js | $(UGLIFY) ) > $@

#
#  dependencies
#
dependencies:
	npm install uglify-js mocha should jsdom

#
#  prune back to source code
#
clean::
	rm -f bookmarklet test-bookmarklet index.html test.html
	rm -rf node_modules extensions
