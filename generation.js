var fs = require("fs");
var text;
var order = 1;
var markovChain = {};
var file = "Shakespeare.txt";
start();

function start() {
  fs.readFile(file, "utf8", function(err, data) {
    if (err) throw err;
    var text = data
      .replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " ")
      .replace(/[a-z]*\d+[a-z]*/gi, "")
      .replace(/\s+/g, "")
      .toLowerCase();
    processChars(text);
  });
}

function processChars(string) {
  for (var i = 0; i <= string.length - order; i++) {
    var gram = string.substring(i, i + order);
    var nextChar = string.charAt(i + order);
    if (!markovChain[gram]) {
      markovChain[gram] = {
        freq: 0
      };
      markovChain[gram][nextChar] = 0;
    }
    if (!markovChain[gram][nextChar]) {
      markovChain[gram][nextChar] = 0;
    }
    markovChain[gram][nextChar]++;
    markovChain[gram]["freq"]++;
  }
  console.log(markovChain);
  loadKeys();
}

function getMostUsed() {
  var ngramArray = [];
  Object.keys(markovChain).forEach(function(key) {
    var obj = {};
    obj[key] = markovChain[key];
    ngramArray.push(obj);
  });
  ngramArray = ngramArray.sort(function(a, b) {
    var aSubObj = a[Object.keys(a)[0]];
    var bSubObj = b[Object.keys(b)[0]];
    return bSubObj["freq"] - aSubObj["freq"];
  });
  ngramArray = ngramArray.map(removeInfo);
  return ngramArray;
}

var topRow = [];
var middleRow = [];
var bottomRow = [];

function loadKeys() {
  var mostUsed = getMostUsed();
  console.log(mostUsed);
  middleRow = mostUsed.slice(0, 9);
  topRow = mostUsed.slice(9, 19);
  bottomRow = mostUsed.slice(19);
  optimizeMiddleRow();
  optimizeTopRow();
  optimizeBottomRow();
  printKeys();
  printKeyArray();
}

function optimizeMiddleRow() {
  var permutations = permut(middleRow.join(""));
  middleRow = optimalPermutation(permutations);
}

function optimizeTopRow() {
  var permutations = permut(topRow.join(""));
  topRow = optimalPermutation(permutations);
}

function optimizeBottomRow() {
  var permutations = permut(bottomRow.join(""));
  bottomRow = optimalPermutation(permutations);
}

function optimalPermutation(perms) {
  var minVal = Number.MAX_VALUE;
  var minIndex;
  for (var i = 0; i < perms.length; i++) {
    var sum = 0;
    var left = middleRow.slice(0, 6);
    var right = middleRow.slice(6);
    for (var j = 0; j < left.length; j++) {
      var currentCharObj = markovChain[perms[i].charAt(j)];
      for (var k = 0; k < left.length; k++) {
        if (j != k) {
          if (currentCharObj[perms[i].charAt(k)]) {
            sum += currentCharObj[perms[i].charAt(k)];
          }
        }
      }
    }
    for (var j = 0; j < right.length; j++) {
      var currentCharObj = markovChain[perms[i].charAt(j)];
      for (var k = 0; k < right.length; k++) {
        if (j != k) {
          if (currentCharObj[perms[i].charAt(k)]) {
            sum += currentCharObj[perms[i].charAt(k)];
          }
        }
      }
    }
    if (sum < minVal) {
      minVal = sum;
      minIndex = i;
    }
    console.log(i + " / " + perms.length + " permutations");
  }
  return perms[minIndex].split("");
}

function printKeys() {
  console.log(
    "\n" +
      topRow[0] +
      topRow[1] +
      topRow[2] +
      topRow[3] +
      topRow[4] +
      topRow[5] +
      topRow[6] +
      topRow[7] +
      topRow[8] +
      topRow[9] +
      "\n" +
      middleRow[0] +
      middleRow[1] +
      middleRow[2] +
      middleRow[3] +
      middleRow[4] +
      middleRow[5] +
      middleRow[6] +
      middleRow[7] +
      middleRow[8] +
      "\n " +
      bottomRow[0] +
      bottomRow[1] +
      bottomRow[2] +
      bottomRow[3] +
      bottomRow[4] +
      bottomRow[5] +
      bottomRow[6]
  );
}

function printKeyArray() {
  var total = topRow.concat(middleRow).concat(bottomRow);
  console.log("\n" + JSON.stringify(total) + "\n");
}

function permut(string) {
  if (string.length < 2) return string; // This is our break condition

  var permutations = []; // This array will hold our permutations

  for (var i = 0; i < string.length; i++) {
    var char = string[i];

    // Cause we don't want any duplicates:
    if (string.indexOf(char) != i)
      // if char was used already
      continue; // skip it this time

    var remainingString =
      string.slice(0, i) + string.slice(i + 1, string.length); //Note: you can concat Strings via '+' in JS

    for (var subPermutation of permut(remainingString))
      permutations.push(char + subPermutation);
  }
  return permutations;
}

function removeInfo(obj) {
  return Object.keys(obj)[0];
}
