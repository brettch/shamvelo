'use strict';

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

// Database module;
var dbEngine = require('./db');

// Strava module.
var strava = require('./strava');

// Util module.
var util = require('./util');


// Load application configuration.
var config = JSON.parse(fs.readFileSync(__dirname + '/appconfig.json', 'utf8'));

// Start the database.
var db = dbEngine.start(config.mongo.url);

function registerAthlete(stravaCode, callback) {
	// Exchange the temporary code for an access token.
	strava.getOAuthToken(stravaCode, function(err, payload) {
		if (err) {
			callback(err);
		} else {
			// Save athlete information to the database.
			var athlete = payload.athlete;
			var token = payload.access_token;
			db.saveAthlete(athlete, function(err) {
				if (err) callback(err);
				else db.saveAthleteToken(athlete.id, token, function(err) {
					callback(err);
				});
			});
		}
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
	db.getItems('athletes', {}, function(err, athletes) {
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
		registerAthlete(stravaCode, function(err) {
			if (err) sendErrorMessage(res, "Unable to process Strava authorisation request");
			else res.redirect('./');
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
	} else db.getItems('athletes', { id : athleteId }, function(err, athletes) {
		if (err) sendError(res);
		else db.getItems('activites', { athleteId : athleteId }, function(err, activities) {
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
