/**
 * Strava API v3
 * The [Swagger Playground](https://developers.strava.com/playground) is the easiest way to familiarize yourself with the Strava API by submitting HTTP requests and observing the responses before you write any client code. It will show what a response will look like with different endpoints depending on the authorization scope you receive from your athletes. To use the Playground, go to https://www.strava.com/settings/api and change your “Authorization Callback Domain” to developers.strava.com. Please note, we only support Swagger 2.0. There is a known issue where you can only select one scope at a time. For more information, please check the section “client code” at https://developers.strava.com/docs.
 *
 * The version of the OpenAPI document: 3.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from './models.js';
import { ActivityType } from './activityType.js';
import { MetaAthlete } from './metaAthlete.js';
import { PolylineMap } from './polylineMap.js';
import { SportType } from './sportType.js';

export class SummaryActivity {
    /**
    * The unique identifier of the activity
    */
    'id'?: number;
    /**
    * The identifier provided at upload time
    */
    'externalId'?: string;
    /**
    * The identifier of the upload that resulted in this activity
    */
    'uploadId'?: number;
    'athlete'?: MetaAthlete;
    /**
    * The name of the activity
    */
    'name'?: string;
    /**
    * The activity\'s distance, in meters
    */
    'distance'?: number;
    /**
    * The activity\'s moving time, in seconds
    */
    'movingTime'?: number;
    /**
    * The activity\'s elapsed time, in seconds
    */
    'elapsedTime'?: number;
    /**
    * The activity\'s total elevation gain.
    */
    'totalElevationGain'?: number;
    /**
    * The activity\'s highest elevation, in meters
    */
    'elevHigh'?: number;
    /**
    * The activity\'s lowest elevation, in meters
    */
    'elevLow'?: number;
    'type'?: ActivityType;
    'sportType'?: SportType;
    /**
    * The time at which the activity was started.
    */
    'startDate'?: Date;
    /**
    * The time at which the activity was started in the local timezone.
    */
    'startDateLocal'?: Date;
    /**
    * The timezone of the activity
    */
    'timezone'?: string;
    /**
    * A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers.
    */
    'startLatlng'?: Array<number>;
    /**
    * A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers.
    */
    'endLatlng'?: Array<number>;
    /**
    * The number of achievements gained during this activity
    */
    'achievementCount'?: number;
    /**
    * The number of kudos given for this activity
    */
    'kudosCount'?: number;
    /**
    * The number of comments for this activity
    */
    'commentCount'?: number;
    /**
    * The number of athletes for taking part in a group activity
    */
    'athleteCount'?: number;
    /**
    * The number of Instagram photos for this activity
    */
    'photoCount'?: number;
    /**
    * The number of Instagram and Strava photos for this activity
    */
    'totalPhotoCount'?: number;
    'map'?: PolylineMap;
    /**
    * Whether this activity was recorded on a training machine
    */
    'trainer'?: boolean;
    /**
    * Whether this activity is a commute
    */
    'commute'?: boolean;
    /**
    * Whether this activity was created manually
    */
    'manual'?: boolean;
    /**
    * Whether this activity is private
    */
    '_private'?: boolean;
    /**
    * Whether this activity is flagged
    */
    'flagged'?: boolean;
    /**
    * The activity\'s workout type
    */
    'workoutType'?: number;
    /**
    * The unique identifier of the upload in string format
    */
    'uploadIdStr'?: string;
    /**
    * The activity\'s average speed, in meters per second
    */
    'averageSpeed'?: number;
    /**
    * The activity\'s max speed, in meters per second
    */
    'maxSpeed'?: number;
    /**
    * Whether the logged-in athlete has kudoed this activity
    */
    'hasKudoed'?: boolean;
    /**
    * Whether the activity is muted
    */
    'hideFromHome'?: boolean;
    /**
    * The id of the gear for the activity
    */
    'gearId'?: string;
    /**
    * The total work done in kilojoules during this activity. Rides only
    */
    'kilojoules'?: number;
    /**
    * Average power output in watts during this activity. Rides only
    */
    'averageWatts'?: number;
    /**
    * Whether the watts are from a power meter, false if estimated
    */
    'deviceWatts'?: boolean;
    /**
    * Rides with power meter data only
    */
    'maxWatts'?: number;
    /**
    * Similar to Normalized Power. Rides with power meter data only
    */
    'weightedAverageWatts'?: number;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "number"
        },
        {
            "name": "externalId",
            "baseName": "external_id",
            "type": "string"
        },
        {
            "name": "uploadId",
            "baseName": "upload_id",
            "type": "number"
        },
        {
            "name": "athlete",
            "baseName": "athlete",
            "type": "MetaAthlete"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "distance",
            "baseName": "distance",
            "type": "number"
        },
        {
            "name": "movingTime",
            "baseName": "moving_time",
            "type": "number"
        },
        {
            "name": "elapsedTime",
            "baseName": "elapsed_time",
            "type": "number"
        },
        {
            "name": "totalElevationGain",
            "baseName": "total_elevation_gain",
            "type": "number"
        },
        {
            "name": "elevHigh",
            "baseName": "elev_high",
            "type": "number"
        },
        {
            "name": "elevLow",
            "baseName": "elev_low",
            "type": "number"
        },
        {
            "name": "type",
            "baseName": "type",
            "type": "ActivityType"
        },
        {
            "name": "sportType",
            "baseName": "sport_type",
            "type": "SportType"
        },
        {
            "name": "startDate",
            "baseName": "start_date",
            "type": "Date"
        },
        {
            "name": "startDateLocal",
            "baseName": "start_date_local",
            "type": "Date"
        },
        {
            "name": "timezone",
            "baseName": "timezone",
            "type": "string"
        },
        {
            "name": "startLatlng",
            "baseName": "start_latlng",
            "type": "Array<number>"
        },
        {
            "name": "endLatlng",
            "baseName": "end_latlng",
            "type": "Array<number>"
        },
        {
            "name": "achievementCount",
            "baseName": "achievement_count",
            "type": "number"
        },
        {
            "name": "kudosCount",
            "baseName": "kudos_count",
            "type": "number"
        },
        {
            "name": "commentCount",
            "baseName": "comment_count",
            "type": "number"
        },
        {
            "name": "athleteCount",
            "baseName": "athlete_count",
            "type": "number"
        },
        {
            "name": "photoCount",
            "baseName": "photo_count",
            "type": "number"
        },
        {
            "name": "totalPhotoCount",
            "baseName": "total_photo_count",
            "type": "number"
        },
        {
            "name": "map",
            "baseName": "map",
            "type": "PolylineMap"
        },
        {
            "name": "trainer",
            "baseName": "trainer",
            "type": "boolean"
        },
        {
            "name": "commute",
            "baseName": "commute",
            "type": "boolean"
        },
        {
            "name": "manual",
            "baseName": "manual",
            "type": "boolean"
        },
        {
            "name": "_private",
            "baseName": "private",
            "type": "boolean"
        },
        {
            "name": "flagged",
            "baseName": "flagged",
            "type": "boolean"
        },
        {
            "name": "workoutType",
            "baseName": "workout_type",
            "type": "number"
        },
        {
            "name": "uploadIdStr",
            "baseName": "upload_id_str",
            "type": "string"
        },
        {
            "name": "averageSpeed",
            "baseName": "average_speed",
            "type": "number"
        },
        {
            "name": "maxSpeed",
            "baseName": "max_speed",
            "type": "number"
        },
        {
            "name": "hasKudoed",
            "baseName": "has_kudoed",
            "type": "boolean"
        },
        {
            "name": "hideFromHome",
            "baseName": "hide_from_home",
            "type": "boolean"
        },
        {
            "name": "gearId",
            "baseName": "gear_id",
            "type": "string"
        },
        {
            "name": "kilojoules",
            "baseName": "kilojoules",
            "type": "number"
        },
        {
            "name": "averageWatts",
            "baseName": "average_watts",
            "type": "number"
        },
        {
            "name": "deviceWatts",
            "baseName": "device_watts",
            "type": "boolean"
        },
        {
            "name": "maxWatts",
            "baseName": "max_watts",
            "type": "number"
        },
        {
            "name": "weightedAverageWatts",
            "baseName": "weighted_average_watts",
            "type": "number"
        }    ];

    static getAttributeTypeMap() {
        return SummaryActivity.attributeTypeMap;
    }
}

export namespace SummaryActivity {
}
