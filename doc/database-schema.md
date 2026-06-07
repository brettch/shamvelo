# Database Schema

Mermaid class diagram of the Firestore database structure for Shamvelo.

```mermaid
classDiagram
    direction TB

    %% ─── Collections ───────────────────────────────────────────────

    class tokens {
        <<collection>>
        +string id (athleteId)
        +string access_token
        +string refresh_token
        +number expires_at
        +number expires_in
    }

    class athletes {
        <<collection>>
        +string id (athleteId)
        +string firstname
        +string lastname
    }

    class activities {
        <<collection>>
        +string id (activityId)
        +object athlete { id }
        +number distance
        +number movingTime
        +string name
        +Date startDate
        +number totalElevationGain
        +ActivityType type
    }

    class athlete_summaries {
        <<collection>>
        +string id [athleteId-leaderboardCode]
        +AthleteSummaryId id
        +Record~string,AthleteYearContainer~ year
    }

    class leaderboards {
        <<collection>>
        +string id [year-leaderboardCode]
        +YearContainerId id
        +LbPeriodSummary summary
        +Record~number,LbPeriodContainer~ month
        +Record~number,LbPeriodContainer~ week
        +YearPoints points
    }

    %% ─── Athlete-side nested types ─────────────────────────────────

    class AthleteSummaryId {
        +number athleteId
        +string leaderboardCode
    }

    class AthleteYearContainer {
        +AthletePeriodSummary summary
        +Record~number,AthletePeriodContainer~ month
        +Record~number,AthletePeriodContainer~ week
    }

    class AthletePeriodContainer {
        +AthletePeriodSummary summary
    }

    class AthletePeriodSummary {
        +number distance
        +number elevation
        +number movingTime
        +number activityCount
        +number averageSpeed
        +Record~string,DaySummary~ activeDays
        +number activeDayCount
        +number eddingtonNumber
        +RideSummary[] longestRide
        +RideSummary[] fastestRide
    }

    %% ─── Leaderboard-side nested types ─────────────────────────────

    class YearContainerId {
        +string leaderboardCode
        +number year
    }

    class LbPeriodSummary {
        +AthleteScore[] activityCount
        +AthleteScore[] activeDayCount
        +AthleteScore[] averageSpeed
        +AthleteScore[] distance
        +AthleteScore[] eddingtonNumber
        +AthleteScore[] elevation
        +RideScore[] fastestRide
        +RideScore[] longestRide
        +AthleteScore[] movingTime
    }

    class LbPeriodContainer {
        +LbPeriodSummary summary
    }

    class YearPoints {
        +PeriodPoints month
        +PeriodPoints week
    }

    class PeriodPoints {
        +AthleteScore[] activeDayCount
        +AthleteScore[] activityCount
        +AthleteScore[] averageSpeed
        +AthleteScore[] distance
        +AthleteScore[] elevation
        +AthleteScore[] eddingtonNumber
        +AthleteScore[] fastestRide
        +AthleteScore[] longestRide
        +AthleteScore[] movingTime
        +AthleteScore[] total
    }

    class AthleteScore {
        +number value
        +Named~number~ athlete
    }

    class RideScore {
        +number value
        +Named~number~ athlete
        +Named~number~ ride
    }

    class DaySummary {
        +number distance
    }

    class RideSummary {
        +number id
        +string name
        +number value
    }

    %% ─── Enums ─────────────────────────────────────────────────────

    class ActivityType {
        <<enum>>
        Ride
        VirtualRide
        Run
        Swim
        ...
    }

    class LeaderboardCode {
        <<enum>>
        reality  "Keeping It Real"
        virtual  "Virtual Insanity"
        all      "It All Counts"
    }

    %% ─── Relationships ─────────────────────────────────────────────

    tokens --> athletes : id
    activities --> athletes : athlete.id
    athlete_summaries --> athletes : id.athleteId
    athlete_summaries --> LeaderboardCode : id.leaderboardCode
    leaderboards --> LeaderboardCode : id.leaderboardCode
    leaderboards --> athletes : AthleteScore.athlete.id

    %% ─── Composition (nested within documents) ────────────────────

    athlete_summaries *-- AthleteSummaryId : id
    athlete_summaries *-- AthleteYearContainer : year[]

    AthleteYearContainer *-- AthletePeriodContainer : month/week[]
    AthletePeriodContainer *-- AthletePeriodSummary : summary
    AthletePeriodSummary *-- DaySummary : activeDays[]
    AthletePeriodSummary *-- RideSummary : longestRide / fastestRide

    leaderboards *-- YearContainerId : id
    leaderboards *-- LbPeriodSummary : summary
    leaderboards *-- LbPeriodContainer : month/week[]
    LbPeriodContainer *-- LbPeriodSummary : summary
    LbPeriodSummary *-- AthleteScore : (all score fields)
    LbPeriodSummary *-- RideScore : fastestRide / longestRide
    RideScore --|> AthleteScore

    leaderboards *-- YearPoints : points
    YearPoints *-- PeriodPoints : month / week
    PeriodPoints *-- AthleteScore : (all point fields)

    activities --> ActivityType : type
```

## Collection Details

| Collection | Document key | Description |
|---|---|---|
| `tokens` | `{athleteId}` | Strava OAuth tokens (access/refresh) per athlete |
| `athletes` | `{athleteId}` | Slim athlete profile (name only) |
| `activities` | `{activityId}` | Slim activity data synced from Strava |
| `athlete_summaries` | `{athleteId}-{leaderboardCode}` | Pre-computed per-athlete stats per leaderboard |
| `leaderboards` | `{year}-{leaderboardCode}` | Ranked scores across all athletes per year |

## Key Relationships

- **`tokens`** and **`activities`** reference **`athletes`** by `athlete.id`
- **`athlete-summaries`** reference **`athletes`** by `athleteId` and a **leaderboard code**
- **`leaderboards`** reference **`athletes`** indirectly via `AthleteScore.athlete.id`
- **`activities`** filter into **`athlete-summaries`** based on `type` (only `Ride` / `VirtualRide`)
- **`athlete-summaries`** are merged into **`leaderboards`** by leaderboard code
