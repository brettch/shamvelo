'use strict';

// Source environment from file if it's not already supplied, required for app engine
require('./config');

// Base express framework.
const express = require('express');

// Add express middleware.
// Logging
const morgan = require('morgan');
// Cookie parsing
const cookies = require('cookies');
// Request body parsing
const bodyParser = require('body-parser');
// Handlebars templating engine
const exphbs  = require('express-handlebars');

const dbEngine = require('./db');
const leaderboardEngine = require('./leaderboard');
const { from } = require('rxjs');
const { bufferCount, mergeMap } = require('rxjs/operators');
const stravaEngine = require('./strava');
const util = require('./util');

// Start the database.
const db = dbEngine.start();

// Start the Strava client.
const strava = stravaEngine.start(
  getAthleteToken,
  db.saveAthleteToken
);

async function registerAthlete(stravaCode) {
  console.log('Registering athlete with code ' + stravaCode);
  // Exchange the temporary code for an access token.
  const payload = await strava.getOAuthToken(stravaCode);
  const athlete = payload.athlete;
  const token = {
    id: athlete.id,
    expires_at: payload.expires_at,
    expires_in: payload.expires_in,
    refresh_token: payload.refresh_token,
    access_token: payload.access_token
  };
  await db.saveAthlete(athlete);
  await db.saveAthleteToken(athlete.id, token);
}

async function getAthleteToken(athleteId) {
  const tokens = await db.getItemsByKey('tokens', athleteId);
  return tokens[0];
}

// Refresh athlete details in our database.
async function refreshAthlete(athleteId) {
  console.log('Refreshing athlete ' + athleteId);
  const athlete = await strava.getAthlete(athleteId);
  await db.saveAthlete(athlete);
}

// Refresh an athlete's activities in our database.
async function refreshAthleteActivities(athleteId) {
  console.log('Refreshing athlete activities ' + athleteId);
  
  await db.deleteActivities(athleteId);
  await strava.getActivities(athleteId)
    .pipe(
      bufferCount(100),
      mergeMap(activities => from(db.saveActivities(activities)))
    )
    .toPromise();
}

async function refreshAllAthleteActivities() {
  console.log('Refreshing all athlete activities');

  const athletes = await db.getItems('athletes', {});
  await from(athletes)
    .pipe(
      mergeMap(athlete => from(refreshAthleteActivities(athlete.id)))
    )
    .toPromise();

  console.log('Completed refreshing all athlete activities');
}

async function getAthleteAndActivities(athleteId) {
  const athletesPromise = db.getItemsByKey('athletes', athleteId);
  const activitiesPromise = db.getItems('activities', {athleteId : athleteId});

  const athletes = await athletesPromise;
  const activities = await activitiesPromise;

  return {
    athlete: athletes[0],
    activities: activities
  };
}

async function getAthletesAndActivities() {
  const athletesPromise = db.getItems('athletes', {});
  const activitiesPromise = db.getItems('activities', {});

  const athletes = await athletesPromise;
  const activities = await activitiesPromise;

  return {
    athletes: athletes,
    activities: activities
  };
}

// Send an error message back to the user.
function sendErrorMessage(res, description) {
  res.render('error.handlebars', {
    error : { description : description }
  });
}

// Send an error message back to the user.
function sendError(res, err) {
  if (err) {
    console.log('Unhandled exception:\n', err);
  } else {
    console.log('Unhandled exception occurred');
  }

  res.render('error.handlebars', {
    error : { description : 'An unexpected error has occurred.' }
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
  db.getItems('athletes', {})
    .then((athletes) => res.render('home.handlebars', {
      athletes : athletes
    }))
    .catch(err => sendError(res, err));
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
    return;
  }

  registerAthlete(stravaCode)
    .then(() => res.redirect('./'))
    .catch(() => sendErrorMessage(res, 'Unable to process Strava authorisation request'));
});

// Display information available for a specific athlete.
app.get('/athlete/:id', function(req, res) {
  var athleteId = parseInt(req.params.id);

  if (isNaN(athleteId)) {
    var description = 'Athlete identifier is missing';
    console.log(description);
    sendErrorMessage(res, description);
    return;
  }

  getAthleteAndActivities(athleteId)
    .then(athleteAndActivities => res.render('athlete.handlebars', athleteAndActivities))
    .catch(err => sendError(res, err));
});

// Download athlete activities as a CSV.
app.get('/athlete/:id/activitiescsv', function(req, res) {
  var athleteId = parseInt(req.params.id);

  if (isNaN(athleteId)) {
    var description = 'Athlete identifier is missing';
    console.log(description);
    sendErrorMessage(res, description);
    return;
  }

  db.getItems('activities', { 'athlete.id' : athleteId })
    .then(activities => {
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
    })
    .catch(err => sendError(res, err));
});

// Refresh the athlete in the database.
app.post('/athlete/:id/refresh', function(req, res) {
  const athleteId = parseInt(req.params.id);

  if (isNaN(athleteId)) {
    const description = 'Athlete identifier is missing';
    console.log(description);
    sendErrorMessage(res, description);
    return;
  }

  refreshAthlete(athleteId)
    .then(() => res.redirect('../' + athleteId))
    .catch(err => sendError(res, err));
});

// Refresh all activities in the database for the athlete.
app.post('/athlete/:id/refreshactivities', function(req, res) {
  const athleteId = parseInt(req.params.id);

  if (isNaN(athleteId)) {
    const description = 'Athlete identifier is missing';
    console.log(description);
    sendErrorMessage(res, description);
    return;
  }
  
  refreshAthleteActivities(athleteId)
    .then(() => res.redirect('../' + athleteId))
    .catch(err => sendError(res, err));
});

app.post('/refreshallactivities', function(req, res) {
  refreshAllAthleteActivities()
    .then(() => res.redirect('..'))
    .catch(err => sendError(res, err));
});

// Display the leaderboard.
app.get('/leaderboard', function(req, res) {
  getAthletesAndActivities()
    .then(athletesAndActivities => leaderboardEngine.build(
      athletesAndActivities.athletes,
      athletesAndActivities.activities
    ))
    .then(leaderboard => res.render('leaderboard.handlebars', {
      leaderboard : leaderboard
    }))
    .catch(err => sendError(res, err));
});

// Display the leaderboard.
app.get('/leaderboardjson', function(req, res) {
  getAthletesAndActivities()
    .then(athletesAndActivities => leaderboardEngine.build(
      athletesAndActivities.athletes,
      athletesAndActivities.activities
    ))
    .then(leaderboard => res.render('leaderboardjson.handlebars', {
      leaderboardjson : util.stringify(leaderboard),
      leaderboard : leaderboard
    }))
    .catch(err => sendError(res, err));
});

// Create a HTTP listener.
console.log('Creating HTTP listener');
var server = app.listen(process.env.PORT, function() {
  console.log('Listening on port %d', server.address().port);
});
