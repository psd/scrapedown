/*
 *  Scrapedown - make a fist at turning a Web page into markdown
 */
function loadScript(src, callback, value) {
    var r = false;
    var js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = src;
    js.onload = js.onreadystatechange = function() {
        if (!r && (!this.readyState || this.readyState == 'complete')) {
          r = true;
          callback(value);
        }
    };
    document.body.appendChild(js);
}


/*
 *  daisy chain loading scripts ..
 */
loadScript(scrapedown_location + "readability.js", function () {
    readability.init(function (div) {
        loadScript(scrapedown_location + "to-markdown.js", function () {

            var text = toMarkdown(div.innerHTML);

            var textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.setAttribute('cols', 100);
            textarea.setAttribute('rows', text.split(/\n/).length);
            document.body.appendChild(textarea);
        });
    });
});
