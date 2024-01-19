export * from './activitiesApi.js';
import { ActivitiesApi } from './activitiesApi.js';
export * from './athletesApi.js';
import { AthletesApi } from './athletesApi.js';
export * from './clubsApi.js';
import { ClubsApi } from './clubsApi.js';
export * from './gearsApi.js';
import { GearsApi } from './gearsApi.js';
export * from './routesApi.js';
import { RoutesApi } from './routesApi.js';
export * from './segmentEffortsApi.js';
import { SegmentEffortsApi } from './segmentEffortsApi.js';
export * from './segmentsApi.js';
import { SegmentsApi } from './segmentsApi.js';
export * from './streamsApi.js';
import { StreamsApi } from './streamsApi.js';
export * from './uploadsApi.js';
import { UploadsApi } from './uploadsApi.js';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export { RequestFile } from '../model/models.js';

export const APIS = [ActivitiesApi, AthletesApi, ClubsApi, GearsApi, RoutesApi, SegmentEffortsApi, SegmentsApi, StreamsApi, UploadsApi];
