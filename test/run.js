var showdown    = new require('../showdown'),
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
        var name = test.replace(/[-.]/g, ' ');
        it (name, function(){
            var mdpath = path.join(dir, test + '.md');
            var htmlpath = path.join(dir, test + '.html');

            var expected = testExpected(mdpath, htmlpath);
            var actual = testActual(mdpath, htmlpath);

            // Normalize line returns
            expected = expected.replace(/\r/g, '');

            // Ignore all leading/trailing whitespace
            expected = expected.split('\n').map(function(x){
                return x.trim();
            }).join('\n');
            actual = actual.split('\n').map(function(x){
                return x.trim();
            }).join('\n');

            // Convert whitespace to a visible character so that it shows up on error reports
            expected = expected.replace(/ /g, '·');
            expected = expected.replace(/\n/g, '•\n');
            actual = actual.replace(/ /g, '·');
            actual = actual.replace(/\n/g, '•\n');

            // Compare
            actual.should.equal(expected);
        });
    });
};


//
// :: Markdown to HTML testing ::
//
describe('Markdown', function() {
    var converter = new showdown.converter();

    var showdownExpected = function(mdpath, htmlpath) {
        return fs.readFileSync(htmlpath, 'utf8').trim();
    }

    var showdownActual = function(mdpath, htmlpath) {
        var md = fs.readFileSync(mdpath, 'utf8');
        return converter.makeHtml(md).trim();
    }

    runTestsInDir('test/showdown', showdownExpected, showdownActual);
});
