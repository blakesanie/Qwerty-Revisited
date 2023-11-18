var fs = require("fs");
var file = "Shakespeare.txt";
var text;

var qwerty = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m"
];
var mine = [
  "w",
  "c",
  "b",
  "m",
  "f",
  "g",
  "l",
  "d",
  "u",
  "y",
  "n",
  "r",
  "h",
  "o",
  "i",
  "s",
  "e",
  "t",
  "a",
  "j",
  "q",
  "z",
  "v",
  "k",
  "x",
  "p"
];

var fingers = [
  1,
  2,
  3,
  4,
  5,
  5,
  6,
  7,
  8,
  1,
  2,
  3,
  4,
  4,
  5,
  5,
  6,
  7,
  1,
  2,
  3,
  4,
  4,
  5,
  6
];

fs.readFile(file, "utf8", function(err, data) {
  if (err) throw err;
  text = data
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .replace(/[a-z]*\d+[a-z]*/gi, "")
    .replace(/\s+/g, "")
    .toLowerCase();
  var myScore = getScore(mine);
  var qwertyScore = getScore(qwerty);
  console.log(
    "Me: " +
      myScore +
      ", " +
      " QWERTY: " +
      qwertyScore +
      ", " +
      Math.round((qwertyScore / myScore) * 100) +
      "% efficiency"
  );
});

function getScore(keyboard) {
  var hands = [1, 1, 1, 1, 1, 1, 1, 1];
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

function getScore(keyboard) {
  var hands = [1, 1, 1, 1, 1, 1, 1, 1];
  var moves = 0;
  var lastTurnwasLeft = true;
  for (var i = 0; i < text.length; i++) {
    var char = text.charAt(i);
    var key = keyboard.indexOf(char);
    var finger = fingers[key];
    var row = 0;
    if (key > 9) row = 1;

    if (key > 18) row = 2;

    var handIsLeft = true;
    if (finger > 4) handIsLeft = false;

    if (row != hands[finger]) {
      hands[finger] = row;
      if (handIsLeft == lastTurnwasLeft) moves++;
      else moves += 0.5;
    }
    lastTurnwasLeft = handIsLeft;
  }
  return moves;
}
