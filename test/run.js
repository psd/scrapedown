var marked    = new require('../marked'),
    toMarkdown = new require('../to-markdown'),
    fs          = require('fs'),
    path        = require('path'),
    should      = require('should');

/*
 *  dom for to-markdown
 */
document = require("jsdom").jsdom();

/*
 *  run all the test cases in a directory
 */
var runTestsInDir = function(dir, testExpected, testActual) {

    // Load test cases from disk
    var cases = fs.readdirSync(dir).filter(function(file){
        return ~file.indexOf('.html');
    }).map(function(file){
        return file.replace('.html', '');
    });

    // Run each test case (markdown -> html)
    for (var i = 0; i < cases.length; i++) {
        (function (test) {
            it (test, function() {
                var mdpath = path.join(dir, test + '.md');
                var htmlpath = path.join(dir, test + '.html');

                var expected = testExpected(mdpath, htmlpath);
                var actual = testActual(mdpath, htmlpath);

                // Normalize line-endings, leading and trailing whitespace
                expected = expected.trim().replace(/\r/g, '');
                actual = actual.trim().replace(/\r/g, '');

                // Compare
                actual.should.equal(expected);
            });
        })(cases[i]);
    }
};


//
// :: HTML to Markdown testing ::
//
describe('to-markdown', function() {
    var toMarkdownExpected = function(mdpath, htmlpath) {
        return fs.readFileSync(mdpath, 'utf8');
    }

    var toMarkdownActual = function(mdpath, htmlpath) {
        var html = fs.readFileSync(htmlpath, 'utf8');
        return toMarkdown(html);
    }

    runTestsInDir('test/to-markdown', toMarkdownExpected, toMarkdownActual);
});


//
// :: Markdown to HTML testing ::
//
describe('to-html', function() {
    var toHtmlExpected = function(mdpath, htmlpath) {
        return fs.readFileSync(htmlpath, 'utf8');
    }

    var toHtmlActual = function(mdpath, htmlpath) {
        var md = fs.readFileSync(mdpath, 'utf8');
        return marked(md);
    }

    runTestsInDir('test/to-html', toHtmlExpected, toHtmlActual);
});
