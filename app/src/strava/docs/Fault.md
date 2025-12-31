
# Fault

Encapsulates the errors that may be returned from the API.

## Properties

Name | Type
------------ | -------------
`errors` | Array&lt;Error&gt;
`message` | string

## Example

```typescript
import type { Fault } from ''

// TODO: Update the object below with actual values
const example = {
  "errors": null,
  "message": null,
} satisfies Fault

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Fault
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


