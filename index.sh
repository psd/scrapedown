#!/bin/sh

bookmarklet="$1"

cat <<-!
<html>
<head><title>Scrapedown</title></head>
<body>
<h1>Scrapedown</h1>
<p>Turn a Web page into <a href="http://en.wikipedia.org/wiki/Markdown">markdown</a>.</p>
!

echo "<p>Drag the <a href='"$(cat $bookmarklet)"'>scrapedown</a> bookmarklet to your bookmarks bar</p>"

cat <<-!
<p>In case of problems try selecting a portion of the page, or use the online <a href="http://www.readability.com/bookmarklets">Readabilty bookmarklet</a> first.
<p><a id="github" href="https://github.com/psd/scrapedown">Fork me on github</a>!</p>
<p>Made by <a href="http://whatfettle.com">psd</a> for <a href="http://www.gov.uk">GOV.UK</a>.</p>
</body>
</html>
!
