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

import { RequestFile } from './models';
import { MetaActivity } from './metaActivity';
import { MetaAthlete } from './metaAthlete';
import { SummarySegment } from './summarySegment';

export class DetailedSegmentEffort {
    /**
    * The unique identifier of this effort
    */
    'id'?: number;
    /**
    * The unique identifier of the activity related to this effort
    */
    'activityId'?: number;
    /**
    * The effort\'s elapsed time
    */
    'elapsedTime'?: number;
    /**
    * The time at which the effort was started.
    */
    'startDate'?: Date;
    /**
    * The time at which the effort was started in the local timezone.
    */
    'startDateLocal'?: Date;
    /**
    * The effort\'s distance in meters
    */
    'distance'?: number;
    /**
    * Whether this effort is the current best on the leaderboard
    */
    'isKom'?: boolean;
    /**
    * The name of the segment on which this effort was performed
    */
    'name'?: string;
    'activity'?: MetaActivity;
    'athlete'?: MetaAthlete;
    /**
    * The effort\'s moving time
    */
    'movingTime'?: number;
    /**
    * The start index of this effort in its activity\'s stream
    */
    'startIndex'?: number;
    /**
    * The end index of this effort in its activity\'s stream
    */
    'endIndex'?: number;
    /**
    * The effort\'s average cadence
    */
    'averageCadence'?: number;
    /**
    * The average wattage of this effort
    */
    'averageWatts'?: number;
    /**
    * For riding efforts, whether the wattage was reported by a dedicated recording device
    */
    'deviceWatts'?: boolean;
    /**
    * The heart heart rate of the athlete during this effort
    */
    'averageHeartrate'?: number;
    /**
    * The maximum heart rate of the athlete during this effort
    */
    'maxHeartrate'?: number;
    'segment'?: SummarySegment;
    /**
    * The rank of the effort on the global leaderboard if it belongs in the top 10 at the time of upload
    */
    'komRank'?: number;
    /**
    * The rank of the effort on the athlete\'s leaderboard if it belongs in the top 3 at the time of upload
    */
    'prRank'?: number;
    /**
    * Whether this effort should be hidden when viewed within an activity
    */
    'hidden'?: boolean;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "number"
        },
        {
            "name": "activityId",
            "baseName": "activity_id",
            "type": "number"
        },
        {
            "name": "elapsedTime",
            "baseName": "elapsed_time",
            "type": "number"
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
            "name": "distance",
            "baseName": "distance",
            "type": "number"
        },
        {
            "name": "isKom",
            "baseName": "is_kom",
            "type": "boolean"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "activity",
            "baseName": "activity",
            "type": "MetaActivity"
        },
        {
            "name": "athlete",
            "baseName": "athlete",
            "type": "MetaAthlete"
        },
        {
            "name": "movingTime",
            "baseName": "moving_time",
            "type": "number"
        },
        {
            "name": "startIndex",
            "baseName": "start_index",
            "type": "number"
        },
        {
            "name": "endIndex",
            "baseName": "end_index",
            "type": "number"
        },
        {
            "name": "averageCadence",
            "baseName": "average_cadence",
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
            "name": "averageHeartrate",
            "baseName": "average_heartrate",
            "type": "number"
        },
        {
            "name": "maxHeartrate",
            "baseName": "max_heartrate",
            "type": "number"
        },
        {
            "name": "segment",
            "baseName": "segment",
            "type": "SummarySegment"
        },
        {
            "name": "komRank",
            "baseName": "kom_rank",
            "type": "number"
        },
        {
            "name": "prRank",
            "baseName": "pr_rank",
            "type": "number"
        },
        {
            "name": "hidden",
            "baseName": "hidden",
            "type": "boolean"
        }    ];

    static getAttributeTypeMap() {
        return DetailedSegmentEffort.attributeTypeMap;
    }
}

