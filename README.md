# What is it?

Shamvelo is a simple application for allowing a small group of friends to share and compare Strava statistics.  It is a Google App Engine/Datastore application that uses OAuth authorisation to register and retrieve athlete details from the Strava API and then stores the data in a database for analysis and summary.  All interaction is via a web interface.

# Requirements

Docker - The application is packaged into Docker containers, so requires a Linux server with the Docker daemon running.  For Windows and OSX, try Boot2Docker.
Docker Compose - Multiple docker containers are linked together using Docker Compose (a.k.a. Fig).

# Local setup and development

All commands should be run from the `app` folder.

Setup application credentials to access the Google Cloud Platform.

```bash
gcloud auth application-default login
```

Install and activate the correct node version.  This requires [NVM](https://github.com/nvm-sh/nvm) to be installed and configured in your shell.

```bash
nvm install
nvm use
```

Install application dependencies.  This requires [Yarn](https://yarnpkg.com/) to be installed locally.

```bash
yarn install
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

# Deployment

All commands should be run from the `app` folder.

Setup gcloud user credentials to access the Google Cloud Platform.

```bash
gcloud init
gcloud auth login
```

Deploy the application and cron jobs.

```
gcloud app deploy app.yaml
gcloud app deploy cron.yaml
```
