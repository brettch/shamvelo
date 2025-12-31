# StreamsApi

All URIs are relative to *https://www.strava.com/api/v3*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getActivityStreams**](StreamsApi.md#getactivitystreams) | **GET** /activities/{id}/streams | Get Activity Streams |
| [**getRouteStreams**](StreamsApi.md#getroutestreams) | **GET** /routes/{id}/streams | Get Route Streams |
| [**getSegmentEffortStreams**](StreamsApi.md#getsegmenteffortstreams) | **GET** /segment_efforts/{id}/streams | Get Segment Effort Streams |
| [**getSegmentStreams**](StreamsApi.md#getsegmentstreams) | **GET** /segments/{id}/streams | Get Segment Streams |



## getActivityStreams

> StreamSet getActivityStreams(id, keys, keyByType)

Get Activity Streams

Returns the given activity\&#39;s streams. Requires activity:read scope. Requires activity:read_all scope for Only Me activities.

### Example

```ts
import {
  Configuration,
  StreamsApi,
} from '';
import type { GetActivityStreamsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StreamsApi(config);

  const body = {
    // number | The identifier of the activity.
    id: 789,
    // Array<'time' | 'distance' | 'latlng' | 'altitude' | 'velocity_smooth' | 'heartrate' | 'cadence' | 'watts' | 'temp' | 'moving' | 'grade_smooth'> | Desired stream types.
    keys: ...,
    // boolean | Must be true.
    keyByType: true,
  } satisfies GetActivityStreamsRequest;

  try {
    const data = await api.getActivityStreams(body);
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
| **keys** | `time`, `distance`, `latlng`, `altitude`, `velocity_smooth`, `heartrate`, `cadence`, `watts`, `temp`, `moving`, `grade_smooth` | Desired stream types. | [Enum: time, distance, latlng, altitude, velocity_smooth, heartrate, cadence, watts, temp, moving, grade_smooth] |
| **keyByType** | `boolean` | Must be true. | [Defaults to `true`] |

### Return type

[**StreamSet**](StreamSet.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The set of requested streams. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getRouteStreams

> StreamSet getRouteStreams(id)

Get Route Streams

Returns the given route\&#39;s streams. Requires read_all scope for private routes.

### Example

```ts
import {
  Configuration,
  StreamsApi,
} from '';
import type { GetRouteStreamsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StreamsApi(config);

  const body = {
    // number | The identifier of the route.
    id: 789,
  } satisfies GetRouteStreamsRequest;

  try {
    const data = await api.getRouteStreams(body);
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
| **id** | `number` | The identifier of the route. | [Defaults to `undefined`] |

### Return type

[**StreamSet**](StreamSet.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The set of requested streams. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSegmentEffortStreams

> StreamSet getSegmentEffortStreams(id, keys, keyByType)

Get Segment Effort Streams

Returns a set of streams for a segment effort completed by the authenticated athlete. Requires read_all scope.

### Example

```ts
import {
  Configuration,
  StreamsApi,
} from '';
import type { GetSegmentEffortStreamsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StreamsApi(config);

  const body = {
    // number | The identifier of the segment effort.
    id: 789,
    // Array<'time' | 'distance' | 'latlng' | 'altitude' | 'velocity_smooth' | 'heartrate' | 'cadence' | 'watts' | 'temp' | 'moving' | 'grade_smooth'> | The types of streams to return.
    keys: ...,
    // boolean | Must be true.
    keyByType: true,
  } satisfies GetSegmentEffortStreamsRequest;

  try {
    const data = await api.getSegmentEffortStreams(body);
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
| **id** | `number` | The identifier of the segment effort. | [Defaults to `undefined`] |
| **keys** | `time`, `distance`, `latlng`, `altitude`, `velocity_smooth`, `heartrate`, `cadence`, `watts`, `temp`, `moving`, `grade_smooth` | The types of streams to return. | [Enum: time, distance, latlng, altitude, velocity_smooth, heartrate, cadence, watts, temp, moving, grade_smooth] |
| **keyByType** | `boolean` | Must be true. | [Defaults to `true`] |

### Return type

[**StreamSet**](StreamSet.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The set of requested streams. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSegmentStreams

> StreamSet getSegmentStreams(id, keys, keyByType)

Get Segment Streams

Returns the given segment\&#39;s streams. Requires read_all scope for private segments.

### Example

```ts
import {
  Configuration,
  StreamsApi,
} from '';
import type { GetSegmentStreamsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StreamsApi(config);

  const body = {
    // number | The identifier of the segment.
    id: 789,
    // Array<'distance' | 'latlng' | 'altitude'> | The types of streams to return.
    keys: ...,
    // boolean | Must be true.
    keyByType: true,
  } satisfies GetSegmentStreamsRequest;

  try {
    const data = await api.getSegmentStreams(body);
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
| **id** | `number` | The identifier of the segment. | [Defaults to `undefined`] |
| **keys** | `distance`, `latlng`, `altitude` | The types of streams to return. | [Enum: distance, latlng, altitude] |
| **keyByType** | `boolean` | Must be true. | [Defaults to `true`] |

### Return type

[**StreamSet**](StreamSet.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The set of requested streams. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

