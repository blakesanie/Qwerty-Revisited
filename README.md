# Qwerty, Revisited

A Node.js program that creates the optimal keyboard for the given text, and compares it to Qwerty.

## generation.js

1. Load .txt file, format string by removing all punctuation, numbers, spaces, and moving all letters to lowercase. 

    ``` javascript
    var fs = require('fs');
    var file = "test.txt";

    fs.readFile(file, 'utf8', function(err, data) {
        if (err) throw err;
        var text = data.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").replace(/[a-z]*\d+[a-z]*/gi, '').replace(/\s+/g, '').toLowerCase();
        processChars(text);
    });
    ```

2. Iterate through all characters, each time updating the [Markov Chain](http://setosa.io/ev/markov-chains/) object. The model contains the frequency of each letter and the frequency of each letter that follows it.

    ``` javascript
    var markovChain = {};

    function processChars(string) {
        for (var i = 0; i <= string.length - order; i++) {
            var gram = string.substring(i, i + order);
            var nextChar = string.charAt(i + order);
            if (!markovChain[gram]) {
                markovChain[gram] = {
                    freq : 0
                };
                markovChain[gram][nextChar] = 0;
            }
            if (!markovChain[gram][nextChar]) {
                markovChain[gram][nextChar] = 0;
            }
            markovChain[gram][nextChar]++;
            markovChain[gram]["freq"]++;
        }
        loadKeys();
    }
    ```
3. Divide letters into rows, and test each permutation of the three rows to find the configuration with the lowest probability of adjacent key presses (using Markov Chain). The final keyboard is printed.

    ``` javascript
    var topRow = [];
    var middleRow = [];
    var bottomRow = [];

    function loadKeys() {
        var mostUsed = getMostUsed(); // getMostUsed() not shown
        console.log(mostUsed);
        middleRow = mostUsed.slice(0,9);
        topRow = mostUsed.slice(9,19);
        bottomRow = mostUsed.slice(19);
        optimizeMiddleRow(); //
        optimizeTopRow();    // algorithm not shown, found in source code
        optimizeBottomRow(); //
        printKeys();     //
        printKeyArray(); // output keyboard to console
    }
    ```
Other functions can be found in the source code for generation.js

## simulation.js

1. Load .txt file, format in same way as before.

    ``` javascript
    var file = "test.txt";

    fs.readFile(file, 'utf8', function(err, data) {
        if (err) throw err;
        text = data.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").replace(/[a-z]*\d+[a-z]*/gi, '').replace(/\s+/g, '').toLowerCase();
        //getScore(text)
    });
    ```
    
2. Re-type .txt file, keeping track of each finger's position. Consecutive movements on the same hand have a weight of 1 (slow), whereas movements after switching hands have a weight of 0.5 (fast).

    ``` javascript
    var fingers = [1,2,3,4,5,5,6,7,8,1,2,3,4,4,5,5,6,7,1,2,3,4,4,5,6]; //index of finger that touches key

    function getScore(keyboard) {
        var hands = [1,1,1,1,1,1,1,1]; // 1 = home row, 0 = top, 2 = bottom
        var moves = 0;
        var lastTurnwasLeft = true;
        for (var i = 0; i < text.length; i++) {
            var char = text.charAt(i);
            var key = keyboard.indexOf(char);
            var finger = fingers[key];
            var row = 0;
            if (key > 9) {
                row = 1;
            } 
            if (key > 18) {
                row = 2;
            }
            var handIsLeft = true;
            if (finger > 4) {
                handIsLeft = false;
            }
            if (row != hands[finger]) {
                hands[finger] = row;
                if (handIsLeft == lastTurnwasLeft) {
                    moves++;
                } else {
                    moves += 0.5;
                }
            }
            lastTurnwasLeft = handIsLeft;
        }
        return moves;
    }
    ```
3. Calculate efficiency and output to console.
    ``` javascript
    var qwerty = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","z","x","c","v","b","n","m"];
    var mine = ["c","w","b","m","f","g","l","d","u","y","n","h","r","o","i","s","e","t","a","v","q","j","k","x","z","p"];
    // ^ keyboard generated after test.txt

    console.log("QWERTY: " + getScore(qwerty));
    console.log("MINE  : " + getScore(mine));
    console.log(Math.round(getScore(qwerty) / getScore(mine) * 100) + "% efficiency \n");
    ```

## Video

<iframe src="https://www.youtube.com/embed/JnN8zwT2e-M?showinfo=0&rel=0&theme=light" width="640px" height="360px" frameborder="0"></iframe>
