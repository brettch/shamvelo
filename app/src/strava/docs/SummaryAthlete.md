
# SummaryAthlete


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

## Example

```typescript
import type { SummaryAthlete } from ''

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
} satisfies SummaryAthlete

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SummaryAthlete
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


