var showdown    = new require('../showdown'),
    toMarkdown = new require('../to-markdown'),
    fs          = require('fs'),
    path        = require('path'),
    should      = require('should');

/*
 *  run all the test cases in a directory
 */
var runTestsInDir = function(dir, testExpected, testActual) {

    // Load test cases from disk
    var cases = fs.readdirSync(dir).filter(function(file){
        return ~file.indexOf('.md');
    }).map(function(file){
        return file.replace('.md', '');
    });

    // Run each test case (markdown -> html)
    showdown.forEach(cases, function(test){
        it (test, function(){
            var mdpath = path.join(dir, test + '.md');
            var htmlpath = path.join(dir, test + '.html');

            var expected = testExpected(mdpath, htmlpath);
            var actual = testActual(mdpath, htmlpath);

            // Normalize line returns
            expected = expected.replace(/\r/g, '');

            // Ignore all leading/trailing whitespace
            expected = expected.trim().split('\n').map(function(x){
                return x.trim();
            }).join('\n');

            actual = actual.trim().split('\n').map(function(x){
                return x.trim();
            }).join('\n');

            // Compare
            actual.should.equal(expected);
        });
    });
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
// :: Showdown Markdown to HTML testing ::
//
describe('Showdown', function() {
    var converter = new showdown.converter();

    var showdownExpected = function(mdpath, htmlpath) {
        return fs.readFileSync(htmlpath, 'utf8');
    }

    var showdownActual = function(mdpath, htmlpath) {
        var md = fs.readFileSync(mdpath, 'utf8');
        return converter.makeHtml(md);
    }

    runTestsInDir('test/showdown', showdownExpected, showdownActual);
});
