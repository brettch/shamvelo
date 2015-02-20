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

// MongoDB database driver.
var mongoClient = require('mongodb').MongoClient

// Strava module.
var strava = require('./strava');

// Util module.
var util = require('./util');


// Load application configuration.
var config = JSON.parse(fs.readFileSync(__dirname + '/appconfig.json', 'utf8'));

// Connect to Mongo DB.
var mongodb;
mongoClient.connect(config.mongo.url, function(err, db) {
	assert.equal(null, err);
	console.log('Connected to MongoDB');
	mongodb = db;
});

// Save or refresh an athlete.
function saveAthlete(athlete, callback) {
	// Get the documents collection
	var collection = mongodb.collection('athletes');
	// Add or update the athlete
	collection.update(
		{ id : athlete.id },
		athlete,
		{ upsert : true },
		function(err) {
			if (err) console.log('Unable to insert athlete\n' + util.stringify(err));
			else console.log('Successfully inserted athlete ' + athlete.id);
			callback(err);
		}
	);
}

// Save or refresh an athlete's token.
function saveAthleteToken(id, token, callback) {
	var collection = mongodb.collection('tokens');
	collection.update(
		{ id: id },
		{ id: id, token: token },
		{ upsert: true },
		function (err) {
			if (err) console.log('Unable to insert token\n' + util.stringify(err));
			else console.log('Successfully inserted token ' + id);
			callback(err);
		}
	);
}

// Search for items in the specified collection.
function getItems(collection, criteria, callback) {
	console.log('Searching ' + collection + ' with criteria ' + util.stringify(criteria));
	mongodb.collection(collection).find(criteria, {}).toArray(function(err, items) {
		if (err) console.log('Unable to retrieve items\n' + util.stringify(err));
		else console.log('Successfully retrieved items\n' + util.stringify(items));
		callback(err, items);
	});
}

// Refresh athlete details in our database.
function refreshAthlete(athleteId, callback) {
	console.log('Refreshing athlete ' + athleteId);
	callback(null);
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
	res.redirect(strava.getOAuthRequestAccessUrl());
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
		strava.getOAuthToken(stravaCode, function(err, payload) {
			if (err) {
				sendErrorMessage(res, "Unable to process Strava authorisation request");
			} else {
				// Save athlete information to the database.
				var athlete = payload.athlete;
				var token = payload.access_token;
				saveAthlete(athlete, function(err) {
					if (err) sendError(res);
					else saveAthleteToken(athlete.id, token, function(err) {
						if (err) sendError(res);
						else res.redirect('./');
					});
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

app.post('/athlete/:id/refresh', function(req, res) {
	var athleteId = parseInt(req.params.id);

	if (isNaN(athleteId)) {
		var description = 'Athlete identifier is missing';
		console.log(description);
		sendErrorMessage(res, description);
	} else refreshAthlete(athleteId, function(err) {
		if (err) sendError(res);
		else res.redirect('../' + athleteId);
	});
});

// Create a HTTP listener.
console.log('Creating HTTP listener');
var server = app.listen(config.express.port, function() {
	console.log('Listening on port %d', server.address().port);
});
