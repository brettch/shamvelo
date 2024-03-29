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

export class SummaryGear {
    /**
    * The gear\'s unique identifier.
    */
    'id'?: string;
    /**
    * Resource state, indicates level of detail. Possible values: 2 -> \"summary\", 3 -> \"detail\"
    */
    'resourceState'?: number;
    /**
    * Whether this gear\'s is the owner\'s default one.
    */
    'primary'?: boolean;
    /**
    * The gear\'s name.
    */
    'name'?: string;
    /**
    * The distance logged with this gear.
    */
    'distance'?: number;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "resourceState",
            "baseName": "resource_state",
            "type": "number"
        },
        {
            "name": "primary",
            "baseName": "primary",
            "type": "boolean"
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
        }    ];

    static getAttributeTypeMap() {
        return SummaryGear.attributeTypeMap;
    }
}

