'use strict';

// Load environment variables.  We must clear TZ if it exists because dotenv
// will refuse to overwrite existing variables and AWS Lambda has begun setting
// it as of May 2017.
if (process.env.TZ) {
  delete process.env.TZ
}
require('dotenv').config();

module.exports = {
  environment: 'dev'
};
