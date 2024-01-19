import localVarRequest from 'request';

export * from './activityStats';
export * from './activityTotal';
export * from './activityType';
export * from './activityZone';
export * from './altitudeStream';
export * from './baseStream';
export * from './cadenceStream';
export * from './clubActivity';
export * from './clubAthlete';
export * from './comment';
export * from './detailedActivity';
export * from './detailedAthlete';
export * from './detailedClub';
export * from './detailedGear';
export * from './detailedSegment';
export * from './detailedSegmentEffort';
export * from './distanceStream';
export * from './explorerResponse';
export * from './explorerSegment';
export * from './fault';
export * from './heartRateZoneRanges';
export * from './heartrateStream';
export * from './lap';
export * from './latLngStream';
export * from './metaActivity';
export * from './metaAthlete';
export * from './metaClub';
export * from './modelError';
export * from './movingStream';
export * from './photosSummary';
export * from './photosSummaryPrimary';
export * from './polylineMap';
export * from './powerStream';
export * from './powerZoneRanges';
export * from './route';
export * from './smoothGradeStream';
export * from './smoothVelocityStream';
export * from './split';
export * from './sportType';
export * from './streamSet';
export * from './summaryActivity';
export * from './summaryAthlete';
export * from './summaryClub';
export * from './summaryGear';
export * from './summaryPRSegmentEffort';
export * from './summarySegment';
export * from './summarySegmentEffort';
export * from './temperatureStream';
export * from './timeStream';
export * from './timedZoneRange';
export * from './updatableActivity';
export * from './upload';
export * from './zoneRange';
export * from './zones';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { ActivityStats } from './activityStats';
import { ActivityTotal } from './activityTotal';
import { ActivityType } from './activityType';
import { ActivityZone } from './activityZone';
import { AltitudeStream } from './altitudeStream';
import { BaseStream } from './baseStream';
import { CadenceStream } from './cadenceStream';
import { ClubActivity } from './clubActivity';
import { ClubAthlete } from './clubAthlete';
import { Comment } from './comment';
import { DetailedActivity } from './detailedActivity';
import { DetailedAthlete } from './detailedAthlete';
import { DetailedClub } from './detailedClub';
import { DetailedGear } from './detailedGear';
import { DetailedSegment } from './detailedSegment';
import { DetailedSegmentEffort } from './detailedSegmentEffort';
import { DistanceStream } from './distanceStream';
import { ExplorerResponse } from './explorerResponse';
import { ExplorerSegment } from './explorerSegment';
import { Fault } from './fault';
import { HeartRateZoneRanges } from './heartRateZoneRanges';
import { HeartrateStream } from './heartrateStream';
import { Lap } from './lap';
import { LatLngStream } from './latLngStream';
import { MetaActivity } from './metaActivity';
import { MetaAthlete } from './metaAthlete';
import { MetaClub } from './metaClub';
import { ModelError } from './modelError';
import { MovingStream } from './movingStream';
import { PhotosSummary } from './photosSummary';
import { PhotosSummaryPrimary } from './photosSummaryPrimary';
import { PolylineMap } from './polylineMap';
import { PowerStream } from './powerStream';
import { PowerZoneRanges } from './powerZoneRanges';
import { Route } from './route';
import { SmoothGradeStream } from './smoothGradeStream';
import { SmoothVelocityStream } from './smoothVelocityStream';
import { Split } from './split';
import { SportType } from './sportType';
import { StreamSet } from './streamSet';
import { SummaryActivity } from './summaryActivity';
import { SummaryAthlete } from './summaryAthlete';
import { SummaryClub } from './summaryClub';
import { SummaryGear } from './summaryGear';
import { SummaryPRSegmentEffort } from './summaryPRSegmentEffort';
import { SummarySegment } from './summarySegment';
import { SummarySegmentEffort } from './summarySegmentEffort';
import { TemperatureStream } from './temperatureStream';
import { TimeStream } from './timeStream';
import { TimedZoneRange } from './timedZoneRange';
import { UpdatableActivity } from './updatableActivity';
import { Upload } from './upload';
import { ZoneRange } from './zoneRange';
import { Zones } from './zones';

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
