
# TimedZoneRange

A union type representing the time spent in a given zone.

## Properties

Name | Type
------------ | -------------
`min` | number
`max` | number
`time` | number

## Example

```typescript
import type { TimedZoneRange } from ''

// TODO: Update the object below with actual values
const example = {
  "min": null,
  "max": null,
  "time": null,
} satisfies TimedZoneRange

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TimedZoneRange
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


