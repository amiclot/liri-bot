
var keys = require("./keys.js");

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

var fs = require("fs");
var action = process.argv[2];
var value = process.argv[3];
var errorSong = "The Sign";
var errorMovie = "Mr. Nobody";


var client = new Twitter(keys.twitterKeys);


var Switch = function(action, value){
	switch (action) {
		case "my-tweets":
		    twitterFeed();
		    break;

		case "spotify-this-song":
		    spotify(value);
		    break;

		case "movie-this":
		    OMDB(value);
		    break;

		case "do-what-it-says":
		    randomSearch();
		    break;
	}
};


var twitterFeed = function(){
	var tweetsLength;


	var params = {screen_name: 'hoftees'};
	client.get('statuses/user_timeline', function(error, tweets, response) {
		if(!error){

		var tweetCount = 20;

		for(var i=0; i<tweetCount; i++){
			console.log("\n----------------------------------------------------\n");
			console.log("Tweet #" + (i+1) + " created on: " + tweets[i].created_at);
			console.log("Tweet #" + (i+1) + " text: " + tweets[i].text);
			console.log("\n----------------------------------------------------\n");

		}
		
		}

	
	});
}

var spotify = function(value){
	var spotify = new Spotify({
	  id: "4b18e160cfca4a9f9d64944034827deb",
	  secret: "0e1828b1fa56480b9fc3c5ade38bd83c",
	});
	var song = value; 

	if (song == null){
    	song = 'The Sign';
    	console.log('Invalid, Enjoy this song instead: \n');
    }  
	 
	spotify.search({ type: 'track', query: song }, function(err, data) {

	  if (err) {
	  	
	    console.log('Error occurred: ' + err + '\n');
	    
	    console.log('Invalid, Enjoy this song instead: \n');
	    console.log("\n------------------------------------------\n");

	    spotify.search({ type: 'track', query: errorSong}, function(err, data) {
		 var newData = data.tracks.items[0];
		 
		 console.log("Artist: " + newData.artists[0].name);
	     console.log("Song Title: " + newData.name);
	     console.log("Album : " + newData.album.name);
	     console.log("Preview : " + newData.preview_url);
	     console.log("\n------------------------------------------\n");
	    });
	    return;

	    //returns "sign of the times" not "the sign"??? 

	  } else{

	 //console.log(JSON.stringify(data));
	 var newData = data.tracks.items[0];
	 console.log("\n------------------------------------------\n");
	 console.log("Artist: " + newData.artists[0].name);
     console.log("Song Title: " + newData.name);
     console.log("Album : " + newData.album.name);
     console.log("Preview : " + newData.preview_url);
     console.log("\n------------------------------------------\n");}

    });
	}           

var OMDB = function(value){

   
    var movieName = value;

    if (movieName == null){
    	movieName = 'Mr. Nobody';
    }
    
    var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece"
    request(url, function (error, response, body) {



    	if (error){
    console.log('error:', error); 
    console.log('statusCode:', response && response.statusCode); 
}
    //console.log('body: ', body);

	console.log("\n------------------------------------------\n");
	        var outputAll = JSON.parse(body);
	        //console.log('body: ', outputAll);
	        
        console.log("Title of the movie : " + outputAll.Title);
        console.log("Year the movie came out : " + outputAll.Year);
        console.log("IMDB Rating of the movie :" + outputAll.imdbRating);
        console.log("Rotten Tomatoes Rating of the movie : " + JSON.stringify(outputAll.Ratings[1]['Value']));
        console.log("Country where the movie was produced : " + outputAll.Country);
        console.log("Language of the movie : " + outputAll.Language);
        console.log("Plot of the movie : " + outputAll.Plot);
        console.log("Actors in the movie :" + outputAll.Actors);

    console.log("\n------------------------------------------\n");


	    });     
	}


var randomSearch = function(){
  fs.readFile('random.txt', "utf8", function(err, data){
  	if (err) {
    return console.log(err);
    }else{
	    var text = data.split(',');
	    console.log("Liri is perfoming a random search for the following task: " + text[0])
	    action = text[0];
	    value = text[1];

   		Switch(action, value);
	}

  });
}



Switch(action, value);
