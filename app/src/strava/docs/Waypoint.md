
# Waypoint


## Properties

Name | Type
------------ | -------------
`latlng` | Array&lt;number&gt;
`targetLatlng` | Array&lt;number&gt;
`categories` | Array&lt;string&gt;
`title` | string
`description` | string
`distanceIntoRoute` | number

## Example

```typescript
import type { Waypoint } from ''

// TODO: Update the object below with actual values
const example = {
  "latlng": null,
  "targetLatlng": null,
  "categories": null,
  "title": null,
  "description": null,
  "distanceIntoRoute": null,
} satisfies Waypoint

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Waypoint
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


