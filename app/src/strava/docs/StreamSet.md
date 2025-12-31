
# StreamSet


## Properties

Name | Type
------------ | -------------
`time` | [TimeStream](TimeStream.md)
`distance` | [DistanceStream](DistanceStream.md)
`latlng` | [LatLngStream](LatLngStream.md)
`altitude` | [AltitudeStream](AltitudeStream.md)
`velocitySmooth` | [SmoothVelocityStream](SmoothVelocityStream.md)
`heartrate` | [HeartrateStream](HeartrateStream.md)
`cadence` | [CadenceStream](CadenceStream.md)
`watts` | [PowerStream](PowerStream.md)
`temp` | [TemperatureStream](TemperatureStream.md)
`moving` | [MovingStream](MovingStream.md)
`gradeSmooth` | [SmoothGradeStream](SmoothGradeStream.md)

## Example

```typescript
import type { StreamSet } from ''

// TODO: Update the object below with actual values
const example = {
  "time": null,
  "distance": null,
  "latlng": null,
  "altitude": null,
  "velocitySmooth": null,
  "heartrate": null,
  "cadence": null,
  "watts": null,
  "temp": null,
  "moving": null,
  "gradeSmooth": null,
} satisfies StreamSet

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as StreamSet
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


