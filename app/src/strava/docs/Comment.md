
# Comment


## Properties

Name | Type
------------ | -------------
`id` | number
`activityId` | number
`text` | string
`athlete` | [SummaryAthlete](SummaryAthlete.md)
`createdAt` | Date

## Example

```typescript
import type { Comment } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "activityId": null,
  "text": null,
  "athlete": null,
  "createdAt": null,
} satisfies Comment

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Comment
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


