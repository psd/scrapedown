/*
 *  to-markdown - convert html to markdown using the dom
 */
function toMarkdown(html) {

    // normalise whitespace in markdown text
    function normalise(string) {
        return string.split('\n').map(function(line) {
                return line.trim().             // trim each line
                    replace(/[ \t]+/g, ' ');    // squash multiple spaces
            }).join('\n').                      // join them again
            replace(/\n{3,}/g, '\n\n').         // squash multiple newlines
            trim();                             // trim the result
    }

    function paragraph(string) {
        return string.replace(/\s+/g, ' ').trim();
    }

    // generators
    function h(node) {
        var depth = parseInt(node.nodeName.substring(1,2), 10);
        var prefix = '';
        for (var i = 0; i < depth; i++) {
            prefix += '#';
        }
        return '\n\n' + prefix + ' ' + descend(node) + '\n';
    }

    var element = {
        a: function(node) {
            var href = node.getAttribute('href') || "";
            var title = node.getAttribute('title') || "";
            return "[" + descend(node) + "](" + href + (title ?  ' "' + title  + '"' : "") + ")";
        },
        b: function(node) {
            return "**" + descend(node) + "**";
        },
        strong: function(node) {
            return "**" + descend(node) + "**";
        },
        code: function(node) {
            return "`" + descend(node) + "`";
        },
        del: function(node) {
            return "~~" + descend(node) + "~~";
        },
        strike: function(node) {
            return "~~" + descend(node) + "~~";
        },
        em: function(node) {
            return "_" + descend(node) + "_";
        },
        i: function(node) {
            return "_" + descend(node) + "_";
        },
        h1: h,
        h2: h,
        h3: h,
        h4: h,
        h5: h,
        h6: h,
        hr: function(node) {
            return "\n---\n";
        },
        img: function(node) {
            var alt = node.getAttribute('alt') || "";
            var src = node.getAttribute('src') || "";
            var title = node.getAttribute('title') || "";
            return "![" + alt + "](" + src + (title ?  ' "' + title  + '"' : "") + ")";
        },
        p: function(node) {
            return "\n\n" + paragraph(descend(node)) + "\n\n";
        },
        div: function(node) {
            return "\n\n" + descend(node) + "\n\n";
        }
    };

    // walk the dom tree
    function descend(node) {
        var text = "";
        node = node.firstChild;
        while (node) {
            text = text + walk(node, "");
            node = node.nextSibling;
        }
        return text;
    }

    function walk(node, markdown) {

        var type = node.nodeType
        var name = node.nodeName.toLowerCase();
        var data = node.data ? node.data : "";
        var text = "";

        if (type === 3) {
            text = data;
        } else if (type === 1 && element[name]) {
            text = (element[name])(node);
        } else {
            text = descend(node);
        }

        return markdown + text;
    }

    // convert string to dom
    if (typeof html === "string") {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        html = wrapper;
    }

    // generate markdown by walking the dom
    var markdown = walk(html, "").trim();
    markdown = normalise(markdown);
    return markdown;
};

// polyfill for trim
''.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,'')})

// export
if (typeof module !== 'undefined') module.exports = toMarkdown;
