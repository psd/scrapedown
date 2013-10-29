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
            textarea = scrapedown_build_gui();
            textarea.value = text;
        });
    });
});


/*
 *  create gui
 */
function scrapedown_build_gui(text) {

    /*
    <div id="scrapedown">
    <div id="leftContainer">
        <textarea id="inputPane" cols="80" rows="20" class="pane"></textarea> 
    </div>
    <div id="rightContainer">
        <div id="previewPane" class="pane"><noscript><h2>You'll need to enable Javascript to use this tool.</h2></noscript></div>
    </div>
    </div>
    */

    var gui = document.createElement("div");
    gui.id = "scrapedown";

    var left = document.createElement("div");
    left.id = "leftContainer";
    gui.appendChild(left);

    var textarea = document.createElement("textarea");
    textarea.id = "inputPane";
    textarea.setAttribute("class", "pane");
    textarea.setAttribute("cols", 80);
    textarea.setAttribute("rows", 20);
    left.appendChild(textarea);

    var right = document.createElement("div");
    right.id = "rightContainer";
    gui.appendChild(right);

    var preview = document.createElement("div");
    preview.setAttribute("class", "pane");
    preview.id = "previewPane";

    document.body.appendChild(gui);
    return textarea;
}
