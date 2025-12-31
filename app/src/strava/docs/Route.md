
# Route


## Properties

Name | Type
------------ | -------------
`athlete` | [SummaryAthlete](SummaryAthlete.md)
`description` | string
`distance` | number
`elevationGain` | number
`id` | number
`idStr` | string
`map` | [PolylineMap](PolylineMap.md)
`name` | string
`_private` | boolean
`starred` | boolean
`timestamp` | number
`type` | number
`subType` | number
`createdAt` | Date
`updatedAt` | Date
`estimatedMovingTime` | number
`segments` | [Array&lt;SummarySegment&gt;](SummarySegment.md)
`waypoints` | [Array&lt;Waypoint&gt;](Waypoint.md)

## Example

```typescript
import type { Route } from ''

// TODO: Update the object below with actual values
const example = {
  "athlete": null,
  "description": null,
  "distance": null,
  "elevationGain": null,
  "id": null,
  "idStr": null,
  "map": null,
  "name": null,
  "_private": null,
  "starred": null,
  "timestamp": null,
  "type": null,
  "subType": null,
  "createdAt": null,
  "updatedAt": null,
  "estimatedMovingTime": null,
  "segments": null,
  "waypoints": null,
} satisfies Route

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Route
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


