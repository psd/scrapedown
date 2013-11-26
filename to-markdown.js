/*
 *  to-markdown - convert html to markdown using the dom
 */
function toMarkdown(html) {

    var pre = false;

    function squash(string) {
        return string.replace(/\s+/g, ' ');
    }

    // normalise whitespace in markdown text
    function normalise(string) {
        pre = false;
        return string.split('\n').map(function(line) {
                if (line === "```") {
                    pre = !pre;
                }
                if (pre) {
                    return line;
                }
                return line.match(/^\s*\* |^\s*[1-9][0-9]*\. /) ? line : squash(line).trim();
            }).join('\n').                      // join them again
            replace(/\n{3,}/g, '\n\n').         // squash multiple newlines
            trim();                             // trim the result
    }

    // generators
    function h(node) {
        var depth = parseInt(node.nodeName.substring(1,2), 10);
        var prefix = '';
        for (var i = 0; i < depth; i++) {
            prefix += '#';
        }
        return '\n\n' + prefix + ' ' + descend(node).trim() + '\n';
    }

    function bullet_ul() {
        return "* ";
    }

    var bullet = bullet_ul;

    // headings
    var hcols = 0;
    function headings() {
        if (!hcols) {
            return "";
        }
        var headings = "|";
        while (hcols > 0) {
            headings = headings + "-|";
            hcols--;
        }
        return headings + "\n";
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
            return "\n\n" + descend(node).trim() + "\n\n";
        },
        blockquote: function(node) {
            return "\n\n> " + descend(node).trim() + "\n\n";
        },
        div: function(node) {
            return "\n\n" + descend(node).trim() + "\n\n";
        },
        pre: function(node) {
            pre = true;
            var text = "\n```\n" + descend(node).trim() + "\n```\n";
            pre = false;
            return text;

        },
        table: function(node) {
            return "\n" + descend(node).replace(/\|\s*\n+\s*\|/g, '|\n|') + "\n";
        },
        tr: function(node) {
            hcols = 0;
            var text = "| " + descend(node).trim() + "\n";
            return text + headings();
        },
        th: function(node) {
            hcols++;
            return " " + descend(node).trim() + " |";
        },
        td: function(node) {
            return " " + descend(node).trim() + " |";
        },
        ul: function(node) {
            bullet = bullet_ul;
            text = descend(node) + "\n";
            bullet = bullet_ul;
            return text;
        },
        ol: function(node) {
            var n = 0;
            bullet = function() { n = n + 1; return n + ". "; };
            text = descend(node) + "\n";
            bullet = bullet_ul;
            return text;
        },
        li: function(node) {
            return bullet() + descend(node) + "\n";
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

        if (type === 3 && !data.match(/^\s+$/)) {
            text = pre ? data : squash(data);
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
