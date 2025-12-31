
# SummaryClub


## Properties

Name | Type
------------ | -------------
`id` | number
`resourceState` | number
`name` | string
`profileMedium` | string
`coverPhoto` | string
`coverPhotoSmall` | string
`sportType` | string
`activityTypes` | [Array&lt;ActivityType&gt;](ActivityType.md)
`city` | string
`state` | string
`country` | string
`_private` | boolean
`memberCount` | number
`featured` | boolean
`verified` | boolean
`url` | string

## Example

```typescript
import type { SummaryClub } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "resourceState": null,
  "name": null,
  "profileMedium": null,
  "coverPhoto": null,
  "coverPhotoSmall": null,
  "sportType": null,
  "activityTypes": null,
  "city": null,
  "state": null,
  "country": null,
  "_private": null,
  "memberCount": null,
  "featured": null,
  "verified": null,
  "url": null,
} satisfies SummaryClub

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SummaryClub
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


