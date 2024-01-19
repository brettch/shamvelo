export * from './activitiesApi';
import { ActivitiesApi } from './activitiesApi';
export * from './athletesApi';
import { AthletesApi } from './athletesApi';
export * from './clubsApi';
import { ClubsApi } from './clubsApi';
export * from './gearsApi';
import { GearsApi } from './gearsApi';
export * from './routesApi';
import { RoutesApi } from './routesApi';
export * from './segmentEffortsApi';
import { SegmentEffortsApi } from './segmentEffortsApi';
export * from './segmentsApi';
import { SegmentsApi } from './segmentsApi';
export * from './streamsApi';
import { StreamsApi } from './streamsApi';
export * from './uploadsApi';
import { UploadsApi } from './uploadsApi';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export { RequestFile } from '../model/models';

export const APIS = [ActivitiesApi, AthletesApi, ClubsApi, GearsApi, RoutesApi, SegmentEffortsApi, SegmentsApi, StreamsApi, UploadsApi];
