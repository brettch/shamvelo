# ClubsApi

All URIs are relative to *https://www.strava.com/api/v3*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getClubActivitiesById**](ClubsApi.md#getclubactivitiesbyid) | **GET** /clubs/{id}/activities | List Club Activities |
| [**getClubAdminsById**](ClubsApi.md#getclubadminsbyid) | **GET** /clubs/{id}/admins | List Club Administrators |
| [**getClubById**](ClubsApi.md#getclubbyid) | **GET** /clubs/{id} | Get Club |
| [**getClubMembersById**](ClubsApi.md#getclubmembersbyid) | **GET** /clubs/{id}/members | List Club Members |
| [**getLoggedInAthleteClubs**](ClubsApi.md#getloggedinathleteclubs) | **GET** /athlete/clubs | List Athlete Clubs |



## getClubActivitiesById

> Array&lt;ClubActivity&gt; getClubActivitiesById(id, page, perPage)

List Club Activities

Retrieve recent activities from members of a specific club. The authenticated athlete must belong to the requested club in order to hit this endpoint. Pagination is supported. Athlete profile visibility is respected for all activities.

### Example

```ts
import {
  Configuration,
  ClubsApi,
} from '';
import type { GetClubActivitiesByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new ClubsApi(config);

  const body = {
    // number | The identifier of the club.
    id: 789,
    // number | Page number. Defaults to 1. (optional)
    page: 56,
    // number | Number of items per page. Defaults to 30. (optional)
    perPage: 56,
  } satisfies GetClubActivitiesByIdRequest;

  try {
    const data = await api.getClubActivitiesById(body);
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
| **id** | `number` | The identifier of the club. | [Defaults to `undefined`] |
| **page** | `number` | Page number. Defaults to 1. | [Optional] [Defaults to `undefined`] |
| **perPage** | `number` | Number of items per page. Defaults to 30. | [Optional] [Defaults to `30`] |

### Return type

[**Array&lt;ClubActivity&gt;**](ClubActivity.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A list of activities. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getClubAdminsById

> Array&lt;SummaryAthlete&gt; getClubAdminsById(id, page, perPage)

List Club Administrators

Returns a list of the administrators of a given club.

### Example

```ts
import {
  Configuration,
  ClubsApi,
} from '';
import type { GetClubAdminsByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new ClubsApi(config);

  const body = {
    // number | The identifier of the club.
    id: 789,
    // number | Page number. Defaults to 1. (optional)
    page: 56,
    // number | Number of items per page. Defaults to 30. (optional)
    perPage: 56,
  } satisfies GetClubAdminsByIdRequest;

  try {
    const data = await api.getClubAdminsById(body);
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
| **id** | `number` | The identifier of the club. | [Defaults to `undefined`] |
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
| **200** | A list of summary athlete representations. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getClubById

> DetailedClub getClubById(id)

Get Club

Returns a given a club using its identifier.

### Example

```ts
import {
  Configuration,
  ClubsApi,
} from '';
import type { GetClubByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new ClubsApi(config);

  const body = {
    // number | The identifier of the club.
    id: 789,
  } satisfies GetClubByIdRequest;

  try {
    const data = await api.getClubById(body);
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
| **id** | `number` | The identifier of the club. | [Defaults to `undefined`] |

### Return type

[**DetailedClub**](DetailedClub.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The detailed representation of a club. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getClubMembersById

> Array&lt;ClubAthlete&gt; getClubMembersById(id, page, perPage)

List Club Members

Returns a list of the athletes who are members of a given club.

### Example

```ts
import {
  Configuration,
  ClubsApi,
} from '';
import type { GetClubMembersByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new ClubsApi(config);

  const body = {
    // number | The identifier of the club.
    id: 789,
    // number | Page number. Defaults to 1. (optional)
    page: 56,
    // number | Number of items per page. Defaults to 30. (optional)
    perPage: 56,
  } satisfies GetClubMembersByIdRequest;

  try {
    const data = await api.getClubMembersById(body);
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
| **id** | `number` | The identifier of the club. | [Defaults to `undefined`] |
| **page** | `number` | Page number. Defaults to 1. | [Optional] [Defaults to `undefined`] |
| **perPage** | `number` | Number of items per page. Defaults to 30. | [Optional] [Defaults to `30`] |

### Return type

[**Array&lt;ClubAthlete&gt;**](ClubAthlete.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A list of club athlete representations. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getLoggedInAthleteClubs

> Array&lt;SummaryClub&gt; getLoggedInAthleteClubs(page, perPage)

List Athlete Clubs

Returns a list of the clubs whose membership includes the authenticated athlete.

### Example

```ts
import {
  Configuration,
  ClubsApi,
} from '';
import type { GetLoggedInAthleteClubsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: strava_oauth accessCode
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new ClubsApi(config);

  const body = {
    // number | Page number. Defaults to 1. (optional)
    page: 56,
    // number | Number of items per page. Defaults to 30. (optional)
    perPage: 56,
  } satisfies GetLoggedInAthleteClubsRequest;

  try {
    const data = await api.getLoggedInAthleteClubs(body);
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

[**Array&lt;SummaryClub&gt;**](SummaryClub.md)

### Authorization

[strava_oauth accessCode](../README.md#strava_oauth-accessCode)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A list of summary club representations. |  -  |
| **0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

