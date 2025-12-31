
# ActivityZone


## Properties

Name | Type
------------ | -------------
`score` | number
`distributionBuckets` | [Array&lt;TimedZoneRange&gt;](TimedZoneRange.md)
`type` | string
`sensorBased` | boolean
`points` | number
`customZones` | boolean
`max` | number

## Example

```typescript
import type { ActivityZone } from ''

// TODO: Update the object below with actual values
const example = {
  "score": null,
  "distributionBuckets": null,
  "type": null,
  "sensorBased": null,
  "points": null,
  "customZones": null,
  "max": null,
} satisfies ActivityZone

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ActivityZone
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


