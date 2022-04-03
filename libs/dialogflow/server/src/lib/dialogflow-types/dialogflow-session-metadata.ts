import { protos } from '@google-cloud/dialogflow';

export type DialogflowSessionRequestsMetadata = {
  ts: number;
  request: protos.google.cloud.dialogflow.v2.IDetectIntentRequest;
}[];

export type DialogflowSessionResponsesMetadata = {
  ts: number;
  response: protos.google.cloud.dialogflow.v2.IDetectIntentResponse;
}[];
