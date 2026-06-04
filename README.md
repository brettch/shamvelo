# Shamvelo

## What is it?

Shamvelo is a simple application for allowing a small group of friends to share and compare Strava statistics.  It is a Cloud Run/Firestore application that uses OAuth authorisation to register and retrieve athlete details from the Strava API and then stores the data in a database for analysis and summary.  All interaction is via a web interface.

## Local setup and development

Install and activate development tooling.  This requires [Mise](https://mise.jdx.dev/) to be installed and configured in your shell.

```bash
mise install
```

Setup gcloud user and application credentials to access the Google Cloud Platform.

```bash
gcloud init
gcloud auth login
gcloud auth application-default login
```

All commands should be run from the `app` folder.

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

Find outdated tools. Update `.mise.toml` accordingly. Ensure the Node version remains aligned with the version in `Dockerfile`.

```bash
mise outdated --bump
```

Find outdated dependencies.

```bash
npm outdated
```

Update dependencies in `package.json` based on the above output. Ensure that the `@tsconfig/nodeXXXX` package matches the version of Node being used and that `tsconfig.json` is updated with the path to the correct tsconfig library.

Update dependencies pinned in `package-lock.json`.

```bash
npm upgrade
```

## Deployment

All commands should be run from the `app` folder.

### One-time setup

Verify your domain ownership and map it to the Cloud Run service.

```bash
gcloud domains verify bretth.com
gcloud beta run domain-mappings create \
  --service shamvelo \
  --region australia-southeast1 \
  --domain shamvelo.bretth.com
```

Add the CNAME record output by the above command at your DNS provider.

Create secrets for Strava credentials.

```bash
gcloud secrets create strava-client-id --data-file=-
gcloud secrets create strava-client-secret --data-file=-
gcloud secrets create strava-redirect-uri --data-file=-
```

Update the `strava-redirect-uri` secret value to `https://shamvelo.bretth.com/registercode` and set the same URL in your [Strava API application settings](https://www.strava.com/settings/api).

### Build and deploy

```bash
gcloud builds submit --tag gcr.io/shamvelo/shamvelo
gcloud run deploy shamvelo \
  --region australia-southeast1 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --set-env-vars "TZ=Australia/Melbourne,DATABASE_ID=production" \
  --update-secrets "STRAVA_CLIENT_ID=strava-client-id:latest,STRAVA_CLIENT_SECRET=strava-client-secret:latest,STRAVA_REDIRECT_URI=strava-redirect-uri:latest" \
  --allow-unauthenticated
```

Stream application logs

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=shamvelo" --limit 50
```

## Usage

See [Leaderboard 2](./doc/leaderboard2.md) for details of the information displayed on the leaderboard.
