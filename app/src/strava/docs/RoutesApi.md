# RoutesApi

All URIs are relative to *https://www.strava.com/api/v3*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getRouteAsGPX**](RoutesApi.md#getrouteasgpx) | **GET** /routes/{id}/export_gpx | Export Route GPX |
| [**getRouteAsTCX**](RoutesApi.md#getrouteastcx) | **GET** /routes/{id}/export_tcx | Export Route TCX |
| [**getRouteById**](RoutesApi.md#getroutebyid) | **GET** /routes/{id} | Get Route |
| [**getRoutesByAthleteId**](RoutesApi.md#getroutesbyathleteid) | **GET** /athletes/{id}/routes | List Athlete Routes |



## getRouteAsGPX

> getRouteAsGPX(id)

Export Route GPX

Returns a GPX file of the route. Requires read_all scope for private routes.

### Example

```ts
import {
  Configuration,
  RoutesApi,
} from '';
import type { GetRouteAsGPXRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new RoutesApi(config);

  const body = {
    // number | The identifier of the route.
    id: 789,
  } satisfies GetRouteAsGPXRequest;

  try {
    const data = await api.getRouteAsGPX(body);
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

`void` (Empty response body)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A GPX file with the route. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getRouteAsTCX

> getRouteAsTCX(id)

Export Route TCX

Returns a TCX file of the route. Requires read_all scope for private routes.

### Example

```ts
import {
  Configuration,
  RoutesApi,
} from '';
import type { GetRouteAsTCXRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new RoutesApi(config);

  const body = {
    // number | The identifier of the route.
    id: 789,
  } satisfies GetRouteAsTCXRequest;

  try {
    const data = await api.getRouteAsTCX(body);
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

`void` (Empty response body)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A TCX file with the route. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getRouteById

> Route getRouteById(id)

Get Route

Returns a route using its identifier. Requires read_all scope for private routes.

### Example

```ts
import {
  Configuration,
  RoutesApi,
} from '';
import type { GetRouteByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new RoutesApi(config);

  const body = {
    // number | The identifier of the route.
    id: 789,
  } satisfies GetRouteByIdRequest;

  try {
    const data = await api.getRouteById(body);
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

[**Route**](Route.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A representation of the route. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getRoutesByAthleteId

> Array&lt;Route&gt; getRoutesByAthleteId(page, perPage)

List Athlete Routes

Returns a list of the routes created by the authenticated athlete. Private routes are filtered out unless requested by a token with read_all scope.

### Example

```ts
import {
  Configuration,
  RoutesApi,
} from '';
import type { GetRoutesByAthleteIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new RoutesApi(config);

  const body = {
    // number | Page number. Defaults to 1. (optional)
    page: 56,
    // number | Number of items per page. Defaults to 30. (optional)
    perPage: 56,
  } satisfies GetRoutesByAthleteIdRequest;

  try {
    const data = await api.getRoutesByAthleteId(body);
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

[**Array&lt;Route&gt;**](Route.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A representation of the route. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

