
# ActivityStats

A set of rolled-up statistics and totals for an athlete

## Properties

Name | Type
------------ | -------------
`biggestRideDistance` | number
`biggestClimbElevationGain` | number
`recentRideTotals` | [ActivityTotal](ActivityTotal.md)
`recentRunTotals` | [ActivityTotal](ActivityTotal.md)
`recentSwimTotals` | [ActivityTotal](ActivityTotal.md)
`ytdRideTotals` | [ActivityTotal](ActivityTotal.md)
`ytdRunTotals` | [ActivityTotal](ActivityTotal.md)
`ytdSwimTotals` | [ActivityTotal](ActivityTotal.md)
`allRideTotals` | [ActivityTotal](ActivityTotal.md)
`allRunTotals` | [ActivityTotal](ActivityTotal.md)
`allSwimTotals` | [ActivityTotal](ActivityTotal.md)

## Example

```typescript
import type { ActivityStats } from ''

// TODO: Update the object below with actual values
const example = {
  "biggestRideDistance": null,
  "biggestClimbElevationGain": null,
  "recentRideTotals": null,
  "recentRunTotals": null,
  "recentSwimTotals": null,
  "ytdRideTotals": null,
  "ytdRunTotals": null,
  "ytdSwimTotals": null,
  "allRideTotals": null,
  "allRunTotals": null,
  "allSwimTotals": null,
} satisfies ActivityStats

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ActivityStats
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


