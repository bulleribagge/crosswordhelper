var WordFinder = require('./wordfinder');
var express = require('express');
var app = express();
var port = 3000;

app.use('/', express.static('public'));

app.all('/word/:word', function (req, res) {
    if (req.params.word && req.params.word !== '') {
        var word = req.params.word;
        console.log('word: ' + word);
        var wordFinder = new WordFinder();
        wordFinder.FindWords(word, function(words){
            if(words.length > 0)
            {
                res.json(words);
            }else{
                res.send('No matches found for: ' + word);
            }
        });
    }
});

app.listen(process.env.PORT || port);
console.log('listening on port ' + port + ' ...');    