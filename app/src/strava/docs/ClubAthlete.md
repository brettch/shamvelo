
# ClubAthlete


## Properties

Name | Type
------------ | -------------
`resourceState` | number
`firstname` | string
`lastname` | string
`member` | string
`admin` | boolean
`owner` | boolean

## Example

```typescript
import type { ClubAthlete } from ''

// TODO: Update the object below with actual values
const example = {
  "resourceState": null,
  "firstname": null,
  "lastname": null,
  "member": null,
  "admin": null,
  "owner": null,
} satisfies ClubAthlete

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ClubAthlete
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


