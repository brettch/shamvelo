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

export class SummaryClub {
    /**
    * The club\'s unique identifier.
    */
    'id'?: number;
    /**
    * Resource state, indicates level of detail. Possible values: 1 -> \"meta\", 2 -> \"summary\", 3 -> \"detail\"
    */
    'resourceState'?: number;
    /**
    * The club\'s name.
    */
    'name'?: string;
    /**
    * URL to a 60x60 pixel profile picture.
    */
    'profileMedium'?: string;
    /**
    * URL to a ~1185x580 pixel cover photo.
    */
    'coverPhoto'?: string;
    /**
    * URL to a ~360x176  pixel cover photo.
    */
    'coverPhotoSmall'?: string;
    /**
    * Deprecated. Prefer to use activity_types.
    */
    'sportType'?: SummaryClub.SportTypeEnum;
    /**
    * The activity types that count for a club. This takes precedence over sport_type.
    */
    'activityTypes'?: Array<ActivityType>;
    /**
    * The club\'s city.
    */
    'city'?: string;
    /**
    * The club\'s state or geographical region.
    */
    'state'?: string;
    /**
    * The club\'s country.
    */
    'country'?: string;
    /**
    * Whether the club is private.
    */
    '_private'?: boolean;
    /**
    * The club\'s member count.
    */
    'memberCount'?: number;
    /**
    * Whether the club is featured or not.
    */
    'featured'?: boolean;
    /**
    * Whether the club is verified or not.
    */
    'verified'?: boolean;
    /**
    * The club\'s vanity URL.
    */
    'url'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "number"
        },
        {
            "name": "resourceState",
            "baseName": "resource_state",
            "type": "number"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "profileMedium",
            "baseName": "profile_medium",
            "type": "string"
        },
        {
            "name": "coverPhoto",
            "baseName": "cover_photo",
            "type": "string"
        },
        {
            "name": "coverPhotoSmall",
            "baseName": "cover_photo_small",
            "type": "string"
        },
        {
            "name": "sportType",
            "baseName": "sport_type",
            "type": "SummaryClub.SportTypeEnum"
        },
        {
            "name": "activityTypes",
            "baseName": "activity_types",
            "type": "Array<ActivityType>"
        },
        {
            "name": "city",
            "baseName": "city",
            "type": "string"
        },
        {
            "name": "state",
            "baseName": "state",
            "type": "string"
        },
        {
            "name": "country",
            "baseName": "country",
            "type": "string"
        },
        {
            "name": "_private",
            "baseName": "private",
            "type": "boolean"
        },
        {
            "name": "memberCount",
            "baseName": "member_count",
            "type": "number"
        },
        {
            "name": "featured",
            "baseName": "featured",
            "type": "boolean"
        },
        {
            "name": "verified",
            "baseName": "verified",
            "type": "boolean"
        },
        {
            "name": "url",
            "baseName": "url",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return SummaryClub.attributeTypeMap;
    }
}

export namespace SummaryClub {
    export enum SportTypeEnum {
        Cycling = <any> 'cycling',
        Running = <any> 'running',
        Triathlon = <any> 'triathlon',
        Other = <any> 'other'
    }
}
