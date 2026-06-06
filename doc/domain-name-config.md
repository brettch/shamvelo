# Domain Name Config

We want users to be able to hit a well-known name such as shamvelo.bretth.com.

Cloud Run doesn't support custom domain mappings in Australian regions so we can't attach a name directly.

We have a couple of options:

* Front the site with Firebase and attach our custom domain name there.
  * Pros
    * Always presents shamvelo.bretth.com to the end user in the browser URL.
    * No chance of weird issues cropping up in web flows (e.g. login from Strava) due to redirects.
  * Cons
    * It adds noticeable latency to very request.
* Create a redirect rule in Cloudflare.
  * Pros
    * Other than the initial redirect it retains snappy performance.
  * Cons
    * It exposes the Cloud Run `.run.app` URL to the user.
    * _May_ encounter issues caused by redirects. Although the risk seems quite low.

I'll go with Cloudflare Redirect approach initially. It's nice to have snappy performance and I already have to create a DNS entry so I'm not adding many more moving parts. I can switch to Firestore if/when I need it.
