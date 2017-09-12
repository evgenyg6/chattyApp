var fs = require('fs');
var request = require('request');
require('./secretKey.env');
var user = username;
var token = pass;


var repoOwner = process.argv[2]; //takes in user input
var repoName = process.argv[3];

function checkArguments(owner, name) {
  if (owner === undefined || name === undefined) {
    console.log("Please enter valid an owner and name!");
  } else {
    console.log('Welcome to the GitHub Avatar Downloader!');
    getRepoContributors(repoOwner, repoName, getAvatar);
  }
}

function getRepoContributors(repoOwner, repoName, cb) {

  var requestURL = 'https://' + user + ':' + token + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var string = '';
  console.log(requestURL);
  /////////////////////////////////////////////////////
  var object = { //adds user-agent object with your ID
    url: requestURL,
    headers: {
      "User-Agent": "evgenyg6"
    }
  };
  ////////////////////////////////////////////////////
  request.get(object) //on error
    .on('error', function(err) {
      console.log(err);
    })

  .on('data', function(data) { //on data recieving
    string += data;
  })

  .on('end', function() { //on data recieve end
    console.log("<-----Response stream conplete.----->")
    string = JSON.parse(string); //pare JSON object to string
    cb(string); //callback for functions below to invoke on string
  });

}

function getAvatar(jaSON) { //loops through .avatar_url and logs

  for (i in jaSON) {
    downloadImageByURL(jaSON[i].avatar_url, 'avatars', jaSON[i].login);
  } //iterates through everyone's avatar_url, places them in folder 'avatars', itirates through each login name and assigns it to file
}

function downloadImageByURL(url, filePath, username) { // This function downloaded the files to an avatars folder and names the files to the login plus extensions of the file types (eg. png or jpeg)
  var stream = request.get(url)
    .on('error', function(err) {
      throw err;
    })
    .on('response', function(response) {
      extension = response.headers["content-type"].split("/")
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
      }
      console.log('Downloading image...');
      stream.pipe(fs.createWriteStream(filePath + "/" + username + "." + extension[1]));
    })
    .on('end', function(response) {
      console.log('Download complete.');
    })

}
checkArguments(repoOwner, repoName);