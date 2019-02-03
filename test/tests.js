var assert = require('assert');
var WordFinder = require('../wordfinder');

describe('WordFinder', function(){
    describe('FindWords', function(){
        it('should return utter when entering 2ter', function(done){
            var wf = new WordFinder();
            wf.FindWords('2ter', 'ss100_utf8_test.txt', function(data){
                assert.equal(data.length, 1);
                assert.equal(data[0], 'utter');
                done();
            });
        });

        it('should not return utter when entering 3ter', function(done){
            var wf = new WordFinder();
            wf.FindWords('3ter', 'ss100_utf8_test.txt', function(data){
                assert.notEqual(data[0], 'utter');
                done();
            });
        })
    });

    describe('GetLetterScore', function(){
        it('should return 1 when a is entered', function(){
            var res = GetLetterScore('a');
            assert.equal(res, 1);
        });
    });

    describe('GetWordScore', function(){
        it('should return 1 when a is entered', function(){
            var res = GetWordScore('a');
            assert.equal(res, 1);
        });

        it('should return 1 when A is entered', function(){
            var res = GetWordScore('A');
            assert.equal(res, 1);
        });

        it('should return 24 when guacamole is entered', function(){
            var res = GetWordScore('A');
            assert.equal(res, 1);
        });
    });

    describe('WordSort', function(){
        it('should correctly sort words that have same number of matches and fullmatch', function(){
            var words = [{
                word: "a",
                fullMatch: true,
                matches: 4,
                score: 10
            },
            {
                word : "b",
                fullMatch : true,
                matches : 4,
                score : 11
            },
            {
                word : "c",
                fullMatch : true,
                matches : 4,
                score : 12
            },
            {
                word : "d",
                fullMatch : true,
                matches : 4,
                score : 13
            }]

            words = words.sort(wordSort);

            assert.equal(words[0].word, "d");
            assert.equal(words[1].word, "c");
            assert.equal(words[2].word, "b");
            assert.equal(words[3].word, "a");
        });

        it('should correctly sort words that have fullmatch', function(){
            var words = [{
                word: "a",
                fullMatch: true,
                matches: 3,
                score: 10
            },
            {
                word : "b",
                fullMatch : true,
                matches : 9,
                score : 11
            },
            {
                word : "c",
                fullMatch : true,
                matches : 5,
                score : 12
            },
            {
                word : "d",
                fullMatch : true,
                matches : 5,
                score : 13
            }]

            words = words.sort(wordSort);

            assert.equal(words[0].word, "b");
            assert.equal(words[1].word, "d");
            assert.equal(words[2].word, "c");
            assert.equal(words[3].word, "a");
        });

        it('should correctly sort words when one word isnt fullmatch', function(){
            var words = [{
                word: "a",
                fullMatch: true,
                matches: 3,
                score: 10
            },
            {
                word : "b",
                fullMatch : true,
                matches : 9,
                score : 11
            },
            {
                word : "c",
                fullMatch : false,
                matches : 5,
                score : 12
            },
            {
                word : "d",
                fullMatch : true,
                matches : 5,
                score : 13
            }]

            words = words.sort(wordSort);

            assert.equal(words[0].word, "b");
            assert.equal(words[1].word, "d");
            assert.equal(words[2].word, "a");
            assert.equal(words[3].word, "c");
        });

        it('should correctly sort words when one word is fullmatch', function(){
            var words = [{
                word: "a",
                fullMatch: true,
                matches: 3,
                score: 10
            },
            {
                word : "b",
                fullMatch : false,
                matches : 9,
                score : 11
            },
            {
                word : "c",
                fullMatch : false,
                matches : 5,
                score : 12
            },
            {
                word : "d",
                fullMatch : false,
                matches : 5,
                score : 13
            }]

            words = words.sort(wordSort);

            assert.equal(words[0].word, "a");
            assert.equal(words[1].word, "b");
            assert.equal(words[2].word, "d");
            assert.equal(words[3].word, "c");
        });
    });

    describe('FindScrabbleWords', function(){
        it('should return utter if tiles are u,t,t,e,r', function(done){
            var wf = new WordFinder();
            wf.FindScrabbleWords('u,t,t,e,r',null,5,5,null,'ss100_utf8_test.txt', function(data){
                assert.equal(data[0].word, 'utter');
                done();
            });
        });

        it('should not return utter if tiles are a,b,c,d,e,f', function(done){
            var wf = new WordFinder();
            wf.FindScrabbleWords('a,b,c,d,e',null,5,5,null,'ss100_utf8_test.txt', function(data){
                assert.notEqual(data[0].word, 'utter');
                done();
            });
        });

        it('should not return utter if tiles are u,t,t,e,r and maxlength is 4', function(done){
            var wf = new WordFinder();
            wf.FindScrabbleWords('u,t,t,e,r',null,4,4,null,'ss100_utf8_test.txt', function(data){
                assert.equal(data[0], undefined);
                done();
            });
        });

        it('should return utter if tiles are u,t,t,e,r and mandatory letter is u', function(done){
            var wf = new WordFinder();
            wf.FindScrabbleWords('u,t,t,e,r','u',5,5,null,'ss100_utf8_test.txt', function(data){
                assert.equal(data[0].word, 'utter');
                done();
            });
        });

        it('should not return utter if tiles are u,t,t,e,r and mandatory letter is p', function(done){
            var wf = new WordFinder();
            wf.FindScrabbleWords('u,t,t,e,r','p',5,5,null,'ss100_utf8_test.txt', function(data){
                assert.equal(data[0], undefined);
                done();
            });
        });

        it('should return utter if tiles are u,t,t,e,r and mandatory letter is u and index is 1', function(done){
            var wf = new WordFinder();
            wf.FindScrabbleWords('u,t,t,e,r','u',5,5,1,'ss100_utf8_test.txt', function(data){
                assert.equal(data[0].word, 'utter');
                done();
            });
        });

        it('should not return utter if tiles are u,t,t,e,r and mandatory letter is u and index is 2', function(done){
            var wf = new WordFinder();
            wf.FindScrabbleWords('u,t,t,e,r','u',5,5,2,'ss100_utf8_test.txt', function(data){
                assert.equal(data[0], undefined);
                done();
            });
        });

        it('should return uttal if tiles are a,t,t,u,y,o', function(done){
            var wf = new WordFinder();
            wf.FindScrabbleWords('a,t,t,u,y,o','l',15,5,5,'ss100_utf8_test.txt', function(data){
                assert.equal(data[0].word, 'uttal');
                done();
            });
        });

        it('should not return bevekas if tiles are k,d,s,n,a,v,b', function(done){
            var wf = new WordFinder();
            wf.FindScrabbleWords('k,d,s,n,a,v,b','e',15,5,null,'ss100_utf8_test.txt', function(data){
                assert.notEqual(data[0].word, 'bevekas');
                done();
            });
        });

        it('should return uttryck if tiles are u,t,t,r,*,c,k', function(done){
            var wf = new WordFinder();
            wf.FindScrabbleWords('u,t,t,r,*,c,k',null,15,5,null,'ss100_utf8_test.txt', function(data){
                assert.equal(data[0].word, 'uttryck');
                done();
            });
        });
    });
});