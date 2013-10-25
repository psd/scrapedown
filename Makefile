TEST_LOCATION="http://localhost/scrapedown/"
LIVE_LOCATION="http://localhost/scrapedown/"

all::	bookmarklet test-bookmarklet index.html

init::	dependencies

#
#  build bookmarklets
#
bookmarklet:	bookmarklet.js Makefile
	( echo "javascript:\\c" ; sed -e "s+location = '+location='$(LIVE_LOCATION)+" < bookmarklet.js | uglifyjs ) > $@

test-bookmarklet:	bookmarklet.js Makefile
	( echo "javascript:\\c" ; sed -e "s+location = '+location='$(TEST_LOCATION)+" -e "s/nocache = ''/nocache='?nocache='+Math.random()/" < bookmarklet.js | uglifyjs ) > $@

#
#  build documentation
#
index.html:	index.sh bookmarklet.js
	./index.sh > $@

#
#  dependencies
#
dependencies:	uglifyjs 
#jquery.js underscore.js

jquery.js:
	curl -s 'http://code.jquery.com/jquery-1.7.2.min.js' > jquery.js

underscore.js:
	curl -s 'http://documentcloud.github.com/underscore/underscore-min.js' > underscore.js

uglifyjs::
	npm install -g uglify-js
	

#
#  prune back to source code
#
clean::	clobber
	rm -f jquery.js underscore.js

clobber::;
	rm -f bookmarklet test-bookmarklet index.html
