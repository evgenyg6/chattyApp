var request = require('request');
var GITHUB_USER = "evgenyg6";
var GITHUB_TOKEN = "fede263adbb99053d153072d57c33d756f4fffc6";
console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
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
      throw err;
    })

  .on('data', function(data) { //on data recieving
    string += data;
    console.log('Chunk Received: ', data.toString());
  })

  .on('end', function() { //on data recieve end
    console.log("<-----Response stream conplete.----->")
    string = JSON.parse(string);
    cb(string);
  });

}

function getAvatar(jaSON, imgPath) {

  for (var i = 1; i < jaSON.length; i++) {
    console.log(jaSON[i].avatar_url);
  }
}

console.log(getRepoContributors('jquery', 'jquery', getAvatar));