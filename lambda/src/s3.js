'use strict';

module.exports = {
  loadObjects,
  listObjects,
  loadObject,
  upload
};

const AWS = require('aws-sdk');
const Rx = require('rx');

const rxo = Rx.Observable;

function loadObjects(bucket) {
  return listObjects(bucket)
    .flatMap(object => loadObject(object.Key));
}

function listObjects(bucket, continuationToken) {
  console.log(`Listing objects in S3. ${bucket} from ${continuationToken}`);
  const params = {
    Bucket: bucket,
    ContinuationToken: continuationToken
  };
  const s3 = new AWS.S3();
  const listObjects = s3.listObjectsV2(params);
  return rxo.fromNodeCallback(listObjects.send, listObjects)()
    .flatMap(data => {
      const currentResult = rxo.from(data.Contents);
      if (data.IsTruncated) {
        return rxo.merge(currentResult, listObjects(bucket, data.NextContinuationToken)
        );
      } else {
        return currentResult;
      }
    })
    .map(entry => entry.key);
}

function loadObject(bucket, key) {
  console.log(`Retrieving object from S3. ${bucket}:${key}`);
  const params = {
    Bucket: bucket,
    Key: key
  };
  const s3 = new AWS.S3();
  const loadObject = s3.loadObject(params);
  return rxo.fromNodeCallback(loadObject.send, loadObject)()
    .map(data => data.Body);
}

function upload(bucket, key, body) {
  console.log(`Uploading object to S3. ${bucket}:${key}`);
  const params = {
    Bucket: bucket,
    Key: '' + key,
    Body: body
  };
  const s3 = new AWS.S3();
  const upload = s3.upload(params);
  return rxo.fromNodeCallback(upload.send, upload)();
}
