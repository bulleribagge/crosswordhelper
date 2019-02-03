var fs = require('fs');

function WordFinder() {

}

GetWordScore = function (word){
    var sum = 0;
    word = word.toLowerCase();
    for(var i = 0; i < word.length; i++)
    {
        sum += GetLetterScore(word[i]);
    }

    return sum;
}

GetLetterScore = function (letter){
    switch(letter){
        case 'a':
        case 'd':
        case 'e':
        case 'i':
        case 'n':
        case 'r':
        case 's':
        case 't':
            return 1;
        case 'l':
        case 'g':
        case 'o':
            return 2;
        case 'b':
        case 'f':
        case 'h':
        case 'm':
        case 'k':
        case 'v':
            return 3;
        case 'p':
        case 'u':
        case 'å':
        case 'ä':
        case 'ö':
            return 4;
        case 'j':
        case 'y':
            return 7;
        case 'c':
        case 'x':
        case 'z':
            return 8;
    }
}

WordFinder.prototype.FindScrabbleWords = function (lettersStr, mandatoryLetter, maxLength, minLength, mandatoryLetterIndex, file, callback){
    var lettersCounts = {};
    var letters = lettersStr.split(',');
    letters.forEach(function(el){
        if(lettersCounts[el])
        {
            lettersCounts[el]++;
        }else{
            lettersCounts[el] = 1;
        }
    });

    fs.readFile(file, 'utf8', function (error, data) {
        var words = data.split('\n');
        var wordMatches = [];
        var localLettersCount = {};
        for(var i = 0; i < words.length; i++) 
        {
            for(prop in lettersCounts) 
            {
                if (lettersCounts.hasOwnProperty(prop)) 
                {
                    localLettersCount[prop] = lettersCounts[prop];
                }
            }

            var word = words[i];
            if(word.length <= maxLength && word.length >= minLength)
            {
                if(mandatoryLetter)
                {
                    if(mandatoryLetterIndex)
                    {
                        if(word.indexOf(mandatoryLetter) !== (parseInt(mandatoryLetterIndex) - 1))
                        {
                            continue;
                        }
                    }else if(word.indexOf(mandatoryLetter) == -1)
                    {
                        continue;
                    }
                }

                var matches = 0;
                var fullMatch = true;
                var mandatoryLetterUsed = false;
                for(var j = 0; j < word.length; j++)
                {
                    var l = word[j];
                    
                    if(letters.indexOf(l) !== -1 && localLettersCount[l] > 0)
                    {
                        matches++;
                        localLettersCount[l]--;
                    }else if(letters.indexOf('*') !== -1 && localLettersCount['*'] > 0)
                    {
                        matches++;
                        localLettersCount['*']--;
                    }
                    else if(mandatoryLetter && l !== mandatoryLetter)
                    {
                        fullMatch = false;
                    }else if(mandatoryLetter && l == mandatoryLetter && !mandatoryLetterUsed)
                    {
                        mandatoryLetterUsed = true;
                    }else if(mandatoryLetter && l == mandatoryLetter && mandatoryLetterUsed)
                    {
                        fullMatch = false;
                    }
                    else if(!mandatoryLetter)
                    {
                        fullMatch = false;
                    }
                };
                if(matches > 0)
                {
                    wordMatches.push({
                        word: word,
                        matches: matches,
                        score: GetWordScore(word),
                        fullMatch: fullMatch
                    });
                }
            }
        }
        
        wordMatches = wordMatches.sort(wordSort);
        callback(wordMatches);
    });
}

wordSort = function(a,b){

    if(!a.fullMatch && b.fullMatch)
    {
        return 1;
    }else if(a.fullMatch && !b.fullMatch)
    {
        return -1;
    }

    if(a.matches < b. matches)
    {
        return 1;
    }else if(a.matches > b.matches)
    {
        return -1;
    }

    if(a.score < b. score)
    {
        return 1;
    }else if(a.score > b.score)
    {
        return -1;
    }else
    {
        return 0;
    }
}

WordFinder.prototype.FindWords = function (word, file, callback) {
    var regex = "";
    //convert to regex
    if (/\d+/.test(word)) {
        var digits = word.match(/\d+/g);
        regex = word.replace(/\d+/g, '(\[A-Öa-ö]){$&}');
    } else {
        regex = word;
    }

    regex = '\n' + regex + '\n';

    fs.readFile(file, 'utf8', function (error, data) {
        var re = new RegExp(regex, 'gi');
        var matches = data.match(re);
        if (matches) {
            var trimmed = [];
            matches.forEach(function(element) {
                trimmed.push(element.replace(/\n/g,''));
            }, this);
            callback(trimmed);
        } else {
            callback([]);
        }
    });
};

module.exports = WordFinder;