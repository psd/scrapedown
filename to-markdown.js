/*
 *  to-markdown - convert html to markdown using the dom
 */
function toMarkdown(html) {

    // trim leading/trailing whitespace
    function trim(string) {
        return string.replace(/^[\t\r\n]+|[\t\r\n]+$/g, '');
    }

    // cleanup markdown text
    function cleanup(string) {
        string = trim(string);
        return string.replace(/\n{3,}/g, '\n\n');   // at most two consecutive blanklines
    }

    function h(node) {
        var depth = parseInt(node.nodeName.substring(1,2), 10);
        var prefix = '';
        for (var i = 0; i < depth; i++) {
            prefix += '#';
        }
        return '\n\n' + prefix + ' ' + descend(node) + '\n';
    }

    var element = {
        b: function(node) {
            return "**" + descend(node) + "**";
        },
        strong: function(node) {
            return "**" + descend(node) + "**";
        },
        em: function(node) {
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
            return trim(descend(node)) + "\n";
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

    // generate makedown from dom
    var markdown = walk(html, "");
    markdown = cleanup(markdown);
    return markdown;
};

// export
if (typeof module !== 'undefined') module.exports = toMarkdown;
