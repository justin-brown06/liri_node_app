//
require("dotenv").config();

const inquirer = require("inquirer");
const keys = require("./keys");
const Spotify = require("spotify-web-api-node");
const request = require("request");

var spotify = new Spotify(keys.spotify);

var artist;

function concertThis() {
    inquirer
    .prompt([{
        type: "input",
        message: "Please search an artist for venues:",
        name: "userArtist"
    }]).then( function(concertRes){
        artist = concertRes.userArtist;
        let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        request(queryUrl, function(error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {
          
              // Parse the body of the site and recover just the imdbRating
              // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
              console.log("Upcoming venue: " + response.body);
            }
          });

    });
};

let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
// https://rest.bandsintown.com/artists/katastro/events?app_id=codingbootcamp

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