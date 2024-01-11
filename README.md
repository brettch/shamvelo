# Shamvelo

## What is it?

Shamvelo is a simple application for allowing a small group of friends to share and compare Strava statistics.  It is a Google App Engine/Datastore application that uses OAuth authorisation to register and retrieve athlete details from the Strava API and then stores the data in a database for analysis and summary.  All interaction is via a web interface.

## Local setup and development

Setup gcloud user and application credentials to access the Google Cloud Platform.

```bash
gcloud init
gcloud auth login
gcloud auth application-default login
```

All commands should be run from the `app` folder.

Install and activate the correct node version.  This requires [NVM](https://github.com/nvm-sh/nvm) to be installed and configured in your shell.

```bash
nvm install
nvm use
```

Install application dependencies.

```bash
npm install
```

Configure the application settings.  Copy `.env.tplt` to `.env` and update all settings as appropriate.

Start the application.

```bash
npm start
```

Access the application from a browser.

```bash
open http://localhost:8080
```

## Deployment

All commands should be run from the `app` folder.

Deploy the application and cron jobs.

```
gcloud app deploy app.yaml
gcloud app deploy cron.yaml
```

## Usage

See [Leaderboard 2](./doc/leaderboard2.md) for details of the information displayed on the leaderboard.
