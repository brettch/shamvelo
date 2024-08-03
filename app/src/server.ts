// Load configuration.
import { appConfig } from './config.js';

// Base express framework.
import express from 'express';
import { Request } from 'express';
import bodyParser from 'body-parser';

// Add express middleware.
// Logging
import morgan from 'morgan';
// Handlebars templating engine
import { create as createHandlebars } from 'express-handlebars';

import * as leaderboard from './leaderboard/index.js';
import { Response } from 'express-serve-static-core';
import { athletePersist, deleteActivity, refreshActivity, refreshAllAthleteActivities, refreshAthlete, refreshAthleteActivities, registerAthlete, registration } from './engine.js';
import { getLatestMonthId, getLatestWeekId, getLatestYearId, getMonthView, getWeekView, getYearView } from './leaderboard/view.js';
import { StravaWebhookBody } from './strava.js';

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
app.use(bodyParser.urlencoded({
  // We may not need extended but it's the default and making it explicit eliminates a startup warning.
  extended: true,
}));
// Parse request bodies with encoding application/json
app.use(bodyParser.json());

// Register the handlebars page templating engine.
const hbs = createHandlebars({
  defaultLayout: 'main',
  helpers: {
    metresAsKilometres: (metres: number) => (metres / 1000).toFixed(1),
    metresAsMetres: (metres: number) => metres.toFixed(0),
    secondsAsHours: (seconds: number) => (seconds / 3600).toFixed(1),
    metresPerSecondAsKmh: (mps: number) => (mps * 3.6).toFixed(1)
  }
});
app.engine('handlebars', (path, options, callback) => {
  // We're passing a lambda to app.engine instead of hbs.engine directly
  // because hbs.engine returns a Promise and eslint complains. The handlebars
  // docs don't say to wait for it so we have to explicitly show that we want
  // to ignore it.
  void hbs.engine(path, options, callback);
});
app.set('view engine', 'handlebars');

// Serve static content.
app.use('/static', express.static('static'));

// Configure the home page to be the default.
app.get('/', function (_, res) {
  athletePersist.getAll()
    .then((athletes) => res.render('home.handlebars', {
      athletes : athletes,
      leaderboards : leaderboard.leaderboardConfigs,
    }))
    .catch((err) => sendError(res, err));
});

// Initiate OAuth registration of a new Strava athlete/user.
app.get('/register', function(_, res) {
  // Redirect the browser to the Strava OAuth grant page.
  res.redirect(registration.getOAuthRequestAccessUrl());
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

  athletePersist.get(athleteId)
    .then(athlete => ({athlete}))
    .then(athlete => res.render('athlete.handlebars', athlete))
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
    .then(() => leaderboard.refreshLeaderboard())
    .then(() => res.redirect('../' + athleteId))
    .catch(err => sendError(res, err));
});

// Refresh all activities.  Intended for use by a web browser.
app.post('/refreshallactivities', function(req, res) {
  refreshAllAthleteActivities()
    .then(() => leaderboard.refreshLeaderboard())
    .then(() => res.redirect('..'))
    .catch(err => sendError(res, err));
});

// Refresh all activities.  Intended for use by a cron trigger.
app.get('/refreshallactivities', function(_, res) {
  refreshAllAthleteActivities()
    .then(() => leaderboard.refreshLeaderboard())
    .then(() => res.send(''))
    .catch(err => sendError(res, err));
});

// Determine the latest leaderboard year and redirect to it.
app.get('/leaderboard/:code/year', function(req, res) {
  console.log('Getting latest year');
  getLatestYearId()
    .then(year => res.redirect(
      307,
      `./year/${year}`
    ))
    .catch((err) => sendError(res, err));
});

// Display the leaderboard for a specific year.
app.get('/leaderboard/:code/year/:year', function(req, res) {
  const year = parseInt(req.params.year);
  console.log(`Displaying details for year ${year}`);

  getYearView(req.params.code, year)
    .then(yearView => res.render('year.handlebars', yearView))
    .catch((err) => sendError(res, err));
});

// Determine the latest leaderboard month and redirect to it.
app.get('/leaderboard/:code/year/:year/month', function(req, res) {
  const year = parseInt(req.params.year);
  console.log(`Getting latest month for year ${year}`);
  getLatestMonthId(req.params.code, year)
    .then(month => res.redirect(
      307,
      `./month/${month}`
    ))
    .catch((err) => sendError(res, err));
});

// Display the leaderboard for a specific month.
app.get('/leaderboard/:code/year/:year/month/:month', function(req, res) {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);
  console.log(`Displaying details for year ${year} and month ${month}`);

  getMonthView(req.params.code, year, month)
    .then(monthView => res.render('period.handlebars', monthView))
    .catch((err) => sendError(res, err));
});

// Determine the latest leaderboard week and redirect to it.
app.get('/leaderboard/:code/year/:year/week', function(req, res) {
  const year = parseInt(req.params.year);
  console.log(`Getting latest week for year ${year}`);
  getLatestWeekId(req.params.code, year)
    .then(week => res.redirect(
      307,
      `./week/${week}`
    ))
    .catch((err) => sendError(res, err));
});

// Display the leaderboard for a specific week.
app.get('/leaderboard/:code/year/:year/week/:week', function(req, res) {
  const year = parseInt(req.params.year);
  const week = parseInt(req.params.week);
  console.log(`Displaying details for year ${year} and week ${week}`);

  getWeekView(req.params.code, year, week)
    .then(weekView => res.render('period.handlebars', weekView))
    .catch((err) => sendError(res, err));
});

// Callback URL used by strava to validate subscriptions.
app.get('/strava-webhook', function(req, res) {
  console.log('req.query:', req.query);
  const hubMode = req.query['hub.mode'];
  const hubChallenge = req.query['hub.challenge'];
  // We will ignore the `hub.verify_token` parameter because we're doing anything sensitive with the request.

  if (hubMode !== 'subscribe') {
    res.status(400).send({error: `invalid hub.mode: ${JSON.stringify(hubMode)}`});
    return;
  }

  res.send({
    'hub.challenge': hubChallenge
  });
});

app.post('/strava-webhook', (req: Request<Record<string, never>, Record<string, never>, StravaWebhookBody, Record<string, never>, Record<string, never>>, res) => {
  console.log('received strava notification:', req.body);
  const objectType = req.body.object_type;
  const aspectType = req.body.aspect_type;
  const objectId = req.body.object_id;
  const updates = req.body.updates;
  const ownerId = req.body.owner_id;
  // Events may include an authorised=false parameter indicating that this data can no longer
  // be accessed.  In all other cases it should be assumed to be authorised.
  const authorized = !(updates?.authorized === 'false');
  console.log('authorized:', authorized);

  // We can about activities that are added and removed.
  if (objectType === 'activity') {

    if ((aspectType === 'create' || aspectType === 'update') && authorized) {
      refreshActivity(objectId, ownerId)
        .then(() => leaderboard.refreshLeaderboard())
        .then(() => console.log('activity refreshed successfully'))
        .catch(err => console.log(err));
    } else if (aspectType === 'delete' || authorized === false) {
      deleteActivity(objectId)
        .then(() => leaderboard.refreshLeaderboard())
        .then(() => console.log('activity deleted successfully'))
        .catch(err => console.log(err));
    }
  }

  res.send({});
});

// Create a HTTP listener.
console.log('Creating HTTP listener');
app.listen(appConfig.port, function() {
  console.log('Listening on port %d', appConfig.port);
});

export {};
