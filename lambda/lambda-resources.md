# Functions

* List athletes.
  * Load athletes document.
* Initiate registration.
  * Generate registration redirect.
* Complete registration.
  * Accept auth code.
  * Exchange code for oauth token.
  * Add token to S3 named by athlete id.
* Generate athlete document.
  * Listen for new token in S3.
  * Retrieve athlete information from Strava.
  * Write athlete document to S3 named by athlete id.
* Generate athletes list document.
  * Listen for new athlete document in S3.
  * Load all athlete documents from S3.
  * Generate summary list document.
  * Write to S3.
* Trigger athletes refresh.
  * Listen for hourly timer.
  * Get all athlete tokens from S3.
  * Trigger generate athlete activities document.
* Generate athlete activities document.
  * Trigger from either athlete refresh, or new athlete token in S3.
  * Get token for athlete from S3.
  * Retrieve all activities for athlete from S3.
  * Store activities document to S3 named by athlete id.
* Generate leaderboard document.
  * Trigger from athlete activities change.
  * Load all activities for all athletes from S3.
  * Generate leaderboard.
  * Store leaderboard view in S3.

# S3 Buckets

* Tokens
* Athletes
* Activities
* Summary Views Bucket
  * Athlete List
  * Leaderboard
