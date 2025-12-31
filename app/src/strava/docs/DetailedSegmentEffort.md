
# DetailedSegmentEffort


## Properties

Name | Type
------------ | -------------
`id` | number
`activityId` | number
`elapsedTime` | number
`startDate` | Date
`startDateLocal` | Date
`distance` | number
`isKom` | boolean
`name` | string
`activity` | [MetaActivity](MetaActivity.md)
`athlete` | [MetaAthlete](MetaAthlete.md)
`movingTime` | number
`startIndex` | number
`endIndex` | number
`averageCadence` | number
`averageWatts` | number
`deviceWatts` | boolean
`averageHeartrate` | number
`maxHeartrate` | number
`segment` | [SummarySegment](SummarySegment.md)
`komRank` | number
`prRank` | number
`hidden` | boolean

## Example

```typescript
import type { DetailedSegmentEffort } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "activityId": null,
  "elapsedTime": null,
  "startDate": null,
  "startDateLocal": null,
  "distance": null,
  "isKom": null,
  "name": null,
  "activity": null,
  "athlete": null,
  "movingTime": null,
  "startIndex": null,
  "endIndex": null,
  "averageCadence": null,
  "averageWatts": null,
  "deviceWatts": null,
  "averageHeartrate": null,
  "maxHeartrate": null,
  "segment": null,
  "komRank": null,
  "prRank": null,
  "hidden": null,
} satisfies DetailedSegmentEffort

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DetailedSegmentEffort
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


