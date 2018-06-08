require("dotenv").config();

var Twitter = require('twitter');
var request = require('request');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var fs = require('fs');
var inquirer = require('inquirer');


var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

// var input = process.argv[2];
// var inputTwo = process.argv[3];

// -----------------------------------------------------------------
inquirer
  .prompt ([
    {
      type: "list",
      message: "What would you like to do today?",
      choices: [
        "my-tweets",
        "spotify-this-song",
        "movie-this",
        "do-it"],
      name: "chooser"
    }
  ])
  .then(function(inquirerResponse) {
    var choice = inquirerResponse.chooser
// twitter---------------------------------------------------------
      if (choice === "my-tweets") {
      tweet();
      }
// spotify----------------------------------------------------------
      if (choice === "spotify-this-song") {
      inquirer.prompt([
        {
          type: "input",
          name: "userInput",
          message: "Which song would you like to spotify?"
        }
      ]).then(function(songChoice) {
        var input = choice
        var inputTwo = songChoice.userInput

        function song() {

          var track = inputTwo;
          if (!inputTwo) {
            var track = "The Sign Ace of Base";
          };

          spotify.search({ type: 'track', query: track }, function(err, data) {
            if (err) {
            return console.log('Error occurred: ' + err);
            }
        var trackStats = data.tracks.items;

        console.log("Artist(s): " + trackStats[0].artists[0].name);
        console.log("Song Name: " + trackStats[0].name);
        console.log("Preview Link: " + trackStats[0].preview_url);
        console.log("Album: " + trackStats[0].album.name);
        });
        }
        song();
      });
      }
// omdb-------------------------------------------------------------
      if (choice === "movie-this") {
        inquirer.prompt([
          {
            type: "input",
            name: "userInputTwo",
            message: "What movie do you want to research?"
          }
        ]).then(function(movieChoice) {

          var input = choice
          var userInputTwo = movieChoice.userInputTwo

          function flick() {

              var movie = userInputTwo
              if (!userInputTwo) {
                var movie = 'Mr Nobody';
              };

              request("https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

              var result = JSON.parse(body);

              console.log("Title: " + result.Title);
              console.log("Year: " + result.Year);
              console.log("IMDB: " + result.imdbRating);
              console.log("Rotton Tomatoes: " + result.Ratings[1].Value);
              console.log("Country: " + result.Country);
              console.log("Language: " + result.Language);
              console.log("Plot: " + result.Plot);
              console.log("Actors: " + result.Actors);
              });
          };
            flick();
        });
      }
// do what is says-------------------------------------------------
      if (choice === "do-it") {
      doIt();
      }

});
// twitter function ------------------------------------------------
function tweet() {

    var params = {
    screen_name: 'NoTwitForYou1',
    count: 20
    };

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if(error) throw error;
    console.log(tweets.map(x=>x.text));

    });
};
// do what it says function ----------------------------------------
function doIt(){

  fs.readFile(__dirname + "/random.txt", 'utf8', function(err, data) {
  if (err) throw err;
  var array = data.split(",");

  input = array[0];
  inputTwo = array[1];

  if (input === "spotify-this-song") {
  song();
  }
  if (input === 'my-tweets') {
  tweet();
  };
  if (input === "movie-this") {
  flick();
  };

});

};

function song() {

  var track = inputTwo;
  if (!inputTwo) {
    var track = "The Sign Ace of Base";
  };

  spotify.search({ type: 'track', query: track }, function(err, data) {
    if (err) {
    return console.log('Error occurred: ' + err);
    }
var trackStats = data.tracks.items;

console.log("Artist(s): " + trackStats[0].artists[0].name);
console.log("Song Name: " + trackStats[0].name);
console.log("Preview Link: " + trackStats[0].preview_url);
console.log("Album: " + trackStats[0].album.name);
});
}

// end of functions -----------------------------------------------

// twitter
  // if (input === 'my-tweets') {
  //   tweet();
  // };
// spotify
  // if (input === "spotify-this-song") {
  //   song();
  // };
// omdb
  // if (input === "movie-this") {
  //   flick();
  // };
// do what it says

  // if (input === "do-it") {
  //   doIt();
  // };
