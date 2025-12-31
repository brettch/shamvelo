# UploadsApi

All URIs are relative to *https://www.strava.com/api/v3*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createUpload**](UploadsApi.md#createupload) | **POST** /uploads | Upload Activity |
| [**getUploadById**](UploadsApi.md#getuploadbyid) | **GET** /uploads/{uploadId} | Get Upload |



## createUpload

> Upload createUpload(file, name, description, trainer, commute, dataType, externalId)

Upload Activity

Uploads a new data file to create an activity from. Requires activity:write scope.

### Example

```ts
import {
  Configuration,
  UploadsApi,
} from '';
import type { CreateUploadRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new UploadsApi(config);

  const body = {
    // Blob | The uploaded file. (optional)
    file: BINARY_DATA_HERE,
    // string | The desired name of the resulting activity. (optional)
    name: name_example,
    // string | The desired description of the resulting activity. (optional)
    description: description_example,
    // string | Whether the resulting activity should be marked as having been performed on a trainer. (optional)
    trainer: trainer_example,
    // string | Whether the resulting activity should be tagged as a commute. (optional)
    commute: commute_example,
    // string | The format of the uploaded file. (optional)
    dataType: dataType_example,
    // string | The desired external identifier of the resulting activity. (optional)
    externalId: externalId_example,
  } satisfies CreateUploadRequest;

  try {
    const data = await api.createUpload(body);
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
| **file** | `Blob` | The uploaded file. | [Optional] [Defaults to `undefined`] |
| **name** | `string` | The desired name of the resulting activity. | [Optional] [Defaults to `undefined`] |
| **description** | `string` | The desired description of the resulting activity. | [Optional] [Defaults to `undefined`] |
| **trainer** | `string` | Whether the resulting activity should be marked as having been performed on a trainer. | [Optional] [Defaults to `undefined`] |
| **commute** | `string` | Whether the resulting activity should be tagged as a commute. | [Optional] [Defaults to `undefined`] |
| **dataType** | `fit`, `fit.gz`, `tcx`, `tcx.gz`, `gpx`, `gpx.gz` | The format of the uploaded file. | [Optional] [Defaults to `undefined`] [Enum: fit, fit.gz, tcx, tcx.gz, gpx, gpx.gz] |
| **externalId** | `string` | The desired external identifier of the resulting activity. | [Optional] [Defaults to `undefined`] |

### Return type

[**Upload**](Upload.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | A representation of the created upload. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getUploadById

> Upload getUploadById(uploadId)

Get Upload

Returns an upload for a given identifier. Requires activity:write scope.

### Example

```ts
import {
  Configuration,
  UploadsApi,
} from '';
import type { GetUploadByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new UploadsApi(config);

  const body = {
    // number | The identifier of the upload.
    uploadId: 789,
  } satisfies GetUploadByIdRequest;

  try {
    const data = await api.getUploadById(body);
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
| **uploadId** | `number` | The identifier of the upload. | [Defaults to `undefined`] |

### Return type

[**Upload**](Upload.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Representation of the upload. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

