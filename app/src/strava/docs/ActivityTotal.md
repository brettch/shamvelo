
# ActivityTotal

A roll-up of metrics pertaining to a set of activities. Values are in seconds and meters.

## Properties

Name | Type
------------ | -------------
`count` | number
`distance` | number
`movingTime` | number
`elapsedTime` | number
`elevationGain` | number
`achievementCount` | number

## Example

```typescript
import type { ActivityTotal } from ''

// TODO: Update the object below with actual values
const example = {
  "count": null,
  "distance": null,
  "movingTime": null,
  "elapsedTime": null,
  "elevationGain": null,
  "achievementCount": null,
} satisfies ActivityTotal

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ActivityTotal
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


