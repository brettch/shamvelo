# ActivitiesApi

All URIs are relative to *https://www.strava.com/api/v3*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createActivity**](ActivitiesApi.md#createactivity) | **POST** /activities | Create an Activity |
| [**getActivityById**](ActivitiesApi.md#getactivitybyid) | **GET** /activities/{id} | Get Activity |
| [**getCommentsByActivityId**](ActivitiesApi.md#getcommentsbyactivityid) | **GET** /activities/{id}/comments | List Activity Comments |
| [**getKudoersByActivityId**](ActivitiesApi.md#getkudoersbyactivityid) | **GET** /activities/{id}/kudos | List Activity Kudoers |
| [**getLapsByActivityId**](ActivitiesApi.md#getlapsbyactivityid) | **GET** /activities/{id}/laps | List Activity Laps |
| [**getLoggedInAthleteActivities**](ActivitiesApi.md#getloggedinathleteactivities) | **GET** /athlete/activities | List Athlete Activities |
| [**getZonesByActivityId**](ActivitiesApi.md#getzonesbyactivityid) | **GET** /activities/{id}/zones | Get Activity Zones |
| [**updateActivityById**](ActivitiesApi.md#updateactivitybyid) | **PUT** /activities/{id} | Update Activity |



## createActivity

> DetailedActivity createActivity(name, sportType, startDateLocal, elapsedTime, type, description, distance, trainer, commute)

Create an Activity

Creates a manual activity for an athlete, requires activity:write scope.

### Example

```ts
import {
  Configuration,
  ActivitiesApi,
} from '';
import type { CreateActivityRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new ActivitiesApi(config);

  const body = {
    // string | The name of the activity.
    name: name_example,
    // string | Sport type of activity. For example - Run, MountainBikeRide, Ride, etc.
    sportType: sportType_example,
    // Date | ISO 8601 formatted date time.
    startDateLocal: 2013-10-20T19:20:30+01:00,
    // number | In seconds.
    elapsedTime: 56,
    // string | Type of activity. For example - Run, Ride etc. (optional)
    type: type_example,
    // string | Description of the activity. (optional)
    description: description_example,
    // number | In meters. (optional)
    distance: 3.4,
    // number | Set to 1 to mark as a trainer activity. (optional)
    trainer: 56,
    // number | Set to 1 to mark as commute. (optional)
    commute: 56,
  } satisfies CreateActivityRequest;

  try {
    const data = await api.createActivity(body);
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
| **name** | `string` | The name of the activity. | [Defaults to `undefined`] |
| **sportType** | `string` | Sport type of activity. For example - Run, MountainBikeRide, Ride, etc. | [Defaults to `undefined`] |
| **startDateLocal** | `Date` | ISO 8601 formatted date time. | [Defaults to `undefined`] |
| **elapsedTime** | `number` | In seconds. | [Defaults to `undefined`] |
| **type** | `string` | Type of activity. For example - Run, Ride etc. | [Optional] [Defaults to `undefined`] |
| **description** | `string` | Description of the activity. | [Optional] [Defaults to `undefined`] |
| **distance** | `number` | In meters. | [Optional] [Defaults to `undefined`] |
| **trainer** | `number` | Set to 1 to mark as a trainer activity. | [Optional] [Defaults to `undefined`] |
| **commute** | `number` | Set to 1 to mark as commute. | [Optional] [Defaults to `undefined`] |

### Return type

[**DetailedActivity**](DetailedActivity.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The activity\&#39;s detailed representation. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getActivityById

> DetailedActivity getActivityById(id, includeAllEfforts)

Get Activity

Returns the given activity that is owned by the authenticated athlete. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.  We strongly encourage you to display the appropriate attribution that identifies Garmin as the data source and the device name in your application. Please see example below from VeloViewer (that provides an attribution for a Garmin Forerunner device).  ![Attribution](/images/device-attribution-image.png)

### Example

```ts
import {
  Configuration,
  ActivitiesApi,
} from '';
import type { GetActivityByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new ActivitiesApi(config);

  const body = {
    // number | The identifier of the activity.
    id: 789,
    // boolean | To include all segments efforts. (optional)
    includeAllEfforts: true,
  } satisfies GetActivityByIdRequest;

  try {
    const data = await api.getActivityById(body);
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
| **id** | `number` | The identifier of the activity. | [Defaults to `undefined`] |
| **includeAllEfforts** | `boolean` | To include all segments efforts. | [Optional] [Defaults to `undefined`] |

### Return type

[**DetailedActivity**](DetailedActivity.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The activity\&#39;s detailed representation. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getCommentsByActivityId

> Array&lt;Comment&gt; getCommentsByActivityId(id, page, perPage, pageSize, afterCursor)

List Activity Comments

Returns the comments on the given activity. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.

### Example

```ts
import {
  Configuration,
  ActivitiesApi,
} from '';
import type { GetCommentsByActivityIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new ActivitiesApi(config);

  const body = {
    // number | The identifier of the activity.
    id: 789,
    // number | Deprecated. Prefer to use after_cursor. (optional)
    page: 56,
    // number | Deprecated. Prefer to use page_size. (optional)
    perPage: 56,
    // number | Number of items per page. Defaults to 30. (optional)
    pageSize: 56,
    // string | Cursor of the last item in the previous page of results, used to request the subsequent page of results.  When omitted, the first page of results is fetched. (optional)
    afterCursor: afterCursor_example,
  } satisfies GetCommentsByActivityIdRequest;

  try {
    const data = await api.getCommentsByActivityId(body);
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
| **id** | `number` | The identifier of the activity. | [Defaults to `undefined`] |
| **page** | `number` | Deprecated. Prefer to use after_cursor. | [Optional] [Defaults to `undefined`] |
| **perPage** | `number` | Deprecated. Prefer to use page_size. | [Optional] [Defaults to `30`] |
| **pageSize** | `number` | Number of items per page. Defaults to 30. | [Optional] [Defaults to `30`] |
| **afterCursor** | `string` | Cursor of the last item in the previous page of results, used to request the subsequent page of results.  When omitted, the first page of results is fetched. | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;Comment&gt;**](Comment.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Comments. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getKudoersByActivityId

> Array&lt;SummaryAthlete&gt; getKudoersByActivityId(id, page, perPage)

List Activity Kudoers

Returns the athletes who kudoed an activity identified by an identifier. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.

### Example

```ts
import {
  Configuration,
  ActivitiesApi,
} from '';
import type { GetKudoersByActivityIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new ActivitiesApi(config);

  const body = {
    // number | The identifier of the activity.
    id: 789,
    // number | Page number. Defaults to 1. (optional)
    page: 56,
    // number | Number of items per page. Defaults to 30. (optional)
    perPage: 56,
  } satisfies GetKudoersByActivityIdRequest;

  try {
    const data = await api.getKudoersByActivityId(body);
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
| **id** | `number` | The identifier of the activity. | [Defaults to `undefined`] |
| **page** | `number` | Page number. Defaults to 1. | [Optional] [Defaults to `undefined`] |
| **perPage** | `number` | Number of items per page. Defaults to 30. | [Optional] [Defaults to `30`] |

### Return type

[**Array&lt;SummaryAthlete&gt;**](SummaryAthlete.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Comments. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getLapsByActivityId

> Array&lt;Lap&gt; getLapsByActivityId(id)

List Activity Laps

Returns the laps of an activity identified by an identifier. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.

### Example

```ts
import {
  Configuration,
  ActivitiesApi,
} from '';
import type { GetLapsByActivityIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new ActivitiesApi(config);

  const body = {
    // number | The identifier of the activity.
    id: 789,
  } satisfies GetLapsByActivityIdRequest;

  try {
    const data = await api.getLapsByActivityId(body);
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
| **id** | `number` | The identifier of the activity. | [Defaults to `undefined`] |

### Return type

[**Array&lt;Lap&gt;**](Lap.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Activity Laps. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getLoggedInAthleteActivities

> Array&lt;SummaryActivity&gt; getLoggedInAthleteActivities(before, after, page, perPage)

List Athlete Activities

Returns the activities of an athlete for a specific identifier. Requires activity:read. Only Me activities will be filtered out unless requested by a token with activity:read_all.

### Example

```ts
import {
  Configuration,
  ActivitiesApi,
} from '';
import type { GetLoggedInAthleteActivitiesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new ActivitiesApi(config);

  const body = {
    // number | An epoch timestamp to use for filtering activities that have taken place before a certain time. (optional)
    before: 56,
    // number | An epoch timestamp to use for filtering activities that have taken place after a certain time. (optional)
    after: 56,
    // number | Page number. Defaults to 1. (optional)
    page: 56,
    // number | Number of items per page. Defaults to 30. (optional)
    perPage: 56,
  } satisfies GetLoggedInAthleteActivitiesRequest;

  try {
    const data = await api.getLoggedInAthleteActivities(body);
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
| **before** | `number` | An epoch timestamp to use for filtering activities that have taken place before a certain time. | [Optional] [Defaults to `undefined`] |
| **after** | `number` | An epoch timestamp to use for filtering activities that have taken place after a certain time. | [Optional] [Defaults to `undefined`] |
| **page** | `number` | Page number. Defaults to 1. | [Optional] [Defaults to `undefined`] |
| **perPage** | `number` | Number of items per page. Defaults to 30. | [Optional] [Defaults to `30`] |

### Return type

[**Array&lt;SummaryActivity&gt;**](SummaryActivity.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The authenticated athlete\&#39;s activities |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getZonesByActivityId

> Array&lt;ActivityZone&gt; getZonesByActivityId(id)

Get Activity Zones

Summit Feature. Returns the zones of a given activity. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.

### Example

```ts
import {
  Configuration,
  ActivitiesApi,
} from '';
import type { GetZonesByActivityIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new ActivitiesApi(config);

  const body = {
    // number | The identifier of the activity.
    id: 789,
  } satisfies GetZonesByActivityIdRequest;

  try {
    const data = await api.getZonesByActivityId(body);
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
| **id** | `number` | The identifier of the activity. | [Defaults to `undefined`] |

### Return type

[**Array&lt;ActivityZone&gt;**](ActivityZone.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Activity Zones. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateActivityById

> DetailedActivity updateActivityById(id, body)

Update Activity

Updates the given activity that is owned by the authenticated athlete. Requires activity:write. Also requires activity:read_all in order to update Only Me activities

### Example

```ts
import {
  Configuration,
  ActivitiesApi,
} from '';
import type { UpdateActivityByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new ActivitiesApi(config);

  const body = {
    // number | The identifier of the activity.
    id: 789,
    // UpdatableActivity (optional)
    body: ...,
  } satisfies UpdateActivityByIdRequest;

  try {
    const data = await api.updateActivityById(body);
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
| **id** | `number` | The identifier of the activity. | [Defaults to `undefined`] |
| **body** | [UpdatableActivity](UpdatableActivity.md) |  | [Optional] |

### Return type

[**DetailedActivity**](DetailedActivity.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The activity\&#39;s detailed representation. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

