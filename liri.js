//
require("dotenv").config();

const inquirer = require("inquirer");
const keys = require("./keys");
const Spotify = require("spotify-web-api-node");
const request = require("request");
const moment = require("moment");

var spotify = new Spotify(keys.spotify);

var artist;

function concertThis() {
    inquirer
        .prompt([{
            type: "input",
            message: "Please search an artist for venues:",
            name: "userArtist"
        }]).then(function (concertRes) {
            artist = concertRes.userArtist;
            let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
            // https://rest.bandsintown.com/artists/katastro/events?app_id=codingbootcamp

            request(queryUrl, function (error, response, body) {

                // If the request is successful
                if (!error && response.statusCode === 200) {

                    var result = JSON.parse(body);

                    for (var i = 0; i < result.length; i++) {
                        console.log("--------------------");
                        console.log("Venue Name: " + result[i].venue.name);
                        console.log("Venue Location: " + result[i].venue.city + ", " + result[i].venue.region);
                        console.log("Venue Date: " + moment().format(JSON.stringify(result[i].datetime), moment.ISO_8601, "MM-DD-YYYY"));
                        console.log("--------------------");
                    };
                };
            });
        });
};

function spotifyThisSong() {
    inquirer
        .prompt([{
            type: "input",
            message: "Please search a song to spotify:",
            name: "userSong"
        }]).then(function (songRes) {
            console.log("You chose a song!" + JSON.stringify(songRes));
            // let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

            // request(queryUrl, function(error, response, body) {

            // // If the request is successful
            // if (!error && response.statusCode === 200) {

            //   // Parse the body of the site and recover just the imdbRating
            //   // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            //   console.log("Upcoming venue: " + body);
            // }
            //   });

        });
};

function movieThis() {
    inquirer
        .prompt([{
            type: "input",
            message: "Please search for a desired movie:",
            name: "userMovie"
        }]).then(function (resMovie) {
            var movieName = resMovie.userMovie
            // Then run a request to the OMDB API with the movie specified
            var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
            //http://www.omdbapi.com/?t=goodfellas&y=&plot=short&apikey=trilogy

            // This line is just to help us debug against the actual URL.
            console.log(queryUrl);

            request(queryUrl, function (error, response, body) {

                // If the request is successful
                if (!error && response.statusCode === 200) {

                    // Parse the body of the site and recover just the imdbRating
                    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
                    console.log("Movie Title: " + JSON.parse(body).Title);
                    console.log("Release Year: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).Ratings[1].Value);
                    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[2].Value);
                    console.log("Country of Production: " + JSON.parse(body).Country);
                    console.log("Language of Movie: " + JSON.parse(body).Language);
                    console.log("Plot of the movie: " + JSON.parse(body).Plot);
                    console.log("Actors in the: " + JSON.parse(body).Actors);
                }
            });

        });
};

function doWhatItSays() {
    inquirer
        .prompt([{
            type: "input",
            message: "Please tell me what to do: ",
            name: "userSong"
        }]).then(function (doItRes) {
            console.log("You chose to do something!" + JSON.stringify(doItRes));
            // let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

            // request(queryUrl, function(error, response, body) {

            // // If the request is successful
            // if (!error && response.statusCode === 200) {

            //   // Parse the body of the site and recover just the imdbRating
            //   // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            //   console.log("Upcoming venue: " + body);
            // }
            //   });

        });
};

// console.log(queryUrl);

inquirer
    .prompt([
        {
            type: "list",
            message: "Choose an option to search: ",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "userOption"
        }
    ]).then(function (inqRes) {
        if (inqRes.userOption == "concert-this") {
            concertThis();
        }
        if (inqRes.userOption == "spotify-this-song") {
            console.log("You chose to spotify this song.")
            spotifyThisSong();
        }
        if (inqRes.userOption == "movie-this") {
            console.log("You chose to search this movie.")
            movieThis();
        }
        if (inqRes.userOption == "do-what-it-says") {
            console.log("You chose to do your own thing.")
            doWhatItSays();
        }
    });

// switch(action) {
//     case "concert-this":

//         request(queryUrl, function(error, response, body) {

//             // If the request is successful
//             if (!error && response.statusCode === 200) {

//               // Parse the body of the site and recover just the imdbRating
//               // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
//               console.log(JSON.parse(body).Year);
//             }
//           });//Will need to create a .then(for loop) to access multiple venues from the return array/object

//     break;
//     case "spotify-this-song":

//     break;
//     case "movie-this":

//     break;
//     case "do-what-it-says":

//     break;
// };