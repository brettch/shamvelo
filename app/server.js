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

// Config module.
var config = require('./config');
// Write strava config out to file in time for loading by the Strava module.
try {
	fs.mkdirSync(__dirname + '/data');
} catch (err) {
	if (err.code != 'EEXIST') throw err;
}
fs.writeFileSync(__dirname + '/data/strava_config', JSON.stringify(config.strava));

// Database module.
var dbEngine = require('./db');

// Leaderboard module.
var leaderboardEngine = require('./leaderboard');

// Strava module.
var strava = require('./strava');

// Util module.
var util = require('./util');


// Start the database.
var db = dbEngine.start(config.mongo.url);

function registerAthlete(stravaCode, callback) {
	console.log('Registering athlete with code ' + stravaCode);
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

function registerAthleteToken(stravaToken, callback) {
	console.log('Registering athlete with token: ' + stravaToken);
	strava.getAthlete(stravaToken, function(err, athlete) {
		if (err) callback(err);
		else {
			db.saveAthlete(athlete, function(err) {
				if (err) callback(err);
				else db.saveAthleteToken(athlete.id, stravaToken, function(err) {
					callback(err);
				});
			});
		}
	});
}

// Refresh athlete details in our database.
function refreshAthlete(athleteId, callback) {
	console.log('Refreshing athlete ' + athleteId);
	db.getItems('tokens', { id : athleteId }, function(err, tokens) {
		if (err) callback(err);
		else strava.getAthlete(tokens[0].token, function(err, athlete) {
			if (err) callback(err);
			else db.saveAthlete(athlete, function(err) {
				callback(err);
			});
		});
	});
}

// Refresh an athlete's activities in our database.
function refreshAthleteActivities(athleteId, callback) {
	console.log('Refreshing athlete activities ' + athleteId);
	db.getItems('tokens', { id : athleteId }, function(err, tokens) {
		if (err) callback(err);
		else {
			var pageCallback = function(activities, pageCallbackCallback) {
				db.saveActivities(activities, function(err) {
					pageCallbackCallback(err);
				});
			}
			var finalCallback = function(err) {
				callback(err);
			}
			// Delete activities, and then do a full refresh from Strava.
			db.deleteActivities(athleteId, function(err) {
				if (err) console.log('Unable to remove activities for athlete ' + athlete.id);
				else strava.getActivities(tokens[0].token, pageCallback, finalCallback);
			});
		}
	});
}

function refreshAllAthleteActivities(callback) {
	var refreshNextAthleteActivities = function(athletes) {
		if (athletes.length > 0) {
			var athlete = athletes[0];
			refreshAthleteActivities(athlete.id, function(err) {
				if (err) console.log('Unable to refresh athlete ' + athlete.id);

				refreshNextAthleteActivities(athletes.slice(1));
			});
		} else {
			console.log('Completed refreshing all athlete activities');
			callback();
		}
	}

	console.log('Refreshing all athlete activities');
	db.getItems('athletes', {}, function(err, athletes) {
		if (err) callback(err);
		else refreshNextAthleteActivities(athletes);
	});
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

// Directly register a bearer token.  Primarily useful in a development setting.
app.get('/registertoken', function(req, res) {
	var stravaToken = req.query.token;

	if (stravaToken == null) {
		var description = 'Query parameter "token" is missing';
		console.log(description);
		sendErrorMessage(res, description);
	} else {
		registerAthleteToken(stravaToken, function(err) {
			if (err) sendErrorMessage(res, "Unable to register Strava token");
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

// Download athlete activities as a CSV.
app.get('/athlete/:id/activitiescsv', function(req, res) {
	var athleteId = parseInt(req.params.id);

	if (isNaN(athleteId)) {
		var description = 'Athlete identifier is missing';
		console.log(description);
		sendErrorMessage(res, description);
	} else db.getItems('activities', { "athlete.id" : athleteId }, function(err, activities) {
		if (err) sendError(res);
		else {
			res.set({
				'Content-Type': 'text/csv',
				'Content-Disposition': 'attachment;filename=activities-' + athleteId + '.csv'
			});
			res.write('id,start_date_local,timezone,distance,moving_time,elapsed_time,total_elevation_gain,type,average_speed,max_speed,name\n');
			for (var i = 0; i < activities.length; i++) {
				var activity = activities[i];
				res.write(
					activity.id + ',' + activity.start_date_local + ',' + activity.timezone + ','
					+ activity.distance + ',' + activity.moving_time + ',' + activity.elapsed_time + ','
					+ activity.total_elevation_gain + ',' + activity.type + ',' + activity.average_speed + ','
					+ activity.max_speed + ',' + util.csvString(activity.name) + '\n');
			}
			res.end();
		}
	});
});

// Refresh the athlete in the database.
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

// Refresh all activities in the database for the athlete.
app.post('/athlete/:id/refreshactivities', function(req, res) {
	var athleteId = parseInt(req.params.id);

	if (isNaN(athleteId)) {
		var description = 'Athlete identifier is missing';
		console.log(description);
		sendErrorMessage(res, description);
	} else refreshAthleteActivities(athleteId, function(err) {
		if (err) sendError(res);
		else res.redirect('../' + athleteId);
	});
});

// Display the leaderboard.
app.get('/leaderboard', function(req, res) {
	db.getItems('athletes', {}, function(err, athletes) {
		if (err) sendError(res);
		else db.getItems('activities', {}, function(err, activities) {
			if (err) sendError(res);
			else {
				var leaderboard = leaderboardEngine.build(athletes, activities);
				res.render('leaderboard.handlebars', {
					leaderboardjson : util.stringify(leaderboard),
					leaderboard : leaderboard
				});
			}
		});
	});
});

// Create a HTTP listener.
console.log('Creating HTTP listener');
var server = app.listen(config.express.port, function() {
	console.log('Listening on port %d', server.address().port);
});

// Set up a regular refresh of athlete activities.
setInterval(function() {
	refreshAllAthleteActivities(function() {});
}, 3600000);
