var fs = require('fs');

function WordFinder() {

}

WordFinder.prototype.FindWords = function (word, callback) {
    var regex = "";
    //convert to regex
    if (/\d+/.test(word)) {
        var digits = word.match(/\d+/g);
        regex = word.replace(/\d+/g, '(\[A-Öa-ö]){$&}');
    } else {
        regex = word;
    }

    regex = '\n' + regex + '\n';

    fs.readFile('ss100_utf8.txt', 'utf8', function (error, data) {
        var re = new RegExp(regex, 'gi');
        var matches = data.match(re);
        if (matches) {
            var trimmed = [];
            matches.forEach(function(element) {
                trimmed.push(element.replace(/\n/g,''));
            }, this);
            console.log(trimmed.length + ' matches found');
            callback(trimmed);
        } else {
            console.log('No matches found for ' + word);
            callback([]);
        }
    });
};

module.exports = WordFinder;