# Strava API Options

It is not obvious what libraries should be used to consume the Strava API from a Node application written in TypeScript.

## Requirements

The ideal solution should:

* Be strongly typed in TypeScript.
* Use modern language and runtime features.
* Be well supported and stable over time.

## Options

### Strava V3

The [Strava V3](https://www.npmjs.com/package/strava-v3) library has been used in this app for a long time but it does
not seem very well maintained and its TypeScript support is poor with many incorrect types that make it frustrating and
almost impossible to use.

It looks like a better path forward may to generate client bindings from the Strava
[Swagger file](https://developers.strava.com/swagger/swagger.json).

### Open API Generator

A popular Open API Generator with TypeScript support is [OpenAPI Generator](https://openapi-generator.tech/). This
showed much promise but it's difficult to know which generator to use. There are multiple TypeScript options each with
different tradeoffs. The `typescript-node` generator does not create correct import statements because it omits file
extensions. The `typescript-fetch` generator uses the new Fetch API which should work in Node 21 but some associated
types are unavailable in Node. The `typescript` generator supports a `node` platform target but they seem more suited to
server bindings than client bindings.

### OpenAPI TypeScript Codegen

The [OpenAPI TypeScript Codegen](https://www.npmjs.com/package/openapi-typescript-codegen) package looks like it might
be an option. It's hard to say how mature or well maintained it is and will continue to be. It's published from a
personal project called `ferdikoomen`, it has less downloads per week than other options, and doesn't have a version 1.

### OpenAPI Typescript

The [OpenAPI TypeScript](https://www.npmjs.com/package/openapi-typescript) package looks quite mature. However, it only
supports OpenAPI v3. The Strava Swagger file uses v2 of the Swagger spec before it became OpenAPI.

### Strava API V3

The [Strava API V3](https://github.com/bergac/strava-api-v3) is a pre-built set of client bindings. It does not seem
well maintained plus it's using the Axios library which I'd prefer not to pull in unless absolutely necessary. However,
it does contain a V3 OpenAPI spec which could be useful in conjunction with other generators.

### Strava Developers

The [Strava Developers](https://developers.strava.com/) provides its own guidance. It says to use their published
Swagger spec (not suprising) to generate bindings. It suggests using version 2 of the Swagger Generator. The code that
it produces does not compile under TypeScript.

* It omits the file extension on imports. This can be fixed relatively easily manually.
* It attempts to delete the URL.search field in many places. This can be fixed by setting to null.
* Many instances of Promise<unknown> cannot be assigned to Promise<MoreSpecificType>.
