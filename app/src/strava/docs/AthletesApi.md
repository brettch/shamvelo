# AthletesApi

All URIs are relative to *https://www.strava.com/api/v3*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getLoggedInAthlete**](AthletesApi.md#getloggedinathlete) | **GET** /athlete | Get Authenticated Athlete |
| [**getLoggedInAthleteZones**](AthletesApi.md#getloggedinathletezones) | **GET** /athlete/zones | Get Zones |
| [**getStats**](AthletesApi.md#getstats) | **GET** /athletes/{id}/stats | Get Athlete Stats |
| [**updateLoggedInAthlete**](AthletesApi.md#updateloggedinathlete) | **PUT** /athlete | Update Athlete |



## getLoggedInAthlete

> DetailedAthlete getLoggedInAthlete()

Get Authenticated Athlete

Returns the currently authenticated athlete. Tokens with profile:read_all scope will receive a detailed athlete representation; all others will receive a summary representation.

### Example

```ts
import {
  Configuration,
  AthletesApi,
} from '';
import type { GetLoggedInAthleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new AthletesApi(config);

  try {
    const data = await api.getLoggedInAthlete();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**DetailedAthlete**](DetailedAthlete.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Profile information for the authenticated athlete. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getLoggedInAthleteZones

> Zones getLoggedInAthleteZones()

Get Zones

Returns the the authenticated athlete\&#39;s heart rate and power zones. Requires profile:read_all.

### Example

```ts
import {
  Configuration,
  AthletesApi,
} from '';
import type { GetLoggedInAthleteZonesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new AthletesApi(config);

  try {
    const data = await api.getLoggedInAthleteZones();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Zones**](Zones.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Heart rate and power zones. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getStats

> ActivityStats getStats(id)

Get Athlete Stats

Returns the activity stats of an athlete. Only includes data from activities set to Everyone visibilty.

### Example

```ts
import {
  Configuration,
  AthletesApi,
} from '';
import type { GetStatsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new AthletesApi(config);

  const body = {
    // number | The identifier of the athlete. Must match the authenticated athlete.
    id: 789,
  } satisfies GetStatsRequest;

  try {
    const data = await api.getStats(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | The identifier of the athlete. Must match the authenticated athlete. | [Defaults to `undefined`] |

### Return type

[**ActivityStats**](ActivityStats.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Activity stats of the athlete. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateLoggedInAthlete

> DetailedAthlete updateLoggedInAthlete(weight)

Update Athlete

Update the currently authenticated athlete. Requires profile:write scope.

### Example

```ts
import {
  Configuration,
  AthletesApi,
} from '';
import type { UpdateLoggedInAthleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new AthletesApi(config);

  const body = {
    // number | The weight of the athlete in kilograms.
    weight: 3.4,
  } satisfies UpdateLoggedInAthleteRequest;

  try {
    const data = await api.updateLoggedInAthlete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **weight** | `number` | The weight of the athlete in kilograms. | [Defaults to `undefined`] |

### Return type

[**DetailedAthlete**](DetailedAthlete.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Profile information for the authenticated athlete. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

