
# UpdatableActivity


## Properties

Name | Type
------------ | -------------
`commute` | boolean
`trainer` | boolean
`hideFromHome` | boolean
`description` | string
`name` | string
`type` | [ActivityType](ActivityType.md)
`sportType` | [SportType](SportType.md)
`gearId` | string

## Example

```typescript
import type { UpdatableActivity } from ''

// TODO: Update the object below with actual values
const example = {
  "commute": null,
  "trainer": null,
  "hideFromHome": null,
  "description": null,
  "name": null,
  "type": null,
  "sportType": null,
  "gearId": null,
} satisfies UpdatableActivity

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdatableActivity
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


