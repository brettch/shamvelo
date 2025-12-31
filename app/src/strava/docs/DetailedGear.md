
# DetailedGear


## Properties

Name | Type
------------ | -------------
`id` | string
`resourceState` | number
`primary` | boolean
`name` | string
`distance` | number
`brandName` | string
`modelName` | string
`frameType` | number
`description` | string

## Example

```typescript
import type { DetailedGear } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "resourceState": null,
  "primary": null,
  "name": null,
  "distance": null,
  "brandName": null,
  "modelName": null,
  "frameType": null,
  "description": null,
} satisfies DetailedGear

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DetailedGear
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


