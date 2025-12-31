
# DetailedActivity


## Properties

Name | Type
------------ | -------------
`id` | number
`externalId` | string
`uploadId` | number
`athlete` | [MetaAthlete](MetaAthlete.md)
`name` | string
`distance` | number
`movingTime` | number
`elapsedTime` | number
`totalElevationGain` | number
`elevHigh` | number
`elevLow` | number
`type` | [ActivityType](ActivityType.md)
`sportType` | [SportType](SportType.md)
`startDate` | Date
`startDateLocal` | Date
`timezone` | string
`startLatlng` | Array&lt;number&gt;
`endLatlng` | Array&lt;number&gt;
`achievementCount` | number
`kudosCount` | number
`commentCount` | number
`athleteCount` | number
`photoCount` | number
`totalPhotoCount` | number
`map` | [PolylineMap](PolylineMap.md)
`deviceName` | string
`trainer` | boolean
`commute` | boolean
`manual` | boolean
`_private` | boolean
`flagged` | boolean
`workoutType` | number
`uploadIdStr` | string
`averageSpeed` | number
`maxSpeed` | number
`hasKudoed` | boolean
`hideFromHome` | boolean
`gearId` | string
`kilojoules` | number
`averageWatts` | number
`deviceWatts` | boolean
`maxWatts` | number
`weightedAverageWatts` | number
`description` | string
`photos` | [PhotosSummary](PhotosSummary.md)
`gear` | [SummaryGear](SummaryGear.md)
`calories` | number
`segmentEfforts` | [Array&lt;DetailedSegmentEffort&gt;](DetailedSegmentEffort.md)
`embedToken` | string
`splitsMetric` | [Array&lt;Split&gt;](Split.md)
`splitsStandard` | [Array&lt;Split&gt;](Split.md)
`laps` | [Array&lt;Lap&gt;](Lap.md)
`bestEfforts` | [Array&lt;DetailedSegmentEffort&gt;](DetailedSegmentEffort.md)

## Example

```typescript
import type { DetailedActivity } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "externalId": null,
  "uploadId": null,
  "athlete": null,
  "name": null,
  "distance": null,
  "movingTime": null,
  "elapsedTime": null,
  "totalElevationGain": null,
  "elevHigh": null,
  "elevLow": null,
  "type": null,
  "sportType": null,
  "startDate": null,
  "startDateLocal": null,
  "timezone": null,
  "startLatlng": null,
  "endLatlng": null,
  "achievementCount": null,
  "kudosCount": null,
  "commentCount": null,
  "athleteCount": null,
  "photoCount": null,
  "totalPhotoCount": null,
  "map": null,
  "deviceName": null,
  "trainer": null,
  "commute": null,
  "manual": null,
  "_private": null,
  "flagged": null,
  "workoutType": null,
  "uploadIdStr": null,
  "averageSpeed": null,
  "maxSpeed": null,
  "hasKudoed": null,
  "hideFromHome": null,
  "gearId": null,
  "kilojoules": null,
  "averageWatts": null,
  "deviceWatts": null,
  "maxWatts": null,
  "weightedAverageWatts": null,
  "description": null,
  "photos": null,
  "gear": null,
  "calories": null,
  "segmentEfforts": null,
  "embedToken": null,
  "splitsMetric": null,
  "splitsStandard": null,
  "laps": null,
  "bestEfforts": null,
} satisfies DetailedActivity

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DetailedActivity
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


