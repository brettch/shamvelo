
# SummarySegment


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`activityType` | string
`distance` | number
`averageGrade` | number
`maximumGrade` | number
`elevationHigh` | number
`elevationLow` | number
`startLatlng` | Array&lt;number&gt;
`endLatlng` | Array&lt;number&gt;
`climbCategory` | number
`city` | string
`state` | string
`country` | string
`_private` | boolean
`athletePrEffort` | [SummaryPRSegmentEffort](SummaryPRSegmentEffort.md)
`athleteSegmentStats` | [SummarySegmentEffort](SummarySegmentEffort.md)

## Example

```typescript
import type { SummarySegment } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "activityType": null,
  "distance": null,
  "averageGrade": null,
  "maximumGrade": null,
  "elevationHigh": null,
  "elevationLow": null,
  "startLatlng": null,
  "endLatlng": null,
  "climbCategory": null,
  "city": null,
  "state": null,
  "country": null,
  "_private": null,
  "athletePrEffort": null,
  "athleteSegmentStats": null,
} satisfies SummarySegment

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SummarySegment
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


