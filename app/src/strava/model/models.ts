import localVarRequest from 'request';

export * from './activityStats.js';
export * from './activityTotal.js';
export * from './activityType.js';
export * from './activityZone.js';
export * from './altitudeStream.js';
export * from './baseStream.js';
export * from './cadenceStream.js';
export * from './clubActivity.js';
export * from './clubAthlete.js';
export * from './comment.js';
export * from './detailedActivity.js';
export * from './detailedAthlete.js';
export * from './detailedClub.js';
export * from './detailedGear.js';
export * from './detailedSegment.js';
export * from './detailedSegmentEffort.js';
export * from './distanceStream.js';
export * from './explorerResponse.js';
export * from './explorerSegment.js';
export * from './fault.js';
export * from './heartRateZoneRanges.js';
export * from './heartrateStream.js';
export * from './lap.js';
export * from './latLngStream.js';
export * from './metaActivity.js';
export * from './metaAthlete.js';
export * from './metaClub.js';
export * from './modelError.js';
export * from './movingStream.js';
export * from './photosSummary.js';
export * from './photosSummaryPrimary.js';
export * from './polylineMap.js';
export * from './powerStream.js';
export * from './powerZoneRanges.js';
export * from './route.js';
export * from './smoothGradeStream.js';
export * from './smoothVelocityStream.js';
export * from './split.js';
export * from './sportType.js';
export * from './streamSet.js';
export * from './summaryActivity.js';
export * from './summaryAthlete.js';
export * from './summaryClub.js';
export * from './summaryGear.js';
export * from './summaryPRSegmentEffort.js';
export * from './summarySegment.js';
export * from './summarySegmentEffort.js';
export * from './temperatureStream.js';
export * from './timeStream.js';
export * from './timedZoneRange.js';
export * from './updatableActivity.js';
export * from './upload.js';
export * from './zoneRange.js';
export * from './zones.js';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { ActivityStats } from './activityStats.js';
import { ActivityTotal } from './activityTotal.js';
import { ActivityType } from './activityType.js';
import { ActivityZone } from './activityZone.js';
import { AltitudeStream } from './altitudeStream.js';
import { BaseStream } from './baseStream.js';
import { CadenceStream } from './cadenceStream.js';
import { ClubActivity } from './clubActivity.js';
import { ClubAthlete } from './clubAthlete.js';
import { Comment } from './comment.js';
import { DetailedActivity } from './detailedActivity.js';
import { DetailedAthlete } from './detailedAthlete.js';
import { DetailedClub } from './detailedClub.js';
import { DetailedGear } from './detailedGear.js';
import { DetailedSegment } from './detailedSegment.js';
import { DetailedSegmentEffort } from './detailedSegmentEffort.js';
import { DistanceStream } from './distanceStream.js';
import { ExplorerResponse } from './explorerResponse.js';
import { ExplorerSegment } from './explorerSegment.js';
import { Fault } from './fault.js';
import { HeartRateZoneRanges } from './heartRateZoneRanges.js';
import { HeartrateStream } from './heartrateStream.js';
import { Lap } from './lap.js';
import { LatLngStream } from './latLngStream.js';
import { MetaActivity } from './metaActivity.js';
import { MetaAthlete } from './metaAthlete.js';
import { MetaClub } from './metaClub.js';
import { ModelError } from './modelError.js';
import { MovingStream } from './movingStream.js';
import { PhotosSummary } from './photosSummary.js';
import { PhotosSummaryPrimary } from './photosSummaryPrimary.js';
import { PolylineMap } from './polylineMap.js';
import { PowerStream } from './powerStream.js';
import { PowerZoneRanges } from './powerZoneRanges.js';
import { Route } from './route.js';
import { SmoothGradeStream } from './smoothGradeStream.js';
import { SmoothVelocityStream } from './smoothVelocityStream.js';
import { Split } from './split.js';
import { SportType } from './sportType.js';
import { StreamSet } from './streamSet.js';
import { SummaryActivity } from './summaryActivity.js';
import { SummaryAthlete } from './summaryAthlete.js';
import { SummaryClub } from './summaryClub.js';
import { SummaryGear } from './summaryGear.js';
import { SummaryPRSegmentEffort } from './summaryPRSegmentEffort.js';
import { SummarySegment } from './summarySegment.js';
import { SummarySegmentEffort } from './summarySegmentEffort.js';
import { TemperatureStream } from './temperatureStream.js';
import { TimeStream } from './timeStream.js';
import { TimedZoneRange } from './timedZoneRange.js';
import { UpdatableActivity } from './updatableActivity.js';
import { Upload } from './upload.js';
import { ZoneRange } from './zoneRange.js';
import { Zones } from './zones.js';

/* tslint:disable:no-unused-variable */
let primitives = [
                    "string",
                    "boolean",
                    "double",
                    "integer",
                    "long",
                    "float",
                    "number",
                    "any"
                 ];

let enumsMap: {[index: string]: any} = {
        "ActivityType": ActivityType,
        "ActivityZone.TypeEnum": ActivityZone.TypeEnum,
        "AltitudeStream.ResolutionEnum": AltitudeStream.ResolutionEnum,
        "AltitudeStream.SeriesTypeEnum": AltitudeStream.SeriesTypeEnum,
        "BaseStream.ResolutionEnum": BaseStream.ResolutionEnum,
        "BaseStream.SeriesTypeEnum": BaseStream.SeriesTypeEnum,
        "CadenceStream.ResolutionEnum": CadenceStream.ResolutionEnum,
        "CadenceStream.SeriesTypeEnum": CadenceStream.SeriesTypeEnum,
        "DetailedAthlete.SexEnum": DetailedAthlete.SexEnum,
        "DetailedAthlete.MeasurementPreferenceEnum": DetailedAthlete.MeasurementPreferenceEnum,
        "DetailedClub.SportTypeEnum": DetailedClub.SportTypeEnum,
        "DetailedClub.MembershipEnum": DetailedClub.MembershipEnum,
        "DetailedSegment.ActivityTypeEnum": DetailedSegment.ActivityTypeEnum,
        "DistanceStream.ResolutionEnum": DistanceStream.ResolutionEnum,
        "DistanceStream.SeriesTypeEnum": DistanceStream.SeriesTypeEnum,
        "ExplorerSegment.ClimbCategoryDescEnum": ExplorerSegment.ClimbCategoryDescEnum,
        "HeartrateStream.ResolutionEnum": HeartrateStream.ResolutionEnum,
        "HeartrateStream.SeriesTypeEnum": HeartrateStream.SeriesTypeEnum,
        "LatLngStream.ResolutionEnum": LatLngStream.ResolutionEnum,
        "LatLngStream.SeriesTypeEnum": LatLngStream.SeriesTypeEnum,
        "MovingStream.ResolutionEnum": MovingStream.ResolutionEnum,
        "MovingStream.SeriesTypeEnum": MovingStream.SeriesTypeEnum,
        "PowerStream.ResolutionEnum": PowerStream.ResolutionEnum,
        "PowerStream.SeriesTypeEnum": PowerStream.SeriesTypeEnum,
        "SmoothGradeStream.ResolutionEnum": SmoothGradeStream.ResolutionEnum,
        "SmoothGradeStream.SeriesTypeEnum": SmoothGradeStream.SeriesTypeEnum,
        "SmoothVelocityStream.ResolutionEnum": SmoothVelocityStream.ResolutionEnum,
        "SmoothVelocityStream.SeriesTypeEnum": SmoothVelocityStream.SeriesTypeEnum,
        "SportType": SportType,
        "SummaryAthlete.SexEnum": SummaryAthlete.SexEnum,
        "SummaryClub.SportTypeEnum": SummaryClub.SportTypeEnum,
        "SummarySegment.ActivityTypeEnum": SummarySegment.ActivityTypeEnum,
        "TemperatureStream.ResolutionEnum": TemperatureStream.ResolutionEnum,
        "TemperatureStream.SeriesTypeEnum": TemperatureStream.SeriesTypeEnum,
        "TimeStream.ResolutionEnum": TimeStream.ResolutionEnum,
        "TimeStream.SeriesTypeEnum": TimeStream.SeriesTypeEnum,
}

let typeMap: {[index: string]: any} = {
    "ActivityStats": ActivityStats,
    "ActivityTotal": ActivityTotal,
    "ActivityZone": ActivityZone,
    "AltitudeStream": AltitudeStream,
    "BaseStream": BaseStream,
    "CadenceStream": CadenceStream,
    "ClubActivity": ClubActivity,
    "ClubAthlete": ClubAthlete,
    "Comment": Comment,
    "DetailedActivity": DetailedActivity,
    "DetailedAthlete": DetailedAthlete,
    "DetailedClub": DetailedClub,
    "DetailedGear": DetailedGear,
    "DetailedSegment": DetailedSegment,
    "DetailedSegmentEffort": DetailedSegmentEffort,
    "DistanceStream": DistanceStream,
    "ExplorerResponse": ExplorerResponse,
    "ExplorerSegment": ExplorerSegment,
    "Fault": Fault,
    "HeartRateZoneRanges": HeartRateZoneRanges,
    "HeartrateStream": HeartrateStream,
    "Lap": Lap,
    "LatLngStream": LatLngStream,
    "MetaActivity": MetaActivity,
    "MetaAthlete": MetaAthlete,
    "MetaClub": MetaClub,
    "ModelError": ModelError,
    "MovingStream": MovingStream,
    "PhotosSummary": PhotosSummary,
    "PhotosSummaryPrimary": PhotosSummaryPrimary,
    "PolylineMap": PolylineMap,
    "PowerStream": PowerStream,
    "PowerZoneRanges": PowerZoneRanges,
    "Route": Route,
    "SmoothGradeStream": SmoothGradeStream,
    "SmoothVelocityStream": SmoothVelocityStream,
    "Split": Split,
    "StreamSet": StreamSet,
    "SummaryActivity": SummaryActivity,
    "SummaryAthlete": SummaryAthlete,
    "SummaryClub": SummaryClub,
    "SummaryGear": SummaryGear,
    "SummaryPRSegmentEffort": SummaryPRSegmentEffort,
    "SummarySegment": SummarySegment,
    "SummarySegmentEffort": SummarySegmentEffort,
    "TemperatureStream": TemperatureStream,
    "TimeStream": TimeStream,
    "TimedZoneRange": TimedZoneRange,
    "UpdatableActivity": UpdatableActivity,
    "Upload": Upload,
    "ZoneRange": ZoneRange,
    "Zones": Zones,
}

export class ObjectSerializer {
    public static findCorrectType(data: any, expectedType: string) {
        if (data == undefined) {
            return expectedType;
        } else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        } else if (expectedType === "Date") {
            return expectedType;
        } else {
            if (enumsMap[expectedType]) {
                return expectedType;
            }

            if (!typeMap[expectedType]) {
                return expectedType; // w/e we don't know the type
            }

            // Check the discriminator
            let discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty == null) {
                return expectedType; // the type does not have a discriminator. use it.
            } else {
                if (data[discriminatorProperty]) {
                    var discriminatorType = data[discriminatorProperty];
                    if(typeMap[discriminatorType]){
                        return discriminatorType; // use the type given in the discriminator
                    } else {
                        return expectedType; // discriminator did not map to a type
                    }
                } else {
                    return expectedType; // discriminator was not present (or an empty string)
                }
            }
        }
    }

    public static serialize(data: any, type: string) {
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf("Array<", 0) === 0) { // string.startsWith pre es6
            let subType: string = type.replace("Array<", ""); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.serialize(datum, subType));
            }
            return transformedData;
        } else if (type === "Date") {
            return data.toISOString();
        } else {
            if (enumsMap[type]) {
                return data;
            }
            if (!typeMap[type]) { // in case we dont know the type
                return data;
            }

            // Get the actual type of this object
            type = this.findCorrectType(data, type);

            // get the map for the correct type.
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            let instance: {[index: string]: any} = {};
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.baseName] = ObjectSerializer.serialize(data[attributeType.name], attributeType.type);
            }
            return instance;
        }
    }

    public static deserialize(data: any, type: string) {
        // polymorphism may change the actual type.
        type = ObjectSerializer.findCorrectType(data, type);
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf("Array<", 0) === 0) { // string.startsWith pre es6
            let subType: string = type.replace("Array<", ""); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.deserialize(datum, subType));
            }
            return transformedData;
        } else if (type === "Date") {
            return new Date(data);
        } else {
            if (enumsMap[type]) {// is Enum
                return data;
            }

            if (!typeMap[type]) { // dont know the type
                return data;
            }
            let instance = new typeMap[type]();
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.name] = ObjectSerializer.deserialize(data[attributeType.baseName], attributeType.type);
            }
            return instance;
        }
    }
}

export interface Authentication {
    /**
    * Apply authentication settings to header and query params.
    */
    applyToRequest(requestOptions: localVarRequest.Options): Promise<void> | void;
}

export class HttpBasicAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        requestOptions.auth = {
            username: this.username, password: this.password
        }
    }
}

export class HttpBearerAuth implements Authentication {
    public accessToken: string | (() => string) = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            const accessToken = typeof this.accessToken === 'function'
                            ? this.accessToken()
                            : this.accessToken;
            requestOptions.headers["Authorization"] = "Bearer " + accessToken;
        }
    }
}

export class ApiKeyAuth implements Authentication {
    public apiKey: string = '';

    constructor(private location: string, private paramName: string) {
    }

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (this.location == "query") {
            (<any>requestOptions.qs)[this.paramName] = this.apiKey;
        } else if (this.location == "header" && requestOptions && requestOptions.headers) {
            requestOptions.headers[this.paramName] = this.apiKey;
        } else if (this.location == 'cookie' && requestOptions && requestOptions.headers) {
            if (requestOptions.headers['Cookie']) {
                requestOptions.headers['Cookie'] += '; ' + this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
            else {
                requestOptions.headers['Cookie'] = this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
        }
    }
}

export class OAuth implements Authentication {
    public accessToken: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers["Authorization"] = "Bearer " + this.accessToken;
        }
    }
}

export class VoidAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(_: localVarRequest.Options): void {
        // Do nothing
    }
}

export type Interceptor = (requestOptions: localVarRequest.Options) => (Promise<void> | void);
