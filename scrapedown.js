/*
 *  Scrapedown - make a fist at turning a Web page into markdown
 */
function loadScript(src, callback, value) {
    var r = false;
    var js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = scrapedown_location + src;
    js.onload = js.onreadystatechange = function() {
        if (!r && (!this.readyState || this.readyState == 'complete')) {
          r = true;
          callback(value);
        }
    };
    document.body.appendChild(js);
}

scrapedown_init();

/*
 *  convert selected text, or readability page
 */
function  scrapedown_init() {
    var html = getSelectionHtml();
    loadScript("readability.js", function () {
        readability.init(function (div) {
            if (!html) {
                html = div.innerHTML;
            }
            scrapedown_html(html);
        });
    });
}

/*
 *  convert to-markdown
 */
function scrapedown_html(html) {
    loadScript("to-markdown.js", function () {
        var text = toMarkdown(html);
        scrapedown_build_gui();
        document.getElementById('inputPane').value = text;

        loadScript("marked.js", function () {
            scrapedown_render();

            // polling for changes is a little clumsy, but most reliable ..
            window.setInterval(scrapedown_render, 500);
        });
    });
}

/*
 *  create gui
 */
function scrapedown_build_gui(text) {

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
    right.appendChild(preview);

    document.body.appendChild(gui);
}


/*
 *  render preview of markdown text
 */
var lastText;
var converter;

function scrapedown_render() {

    text = document.getElementById('inputPane').value;

    if (text === lastText) {
        return;
    }
    lastText = text;

    document.getElementById('previewPane').innerHTML = marked(text);
};


/*
 *  attempt to get the selected portion of the page as HTML
 */
function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}
