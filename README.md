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

Install and activate the correct node version.  This requires [Mise](https://mise.jdx.dev/) to be installed and configured in your shell.

```bash
mise install
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

## Upgrade dependencies

Find outdated dependencies.

```bash
npm outdated
```

Update dependencies in `package.json` based on the above output.

Update dependencies pinned in `package-lock.json`.

```bash
npm upgrade
```

## Deployment

All commands should be run from the `app` folder.

Deploy the application and cron jobs.

```bash
gcloud app deploy app.yaml
gcloud app deploy cron.yaml
```

Stream application logs

```bash
gcloud app logs tail -s default
```

## Usage

See [Leaderboard 2](./doc/leaderboard2.md) for details of the information displayed on the leaderboard.
