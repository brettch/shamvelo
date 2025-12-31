
# DetailedSegment


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
`createdAt` | Date
`updatedAt` | Date
`totalElevationGain` | number
`map` | [PolylineMap](PolylineMap.md)
`effortCount` | number
`athleteCount` | number
`hazardous` | boolean
`starCount` | number

## Example

```typescript
import type { DetailedSegment } from ''

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
  "createdAt": null,
  "updatedAt": null,
  "totalElevationGain": null,
  "map": null,
  "effortCount": null,
  "athleteCount": null,
  "hazardous": null,
  "starCount": null,
} satisfies DetailedSegment

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DetailedSegment
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


