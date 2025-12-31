
# DetailedAthlete


## Properties

Name | Type
------------ | -------------
`id` | number
`resourceState` | number
`firstname` | string
`lastname` | string
`profileMedium` | string
`profile` | string
`city` | string
`state` | string
`country` | string
`sex` | string
`premium` | boolean
`summit` | boolean
`createdAt` | Date
`updatedAt` | Date
`followerCount` | number
`friendCount` | number
`measurementPreference` | string
`ftp` | number
`weight` | number
`clubs` | [Array&lt;SummaryClub&gt;](SummaryClub.md)
`bikes` | [Array&lt;SummaryGear&gt;](SummaryGear.md)
`shoes` | [Array&lt;SummaryGear&gt;](SummaryGear.md)

## Example

```typescript
import type { DetailedAthlete } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "resourceState": null,
  "firstname": null,
  "lastname": null,
  "profileMedium": null,
  "profile": null,
  "city": null,
  "state": null,
  "country": null,
  "sex": null,
  "premium": null,
  "summit": null,
  "createdAt": null,
  "updatedAt": null,
  "followerCount": null,
  "friendCount": null,
  "measurementPreference": null,
  "ftp": null,
  "weight": null,
  "clubs": null,
  "bikes": null,
  "shoes": null,
} satisfies DetailedAthlete

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DetailedAthlete
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


