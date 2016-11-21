'use strict';

module.exports = {
  loadObjects,
  listObjects,
  getObject,
  upload,
  uploadIfChanged,
  deleteAll,
  deleteObject
};

const AWS = require('aws-sdk');
const Rx = require('rx');

const rxo = Rx.Observable;

function loadObjects(bucket, prefix) {
  return listObjects(bucket, prefix)
    .flatMap(key => getObject(bucket, key));
}

function listObjects(bucket, prefix) {
  console.log(`Listing objects in S3. ${bucket} prefix ${prefix}`);
  return listObjectsImpl();

  function listObjectsImpl(continuationToken) {
    console.log(`Listing objects in S3. ${bucket} from ${continuationToken}`);
    const params = {
      Bucket: bucket,
      ContinuationToken: continuationToken,
      Prefix: prefix
    };
    const s3 = new AWS.S3();
    const listObjects = s3.listObjectsV2(params);
    return rxo.fromNodeCallback(listObjects.send, listObjects)()
      .flatMap(data => {
        const currentResult = rxo.from(data.Contents);
        if (data.IsTruncated) {
          return rxo.merge(currentResult, listObjectsImpl(data.NextContinuationToken)
          );
        } else {
          return currentResult;
        }
      })
      .map(entry => entry.Key);
  }
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

function uploadIfChanged(bucket, key, body) {
  console.log(`Uploading object to S3 if changed. ${bucket}:${key}`);
  return loadObjects(bucket, key)
    // Default current value to null if object doesn't already exist
    .concat(rxo.return()).first()
    .flatMap(s3Body => {
      if (body != s3Body) {
        return upload(bucket, key, body);
      } else {
        return rxo.return();
      }
    });
}

function deleteAll(bucket) {
  console.log(`Deleting objects from S3. ${bucket}`);
  return listObjects(bucket)
    .flatMap(key => deleteObject(bucket, key));
}

function deleteObject(bucket, key) {
  console.log(`Deleting object from S3. ${bucket}:${key}`);
  const params = {
    Bucket: bucket,
    Key: key
  };
  const s3 = new AWS.S3();
  const loadObject = s3.deleteObject(params);
  return rxo.fromNodeCallback(loadObject.send, loadObject)()
    .map(data => data.Body.toString());
}
