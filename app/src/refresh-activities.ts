import { appConfig } from './config.js';
import { athletePersist, refreshStatePersist, processActivityRefreshChunk, finalizeActivityRefresh } from './engine.js';

const ACTIVITIES_PER_PAGE = 100;
const LOCAL_TASK_DELAY_MS = 100;
const WRITE_BATCH_SIZE = 100;
const PAGE_CONCURRENCY = 10;
const FULL_BATCH_SIZE = PAGE_CONCURRENCY * ACTIVITIES_PER_PAGE;

export interface InitRefresh {
  type: 'init';
  athleteId: number;
}

export interface ChunkRefresh {
  type: 'chunk';
  athleteId: number;
  batchStart: number;
  batchId: string;
}

export interface FinalizeRefresh {
  type: 'finalize';
  athleteId: number;
  batchId: string;
}

export type RefreshPayload = InitRefresh | ChunkRefresh | FinalizeRefresh;

export async function enqueueRefreshActivity(payload: RefreshPayload): Promise<void> {
  const serviceUrl = appConfig.cloudTasksServiceUrl;
  if (serviceUrl) {
    await enqueueCloudActivity(payload, serviceUrl);
  } else {
    enqueueLocalActivity(payload);
  }
}

export async function refreshAthleteActivities(athleteId: number): Promise<void> {
  console.log('Queueing refresh of athlete activities ' + athleteId);
  await enqueueRefreshActivity({ type: 'init', athleteId });
}

type CloudTasksClient = import('@google-cloud/tasks').v2.CloudTasksClient;

let cloudTasksClient: CloudTasksClient | undefined;

async function getCloudTasksClient(): Promise<CloudTasksClient> {
  if (!cloudTasksClient) {
    const tasks = await import('@google-cloud/tasks');
    cloudTasksClient = new tasks.v2.CloudTasksClient();
  }
  return cloudTasksClient;
}

async function enqueueCloudActivity(payload: RefreshPayload, serviceUrl: string): Promise<void> {
  const client = await getCloudTasksClient();
  const parent = client.queuePath(
    appConfig.firebaseProjectId,
    appConfig.cloudTasksLocation,
    appConfig.cloudTasksQueue,
  );

  const body = JSON.stringify(payload);
  const bodyBytes = Buffer.from(body).toString('base64');

  await client.createTask({
    parent,
    task: {
      httpRequest: {
        url: `${serviceUrl}/tasks/refresh`,
        httpMethod: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tasks-Auth-Token': appConfig.tasksAuthToken,
        },
        body: bodyBytes,
        oidcToken: {
          serviceAccountEmail: undefined,
          audience: serviceUrl,
        },
      },
    },
  });
}

function enqueueLocalActivity(payload: RefreshPayload): void {
  setTimeout(() => {
    dispatchActivity(payload).catch(err =>
      console.log('[refresh-activities] local dispatch error:', err)
    );
  }, LOCAL_TASK_DELAY_MS);
}

export async function dispatchActivity(payload: RefreshPayload): Promise<void> {
  switch (payload.type) {
    case 'init':
      return handleInit(payload.athleteId);
    case 'chunk':
      return handleChunk(payload.athleteId, payload.batchStart, payload.batchId);
    case 'finalize':
      return handleFinalize(payload.athleteId, payload.batchId);
  }
}

async function handleInit(athleteId: number): Promise<void> {
  console.log(`[refresh-activities] init: athlete ${athleteId}`);

  const athlete = await athletePersist.getIfExists(athleteId);
  if (!athlete) {
    console.log(`[refresh-activities] init: athlete ${athleteId} not found, aborting`);
    return;
  }

  const batchId = `refresh-${athleteId}-${Date.now()}`;
  await refreshStatePersist.set({ id: athleteId, batchId });

  console.log(`[refresh-activities] init: athlete ${athleteId} batchId ${batchId}, enqueuing first chunk`);
  await enqueueRefreshActivity({ type: 'chunk', athleteId, batchStart: 1, batchId });
}

async function handleChunk(athleteId: number, batchStart: number, batchId: string): Promise<void> {
  console.log(`[refresh-activities] chunk: athlete ${athleteId} pages ${batchStart}-${batchStart + PAGE_CONCURRENCY - 1} batchId ${batchId}`);

  const activities = await processActivityRefreshChunk(athleteId, batchStart, PAGE_CONCURRENCY, batchId, WRITE_BATCH_SIZE);

  if (activities.length < FULL_BATCH_SIZE) {
    console.log(`[refresh-activities] chunk: last batch (${activities.length} < ${FULL_BATCH_SIZE}), enqueuing finalize`);
    await enqueueRefreshActivity({ type: 'finalize', athleteId, batchId });
  } else {
    const nextBatchStart = batchStart + PAGE_CONCURRENCY;
    console.log(`[refresh-activities] chunk: full batch, enqueuing next chunk starting at ${nextBatchStart}`);
    await enqueueRefreshActivity({ type: 'chunk', athleteId, batchStart: nextBatchStart, batchId });
  }
}

async function handleFinalize(athleteId: number, batchId: string): Promise<void> {
  console.log(`[refresh-activities] finalize: athlete ${athleteId} batchId ${batchId}`);

  const state = await refreshStatePersist.getIfExists(athleteId);

  if (!state || state.batchId !== batchId) {
    console.log(`[refresh-activities] finalize: athlete ${athleteId} has no state or newer batch, skipping sweep`);
    return;
  }

  await finalizeActivityRefresh(athleteId, batchId);

  await refreshStatePersist.deleteItem(athleteId);

  console.log(`[refresh-activities] finalize: complete for athlete ${athleteId}`);
}
