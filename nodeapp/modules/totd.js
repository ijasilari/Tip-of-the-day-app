var fs = require('fs');

var allFiles = []; // This contains all the files we have
var nrFiles = 0; // Number of tips files
var tipsDir = '../tips/linux/'; // Path where the files reside

exports.myDateTime = function () {
  return Date();
};

exports.readTip = function (nr) {
  nr = parseInt(nr)
  let returnTip = nr % nrFiles;
  //if (nr > 0 && nr < nrFiles) {
    //returnTip = nr;
  //}

  console.log("Param " + nr + " mods to " + returnTip + " and the file to read is: " + allFiles[returnTip]);

  return exports.readFile(allFiles[returnTip]);
};

exports.scanAllFiles = function () {
  //let data = '../tips/legends';

  fs.readdir(tipsDir, function (err, res) {
    console.log(res);
    allFiles = res;
    allFiles.forEach(element => {
      console.log("File in directory: " + element)
    });
    nrFiles = allFiles.length;
    console.log("Number of files is " + nrFiles)
  })
}

exports.readFile = function (filename) {
  console.log('The file requested is' + filename)
  let filePath = tipsDir + filename;
  console.log('The path to read is' + filePath)

  return fs.readFileSync(filePath);
  // Ok: return fs.readFileSync('sample.txt');
  // Ok: return fs.readFileSync('../tips/legends/wall.txt');   
}