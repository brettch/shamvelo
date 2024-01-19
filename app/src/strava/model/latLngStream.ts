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

export class LatLngStream {
    /**
    * The number of data points in this stream
    */
    'originalSize'?: number;
    /**
    * The level of detail (sampling) in which this stream was returned
    */
    'resolution'?: LatLngStream.ResolutionEnum;
    /**
    * The base series used in the case the stream was downsampled
    */
    'seriesType'?: LatLngStream.SeriesTypeEnum;
    /**
    * The sequence of lat/long values for this stream
    */
    'data'?: Array<Array<number>>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "originalSize",
            "baseName": "original_size",
            "type": "number"
        },
        {
            "name": "resolution",
            "baseName": "resolution",
            "type": "LatLngStream.ResolutionEnum"
        },
        {
            "name": "seriesType",
            "baseName": "series_type",
            "type": "LatLngStream.SeriesTypeEnum"
        },
        {
            "name": "data",
            "baseName": "data",
            "type": "Array<Array<number>>"
        }    ];

    static getAttributeTypeMap() {
        return LatLngStream.attributeTypeMap;
    }
}

export namespace LatLngStream {
    export enum ResolutionEnum {
        Low = <any> 'low',
        Medium = <any> 'medium',
        High = <any> 'high'
    }
    export enum SeriesTypeEnum {
        Distance = <any> 'distance',
        Time = <any> 'time'
    }
}
