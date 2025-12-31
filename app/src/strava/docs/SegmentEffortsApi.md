# SegmentEffortsApi

All URIs are relative to *https://www.strava.com/api/v3*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getEffortsBySegmentId**](SegmentEffortsApi.md#geteffortsbysegmentid) | **GET** /segment_efforts | List Segment Efforts |
| [**getSegmentEffortById**](SegmentEffortsApi.md#getsegmenteffortbyid) | **GET** /segment_efforts/{id} | Get Segment Effort |



## getEffortsBySegmentId

> Array&lt;DetailedSegmentEffort&gt; getEffortsBySegmentId(segmentId, startDateLocal, endDateLocal, perPage)

List Segment Efforts

Returns a set of the authenticated athlete\&#39;s segment efforts for a given segment.  Requires subscription.

### Example

```ts
import {
  Configuration,
  SegmentEffortsApi,
} from '';
import type { GetEffortsBySegmentIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SegmentEffortsApi(config);

  const body = {
    // number | The identifier of the segment.
    segmentId: 56,
    // Date | ISO 8601 formatted date time. (optional)
    startDateLocal: 2013-10-20T19:20:30+01:00,
    // Date | ISO 8601 formatted date time. (optional)
    endDateLocal: 2013-10-20T19:20:30+01:00,
    // number | Number of items per page. Defaults to 30. (optional)
    perPage: 56,
  } satisfies GetEffortsBySegmentIdRequest;

  try {
    const data = await api.getEffortsBySegmentId(body);
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
| **segmentId** | `number` | The identifier of the segment. | [Defaults to `undefined`] |
| **startDateLocal** | `Date` | ISO 8601 formatted date time. | [Optional] [Defaults to `undefined`] |
| **endDateLocal** | `Date` | ISO 8601 formatted date time. | [Optional] [Defaults to `undefined`] |
| **perPage** | `number` | Number of items per page. Defaults to 30. | [Optional] [Defaults to `30`] |

### Return type

[**Array&lt;DetailedSegmentEffort&gt;**](DetailedSegmentEffort.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of segment efforts. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSegmentEffortById

> DetailedSegmentEffort getSegmentEffortById(id)

Get Segment Effort

Returns a segment effort from an activity that is owned by the authenticated athlete. Requires subscription.

### Example

```ts
import {
  Configuration,
  SegmentEffortsApi,
} from '';
import type { GetSegmentEffortByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SegmentEffortsApi(config);

  const body = {
    // number | The identifier of the segment effort.
    id: 789,
  } satisfies GetSegmentEffortByIdRequest;

  try {
    const data = await api.getSegmentEffortById(body);
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

### Return type

[**DetailedSegmentEffort**](DetailedSegmentEffort.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Representation of a segment effort. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

