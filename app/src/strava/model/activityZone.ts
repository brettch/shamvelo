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
import { TimedZoneRange } from './timedZoneRange.js';

export class ActivityZone {
    'score'?: number;
    /**
    * Stores the exclusive ranges representing zones and the time spent in each.
    */
    'distributionBuckets'?: Array<TimedZoneRange>;
    'type'?: ActivityZone.TypeEnum;
    'sensorBased'?: boolean;
    'points'?: number;
    'customZones'?: boolean;
    'max'?: number;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "score",
            "baseName": "score",
            "type": "number"
        },
        {
            "name": "distributionBuckets",
            "baseName": "distribution_buckets",
            "type": "Array<TimedZoneRange>"
        },
        {
            "name": "type",
            "baseName": "type",
            "type": "ActivityZone.TypeEnum"
        },
        {
            "name": "sensorBased",
            "baseName": "sensor_based",
            "type": "boolean"
        },
        {
            "name": "points",
            "baseName": "points",
            "type": "number"
        },
        {
            "name": "customZones",
            "baseName": "custom_zones",
            "type": "boolean"
        },
        {
            "name": "max",
            "baseName": "max",
            "type": "number"
        }    ];

    static getAttributeTypeMap() {
        return ActivityZone.attributeTypeMap;
    }
}

export namespace ActivityZone {
    export enum TypeEnum {
        Heartrate = <any> 'heartrate',
        Power = <any> 'power'
    }
}
