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
const leaderboard2 = require('./leaderboard2');
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

  await leaderboard2.refreshAthleteSummary(athleteId);
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

async function refreshActivity(activityId, athleteId) {
  console.log(`refreshing activity ${activityId} for athlete ${athleteId}`);
  const activity = await strava.getActivity(activityId, athleteId);
  console.log('activity:', activity);
  await db.saveActivities([activity]);

  await leaderboard2.refreshAthleteSummary(athleteId);
}

async function deleteActivity(activityId) {
  console.log(`deleting activity ${activityId}`);
  const activity = await db.getItems('activities', {'id' : activityId})[0];
  await db.deleteActivity(activityId);

  if (activity) {
    await leaderboard2.refreshAthleteSummary(activity.athlete.id);
  }
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
// Parse request bodies with encoding application/json
app.use(bodyParser.json());

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
    .then(() => leaderboard2.refreshLeaderboard())
    .then(() => res.redirect('../' + athleteId))
    .catch(err => sendError(res, err));
});

// Refresh all activities.  Intended for use by a web browser.
app.post('/refreshallactivities', function(req, res) {
  refreshAllAthleteActivities()
    .then(() => leaderboard2.refreshLeaderboard())
    .then(() => res.redirect('..'))
    .catch(err => sendError(res, err));
});

// Refresh all activities.  Intended for use by a cron trigger.
app.get('/refreshallactivities', function(req, res) {
  refreshAllAthleteActivities()
    .then(() => leaderboard2.refreshLeaderboard())
    .then(() => res.send(''))
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

// Callback URL used by strava to validate subscriptions.
app.get('/strava-webhook', function(req, res) {
  console.log('req.query:', req.query);
  const hubMode = req.query['hub.mode'];
  const hubChallenge = req.query['hub.challenge'];
  // We will ignore the `hub.verify_token` parameter because we're doing anything sensitive with the request.

  if (hubMode !== 'subscribe') {
    res.status(400).send({error: `invalid hub.mode: ${hubMode}`});
    return;
  }

  res.send({
    'hub.challenge': hubChallenge
  });
});

app.post('/strava-webhook', function(req, res) {
  console.log('received strava notification:', req.body);
  const objectType = req.body.object_type;
  const aspectType = req.body.aspect_type;
  const objectId = req.body.object_id;
  const updates = req.body.updates;
  const ownerId = req.body.owner_id;
  // Update events may include an authorised=false parameter indicating that this data can no longer
  // be accessed.  In all other cases it should be assumed to be authorised.
  const authorised = !(aspectType === 'update' && updates.authorized === false);
  console.log('authorized:', authorised);

  // We can about activities that are added and removed.
  if (objectType === 'activity') {

    if ((aspectType === 'create' || aspectType === 'update') && authorised) {
      refreshActivity(objectId, ownerId)
        .then(() => leaderboard2.refreshLeaderboard())
        .then(() => console.log('activity refreshed successfully'))
        .catch(err => console.log(err));
    } else if (aspectType === 'delete' || authorised === false) {
      deleteActivity(objectId)
        .then(() => leaderboard2.refreshLeaderboard())
        .then(() => console.log('activity deleted successfully'))
        .catch(err => console.log(err));
    }
  }

  res.send({});
});

// Create a HTTP listener.
console.log('Creating HTTP listener');
var server = app.listen(process.env.PORT, function() {
  console.log('Listening on port %d', server.address().port);
});
