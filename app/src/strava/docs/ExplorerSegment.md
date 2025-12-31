
# ExplorerSegment


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`climbCategory` | number
`climbCategoryDesc` | string
`avgGrade` | number
`startLatlng` | Array&lt;number&gt;
`endLatlng` | Array&lt;number&gt;
`elevDifference` | number
`distance` | number
`points` | string

## Example

```typescript
import type { ExplorerSegment } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "climbCategory": null,
  "climbCategoryDesc": null,
  "avgGrade": null,
  "startLatlng": null,
  "endLatlng": null,
  "elevDifference": null,
  "distance": null,
  "points": null,
} satisfies ExplorerSegment

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ExplorerSegment
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


