/*
 *  to-markdown - convert html to markdown using the dom
 */
function toMarkdown(html) {

    var elements = {
        b: function(node) {
            return "**" + descend(node) + "**";
        },
        p: function(node) {
            return descend(node) + "\n";
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

        var data = node.data ? node.data : "";
        var text = "";
        var element = node.nodeName.toLowerCase();

        if (node.nodeType === 3) {
            text = data;
        } else if (node.nodeType === 1 && elements[element]) {
            text = (elements[element])(node);
        } else {
            text = descend(node);
        }

        return markdown + text;
    }

    // use the dom to parse the st
    if (typeof html === "string") {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        html = wrapper;
    }

    return walk(html, "");
};

// export
if (typeof module !== 'undefined') module.exports = toMarkdown;
