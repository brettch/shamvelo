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
import { ActivityTotal } from './activityTotal.js';

/**
* A set of rolled-up statistics and totals for an athlete
*/
export class ActivityStats {
    /**
    * The longest distance ridden by the athlete.
    */
    'biggestRideDistance'?: number;
    /**
    * The highest climb ridden by the athlete.
    */
    'biggestClimbElevationGain'?: number;
    'recentRideTotals'?: ActivityTotal;
    'recentRunTotals'?: ActivityTotal;
    'recentSwimTotals'?: ActivityTotal;
    'ytdRideTotals'?: ActivityTotal;
    'ytdRunTotals'?: ActivityTotal;
    'ytdSwimTotals'?: ActivityTotal;
    'allRideTotals'?: ActivityTotal;
    'allRunTotals'?: ActivityTotal;
    'allSwimTotals'?: ActivityTotal;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "biggestRideDistance",
            "baseName": "biggest_ride_distance",
            "type": "number"
        },
        {
            "name": "biggestClimbElevationGain",
            "baseName": "biggest_climb_elevation_gain",
            "type": "number"
        },
        {
            "name": "recentRideTotals",
            "baseName": "recent_ride_totals",
            "type": "ActivityTotal"
        },
        {
            "name": "recentRunTotals",
            "baseName": "recent_run_totals",
            "type": "ActivityTotal"
        },
        {
            "name": "recentSwimTotals",
            "baseName": "recent_swim_totals",
            "type": "ActivityTotal"
        },
        {
            "name": "ytdRideTotals",
            "baseName": "ytd_ride_totals",
            "type": "ActivityTotal"
        },
        {
            "name": "ytdRunTotals",
            "baseName": "ytd_run_totals",
            "type": "ActivityTotal"
        },
        {
            "name": "ytdSwimTotals",
            "baseName": "ytd_swim_totals",
            "type": "ActivityTotal"
        },
        {
            "name": "allRideTotals",
            "baseName": "all_ride_totals",
            "type": "ActivityTotal"
        },
        {
            "name": "allRunTotals",
            "baseName": "all_run_totals",
            "type": "ActivityTotal"
        },
        {
            "name": "allSwimTotals",
            "baseName": "all_swim_totals",
            "type": "ActivityTotal"
        }    ];

    static getAttributeTypeMap() {
        return ActivityStats.attributeTypeMap;
    }
}

