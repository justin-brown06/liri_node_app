require("dotenv").config();

const inquirer = require("inquirer");
const keys = require("./keys");
const Spotify = require("node-spotify-api");
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
            //! Example: https://rest.bandsintown.com/artists/katastro/events?app_id=codingbootcamp

            request(queryUrl, function (error, response, body) {

                // If the request is successful
                if (!error && response.statusCode === 200) {

                    var result = JSON.parse(body);

                    for (var i = 0; i < result.length; i++) {
                        console.log("--------------------");
                        console.log("Venue Name: " + result[i].venue.name);
                        console.log("Venue Location: " + result[i].venue.city + ", " + result[i].venue.region);
                        console.log("Venue Date: " + moment(result[i].datetime, moment.ISO_8601).format("MM-DD-YYYY"));
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
            spotify
                .search({ type: 'track', query: songRes.userSong, limit: 3})
                .then(function (response) {
                    console.log(response.tracks.items[0].name);
                    console.log(response.tracks.items[0].artists[0].name);
                    console.log(response.tracks.items[0].album.name);
                    console.log(response.tracks.items[0].external_urls.spotify);
                })
                .catch(function (err) {
                    console.log(err)
                });
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
            //! Example: http://www.omdbapi.com/?t=goodfellas&y=&plot=short&apikey=trilogy

            request(queryUrl, function (error, response, body) {

                // If the request is successful
                if (!error && response.statusCode === 200) {

                    // Display the information of the movie.
                    console.log("Movie Title: " + JSON.parse(body).Title);
                    console.log("Release Year: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).Ratings[1].Value);
                    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[2].Value);
                    console.log("Country of Production: " + JSON.parse(body).Country);
                    console.log("Language of Movie: " + JSON.parse(body).Language);
                    console.log("Plot of the movie: " + JSON.parse(body).Plot);
                    console.log("Actors in the: " + JSON.parse(body).Actors);
                };
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

        });
};

inquirer
    .prompt([
        {
            type: "list",
            message: "Choose an option to search: ",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "userOption"
        }
    ]).then(function (inqRes) {
        if (inqRes.userOption === "concert-this") {
            concertThis();
        }
        if (inqRes.userOption === "spotify-this-song") {
            console.log("You chose to spotify this song.")
            spotifyThisSong();
        }
        if (inqRes.userOption === "movie-this") {
            console.log("You chose to search this movie.")
            movieThis();
        }
        if (inqRes.userOption === "do-what-it-says") {
            console.log("You chose to do your own thing.")
            doWhatItSays();
        }
    });