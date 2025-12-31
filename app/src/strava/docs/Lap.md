
# Lap


## Properties

Name | Type
------------ | -------------
`id` | number
`activity` | [MetaActivity](MetaActivity.md)
`athlete` | [MetaAthlete](MetaAthlete.md)
`averageCadence` | number
`averageSpeed` | number
`distance` | number
`elapsedTime` | number
`startIndex` | number
`endIndex` | number
`lapIndex` | number
`maxSpeed` | number
`movingTime` | number
`name` | string
`paceZone` | number
`split` | number
`startDate` | Date
`startDateLocal` | Date
`totalElevationGain` | number

## Example

```typescript
import type { Lap } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "activity": null,
  "athlete": null,
  "averageCadence": null,
  "averageSpeed": null,
  "distance": null,
  "elapsedTime": null,
  "startIndex": null,
  "endIndex": null,
  "lapIndex": null,
  "maxSpeed": null,
  "movingTime": null,
  "name": null,
  "paceZone": null,
  "split": null,
  "startDate": null,
  "startDateLocal": null,
  "totalElevationGain": null,
} satisfies Lap

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Lap
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


