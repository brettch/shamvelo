
# ClubActivity


## Properties

Name | Type
------------ | -------------
`athlete` | [MetaAthlete](MetaAthlete.md)
`name` | string
`distance` | number
`movingTime` | number
`elapsedTime` | number
`totalElevationGain` | number
`type` | [ActivityType](ActivityType.md)
`sportType` | [SportType](SportType.md)
`workoutType` | number

## Example

```typescript
import type { ClubActivity } from ''

// TODO: Update the object below with actual values
const example = {
  "athlete": null,
  "name": null,
  "distance": null,
  "movingTime": null,
  "elapsedTime": null,
  "totalElevationGain": null,
  "type": null,
  "sportType": null,
  "workoutType": null,
} satisfies ClubActivity

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ClubActivity
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


