var WordFinder = require('./wordfinder');
var express = require('express');
var app = express();
var port = 3000;

app.use('/', express.static('public'));

app.all('/scrabbleword', function (req, res) {
    if (req.query.word && req.query.word !== '') {
        var word = req.query.word;
        var mandatoryLetter = req.query.mandatoryletter;
        var maxLength = req.query.maxlength;
        var minLength = req.query.minlength;
        var mandatoryLetterIndex = req.query.mandatoryletterindex;
        var wordFinder = new WordFinder();
        wordFinder.FindScrabbleWords(word, mandatoryLetter, maxLength, minLength, mandatoryLetterIndex, 'ss100_utf8.txt', function(words){
            if(words.length > 0)
            {
                res.json(words);
            }else{
                res.json(null);
            }
        })
    }
});

app.all('/word/:word', function (req, res) {
    if (req.params.word && req.params.word !== '') {
        var word = req.params.word;
        var wordFinder = new WordFinder();
        wordFinder.FindWords(word, 'ss100_utf8.txt', function(words){
            if(words.length > 0)
            {
                res.json(words);
            }else{
                res.json(null);
            }
        });
    }
});

app.listen(process.env.PORT || port);
console.log('listening on port ' + port + ' ...');