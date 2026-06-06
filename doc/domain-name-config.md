# Domain Name Config

We want users to be able to hit a well-known name such as shamvelo.bretth.com.

Cloud Run doesn't support custom domain mappings in Australian regions so we can't attach a name directly.

## Options

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
* Create a Cloudflare worker that proxies requests through.
  * Pros
    * Same as Firebase (always shows the custom domain in the URL).
    * Negligible latency — the proxy adds ~5ms.
  * Cons
    * None found in practice.

## Outcome

I'll go with Cloudflare Worker approach initially. It's nice to have snappy performance and always shows `shamvelo.bretth.com` in the browser. I can switch to Firebase if/when I need it.

## Setup

Create a DNS AAAA entry called `shamvelo` pointing to `100::` (a dummy IPv6 address — with Proxy Status enabled, Cloudflare intercepts traffic at the edge before it reaches this address). Ensure the "Proxy Status" is set to "Proxied".

Visit Workers Routes, and create a new Cloudflare Worker called `shamvelo-proxy` with following code:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    // Swap the hostname to the Cloud Run app while keeping the path and query strings
    url.hostname = "shamvelo-404013849600.australia-southeast1.run.app";

    // Construct a new request to forward headers, method, and body seamlessly
    const modifiedRequest = new Request(url, request);

    return fetch(modifiedRequest);
  }
};
```

Back in Workers Routes, add a route with route set to `shamvelo.bretth.com/*` and set the worker to the `shamvelo-proxy` created above.

Under the domain's **SSL/TLS → Edge Certificates** section, ensure **Always Use HTTPS** is enabled. Without this, a user hitting `http://shamvelo.bretth.com` gets redirected by Cloud Run directly to the `.run.app` URL, exposing the backend URL in their address bar.
