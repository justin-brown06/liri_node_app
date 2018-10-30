require("dotenv").config();

const inquirer = require("inquirer");
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const request = require("request");
const moment = require("moment");
const chalk = require("chalk");
const fs = require("fs");
const file = require("file-system");

var spotify = new Spotify(keys.spotify);

var artist;

function concertThis() {
    inquirer
        .prompt([{
            type: "input",
            message: chalk.inverse("Please search an artist for venues:"),
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
                        console.log(chalk.gray("--------------------"));
                        console.log(chalk.blueBright("Venue Name: ") + chalk.greenBright(result[i].venue.name));
                        console.log(chalk.blueBright("Venue Location: ") + chalk.greenBright(result[i].venue.city + ", " + result[i].venue.region));
                        console.log(chalk.blueBright("Venue Date: ") + chalk.greenBright(moment(result[i].datetime, moment.ISO_8601).format("MM-DD-YYYY")));
                        console.log(chalk.gray("--------------------"));
                    };
                };
            });
        });
};

function spotifyThisSong() {
    inquirer
        .prompt([{
            type: "input",
            message: chalk.inverse("Please search a song to spotify:"),
            name: "userSong"
        }]).then(function (songRes) {
            spotify
                .search({ type: 'track', query: songRes.userSong, limit: 3 })
                .then(function (response) {
                    for (var i = 0; i < response.tracks.items.length; i++) {
                        console.log(chalk.gray("--------------------"));
                        console.log(chalk.blueBright("Track Name: ") + chalk.greenBright(response.tracks.items[i].name));
                        console.log(chalk.blueBright("Artist Name: ") + chalk.greenBright(response.tracks.items[i].artists[0].name));
                        console.log(chalk.blueBright("Album Name: ") + chalk.greenBright(response.tracks.items[i].album.name));
                        console.log(chalk.blueBright("URL Sample: ") + chalk.greenBright(response.tracks.items[i].external_urls.spotify));
                        console.log(chalk.gray("--------------------"));
                    };
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
            message: chalk.inverse("Please search for a desired movie:"),
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
                    console.log(chalk.gray("--------------------"));
                    console.log(chalk.blueBright("Movie Title: ") + chalk.greenBright(JSON.parse(body).Title));
                    console.log(chalk.blueBright("Release Year: ") + chalk.greenBright(JSON.parse(body).Year));
                    console.log(chalk.blueBright("IMDB Rating: ") + chalk.greenBright(JSON.parse(body).Ratings[1].Value));
                    console.log(chalk.blueBright("Rotten Tomatoes Rating: ") + chalk.greenBright(JSON.parse(body).Ratings[2].Value));
                    console.log(chalk.blueBright("Country of Production: ") + chalk.greenBright(JSON.parse(body).Country));
                    console.log(chalk.blueBright("Language of Movie: ") + chalk.greenBright(JSON.parse(body).Language));
                    console.log(chalk.blueBright("Plot of the movie: ") + chalk.greenBright(JSON.parse(body).Plot));
                    console.log(chalk.blueBright("Actors in the: ") + chalk.greenBright(JSON.parse(body).Actors));
                    console.log(chalk.gray("--------------------"));
                };
            });

        });
};

function doWhatItSays() {
    inquirer
    fs.readFile("./random.txt", "utf8", (err, data) => {
        if (err) { console.log(err) };
        console.log(data);

        spotify
            .search({ type: 'track', query: "I Want it That Way", limit: 3 })
            .then(function (response) {
                for (var i = 0; i < response.tracks.items.length; i++) {
                    console.log(chalk.gray("--------------------"));
                    console.log(chalk.blueBright("Track Name: ") + chalk.greenBright(response.tracks.items[i].name));
                    console.log(chalk.blueBright("Artist Name: ") + chalk.greenBright(response.tracks.items[i].artists[0].name));
                    console.log(chalk.blueBright("Album Name: ") + chalk.greenBright(response.tracks.items[i].album.name));
                    console.log(chalk.blueBright("URL Sample: ") + chalk.greenBright(response.tracks.items[i].external_urls.spotify));
                    console.log(chalk.gray("--------------------"));
                };
            })
            .catch(function (err) {
                console.log(err)
            });
    });
};

inquirer
    .prompt([
        {
            type: "list",
            message: chalk.inverse("Choose an option to search: "),
            choices: [("concert-this"), "spotify-this-song", "movie-this", "do-what-it-says"],
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