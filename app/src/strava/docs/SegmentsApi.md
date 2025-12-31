# SegmentsApi

All URIs are relative to *https://www.strava.com/api/v3*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**exploreSegments**](SegmentsApi.md#exploresegments) | **GET** /segments/explore | Explore segments |
| [**getLoggedInAthleteStarredSegments**](SegmentsApi.md#getloggedinathletestarredsegments) | **GET** /segments/starred | List Starred Segments |
| [**getSegmentById**](SegmentsApi.md#getsegmentbyid) | **GET** /segments/{id} | Get Segment |
| [**starSegment**](SegmentsApi.md#starsegment) | **PUT** /segments/{id}/starred | Star Segment |



## exploreSegments

> ExplorerResponse exploreSegments(bounds, activityType, minCat, maxCat)

Explore segments

Returns the top 10 segments matching a specified query.

### Example

```ts
import {
  Configuration,
  SegmentsApi,
} from '';
import type { ExploreSegmentsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SegmentsApi(config);

  const body = {
    // Array<number> | The latitude and longitude for two points describing a rectangular boundary for the search: [southwest corner latitutde, southwest corner longitude, northeast corner latitude, northeast corner longitude]
    bounds: ...,
    // 'running' | 'riding' | Desired activity type. (optional)
    activityType: activityType_example,
    // number | The minimum climbing category. (optional)
    minCat: 56,
    // number | The maximum climbing category. (optional)
    maxCat: 56,
  } satisfies ExploreSegmentsRequest;

  try {
    const data = await api.exploreSegments(body);
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
| **bounds** | `Array<number>` | The latitude and longitude for two points describing a rectangular boundary for the search: [southwest corner latitutde, southwest corner longitude, northeast corner latitude, northeast corner longitude] | |
| **activityType** | `running`, `riding` | Desired activity type. | [Optional] [Defaults to `undefined`] [Enum: running, riding] |
| **minCat** | `number` | The minimum climbing category. | [Optional] [Defaults to `undefined`] |
| **maxCat** | `number` | The maximum climbing category. | [Optional] [Defaults to `undefined`] |

### Return type

[**ExplorerResponse**](ExplorerResponse.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of matching segments. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getLoggedInAthleteStarredSegments

> Array&lt;SummarySegment&gt; getLoggedInAthleteStarredSegments(page, perPage)

List Starred Segments

List of the authenticated athlete\&#39;s starred segments. Private segments are filtered out unless requested by a token with read_all scope.

### Example

```ts
import {
  Configuration,
  SegmentsApi,
} from '';
import type { GetLoggedInAthleteStarredSegmentsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SegmentsApi(config);

  const body = {
    // number | Page number. Defaults to 1. (optional)
    page: 56,
    // number | Number of items per page. Defaults to 30. (optional)
    perPage: 56,
  } satisfies GetLoggedInAthleteStarredSegmentsRequest;

  try {
    const data = await api.getLoggedInAthleteStarredSegments(body);
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
| **page** | `number` | Page number. Defaults to 1. | [Optional] [Defaults to `undefined`] |
| **perPage** | `number` | Number of items per page. Defaults to 30. | [Optional] [Defaults to `30`] |

### Return type

[**Array&lt;SummarySegment&gt;**](SummarySegment.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of the authenticated athlete\&#39;s starred segments. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSegmentById

> DetailedSegment getSegmentById(id)

Get Segment

Returns the specified segment. read_all scope required in order to retrieve athlete-specific segment information, or to retrieve private segments.

### Example

```ts
import {
  Configuration,
  SegmentsApi,
} from '';
import type { GetSegmentByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SegmentsApi(config);

  const body = {
    // number | The identifier of the segment.
    id: 789,
  } satisfies GetSegmentByIdRequest;

  try {
    const data = await api.getSegmentById(body);
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

### Return type

[**DetailedSegment**](DetailedSegment.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Representation of a segment. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## starSegment

> DetailedSegment starSegment(id, starred)

Star Segment

Stars/Unstars the given segment for the authenticated athlete. Requires profile:write scope.

### Example

```ts
import {
  Configuration,
  SegmentsApi,
} from '';
import type { StarSegmentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SegmentsApi(config);

  const body = {
    // number | The identifier of the segment to star.
    id: 789,
    // boolean | If true, star the segment; if false, unstar the segment.
    starred: true,
  } satisfies StarSegmentRequest;

  try {
    const data = await api.starSegment(body);
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
| **id** | `number` | The identifier of the segment to star. | [Defaults to `undefined`] |
| **starred** | `boolean` | If true, star the segment; if false, unstar the segment. | [Defaults to `false`] |

### Return type

[**DetailedSegment**](DetailedSegment.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Representation of a segment. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

