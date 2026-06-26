# Shamvelo

## What is it?

Shamvelo is a simple application for allowing a small group of friends to share and compare Strava statistics.  It is a Cloud Run/Firestore application that uses OAuth authorisation to register and retrieve athlete details from the Strava API and then stores the data in a database for analysis and summary.  All interaction is via a web interface.  Access requires signing in with a Google account via Firebase Authentication (except the Strava webhook endpoint which must remain public).

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

Create secrets for the Strava credentials (from your `.env` file).

```bash
echo -n "your-strava-client-id" | gcloud secrets create strava-client-id --data-file=-
echo -n "your-strava-client-secret" | gcloud secrets create strava-client-secret --data-file=-
# Generate a token with: openssl rand -hex 16
echo -n "abc123..." | gcloud secrets create tasks-auth-token --data-file=-
```

Set `https://shamvelo.bretth.com/registercode` as the **Authorization Callback URL** in your [Strava API application settings](https://www.strava.com/settings/api).

Grant the Cloud Run service account access to read secrets.

```bash
gcloud projects add-iam-policy-binding shamvelo \
  --member serviceAccount:404013849600-compute@developer.gserviceaccount.com \
  --role roles/secretmanager.secretAccessor
```

### Firebase Authentication setup

This application uses Firebase Authentication with Google sign-in. Add Firebase
to your existing GCP project.

1. Go to the [Firebase Console](https://console.firebase.google.com) and
   **Add project**. Select your existing GCP project `shamvelo`.
2. **Authentication** → **Sign-in providers** → **Enable Google**.
3. **Authentication** → **Settings** → **Authorized domains** → add
   `shamvelo.bretth.com`.
4. **Project settings** → **General** → **Your apps** → **Add app** → **Web**.
   Copy the `firebaseConfig` values (`apiKey`, `authDomain`, `projectId`).
5. Add them to `.env` as `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, and
   `FIREBASE_PROJECT_ID`.
6. Grant the Cloud Run service account permission to create session cookies.

   ```bash
   gcloud projects add-iam-policy-binding shamvelo \
     --member="serviceAccount:404013849600-compute@developer.gserviceaccount.com" \
     --role="roles/firebaseauth.admin"
   ```

### Cloud Tasks setup

Activity refreshes are processed asynchronously via a Cloud Tasks queue. Each
refresh creates a chain of tasks that fetches activity pages from Strava,
persists them, and finally recalculates the leaderboard.

Create the task queue.

```bash
gcloud tasks queues create shamvelo-refresh \
    --location=us-central1 \
    --max-concurrent-dispatches=5 \
    --max-dispatches-per-second=0.67 \
    --max-attempts=3
```

Grant the Cloud Run service account permission to create tasks.

```bash
gcloud projects add-iam-policy-binding shamvelo \
  --member="serviceAccount:404013849600-compute@developer.gserviceaccount.com" \
  --role="roles/cloudtasks.enqueuer"
```

Grant the default compute service account permission to invoke Cloud Run (so
Cloud Tasks can call back to the `/tasks/refresh` endpoint).

```bash
gcloud projects add-iam-policy-binding shamvelo \
  --member="serviceAccount:404013849600-compute@developer.gserviceaccount.com" \
  --role="roles/run.invoker"
```

Add the following to `.env`:

```bash
CLOUD_TASKS_QUEUE=shamvelo-refresh
CLOUD_TASKS_LOCATION=us-central1
CLOUD_TASKS_SERVICE_URL=https://shamvelo-xxxxx-uc.a.run.app
# Generate a token with: openssl rand -hex 16
TASKS_AUTH_TOKEN=abc123...
```

The `CLOUD_TASKS_SERVICE_URL` must be set to your Cloud Run service URL (it
appears in the deploy output). The `TASKS_AUTH_TOKEN` is a shared secret used
to authenticate Cloud Tasks callbacks. Generate one with `openssl rand -hex 16`.

### Cloudflare Worker setup

See [Domain Name Configuration](./doc/domain-name-config.md) for details.

### Deploy

```bash
# Source environment variables, then deploy Cloud Run.
source .env && \
gcloud run deploy shamvelo \
  --source . \
  --region australia-southeast1 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --set-env-vars "TZ=${TZ},DATABASE_ID=${DATABASE_ID},STRAVA_REDIRECT_URI=${STRAVA_REDIRECT_URI},FIREBASE_API_KEY=${FIREBASE_API_KEY},FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN},FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID},CLOUD_TASKS_QUEUE=${CLOUD_TASKS_QUEUE},CLOUD_TASKS_LOCATION=${CLOUD_TASKS_LOCATION},CLOUD_TASKS_SERVICE_URL=${CLOUD_TASKS_SERVICE_URL}" \
  --update-secrets "STRAVA_CLIENT_ID=strava-client-id:latest,STRAVA_CLIENT_SECRET=strava-client-secret:latest,TASKS_AUTH_TOKEN=tasks-auth-token:latest" \
  --allow-unauthenticated
```

Stream application logs

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=shamvelo" --limit 50
```

## Usage

See [Leaderboard 2](./doc/leaderboard2.md) for details of the information displayed on the leaderboard.
