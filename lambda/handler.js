'use strict';

const register = require('./src/register');

module.exports.getRegister = (event, context, callback) => {
  const accessUrl = register.getOAuthRequestAccessUrl();

  const response = {
    statusCode: 302,
    headers: {
      location: accessUrl
    }
  };

  callback(null, response);
};

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
