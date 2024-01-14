// Source environment from file if it's not already supplied, required for app engine
import './config.js';

// Base express framework.
import express from 'express';

// Add express middleware.
// Logging
import morgan from 'morgan';
// Request body parsing
import bodyParser from 'body-parser';
// Handlebars templating engine
import exphbs from 'express-handlebars';

import { start as dbStart } from './db.js';
import { build as buildLeaderboard } from './leaderboard.js';
import * as leaderboard2 from './leaderboard2/index.js';
import { from } from 'rxjs';
import { bufferCount, mergeMap } from 'rxjs/operators';
import { start as startStrava } from './strava.js';
import { csvString, stringify } from './util.js';
import { Response } from 'express-serve-static-core';

// Start the database.
const db = dbStart();

// Start the Strava client.
const strava = startStrava(
  getAthleteToken,
  db.saveAthleteToken
);

async function registerAthlete(stravaCode: string) {
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

async function getAthleteToken(athleteId: any) {
  const tokens = await db.getItemsByKey('tokens', athleteId);
  return tokens[0];
}

// Refresh athlete details in our database.
async function refreshAthlete(athleteId: any) {
  console.log('Refreshing athlete ' + athleteId);
  const athlete = await strava.getAthlete(athleteId);
  await db.saveAthlete(athlete);
}

// Refresh an athlete's activities in our database.
async function refreshAthleteActivities(athleteId: any) {
  console.log('Refreshing athlete activities ' + athleteId);
  
  await db.deleteActivities(athleteId);
  await strava.getActivities(athleteId)
    .pipe(
      bufferCount(100),
      mergeMap((activities) => from(db.saveActivities(activities)))
    )
    .toPromise();

  await leaderboard2.refreshAthleteSummary(athleteId);
}

async function refreshAllAthleteActivities() {
  console.log('Refreshing all athlete activities');

  const athletes = await db.getAllItems('athletes');
  await from(athletes)
    .pipe(
      mergeMap((athlete) => from(refreshAthleteActivities(athlete.id)))
    )
    .toPromise();

  console.log('Completed refreshing all athlete activities');
}

async function refreshActivity(activityId: any, athleteId: any) {
  console.log(`refreshing activity ${activityId} for athlete ${athleteId}`);
  const activity = await strava.getActivity(activityId, athleteId);
  console.log('activity:', activity);
  await db.saveActivities([activity]);

  await leaderboard2.refreshAthleteSummary(athleteId);
}

async function deleteActivity(activityId: any) {
  console.log(`deleting activity ${activityId}`);
  const activities = await db.getItemsWithFilter('activities', 'id', activityId);
  const activity = activities[0];
  await db.deleteActivity(activityId);

  if (activity) {
    await leaderboard2.refreshAthleteSummary(activity.athlete.id);
  }
}

async function getAthleteAndActivities(athleteId: any) {
  const athletesPromise = db.getItemsByKey('athletes', athleteId);
  const activitiesPromise = db.getItemsWithFilter('activities', 'athleteId', athleteId);

  const athletes = await athletesPromise;
  const activities = await activitiesPromise;

  return {
    athlete: athletes[0],
    activities: activities
  };
}

async function getAthletesAndActivities() {
  const athletesPromise = db.getAllItems('athletes');
  const activitiesPromise = db.getAllItems('activities');

  const athletes = await athletesPromise;
  const activities = await activitiesPromise;

  return {
    athletes: athletes,
    activities: activities
  };
}

// Send an error message back to the user.
function sendErrorMessage<B, L extends Record<string, unknown>, S extends number>(res: Response<B, L, S>, description: string) {
  res.render('error.handlebars', {
    error : { description : description }
  });
}

// Send an error message back to the user.
function sendError<B, L extends Record<string, unknown>, S extends number>(res: Response<B, L, S>, err: unknown) {
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
const app = express();

// Enable logging.
app.use(morgan('combined', {}));
// Parse request bodies with encoding application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse request bodies with encoding application/json
app.use(bodyParser.json());

// Register the handlebars page templating engine.
const hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    metresAsKilometres: (metres: any) => (metres / 1000).toFixed(1),
    metresAsMetres: (metres: any) => metres.toFixed(0),
    secondsAsHours: (seconds: any) => (seconds / 3600).toFixed(1),
    metresPerSecondAsKmh: (mps: any) => (mps * 3.6).toFixed(1)
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Serve static content.
app.use('/static', express.static('static'));

// Configure the home page to be the default.
app.get('/', function (_, res) {
  db.getAllItems('athletes')
    .then((athletes) => res.render('home.handlebars', {
      athletes : athletes
    }))
    .catch((err) => sendError(res, err));
});

// Initiate OAuth registration of a new Strava athlete/user.
app.get('/register', function(_, res) {
  // Redirect the browser to the Strava OAuth grant page.
  res.redirect(strava.getOAuthRequestAccessUrl());
});

// Handle the OAuth callback from Strava, and exchange the temporary code for an access token.
app.get('/registercode', function(req, res) {
  const stravaCode = req.query.code;

  if (stravaCode == null) {
    const description = 'Query parameter "code" is missing';
    console.log(description);
    sendErrorMessage(res, description);
    return;
  }

  if (typeof stravaCode !== "string") {
    const description = 'Query parameter "code" does not contain a string';
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
  const athleteId = parseInt(req.params.id);

  if (isNaN(athleteId)) {
    const description = 'Athlete identifier is missing';
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
  const athleteId = parseInt(req.params.id);

  if (isNaN(athleteId)) {
    const description = 'Athlete identifier is missing';
    console.log(description);
    sendErrorMessage(res, description);
    return;
  }

  db.getItemsWithFilter('activities', 'athlete.id', athleteId)
    .then((activities) => {
      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment;filename=activities-' + athleteId + '.csv'
      });
      res.write('id,start_date_local,timezone,distance,moving_time,elapsed_time,total_elevation_gain,type,average_speed,max_speed,name\n');
      for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];
        res.write(
          activity.id + ',' + activity.start_date_local + ',' + activity.timezone + ','
          + activity.distance + ',' + activity.moving_time + ',' + activity.elapsed_time + ','
          + activity.total_elevation_gain + ',' + activity.type + ',' + activity.average_speed + ','
          + activity.max_speed + ',' + csvString(activity.name) + '\n');
      }
      res.end();
    })
    .catch((err) => sendError(res, err));
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
app.get('/refreshallactivities', function(_, res) {
  refreshAllAthleteActivities()
    .then(() => leaderboard2.refreshLeaderboard())
    .then(() => res.send(''))
    .catch(err => sendError(res, err));
});

// Display the leaderboard.
app.get('/leaderboard', function(_, res) {
  getAthletesAndActivities()
    .then(athletesAndActivities => buildLeaderboard(
      athletesAndActivities.athletes,
      athletesAndActivities.activities
    ))
    .then(leaderboard => res.render('leaderboard.handlebars', {
      leaderboard : leaderboard
    }))
    .catch(err => sendError(res, err));
});

// Display the leaderboard.
app.get('/leaderboardjson', function(_, res) {
  getAthletesAndActivities()
    .then(athletesAndActivities => buildLeaderboard(
      athletesAndActivities.athletes,
      athletesAndActivities.activities
    ))
    .then(leaderboard => res.render('leaderboardjson.handlebars', {
      leaderboardjson : stringify(leaderboard),
      leaderboard : leaderboard
    }))
    .catch(err => sendError(res, err));
});

// Determine the latest leaderboard 2 year/month/week combination and redirect to it.
app.get('/leaderboard2', function(_, res) {
  leaderboard2
    .getLatestLeaderboardIds()
    .then((leaderboardIds) => res.redirect(
      307,
      `./leaderboard2/${leaderboardIds.year}/${leaderboardIds.month}/${leaderboardIds.week}`
    ))
    .catch((err) => sendError(res, err));
});

// Display leaderboard 2 for a specific year/month/week combination.
app.get('/leaderboard2/:year/:month/:week', function(req, res) {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);
  const week = parseInt(req.params.week);
  console.log(`Displaying leaderboard for year ${year}, month ${month}, week ${week}`);

  leaderboard2
    .getLeaderboard(year, month, week)
    .then((leaderboard) => res.render('leaderboard2.handlebars', {
      leaderboard,
      leaderboardjson: JSON.stringify(leaderboard, null, 2)
    }))
    .catch((err) => sendError(res, err));
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
const port = process.env.PORT;
app.listen(port, function() {
  console.log('Listening on port %d', port);
});

export {};
