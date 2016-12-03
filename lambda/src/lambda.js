'use strict';

module.exports = {
  invoke
};

const AWS = require('aws-sdk');
const Rx = require('rx');

const rxo = Rx.Observable;

function invoke(functionName, payload) {
  const lambda = new AWS.Lambda();

  const params = {
    FunctionName: functionName,
    InvocationType: 'Event',
    Payload: payload
  };

  const doInvoke = lambda.invoke(params);
  return rxo.fromNodeCallback(doInvoke.send, doInvoke)();
}


function getObject(bucket, key) {
  console.log(`Getting object from S3. ${bucket}:${key}`);
  const params = {
    Bucket: bucket,
    Key: key
  };
  const s3 = new AWS.S3();
  const loadObject = s3.getObject(params);
  return rxo.fromNodeCallback(loadObject.send, loadObject)()
    .map(data => data.Body.toString());
}


function deleteObject(bucket, key) {
  console.log(`Deleting object from S3. ${bucket}:${key}`);
  const params = {
    Bucket: bucket,
    Key: key
  };
  const s3 = new AWS.S3();
  const loadObject = s3.deleteObject(params);
  return rxo.fromNodeCallback(loadObject.send, loadObject)();
}
