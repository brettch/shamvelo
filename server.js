'use strict';

var assert = require('assert')

var fs = require("fs");

// Base express framework.
var express = require('express');

// Add express middleware.
// Logging
var morgan = require('morgan');
// Cookie parsing
var cookies = require('cookies');
// Request body parsing
var bodyParser = require('body-parser');
// Handlebars templating engine
var exphbs  = require('express-handlebars');

// Strava API.
var strava = require('strava-v3');

// MongoDB database driver.
var mongoClient = require('mongodb').MongoClient

// Load application configuration.
var config = JSON.parse(fs.readFileSync(__dirname + '/appconfig.json', 'utf8'));

// Connect to Mongo DB.
var mongodb;
mongoClient.connect(config.mongo.url, function(err, db) {
	assert.equal(null, err);
	console.log('Connected to MongoDB');
	mongodb = db;
});

function stringify(obj) {
	return JSON.stringify(obj, null, 2);
}

// Save a new athlete.
function saveAthlete(athlete, callback) {
	// Get the documents collection
	var collection = mongodb.collection('athletes');
	// Add or update the athlete
	collection.update(
		{ id : athlete.id },
		athlete,
		{ upsert : true },
		function(err) {
			if (err) console.log('Unable to insert athlete\n' + stringify(err));
			else console.log('Successfully inserted athlete ' + athlete.id);
			callback(err);
		}
	);
}

// Search for items in the specified collection.
function getItems(collection, criteria, callback) {
	console.log('Searching ' + collection + ' with criteria ' + stringify(criteria));
	mongodb.collection(collection).find(criteria, {}).toArray(function(err, items) {
		if (err) console.log('Unable to retrieve items\n' + stringify(err));
		else console.log('Successfully retrieved items\n' + stringify(items));
		callback(err, items);
	});
}

}

// Send an error message back to the user.
function sendErrorMessage(res, description) {
	res.render('error.handlebars', {
		error : { description : description }
	});
}

// Send an error message back to the user.
function sendError(res) {
	res.render('error.handlebars', {
		error : { description : "An unexpected error has occurred." }
	});
}

// Instantiate express app.
var app = express();

// Enable logging.
app.use(morgan('combined', {}));
// Enable cookie management for all requests.
app.use(cookies.express());
// Parse request bodies with encoding application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Register the handlebars page templating engine.
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Configure the home page to be the default.
app.get('/', function (req, res) {
	getItems('athletes', {}, function(err, athletes) {
		if (err) sendError(res);
		else res.render('home.handlebars', {
			athletes : athletes
		});
	});
});

// Initiate OAuth registration of a new Strava athlete/user.
app.get('/register', function(req, res) {
	// Redirect the browser to the Strava OAuth grant page.
	res.redirect(strava.oauth.getRequestAccessURL({}));
});

// Handle the OAuth callback from Strava, and exchange the temporary code for an access token.
app.get('/registercode', function(req, res) {
	var stravaCode = req.query.code;

	if (stravaCode == null) {
		var description = 'Query parameter "code" is missing';
		console.log(description);
		sendErrorMessage(res, description);
	} else {
		// Exchange the temporary code for an access token.
		strava.oauth.getToken(stravaCode, function(err, payload) {
			if (err) {
				console.log("Received error from getToken service:\n" + stringify(err));
				sendErrorMessage(res, "Unable to process Strava authorisation request");
			} else {
				console.log("Received oauth payload:\n" + stringify(payload));

				// Save athlete information to the database.
				var athlete = {
					id: payload.athlete.id,
					accessToken: payload.access_token,
					name: payload.athlete.firstname + ' ' + payload.athlete.lastname
				};
				saveAthlete(athlete, function(err) {
					if (err) sendError(res);
					else res.redirect('./');
				});
			}
		});
	}
});

// Display information available for a specific athlete.
app.get('/athlete/:id', function(req, res) {
	var athleteId = parseInt(req.params.id);

	if (isNaN(athleteId)) {
		var description = 'Athlete identifier is missing';
		console.log(description);
		sendErrorMessage(res, description);
	} else getItems('athletes', { id : athleteId }, function(err, athletes) {
		if (err) sendError(res);
		else getItems('activites', { athleteId : athleteId }, function(err, activities) {
			if (err) sendError(res);
			else res.render('athlete.handlebars', {
				athlete: athletes[0],
				activities: activities
			});
		});
	});
});
});

// Create a HTTP listener.
console.log('Creating HTTP listener');
var server = app.listen(config.express.port, function() {
	console.log('Listening on port %d', server.address().port);
});
