# GearsApi

All URIs are relative to *https://www.strava.com/api/v3*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getGearById**](GearsApi.md#getgearbyid) | **GET** /gear/{id} | Get Equipment |



## getGearById

> DetailedGear getGearById(id)

Get Equipment

Returns an equipment using its identifier.

### Example

```ts
import {
  Configuration,
  GearsApi,
} from '';
import type { GetGearByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new GearsApi(config);

  const body = {
    // string | The identifier of the gear.
    id: id_example,
  } satisfies GetGearByIdRequest;

  try {
    const data = await api.getGearById(body);
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
| **id** | `string` | The identifier of the gear. | [Defaults to `undefined`] |

### Return type

[**DetailedGear**](DetailedGear.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A representation of the gear. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

